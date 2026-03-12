### TrueMotives – UI/UX Design Guidelines

This document defines UI/UX foundations for TrueMotives, optimized for **trust, rigor, and calm focus** while still feeling **accessible** to non-experts.

---

## 1. Brand personality → Design principles

- **Investigative, rigorous, sober**
  - Visual tone closer to high‑quality investigative journalism / think tank than “AI startup”.
  - Avoid playful, overly bright palettes and exaggerated rounded shapes.

- **Trustworthy and transparent**
  - High contrast and excellent readability.
  - Clear hierarchy, visible citations, and explicit labels for uncertainty and hypotheses.

- **Calm focus under cognitive load**
  - Users are reading dense, high‑stakes material.
  - Use restrained color and careful spacing to reduce fatigue and avoid sensationalism.

---

## 2. Color system

Psychologically, colors should evoke **trust, seriousness, and analytical clarity**, with controlled use of **warmth** to highlight insight and **muted red** to signal risk.

### 2.1 Core palette (tokens)

Use semantic tokens in code (for example, `--tm-color-*`) rather than raw hex where possible.

- **Primary – Deep Ink**
  - `primary/900` `#0A1020` (ink)
  - `primary/800` `#131A30`
  - `primary/600` `#1E2740`
  - `primary/100` `#E3E7F2`
  - **Psychology**: Deep navy/ink is associated with **credibility, authority, and calm** (used by banks, newspapers, institutions). It anchors the product as serious and evidence‑driven.

- **Neutral – Paper & Slate**
  - `neutral/50` `#F6F5F2` (paper)
  - `neutral/100` `#ECEAE5`
  - `neutral/300` `#C0C3CC`
  - `neutral/600` `#5C6270`
  - `neutral/900` `#151822`
  - **Psychology**: Warm‑neutral “paper” background mimics printed reports, **reducing eye strain** and making the experience feel less like a flashy app and more like a briefing document.

- **Accent – Insight Amber**
  - `accent/500` `#F6A800`
  - `accent/400` `#F8C24A`
  - `accent/700` `#C97F00`
  - **Psychology**: Amber/yellow is linked to **insight, attention, and “highlighting”**. Used sparingly, it reinforces the idea of surfacing key motives without feeling alarmist (unlike pure red).

- **Support – Analytical Teal**
  - `info/500` `#1D9A8A`
  - `info/100` `#D3F0EC`
  - **Psychology**: Teal suggests **balanced analysis, rationality, and modernity**. Use for neutral informational elements (tags, filters, neutral status).

- **Risk / Caution – Muted Red**
  - `danger/500` `#C64545`
  - `danger/100` `#F9E1E1`
  - **Psychology**: Muted red signals **legal/ethical risk or low confidence** without triggering panic. Avoid neon reds or full-saturation crimsons.

- **Positive – Muted Green**
  - `success/500` `#3A8F5C`
  - `success/100` `#D7F0E0`
  - **Psychology**: Indicates **robust evidence, higher confidence, or “well supported”** claims.

### 2.2 Usage rules

- **Backgrounds**
  - App shell / pages: `neutral/50` or `#F6F5F2`.
  - Report reading surface (the “sheet”): `#FFFFFF` with subtle border `neutral/100`.
  - Dark backgrounds (for example, top nav): `primary/900` with white or `neutral/50` text.

- **Text**
  - Primary body text: very dark slate `neutral/900` on light background (never pure black).
  - Secondary text / metadata: `neutral/600`.
  - Deemphasized / disclaimers: `neutral/600` or `neutral/300` (never lower contrast than WCAG AA).

- **Primary call to action (CTA)**
  - Background: `primary/800` or `primary/900`, text: white.
  - Hover: lighten to `primary/700`, focus ring with `accent/400`.
  - This conveys **strong but sober** action (for example, “Generate motives analysis”, “Start investigating”).

- **Highlight / emphasis**
  - Use `accent/500` for:
    - Key figures in executive summary.
    - Small highlight stripe on the left of important cards (for example, “Core motivations”).
    - Underlines or chips for “New” or “Featured” reports.
  - Limit to **< 5% of pixels** on any screen to maintain impact.

