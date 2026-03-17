"use client";

import { useState, useEffect, useRef } from "react";
import type {
  Investigation,
  GenerationPhase,
  ActivityLogEntry,
} from "@/lib/types";

const PHASES: { id: GenerationPhase; label: string; description: string }[] = [
  {
    id: "gathering-sources",
    label: "Gathering sources",
    description: "Searching news archives, official documents, and public records",
  },
  {
    id: "identifying-stakeholders",
    label: "Identifying stakeholders",
    description: "Mapping actors, organizations, and interest groups involved",
  },
  {
    id: "analyzing-incentives",
    label: "Analyzing incentives",
    description: "Modeling economic, political, and ideological motivations",
  },
  {
    id: "drafting-report",
    label: "Drafting report",
    description: "Structuring findings into the TrueMotives report format",
  },
  {
    id: "finalizing",
    label: "Finalizing",
    description: "Verifying citations and confidence levels",
  },
];

const SIMULATED_LOGS: string[] = [
  "Querying EU transparency register for lobbying disclosures...",
  "Found 8 additional stakeholder connections via OpenCorporates...",
  "Cross-referencing campaign finance records with policy votes...",
  "Analyzing correlation between soy futures and deforestation permits...",
  "Retrieving World Bank agricultural export data for Brazil 2020–2026...",
  "Identifying high-confidence incentive cluster: agribusiness export revenue...",
  "Checking for alternative explanations: environmental compliance narrative...",
  "Assigning confidence levels to 14 motivation hypotheses...",
  "Verifying source credibility scores for 22 citations...",
  "Structuring executive summary with ranked motivations...",
];

function PhaseIcon({
  phase,
  state,
}: {
  phase: GenerationPhase;
  state: "completed" | "active" | "pending";
}) {
  if (state === "completed") {
    return (
      <svg
        className="h-4 w-4 text-white"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
    );
  }
  if (state === "active") {
    return (
      <span className="h-2.5 w-2.5 rounded-full bg-white animate-breathing-pulse" />
    );
  }
  return <span className="h-2 w-2 rounded-full bg-white/30" />;
}

function formatSecondsRemaining(seconds: number): string {
  if (seconds < 60) return `~${seconds}s remaining`;
  const mins = Math.ceil(seconds / 60);
  return `~${mins}m remaining`;
}

function formatLogTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function GenerationProgress({
  investigation,
}: {
  investigation: Investigation;
}) {
  const progress = investigation.generationProgress!;
  const logRef = useRef<HTMLDivElement>(null);

  const [liveLog, setLiveLog] = useState<ActivityLogEntry[]>(
    progress.activityLog
  );
  const [displayedPercentage, setDisplayedPercentage] = useState(
    progress.percentage
  );
  const logIndexRef = useRef(0);

  // Simulate live activity log additions
  useEffect(() => {
    const interval = setInterval(() => {
      const idx = logIndexRef.current % SIMULATED_LOGS.length;
      logIndexRef.current += 1;

      const newEntry: ActivityLogEntry = {
        id: `live-${Date.now()}`,
        timestamp: new Date().toISOString(),
        message: SIMULATED_LOGS[idx],
      };

      setLiveLog((prev) => [...prev.slice(-20), newEntry]);

      // Also slowly increment percentage
      setDisplayedPercentage((prev) => Math.min(prev + 0.6, 95));
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll log to bottom
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [liveLog]);

  const currentPhaseIndex = PHASES.findIndex(
    (p) => p.id === progress.currentPhase
  );

  return (
    <div className="space-y-6">
      {/* Transparency callout banner */}
      <div className="flex items-start gap-3 rounded-xl border border-(--tm-color-info-500)/30 bg-(--tm-color-info-100)/60 px-4 py-3.5">
        <svg
          className="mt-0.5 h-4 w-4 flex-shrink-0 text-(--tm-color-info-500)"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
        <p className="text-sm text-(--tm-color-info-500)">
          <span className="font-semibold">TrueMotives shows its work.</span>{" "}
          Every claim in the final report will include sources, confidence levels,
          and explicit reasoning chains — not just conclusions.
        </p>
      </div>

      {/* Phase stepper */}
      <div className="rounded-xl border border-(--tm-color-neutral-100) bg-white p-6">
        <h3 className="text-sm font-semibold text-(--tm-color-primary-900) mb-5 uppercase tracking-wide">
          Research phases
        </h3>
        <div className="space-y-1">
          {PHASES.map((phase, index) => {
            const isCompleted = progress.completedPhases.includes(phase.id);
            const isActive = phase.id === progress.currentPhase;
            const state: "completed" | "active" | "pending" = isCompleted
              ? "completed"
              : isActive
              ? "active"
              : "pending";

            return (
              <div key={phase.id} className="flex items-start gap-4">
                {/* Connector line + icon column */}
                <div className="flex flex-col items-center">
                  <div
                    className={[
                      "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-all duration-500",
                      isCompleted
                        ? "bg-(--tm-color-success-500)"
                        : isActive
                        ? "bg-(--tm-color-accent-500) shadow-[0_0_12px_rgba(246,168,0,0.4)] animate-breathing-pulse"
                        : "bg-(--tm-color-neutral-100) border border-(--tm-color-neutral-100)",
                    ].join(" ")}
                  >
                    <PhaseIcon phase={phase.id} state={state} />
                  </div>
                  {index < PHASES.length - 1 && (
                    <div
                      className={[
                        "w-px flex-1 min-h-4 transition-colors duration-700",
                        isCompleted
                          ? "bg-(--tm-color-success-500)/40"
                          : "bg-(--tm-color-neutral-100)",
                      ].join(" ")}
                    />
                  )}
                </div>

                {/* Phase content */}
                <div className={["pb-4 pt-0.5 min-w-0", index === PHASES.length - 1 ? "pb-0" : ""].join(" ")}>
                  <p
                    className={[
                      "text-sm font-medium transition-colors",
                      isActive
                        ? "text-(--tm-color-accent-700)"
                        : isCompleted
                        ? "text-(--tm-color-neutral-600)"
                        : "text-(--tm-color-neutral-300)",
                    ].join(" ")}
                  >
                    {phase.label}
                    {isActive && (
                      <span className="ml-2 text-xs font-normal text-(--tm-color-neutral-300) italic">
                        in progress…
                      </span>
                    )}
                  </p>
                  {(isActive || isCompleted) && (
                    <p className="mt-0.5 text-xs text-(--tm-color-neutral-600)/70">
                      {phase.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="rounded-xl border border-(--tm-color-neutral-100) bg-white px-6 py-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--tm-color-accent-500) opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-(--tm-color-accent-500)" />
            </span>
            <span className="text-sm font-medium text-(--tm-color-primary-900)">
              Deep research in progress
            </span>
          </div>
          <div className="flex items-center gap-3">
            {progress.estimatedSecondsRemaining != null && (
              <span className="text-xs text-(--tm-color-neutral-600)">
                {formatSecondsRemaining(progress.estimatedSecondsRemaining)}
              </span>
            )}
            <span className="text-sm font-mono font-semibold text-(--tm-color-accent-700)">
              {Math.round(displayedPercentage)}%
            </span>
          </div>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-(--tm-color-neutral-100)">
          <div
            className="h-full rounded-full bg-gradient-to-r from-(--tm-color-accent-700) to-(--tm-color-accent-400) transition-all duration-1000 ease-out"
            style={{ width: `${displayedPercentage}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-(--tm-color-neutral-300)">
          Phase {currentPhaseIndex + 1} of {PHASES.length}:{" "}
          {PHASES[currentPhaseIndex]?.label}
        </p>
      </div>

      {/* Live activity log */}
      <div className="rounded-xl border border-(--tm-color-neutral-100) bg-(--tm-color-primary-900) overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--tm-color-accent-500) opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-(--tm-color-accent-500)" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-white/60">
              Live activity log
            </span>
          </div>
          <span className="text-xs text-white/30 font-mono">
            {liveLog.length} events
          </span>
        </div>
        <div
          ref={logRef}
          className="h-56 overflow-y-auto px-5 py-4 space-y-2 font-mono text-xs scroll-smooth"
        >
          {liveLog.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-3 animate-log-slide-in"
            >
              <span className="flex-shrink-0 text-white/25 pt-px">
                {formatLogTime(entry.timestamp)}
              </span>
              <span className="text-white/80 leading-relaxed">{entry.message}</span>
            </div>
          ))}
          {/* Blinking cursor */}
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 text-white/25">
              {formatLogTime(new Date().toISOString())}
            </span>
            <span className="inline-flex">
              <span className="h-3.5 w-0.5 bg-(--tm-color-accent-500) animate-pulse" />
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg border border-(--tm-color-neutral-100) bg-white px-4 py-2 text-sm font-medium text-(--tm-color-neutral-600) hover:bg-(--tm-color-neutral-50) hover:text-(--tm-color-primary-900) transition-colors"
        >
          Continue in background
        </button>
        <button
          type="button"
          className="rounded-lg px-4 py-2 text-sm font-medium text-(--tm-color-danger-500) hover:bg-(--tm-color-danger-100) transition-colors"
        >
          Cancel generation
        </button>
      </div>
    </div>
  );
}
