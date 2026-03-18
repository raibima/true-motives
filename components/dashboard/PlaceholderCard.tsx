import type { ReactNode } from "react";

export interface PlaceholderCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  action: ReactNode;
  className?: string;
}

export function PlaceholderCard({
  icon,
  title,
  description,
  action,
  className,
}: PlaceholderCardProps) {
  return (
    <div
      className={[
        "animate-fade-in-up stagger-2 rounded-xl border border-(--tm-color-neutral-100) bg-white p-6 text-center",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mb-3 flex items-center justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--tm-color-neutral-100)">
          {icon}
        </div>
      </div>
      <h2 className="font-serif text-lg font-semibold text-(--tm-color-primary-900) mb-2">
        {title}
      </h2>
      <p className="text-sm text-(--tm-color-neutral-600) mb-5">{description}</p>
      {action}
    </div>
  );
}
