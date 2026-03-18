"use client";

import { Check, ChevronRight } from "lucide-react";
import { twMerge } from "tailwind-merge";

export interface StepDefinition<K extends string = string> {
  key: K;
  label: string;
}

export interface ProgressStepperProps<K extends string = string> {
  steps: ReadonlyArray<StepDefinition<K>>;
  currentStep: K;
  className?: string;
}

export function ProgressStepper<K extends string>({
  steps,
  currentStep,
  className,
}: ProgressStepperProps<K>) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <nav aria-label="Progress" className={twMerge("font-sans", className)}>
      <ol className="flex items-center">
        {steps.map((step, i) => {
          const isCompleted = i < currentIndex;
          const isActive = i === currentIndex;

          return (
            <li key={step.key} className="flex items-center">
              <div className="flex items-center gap-2.5">
                <span
                  aria-current={isActive ? "step" : undefined}
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    isCompleted || isActive
                      ? "bg-(--tm-color-primary-900) text-white"
                      : "border border-(--tm-color-neutral-300) text-(--tm-color-neutral-400)"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={`text-sm whitespace-nowrap ${
                    isActive
                      ? "font-semibold text-(--tm-color-primary-900)"
                      : isCompleted
                        ? "font-medium text-(--tm-color-primary-900)"
                        : "text-(--tm-color-neutral-400)"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight
                  aria-hidden="true"
                  className={`mx-3 h-4 w-4 shrink-0 ${
                    isCompleted
                      ? "text-(--tm-color-primary-900)"
                      : "text-(--tm-color-neutral-300)"
                  }`}
                  strokeWidth={2}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
