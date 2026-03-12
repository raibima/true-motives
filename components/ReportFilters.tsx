"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CATEGORIES, GEOGRAPHIES } from "@/lib/mock-data";
import { useCallback } from "react";

export function ReportFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentCategory = searchParams.get("category") ?? "";
  const currentGeo = searchParams.get("geography") ?? "";
  const currentQuery = searchParams.get("q") ?? "";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/reports?${params.toString()}`);
    },
    [searchParams, router]
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--tm-color-neutral-300)"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          type="search"
          placeholder="Search by topic, keyword…"
          defaultValue={currentQuery}
          onChange={(e) => updateParams("q", e.target.value)}
          className="h-9 w-full rounded-lg border border-(--tm-color-neutral-100) bg-white pl-9 pr-3 text-sm text-(--tm-color-neutral-900) placeholder:text-(--tm-color-neutral-300) focus:border-(--tm-color-neutral-300) focus:outline-none focus:ring-2 focus:ring-(--tm-color-accent-400)/30 transition-shadow"
        />
      </div>

      {/* Category */}
      <select
        value={currentCategory}
        onChange={(e) => updateParams("category", e.target.value)}
        className="h-9 rounded-lg border border-(--tm-color-neutral-100) bg-white px-3 text-sm text-(--tm-color-neutral-600) focus:border-(--tm-color-neutral-300) focus:outline-none focus:ring-2 focus:ring-(--tm-color-accent-400)/30 transition-shadow cursor-pointer"
      >
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      {/* Geography */}
      <select
        value={currentGeo}
        onChange={(e) => updateParams("geography", e.target.value)}
        className="h-9 rounded-lg border border-(--tm-color-neutral-100) bg-white px-3 text-sm text-(--tm-color-neutral-600) focus:border-(--tm-color-neutral-300) focus:outline-none focus:ring-2 focus:ring-(--tm-color-accent-400)/30 transition-shadow cursor-pointer"
      >
        <option value="">All regions</option>
        {GEOGRAPHIES.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
    </div>
  );
}
