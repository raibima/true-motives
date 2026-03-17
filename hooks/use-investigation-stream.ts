"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  parseJsonEventStream,
  readUIMessageStream,
  type UIMessageChunk,
  type UIMessage,
  uiMessageChunkSchema,
} from "ai";

import type { ActivityLogEntry, GenerationPhase } from "@/lib/types";

const PHASE_PROGRESS: Record<GenerationPhase, number> = {
  "gathering-sources": 20,
  "identifying-stakeholders": 40,
  "analyzing-incentives": 62,
  "drafting-report": 84,
  finalizing: 95,
};

function inferPhaseFromTool(toolName: string): GenerationPhase {
  if (
    toolName.includes("brave") ||
    toolName.includes("firecrawl") ||
    toolName.includes("news")
  ) {
    return "gathering-sources";
  }

  if (toolName.includes("gdelt")) {
    return "identifying-stakeholders";
  }

  return "analyzing-incentives";
}

function nowIso() {
  return new Date().toISOString();
}

function truncateJson(value: unknown, max = 220): string {
  const raw = JSON.stringify(value);
  if (!raw) return "";
  return raw.length > max ? `${raw.slice(0, max)}...` : raw;
}

export function useInvestigationStream(runId: string) {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [currentPhase, setCurrentPhase] =
    useState<GenerationPhase>("gathering-sources");
  const [percentage, setPercentage] = useState(5);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estimatedSecondsRemaining, setEstimatedSecondsRemaining] = useState<
    number | undefined
  >(undefined);

  const processedPartsRef = useRef<Set<string>>(new Set());
  const logCounterRef = useRef(0);

  useEffect(() => {
    const abortController = new AbortController();

    function nextLogId() {
      const current = logCounterRef.current++;
      return `${runId}-log-${current}`;
    }

    async function consume() {
      setError(null);
      setIsComplete(false);
      setMessages([]);
      setActivityLog([]);
      setCurrentPhase("gathering-sources");
      setPercentage(5);
      setEstimatedSecondsRemaining(undefined);
      processedPartsRef.current = new Set();
      setActivityLog([
        {
          id: nextLogId(),
          timestamp: nowIso(),
          message: `Connected to workflow stream for run ${runId}. Awaiting investigation events...`,
        },
      ]);

      try {
        const response = await fetch(`/api/investigations/${runId}/stream`, {
          method: "GET",
          signal: abortController.signal,
          headers: {
            Accept: "text/event-stream",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Stream request failed (${response.status}).`);
        }

        if (!response.body) {
          throw new Error("No stream body returned by investigation endpoint.");
        }

        const parsedStream = parseJsonEventStream({
          stream: response.body,
          schema: uiMessageChunkSchema,
        });
        const chunkStream = parsedStream.pipeThrough(
          new TransformStream<
            { success: true; value: UIMessageChunk } | { success: false },
            UIMessageChunk
          >({
            transform(part, controller) {
              if (part.success) {
                controller.enqueue(part.value);
              }
            },
          }),
        );

        for await (const message of readUIMessageStream({
          stream: chunkStream,
        })) {
          if (abortController.signal.aborted) {
            return;
          }

          setMessages((prev) => {
            const existingIndex = prev.findIndex((m) => m.id === message.id);
            if (existingIndex === -1) return [...prev, message];
            const next = [...prev];
            next[existingIndex] = message;
            return next;
          });

          message.parts.forEach((part, index) => {
            const key = `${message.id}:${index}:${part.type}:${JSON.stringify(part)}`;
            if (processedPartsRef.current.has(key)) return;
            processedPartsRef.current.add(key);

            if (part.type === "data-progress") {
              const payload = Array.isArray(part.data) ? part.data[0] : part.data;
              if (payload && typeof payload === "object") {
                const phase = (payload as { phase?: GenerationPhase }).phase;
                const msg = (payload as { message?: string }).message;
                const nextPercentage = (payload as { percentage?: number }).percentage;
                const eta = (payload as { estimatedSecondsRemaining?: number })
                  .estimatedSecondsRemaining;

                if (phase) {
                  setCurrentPhase(phase);
                  setPercentage((prev) =>
                    Math.max(prev, nextPercentage ?? PHASE_PROGRESS[phase]),
                  );
                }

                if (typeof eta === "number") {
                  setEstimatedSecondsRemaining(eta);
                }

                if (msg) {
                  setActivityLog((prev) =>
                    [
                      ...prev,
                      {
                        id: nextLogId(),
                        timestamp: nowIso(),
                        message: msg,
                      },
                    ].slice(-40),
                  );
                }
              }
              return;
            }

            if (part.type.startsWith("tool-") && "state" in part && part.state === "input-available") {
              const toolName = part.type.replace("tool-", "");
              const inferredPhase = inferPhaseFromTool(toolName);
              setCurrentPhase((prev) => prev ?? inferredPhase);
              setPercentage((prev) => Math.max(prev, PHASE_PROGRESS[inferredPhase]));
              setActivityLog((prev) =>
                [
                  ...prev,
                  {
                    id: nextLogId(),
                    timestamp: nowIso(),
                    message: `Running tool ${toolName} with input ${truncateJson(
                      "input" in part ? part.input : undefined,
                    )}`,
                  },
                ].slice(-40),
              );
            }

            if (part.type.startsWith("tool-") && "state" in part && part.state === "input-streaming") {
              const toolName = part.type.replace("tool-", "");
              setActivityLog((prev) =>
                [
                  ...prev,
                  {
                    id: nextLogId(),
                    timestamp: nowIso(),
                    message: `Preparing ${toolName} call payload...`,
                  },
                ].slice(-40),
              );
            }

            if (part.type.startsWith("tool-") && "state" in part && part.state === "output-available") {
              const toolName = part.type.replace("tool-", "");
              setActivityLog((prev) =>
                [
                  ...prev,
                  {
                    id: nextLogId(),
                    timestamp: nowIso(),
                    message: `Tool ${toolName} completed. Output snapshot: ${truncateJson(
                      "output" in part ? part.output : undefined,
                    )}`,
                  },
                ].slice(-40),
              );
            }

            if (part.type.startsWith("tool-") && "state" in part && part.state === "output-error") {
              const toolName = part.type.replace("tool-", "");
              setActivityLog((prev) =>
                [
                  ...prev,
                  {
                    id: nextLogId(),
                    timestamp: nowIso(),
                    message: `Tool ${toolName} failed: ${
                      "errorText" in part ? part.errorText : "Unknown tool error"
                    }`,
                  },
                ].slice(-40),
              );
            }

            if (part.type === "step-start") {
              setActivityLog((prev) =>
                [
                  ...prev,
                  {
                    id: nextLogId(),
                    timestamp: nowIso(),
                    message: "Starting a new model reasoning step...",
                  },
                ].slice(-40),
              );
            }

          });
        }

        setCurrentPhase("finalizing");
        setPercentage(100);
        setEstimatedSecondsRemaining(0);
        setActivityLog((prev) =>
          [
            ...prev,
            {
              id: nextLogId(),
              timestamp: nowIso(),
              message: "Investigation complete. Final report is now available.",
            },
          ].slice(-40),
        );
        setIsComplete(true);
      } catch (err) {
        if (abortController.signal.aborted) return;
        const message =
          err instanceof Error ? err.message : "Unknown stream error.";
        setError(message);
      }
    }

    void consume();

    return () => abortController.abort();
  }, [runId]);

  return useMemo(
    () => ({
      messages,
      activityLog,
      currentPhase,
      percentage,
      isComplete,
      error,
      estimatedSecondsRemaining,
    }),
    [
      messages,
      activityLog,
      currentPhase,
      percentage,
      isComplete,
      error,
      estimatedSecondsRemaining,
    ],
  );
}
