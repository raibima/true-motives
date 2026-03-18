"use client";

import { Link } from "@/components/ui/Link";
import { usePathname } from "next/navigation";

function FileTextIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
}

function ChartBarIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
      />
    </svg>
  );
}

const USAGE_USED = 12;
const USAGE_LIMIT = 20;

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  badge?: string;
}

function NavItem({ href, icon, label, isActive, badge }: NavItemProps) {
  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
        isActive
          ? "bg-(--tm-color-accent-700)/20 text-(--tm-color-accent-400) border border-(--tm-color-accent-700)/30"
          : "text-white/60 hover:bg-white/8 hover:text-white/90 border border-transparent",
      ].join(" ")}
    >
      <span
        className={[
          "flex-shrink-0 transition-colors",
          isActive ? "text-(--tm-color-accent-400)" : "text-white/40",
        ].join(" ")}
      >
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="rounded-full bg-(--tm-color-accent-700)/30 px-2 py-0.5 text-xs text-(--tm-color-accent-400) font-mono">
          {badge}
        </span>
      )}
    </Link>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col bg-(--tm-color-primary-900) border-r border-white/8">
      {/* Brand */}
      <div className="flex h-14 items-center gap-2.5 border-b border-white/8 px-5">
        <Link href="/" variant="plain" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <span className="inline-block h-5 w-1 rounded-sm bg-(--tm-color-accent-500)" />
          <span className="font-serif text-base font-semibold tracking-tight text-white">
            TrueMotives
          </span>
        </Link>
        <span className="ml-auto rounded-full bg-(--tm-color-accent-700)/20 px-2 py-0.5 text-[10px] font-medium text-(--tm-color-accent-400) tracking-wide uppercase">
          Pro
        </span>
      </div>

      {/* New investigation CTA */}
      <div className="p-3 border-b border-white/8">
        <Link href="/dashboard/new" variant="button-accent" className="w-full">
          <PlusIcon />
          New investigation
        </Link>
      </div>

      {/* Primary nav */}
      <nav className="flex flex-col gap-0.5 p-3">
        <p className="px-3 pb-1.5 pt-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Workspace
        </p>
        <NavItem
          href="/dashboard"
          icon={<FileTextIcon />}
          label="Investigations"
          isActive={pathname === "/dashboard"}
          badge={String(USAGE_USED)}
        />
        <NavItem
          href="/dashboard/analytics"
          icon={<ChartBarIcon />}
          label="Analytics"
          isActive={pathname === "/dashboard/analytics"}
        />
        <NavItem
          href="/dashboard/settings"
          icon={<SettingsIcon />}
          label="Settings"
          isActive={pathname === "/dashboard/settings"}
        />
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Usage meter */}
      <div className="p-4 border-t border-white/8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-white/50">
            Monthly investigations
          </span>
          <span className="text-xs font-mono text-white/70">
            {USAGE_USED}/{USAGE_LIMIT}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-(--tm-color-accent-500) transition-all duration-500"
            style={{ width: `${(USAGE_USED / USAGE_LIMIT) * 100}%` }}
          />
        </div>
        <p className="mt-1.5 text-[11px] text-white/30">
          {USAGE_LIMIT - USAGE_USED} remaining this billing cycle
        </p>
      </div>

      {/* User section */}
      <div className="flex items-center gap-3 border-t border-white/8 p-4">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-(--tm-color-accent-700)/30 text-sm font-semibold text-(--tm-color-accent-400)">
          S
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-white">
            Sarah Chen
          </p>
          <p className="truncate text-xs text-white/40">
            sarah@globalpost.com
          </p>
        </div>
        <Link
          href="/"
          className="flex-shrink-0 rounded p-1 text-white/30 hover:text-white/70 transition-colors"
          aria-label="View public site"
        >
          <ExternalLinkIcon />
        </Link>
      </div>
    </aside>
  );
}