- **Risk & uncertainty labelling**
  - “High legal risk”, “Low evidence”, “Speculative hypothesis”: label chips with `danger/100` background and `danger/500` text.
  - Confidence tags:
    - High: `success/100` background and `success/500` text.
    - Medium: `info/100` background and `info/500` text.
    - Low: `danger/100` background and `danger/500` text.
  - This keeps risk messaging **visible but measured**, avoiding tabloid aesthetics.

---

## 3. Typography system

Goal: combine **journalistic gravitas** with **interface clarity**. Use a **serif for long‑form report content** and a **high-legibility sans for UI**.

### 3.1 Typefaces

- **UI Sans (primary UI font)**: `Inter` (or `system-ui` fallback)
  - Contexts: navigation, buttons, forms, filters, dashboard tables, small labels.
  - Psychology: Inter is **neutral, modern, and highly legible**, conveying a tool that is efficient rather than opinionated.

- **Editorial Serif (content font)**: `Source Serif 4` or `Merriweather`
  - Contexts: report titles, section headings inside reports, body copy of the TrueMotives report.
  - Psychology: Serif faces recall **newspapers and long-form analysis**, signaling depth, seriousness, and trustworthiness.

- **Code / technical snippets**: `JetBrains Mono` or `Menlo` as fallback for any config-like content.

### 3.2 Type scale (desktop baseline)

Use a modular scale that’s slightly conservative to avoid feeling like marketing copy.

- **Display / Page title** (for example, landing hero, report title)
  - `font-family`: serif
  - Size: 32–40px, weight: 600–700, line-height: 1.2

- **Section heading (H2)**
  - `font-family`: serif
  - Size: 24px, weight: 600, line-height: 1.35

- **Subheading / H3**
  - `font-family`: sans
  - Size: 18–20px, weight: 600, line-height: 1.4

- **Body text**
  - `font-family`: serif for report content, sans for UI text outside reports.
  - Size: 16px default, 18px for long-form reading views.
  - Line-height: 1.6–1.7 (optimize for scanning evidence and complex arguments).

- **Small text / captions / metadata**
  - Size: 13–14px, `neutral/600`.
  - Use for timestamps, source names, tags.

### 3.3 Typographic behavior

- **Hierarchy**
  - Restrict to **3–4 clear levels** in any view: title → section heading → subheading → body.
  - Avoid overusing bold in body copy; reserve bold for key claims and section labels.

- **Readability**
  - Max line length for long-form reading: **60–80 characters**.
  - Use generous line spacing and paragraph spacing to prevent wall-of-text effect.

- **Tone**
  - Avoid all‑caps except for **short UI labels** (for example, chip filters).
  - Use sentence case for headings: “Stakeholder incentives”, not “STAKEHOLDER INCENTIVES”.

---

## 4. Layout and structure

### 4.1 Global layout

- **Page shell**
  - Top navigation bar (dark or white with subtle bottom border).
  - Content width: 1024–1200px max for desktop, centered.
  - Clear left and right margins (do not full‑bleed multi-column analytical content).

- **Report reading layout**
  - Central “report sheet” with white background, subtle drop shadow or border.
  - Side rail (optional, on larger screens) for:
    - Outline or table of contents for report sections.
    - Filters (for example, show/hide evidence, show assumptions).

- **Dashboard layout (journalists)**
  - Left sidebar for navigation (Dashboard, My investigations, Public library).
  - Main content: cards or table list of investigations with clear status and timestamps.

### 4.2 Spacing

- Base spacing unit: 4px.
- Common increments: 8, 12, 16, 24, 32px.
- Use more vertical than horizontal padding in section blocks to create calm flow.

### 4.3 Critical views and heuristics

- **Landing page (public)**
  - Above the fold: concise explanation, primary CTA (“Browse reports”) and secondary CTA (“For journalists”).
  - Visual: minimal illustration or abstract pattern; avoid stock imagery of politicians or dystopian AI.

- **Report library listing**
  - Card or row layout:
    - Title, location or region, category, short 1–2 line summary.
    - Confidence and risk labels visible at a glance (chips using success, info, danger colors).
  - Sorting and filters always visible (no hidden advanced filters).

