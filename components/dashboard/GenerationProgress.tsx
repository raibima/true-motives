"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useInvestigationStream } from "@/client/hooks/use-investigation-stream";

function PhaseIcon({
  state,
}: {
  state: "completed" | "active" | "pending" | "skipped";
}) {
  if (state === "completed" || state === "skipped") {
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
  runId,
}: {
  runId: string;
}) {
  const router = useRouter();
  const logRef = useRef<HTMLDivElement>(null);
  const hasRefreshedRef = useRef(false);
  const {
    activityLog,
    phases,
    percentage,
    isComplete,
    error,
    estimatedSecondsRemaining,
  } = useInvestigationStream(runId);

  useEffect(() => {
    if (!isComplete || hasRefreshedRef.current) return;
    hasRefreshedRef.current = true;
    const timeout = setTimeout(() => {
      if (typeof window !== "undefined") {
        window.location.reload();
      } else {
        router.refresh();
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [isComplete, router, runId]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [activityLog]);

  const displayedPercentage = Math.max(1, Math.min(100, Math.round(percentage)));
  const activePhaseIndex = phases.findIndex((p) => p.status === "in-progress");
  const completedCount = phases.filter(
    (p) => p.status === "completed" || p.status === "skipped",
  ).length;
  const currentPhaseNumber =
    activePhaseIndex >= 0 ? activePhaseIndex + 1 : completedCount;
  const currentPhaseLabel =
    activePhaseIndex >= 0
      ? phases[activePhaseIndex].label
      : isComplete
        ? "Complete"
        : "Initializing";

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-(--tm-color-danger-500)/30 bg-(--tm-color-danger-100)/60 px-4 py-3 text-sm text-(--tm-color-danger-500)">
          Stream error: {error}
        </div>
      )}
      {/* Transparency callout banner */}
      <div className="flex items-start gap-3 rounded-xl border border-(--tm-color-info-500)/30 bg-(--tm-color-info-100)/60 px-4 py-3.5">
        <svg
          className="mt-0.5 h-4 w-4 shrink-0 text-(--tm-color-info-500)"
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
        {phases.length === 0 ? (
          <div className="flex items-center gap-3 py-4">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-(--tm-color-accent-500)/20">
              <span className="h-2.5 w-2.5 rounded-full bg-(--tm-color-accent-500) animate-breathing-pulse" />
            </span>
            <span className="text-sm text-(--tm-color-neutral-600)">
              Preparing research plan…
            </span>
          </div>
        ) : (
          <div className="space-y-1">
            {phases.map((phase, index) => {
              const isCompleted =
                phase.status === "completed" ||
                phase.status === "skipped" ||
                isComplete;
              const isActive = phase.status === "in-progress" && !isComplete;
              const state: "completed" | "active" | "pending" | "skipped" =
                isCompleted
                  ? phase.status === "skipped" && !isComplete
                    ? "skipped"
                    : "completed"
                  : isActive
                    ? "active"
                    : "pending";

              return (
                <div key={phase.id} className="flex items-start gap-4">
                  {/* Connector line + icon column */}
                  <div className="flex flex-col items-center">
                    <div
                      className={[
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-500",
                        isCompleted
                          ? "bg-(--tm-color-success-500)"
                          : isActive
                            ? "bg-(--tm-color-accent-500) shadow-[0_0_12px_rgba(246,168,0,0.4)] animate-breathing-pulse"
                            : "bg-(--tm-color-neutral-100) border border-(--tm-color-neutral-100)",
                      ].join(" ")}
                    >
                      <PhaseIcon state={state} />
                    </div>
                    {index < phases.length - 1 && (
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
                  <div className={["pb-4 pt-0.5 min-w-0", index === phases.length - 1 ? "pb-0" : ""].join(" ")}>
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
                      {phase.status === "skipped" && !isComplete && (
                        <span className="ml-2 text-xs font-normal text-(--tm-color-neutral-300) italic">
                          skipped
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
        )}
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
            {estimatedSecondsRemaining != null && !isComplete && (
              <span className="text-xs text-(--tm-color-neutral-600)">
                {formatSecondsRemaining(estimatedSecondsRemaining)}
              </span>
            )}
            <span className="text-sm font-mono font-semibold text-(--tm-color-accent-700)">
              {Math.round(displayedPercentage)}%
            </span>
          </div>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-(--tm-color-neutral-100)">
          <div
            className="h-full rounded-full bg-linear-to-r from-(--tm-color-accent-700) to-(--tm-color-accent-400) transition-all duration-1000 ease-out"
            style={{ width: `${displayedPercentage}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-(--tm-color-neutral-300)">
          {phases.length > 0
            ? `Phase ${currentPhaseNumber} of ${phases.length}: ${currentPhaseLabel}`
            : "Initializing research plan…"}
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
            {activityLog.length} events
          </span>
        </div>
        <div
          ref={logRef}
          className="h-56 overflow-y-auto px-5 py-4 space-y-2 font-mono text-xs scroll-smooth"
        >
          {activityLog.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-3 animate-log-slide-in"
            >
              <span className="shrink-0 text-white/25 pt-px">
                {formatLogTime(entry.timestamp)}
              </span>
              <span className="text-white/80 leading-relaxed">{entry.message}</span>
            </div>
          ))}
          {!isComplete && (
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-white/25">
                {formatLogTime(new Date().toISOString())}
              </span>
              <span className="inline-flex">
                <span className="h-3.5 w-0.5 bg-(--tm-color-accent-500) animate-pulse" />
              </span>
            </div>
          )}
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
