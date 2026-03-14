---
name: Journalist Dashboard Mockups
overview: Build high-fidelity mockups for the journalist dashboard (PRD section 7.2) under `/app/dashboard/*` routes, including investigations list, new investigation form, investigation detail with generation progress, plus loading/empty/error states with differentiated short-task and long-running deep research agent loading experiences.
todos:
  - id: types
    content: Extend lib/types.ts with Investigation, InvestigationStatus, GenerationPhase types
    status: pending
  - id: mock-data
    content: Add mock investigations array and helper functions to lib/mock-data.ts
    status: pending
  - id: dashboard-layout
    content: Create app/dashboard/layout.tsx with sidebar-based shell (DashboardSidebar component)
    status: pending
  - id: dashboard-home
    content: Create app/dashboard/page.tsx (investigations list) with InvestigationCard components
    status: pending
  - id: empty-state
    content: Create EmptyState component for zero-investigations dashboard view
    status: pending
  - id: dashboard-loading-error
    content: Create app/dashboard/loading.tsx and app/dashboard/error.tsx
    status: pending
  - id: new-investigation
    content: Create app/dashboard/new/page.tsx with the investigation form (React Aria TextField, Select, etc.)
    status: pending
  - id: investigation-detail
    content: Create app/dashboard/investigations/[id]/page.tsx showing report or generation progress
    status: pending
  - id: generation-progress
    content: Build GenerationProgress component with multi-phase stepper, progress bar, live activity log, and breathing animations for long-running tasks
    status: pending
  - id: detail-loading-error
    content: Create loading.tsx and error.tsx for investigation detail route
    status: pending
  - id: globals-css
    content: Add dashboard-specific animation keyframes to globals.css (breathing pulse, shimmer)
    status: pending
  - id: build-verify
    content: Run bun run build to verify everything compiles without errors
    status: pending
isProject: false
---

# Journalist Dashboard Hi-Fi Mockups

## Design Direction

**Aesthetic: "Newsroom Command Center"** -- An editorial/utilitarian interface that feels like a modern digital newsroom tool. Information-dense but clean, with the existing brand tokens (dark primaries, amber accents, grain overlay) extended into a sidebar-based dashboard layout. The dashboard should feel distinctly professional and tool-like compared to the public marketing pages.

- **Typography**: Continue using Source Serif 4 for headings + Inter for body, but leaning heavier on Inter in the dashboard for information density
- **Layout**: Sidebar navigation + main content area (common dashboard pattern, but refined)
- **Color**: Same brand palette -- dark primary sidebar, light content area, amber accents for CTAs and progress
- **Motion**: Staggered fade-in-up for list items, breathing pulse for long-running tasks, smooth progress transitions

## Architecture

### Route Structure

All new routes live under `/app/dashboard/`:

```
app/dashboard/
  layout.tsx           -- Dashboard shell (sidebar + main area, separate from public SiteHeader)
  page.tsx             -- Investigations list (main dashboard view)
  loading.tsx          -- Short-task skeleton (cards placeholder)
  error.tsx            -- Error boundary with retry
  new/
    page.tsx           -- New investigation form
  investigations/
    [id]/
      page.tsx         -- Investigation detail (view/edit + generation states)
      loading.tsx      -- Short-task skeleton for detail view
      error.tsx        -- Error boundary for investigation detail
```

### Type Extensions

Extend `[lib/types.ts](lib/types.ts)` with:

- `InvestigationStatus`: `"draft"` | `"generating"` | `"completed"` | `"failed"`
- `GenerationPhase`: `"gathering-sources"` | `"identifying-stakeholders"` | `"analyzing-incentives"` | `"drafting-report"` | `"finalizing"`
- `Investigation` interface: id, title, description, status, category, geography, createdAt, updatedAt, report (optional Report), generationProgress (optional)

### Mock Data

Extend `[lib/mock-data.ts](lib/mock-data.ts)` with:

- `INVESTIGATIONS` array: 5-6 sample investigations in various states (2 completed, 1 generating, 1 draft, 1 failed)
- `getInvestigationById()`, `getInvestigations()` helper functions

### New Components

Under `components/dashboard/`:

- `**DashboardSidebar.tsx**` -- Sidebar with nav links (Investigations, New investigation, usage meter) and user info
- `**InvestigationCard.tsx**` -- Card for the investigations list showing title, status badge, date, category
- `**EmptyState.tsx**` -- Empty state when no investigations exist (illustration + CTA)
- `**GenerationProgress.tsx**` -- **(Key component)** Long-running deep research agent progress with:
  - Multi-phase stepper (5 phases: gathering sources, identifying stakeholders, analyzing incentives, drafting report, finalizing)
  - Overall progress bar with estimated time remaining
  - Live log/stream area showing what the agent is currently processing
  - Breathing/pulse animation on the active phase
  - Cancel button
- `**InvestigationSkeleton.tsx`** -- Reusable skeleton for both list and detail views

## Loading Experience Differentiation

### Short-running tasks (< 3 seconds)

- **Dashboard list loading** (`dashboard/loading.tsx`): Skeleton cards with shimmer animation -- 4 placeholder cards matching InvestigationCard layout
- **Investigation detail loading** (`dashboard/investigations/[id]/loading.tsx`): Skeleton matching the detail page structure (header, section blocks)
- **Form submission**: React Aria `Button` `isPending` state (spinner in button, already supported by existing Button component)

### Long-running tasks (60-120 seconds) -- Deep Research Agent

The `GenerationProgress` component renders when an investigation has `status: "generating"`. This is the centerpiece UX:

1. **Phase stepper** at the top -- 5 labeled steps with icons. Active step pulses with amber accent. Completed steps show checkmark.
2. **Progress bar** -- Indeterminate at first, then determinate as phases complete. Shows "~45 seconds remaining" estimate.
3. **Live activity log** -- Scrolling feed of what the agent is doing: "Searching for stakeholder connections in EU lobbying registry...", "Found 12 relevant source documents...", "Analyzing incentive structure for European Commission..."
4. **Transparency callout** -- Small banner: "TrueMotives shows its work. Every claim will include sources and confidence levels."
5. **Cancel/background option** -- "Cancel generation" destructive button, or "Continue in background" quiet button

This lives inside the investigation detail page (`dashboard/investigations/[id]/page.tsx`), conditionally rendered based on investigation status.

## Error States

- `**dashboard/error.tsx`**: Full-page error with message, retry button, and "return to dashboard" link. Uses existing brand styling.
- `**dashboard/investigations/[id]/error.tsx`**: Similar but contextual to investigation -- "We couldn't load this investigation" with retry and back link.

## Key Implementation Notes

- Use React Aria components throughout (Button, TextField, Select, Tabs, ProgressBar, etc.) from the existing `components/ui/` library
- Leverage existing design tokens from `[app/globals.css](app/globals.css)` -- no new color tokens needed
- Use `tailwind-variants` (`tv`) for component styling, consistent with existing patterns
- Dashboard layout should NOT include the public SiteHeader/Footer -- it has its own sidebar shell
- All pages are server components by default; client components only where interactivity is needed (form, progress animation, sidebar navigation state)
- Since these are mockups, data comes from mock helpers, not real API calls
- The existing `Report` type can be reused as-is for completed investigations