- **Report detail**
  - Fixed order:
    1. Title and meta (topic, date, geography, categories).
    2. Short disclaimer (AI-assisted, not definitive).
    3. Executive summary (readable in under 30 seconds).
    4. Stakeholder map and incentives.
    5. Evidence and citations with links.
    6. Assumptions and limitations section styled distinctly (for example, shaded background).
  - Use **visual separation** (dividers, background blocks) for:
    - Hypotheses vs evidence vs limitations.

---

## 5. Components and interaction patterns

### 5.1 Buttons

- **Primary button**
  - Fill: `primary/800`, text: white.
  - Border-radius: 6–8px (moderate, not pill).
  - Hover: slightly lighter background and subtle elevation or outline.
  - Focus: 2px outline in `accent/400`.

- **Secondary button**
  - Border: 1px `primary/600`, text `primary/800`, background `transparent` or `neutral/50`.

- **Destructive**
  - Use `danger/500` text and border or fill for high-risk actions.
  - Require confirmation and avoid placing next to primary positive actions.

### 5.2 Chips and tags

- Use small pill‑shaped chips for:
  - Category (policy, regulation, corporate decision).
  - Geography.
  - Confidence levels (“High confidence”, “Low confidence”).
- Color mapping:
  - Neutral metadata chips: `neutral/100` background and `neutral/600` text.
  - Confidence and risk chips: success, info, and danger semantic colors as above.

### 5.3 Cards

- **Investigation cards and report summaries**
  - White background, subtle border and hover elevation.
  - Include:
    - Title (2 lines max).
    - 1–2 line synopsis.
    - Key tags (category, geography).
    - Status chip (Draft, Private, Public).
  - On hover: elevate slightly and increase border contrast.

### 5.4 Tables and lists

- Use tables sparingly; when needed (for example, stakeholder list), ensure:
  - Row striping with light `neutral/50`.
  - Left‑aligned text, tight but readable vertical spacing.
  - Icons used minimally; prefer text labels.

---

## 6. UX patterns for trust and transparency

### 6.1 Explicit labelling

- Always distinguish:
  - **“Motivation hypothesis”** vs **“Evidence or citation”** vs **“Assumption”**.
- Visual language:
  - Hypothesis: icon and label, neutral or accent color.
  - Evidence: small link icon, `info/500` accent.
  - Assumption: chip with `neutral/100` background, “Assumption” label.

### 6.2 Uncertainty and limitations

- Dedicated section at the end of each report, visually distinct:
  - Background `neutral/50` or very light tinted panel.
  - Title like “Limitations and uncertainty” in serif.
- Short, clear bullet points; avoid walls of text.

### 6.3 Error and empty states

- Friendly but serious tone (no jokes).
- Use muted illustrations or icons; keep color subdued.
- Examples:
  - “We couldn’t retrieve enough reliable sources. Here’s what you can try next…”

---

## 7. Motion and microinteractions

- Keep animations **subtle and functional**:
  - 150–200ms ease‑out transitions for hovers and dropdowns.
  - Avoid parallax, bouncy easing, or large page transitions that feel “gimmicky”.
- Use microfeedback only where it reduces uncertainty:
  - Progress indicator during report generation (linear progress bar with reassuring copy).
  - Brief success toasts for saved drafts.

---

## 8. Accessibility and inclusivity

- **Contrast**
  - All primary text elements must meet **WCAG AA** (ideally AAA for report text).
  - Avoid using color as the only means of conveying risk or level; combine color and labels (for example, “Low confidence”).

- **Keyboard and screen readers**
  - Ensure focus states on all interactive elements.
  - Landmarks: `header`, `nav`, `main`, `aside`, `footer`.

- **Copy tone**
  - Neutral, non‑sensational, avoid language that implies conspiracy.
  - Prefer: “plausible motivations include…” over “the real reason is…”.

---

## 9. Responsive behavior

- **Mobile**
  - Collapse sidebars into top or bottom sheets or filters drawer.
  - Increase base font size to 17–18px for report reading.
  - Stacked layouts: summary → stakeholder cards → evidence.

- **Tablet**
  - Single column for content, optional narrow side rail.

