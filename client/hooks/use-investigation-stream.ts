"use client";

import "client-only";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  parseJsonEventStream,
  readUIMessageStream,
  type UIMessageChunk,
  type UIMessage,
  uiMessageChunkSchema,
} from "ai";

import type {
  ActivityLogEntry,
  DynamicPhase,
  DynamicPhaseStatus,
} from "@/shared/types";

function nowIso() {
  return new Date().toISOString();
}

function truncateJson(value: unknown, max = 220): string {
  const raw = JSON.stringify(value);
  if (!raw) return "";
  return raw.length > max ? `${raw.slice(0, max)}...` : raw;
}

type DataProgressChunk = UIMessageChunk & {
  type: string;
  data: unknown;
  transient?: boolean;
};

function isDataProgressChunk(
  chunk: UIMessageChunk,
): chunk is DataProgressChunk {
  return (
    "data" in chunk &&
    (chunk as DataProgressChunk).type === "data-progress"
  );
}

export function useInvestigationStream(runId: string) {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [phases, setPhases] = useState<DynamicPhase[]>([]);
  const [percentage, setPercentage] = useState(5);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estimatedSecondsRemaining, setEstimatedSecondsRemaining] = useState<
    number | undefined
  >(undefined);

  const processedPartsRef = useRef<Set<string>>(new Set());
  const logCounterRef = useRef(0);

  useEffect(() => {
    if (phases.length === 0) return;
    const completed = phases.filter(
      (p) => p.status === "completed" || p.status === "skipped",
    ).length;
    const inProgress = phases.filter(
      (p) => p.status === "in-progress",
    ).length;
    const computed = Math.min(
      95,
      Math.round(((completed + 0.5 * inProgress) / phases.length) * 100),
    );
    setPercentage((prev) => Math.max(prev, Math.max(5, computed)));
  }, [phases]);

  useEffect(() => {
    const abortController = new AbortController();

    function nextLogId() {
      const current = logCounterRef.current++;
      return `${runId}-log-${current}`;
    }

    function appendLog(message: string) {
      setActivityLog((prev) =>
        [
          ...prev,
          {
            id: nextLogId(),
            timestamp: nowIso(),
            message,
          },
        ].slice(-40),
      );
    }

    function handleDataProgress(chunk: DataProgressChunk) {
      const payload = Array.isArray(chunk.data)
        ? chunk.data[0]
        : chunk.data;
      if (!payload || typeof payload !== "object") return;

      const kind = (payload as { kind?: string }).kind;

      if (kind === "phases-init") {
        const phasesData = (payload as { phases: DynamicPhase[] }).phases;
        setPhases(phasesData);
      } else if (kind === "phase-update") {
        const { phaseId, status, note } = payload as {
          phaseId: string;
          status: DynamicPhaseStatus;
          note?: string;
        };
        setPhases((prev) =>
          prev.map((p) => (p.id === phaseId ? { ...p, status } : p)),
        );
        if (note) {
          appendLog(note);
        }
      } else if (kind === "phase-added") {
        const { phase, insertAfter } = payload as {
          phase: DynamicPhase;
          insertAfter?: string;
        };
        setPhases((prev) => {
          if (insertAfter) {
            const idx = prev.findIndex((p) => p.id === insertAfter);
            if (idx !== -1) {
              const next = [...prev];
              next.splice(idx + 1, 0, phase);
              return next;
            }
          }
          return [...prev, phase];
        });
        appendLog(`Research plan updated: added phase "${phase.label}"`);
      } else if (kind === "activity") {
        const msg = (payload as { message?: string }).message;
        if (msg) {
          appendLog(msg);
        }
      } else {
        const msg = (payload as { message?: string }).message;
        if (msg) {
          appendLog(msg);
        }
      }

      const eta = (payload as { estimatedSecondsRemaining?: number })
        .estimatedSecondsRemaining;
      if (typeof eta === "number") {
        setEstimatedSecondsRemaining(eta);
      }
    }

    async function consume() {
      setError(null);
      setIsComplete(false);
      setMessages([]);
      setActivityLog([]);
      setPhases([]);
      setPercentage(5);
      setEstimatedSecondsRemaining(undefined);
      processedPartsRef.current = new Set();
      appendLog(
        `Connected to workflow stream for run ${runId}. Awaiting investigation events...`,
      );

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
              if (!part.success) return;
              const chunk = part.value;
              if (isDataProgressChunk(chunk)) {
                handleDataProgress(chunk);
                return;
              }
              controller.enqueue(chunk);
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

            if (
              part.type.startsWith("tool-") &&
              "state" in part &&
              part.state === "input-available"
            ) {
              const toolName = part.type.replace("tool-", "");
              appendLog(
                `Running tool ${toolName} with input ${truncateJson(
                  "input" in part ? part.input : undefined,
                )}`,
              );
            }

            if (
              part.type.startsWith("tool-") &&
              "state" in part &&
              part.state === "input-streaming"
            ) {
              const toolName = part.type.replace("tool-", "");
              appendLog(`Preparing ${toolName} call payload...`);
            }

            if (
              part.type.startsWith("tool-") &&
              "state" in part &&
              part.state === "output-available"
            ) {
              const toolName = part.type.replace("tool-", "");
              appendLog(
                `Tool ${toolName} completed. Output snapshot: ${truncateJson(
                  "output" in part ? part.output : undefined,
                )}`,
              );
            }

            if (
              part.type.startsWith("tool-") &&
              "state" in part &&
              part.state === "output-error"
            ) {
              const toolName = part.type.replace("tool-", "");
              appendLog(
                `Tool ${toolName} failed: ${
                  "errorText" in part ? part.errorText : "Unknown tool error"
                }`,
              );
            }

            if (part.type === "step-start") {
              appendLog("Starting a new model reasoning step...");
            }
          });
        }

        setPhases((prev) =>
          prev.map((p) =>
            p.status !== "completed" && p.status !== "skipped"
              ? { ...p, status: "completed" as const }
              : p,
          ),
        );
        setPercentage(100);
        setEstimatedSecondsRemaining(0);
        appendLog(
          "Investigation complete. Final report is now available.",
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
      phases,
      percentage,
      isComplete,
      error,
      estimatedSecondsRemaining,
    }),
    [
      messages,
      activityLog,
      phases,
      percentage,
      isComplete,
      error,
      estimatedSecondsRemaining,
    ],
  );
}
