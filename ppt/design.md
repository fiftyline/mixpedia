## Overview

Mixpedia presents itself as a data-dense marketing analytics platform through a clean, analytical brand voice. The app opens with a **split login layout** — a deep dark left panel (`{colors.sidebar-bg}`) decorated with a fine mesh grid overlay (`rgba(165,180,252,0.04)` 1px lines at 40px pitch), carrying the headline **"Marketing Intelligence"** in Outfit weight 700, with the `em` accent rendered in periwinkle (`{colors.sidebar-active-stripe}`). The right panel is a white form card with an indigo submit button (`{colors.accent}`).

Inside the app, the layout is a **fixed 248px dark sidebar** (`{colors.sidebar-bg}`) + flex-1 light content area (`{colors.bg}`). The sidebar carries grouped navigation links with a 2px left accent stripe (`{colors.sidebar-active-stripe}`) marking the active route. The content area is divided into page-level sections: a **Search Panel** (filter card), a **Result Section** (GridJS table), and a **Detail View** (hero card + charts + similar items grid).

The system uses three distinct typefaces across every UI surface — **Outfit** for all display headlines, **DM Sans** for all body text, labels, buttons, and data tables, and **JetBrains Mono** for all numeric KPI values and identifiers. All cards, panels, inputs, and buttons are **square (0px border-radius)**, giving the system a sober editorial-analytical geometry. Pills (`{rounded.pill}` 20px) are reserved exclusively for status badges and contextual action chips.

**Key Characteristics:**
- Deep dark sidebar (`{colors.sidebar-bg}` #111827) with periwinkle active stripe (`{colors.sidebar-active-stripe}` #a5b4fc)
- **Signature indigo** (`{colors.accent}` #6366f1) as the singular CTA — every primary action, active state, and accent highlight
- Square/flat geometry on all cards, panels, inputs, and buttons — no rounded corners except badges
- Three-font system: Outfit (display), DM Sans (body/UI), JetBrains Mono (data values)
- GridJS tables as the primary content surface — custom themed with DM Sans and accent pagination
- ECharts visualizations using the MIXPEDIA 16-color palette (slate-first, indigo-led)
- Accent-bordered section headers with gradient wash for sub-sections within cards
- Login: dark-left + white-right split layout with mesh grid decoration

## Colors

> Source files: src/index.css (:root tokens), src/pages/*/styles.css, src/pages/MarketingMixModel/detail/chartUtils.js

### Brand & Primary
- **Mixpedia Indigo** (`{colors.accent}`): Signature primary CTA and active state color — every button, active tab, focus border, and accent highlight.
- **Indigo Hover** (`{colors.accent-hover}`): #5457e0 — pressed / hover state variant.
- **Indigo Muted** (`{colors.accent-muted}`): #ede9fe — accent background tint for tags, selected chip backgrounds, selection indicators.
- **Indigo Muted Text** (`{colors.accent-muted-text}`): #6366f1 — text color on accent-muted backgrounds.
- **Sidebar Active Stripe** (`{colors.sidebar-active-stripe}`): #a5b4fc — periwinkle, exclusive to active sidebar nav indicator. Never used in light content area.

### Sidebar (Dark Surface)
- **Sidebar Background** (`{colors.sidebar-bg}`): #111827 — deep dark panel background.
- **Sidebar Border** (`{colors.sidebar-border}`): #1f2937 — subtle separator and item hover background.
- **Sidebar Text** (`{colors.sidebar-text}`): #9ca3bf — muted nav link text at rest.
- **Sidebar Text Active** (`{colors.sidebar-text-active}`): #e5e7f0 — active / hover nav link text.
- **Sidebar Sub Text** (`{colors.sidebar-sub-text}`): #6b7280 — sub-link text at rest.
- **Sidebar Sub Active** (`{colors.sidebar-sub-active}`): #c7d2fe — active sub-link text.

### Surface (Light Content Area)
- **Page Background** (`{colors.bg}`): #f8f9fc — the outermost page background.
- **Surface** (`{colors.surface}`): #ffffff — primary card, panel, and modal surface.
- **Surface Raised** (`{colors.surface-raised}`): #f1f3fa — input rest state, table headers, filter bars, hover states.
- **Border** (`{colors.border}`): #dde1ef — primary 1px divider and card edge.
- **Border Subtle** (`{colors.border-subtle}`): #eef0f8 — quieter row dividers within tables.

### Text
- **Text** (`{colors.text}`): #1a1d2e — primary headlines and body text.
- **Text Secondary** (`{colors.text-secondary}`): #4b5070 — secondary body, label text, table cell values.
- **Text Tertiary** (`{colors.text-tertiary}`): #8b90b0 — muted hints, placeholders, counts, axis labels.
- **On Dark** (`{colors.on-dark}`): #e5e7f0 — primary text on dark sidebar.
- **On Dark Muted** (`{colors.on-dark-muted}`): #9ca3bf — reduced-opacity text on dark surfaces.

### Semantic
- **Success** (`{colors.success}`): #4fc98f — completed status, upload success, step-done circle fill.
- **Success BG** (`{colors.success-bg}`): rgba(79,201,143,0.1) — success badge background tint.
- **Warning** (`{colors.warning}`): #f59e0b — in-progress / amber status.
- **Warning BG** (`{colors.warning-bg}`): #fef3c7 — in-progress badge background.
- **Error Text** (`{colors.error-text}`): #dc2626 — validation error text.
- **Error BG** (`{colors.error-bg}`): #fef2f2 — error alert panel background.
- **Error Border** (`{colors.error-border}`): #fecaca — error alert border.
- **Danger** (`{colors.danger}`): #f43f5e — rose, destructive actions (delete button).
- **Danger Muted** (`{colors.danger-muted}`): rgba(244,63,94,0.07) — delete pill button background tint.

### Chart Palette (MIXPEDIA)
Slate-first, indigo-led 16-color sequence. Index 0 is always the neutral/non-marketing baseline; indigo (#6366f1) at index 1 matches the system accent.
- [0] **Slate** (`{colors.chart-0}`): #94a3b8 — non-marketing / neutral baseline series.
- [1] **Indigo** (`{colors.chart-1}`): #6366f1 — primary series; matches system accent.
- [2] **Sky** (`{colors.chart-2}`): #0ea5e9
- [3] **Emerald** (`{colors.chart-3}`): #10b981 — also used for R² metric column highlight.
- [4] **Amber** (`{colors.chart-4}`): #f59e0b
- [5] **Rose** (`{colors.chart-5}`): #f43f5e
- [6] **Violet** (`{colors.chart-6}`): #8b5cf6
- [7] **Cyan** (`{colors.chart-7}`): #06b6d4
- [8–15] Extended: Emerald-400, Sky-400, Amber-400, Rose-400, Violet-400, Cyan-400, Lime, Pink

## Typography

### Font Family
**Outfit** (headline): Geometric display sans — Outfit, sans-serif. Fallbacks: sans-serif. Used exclusively for page titles, card headings, modal titles, login headline, logo text.

**DM Sans** (body): Humanist sans — DM Sans, sans-serif. Fallbacks: sans-serif. Every interactive surface: body text, filter labels, button labels, nav links, inputs, GridJS tables, tooltips.

**JetBrains Mono** (data): Developer monospace — JetBrains Mono, monospace. Strictly for numeric KPI values, model IDs, date strings, count displays, similarity scores.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Font | Use |
|---|---|---|---|---|---|---|
| `{typography.page-title}` | 1.55rem (~25px) | 600 | 1.3 | -0.01em | Outfit | Page-level heading (미디어믹스 검색) |
| `{typography.hero-name}` | 1.75rem (~28px) | 700 | 1.2 | -0.02em | Outfit | Mix detail file name headline |
| `{typography.media-name}` | 2rem (32px) | 700 | 1.1 | -0.02em | Outfit | Media insight hero name |
| `{typography.model-name}` | 1.5rem (24px) | 700 | 1.2 | 0 | Outfit | MMM model name in detail header band |
| `{typography.card-title}` | 1rem (16px) | 700 | 1.4 | 0 | Outfit | Card / section card title |
| `{typography.section-title}` | 0.95rem (~15px) | 700 | 1.4 | 0 | Outfit | Section header label (`mmm-section-hdr-title`) |
| `{typography.complete-title}` | 1.4rem (~22px) | 700 | 1.4 | 0 | Outfit | Step-completion congratulation headline |
| `{typography.body-md}` | 0.875rem (14px) | 400 | 1.6 | 0 | DM Sans | Primary body text, descriptions |
| `{typography.body-sm}` | 0.825rem (~13px) | 400 | 1.6 | 0 | DM Sans | Secondary body, table cells, modal body |
| `{typography.body-xs}` | 0.775rem (~12px) | 400–500 | 1.5 | 0 | DM Sans | Tertiary hints, counts, result header |
| `{typography.label}` | 0.7rem (~11px) | 600–700 | 1.4 | 0.05–0.06em | DM Sans | Uppercase filter / form labels |
| `{typography.label-sm}` | 0.65–0.68rem | 700 | 1.4 | 0.06em | DM Sans | Stat strip micro labels, chip-k labels |
| `{typography.caption}` | 0.72–0.78rem | 700 | 1.4 | 0.03em | DM Sans | Badge text, section number chips |
| `{typography.button}` | 0.875rem (14px) | 600 | 1.3 | 0.02em | DM Sans | All primary button labels |
| `{typography.button-sm}` | 0.82–0.85rem | 600 | 1.3 | 0.02em | DM Sans | Filter action and compact buttons |
| `{typography.table-header}` | 0.72rem (~11.5px) | 600 | 1.4 | 0.06em | DM Sans | GridJS TH — uppercase centered |
| `{typography.table-cell}` | 0.825rem (~13px) | 400 | 1.5 | 0 | DM Sans | GridJS TD |
| `{typography.data-lg}` | 1.25–1.55rem | 700 | 1 | 0 | JetBrains Mono | KPI big numbers, stat strip highlight |
| `{typography.data-md}` | 0.875–1.1rem | 700 | 1.3 | 0 | JetBrains Mono | Performance table values (R², MAPE) |
| `{typography.data-sm}` | 0.72–0.82rem | 500–700 | 1.4 | 0.02–0.04em | JetBrains Mono | Counts, IDs, similarity scores |

### Principles
- Outfit exclusively for headings and display — never body or labels
- DM Sans for every interactive and editorial surface — buttons, inputs, nav, tables, all GridJS
- JetBrains Mono strictly for measured numeric output — signals "this is a data value"
- Labels always uppercase with letter-spacing 0.05–0.06em at 0.68–0.78rem weight 600–700
- All ECharts chart options must set `fontFamily: "DM Sans, sans-serif"` explicitly — no browser fallback

## Layout

### Spacing System
- **Base unit**: 4px (8px primary increment)
- **Content horizontal padding**: 24px (all page-level modules)
- **Card padding**: 24px 28px (standard), 20px 24px (filter panels)
- **Section vertical gap**: 20px (between cards on a page)
- **Grid gap tight**: 12px (badge grids, similar-card flex)
- **Grid gap standard**: 16px (filter rows, insight grid)
- **Grid gap loose**: 20–24px (two-column chart grids, info card grids)

### Grid & Container
- App: 248px fixed sidebar + `flex: 1` light content (no max-width cap)
- Detail two-column: `1fr / 320px` sidebar for overview attribution; collapses at 960px
- Info cards: `repeat(5, 1fr)` at desktop; `repeat(3, 1fr)` below 1200px
- Stat strip: 5 columns, border-joined cells (`border-right` on each, no gap)
- Filter grids: `auto-fill minmax(180px, 1fr)` for adaptive filter layouts
- Two-column charts: `1fr 1fr` with `align-items: start`

### Whitespace Philosophy
Data-dense — cards are packed with information rather than padded generously. Page content is separated by `1px {colors.border}` lines and surface-color shifts (`{colors.surface}` vs `{colors.bg}`) rather than large vertical gaps. ECharts chart heights are fixed at 220px for side-by-side grids, ~300px for full-width views.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow; `{colors.border}` 1px border | All content cards, tables, panels, inputs |
| 1 (dropdown) | `rgba(0,0,0,0.08) 0px 4px 16px` | MultiSelect dropdowns, select overlays |
| 2 (modal) | `rgba(0,0,0,0.40) 0px 8px 32px` | Edit request modal, bookmark confirm modal |
| 3 (delete modal) | `rgba(0,0,0,0.15) 0px 20px 60px` | Delete confirm modal — with `backdrop-filter: blur(2px)` |

### Overlay
- Standard modals: `rgba(0,0,0,0.35–0.50)` full-screen overlay, no blur
- Delete confirm modal: `rgba(15,17,35,0.45)` overlay + `backdrop-filter: blur(2px)` — higher visual weight for destructive action

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | ALL primary cards, panels, inputs, main buttons, table borders — the absolute default |
| `{rounded.xs}` | 2px | GridJS pagination buttons |
| `{rounded.sm}` | 4px | Bookmark icon button, action buttons, overview KPI cards, detail media tags |
| `{rounded.md}` | 6px | Bookmark modal container, model ID `<code>` chip in delete modal |
| `{rounded.lg}` | 8px | Info card icon containers (42×42px squares) |
| `{rounded.modal-btn}` | 10px | Delete confirm modal action buttons (cancel / confirm) |
| `{rounded.pill}` | 16–20px | Status badges (mmm-badge), report/delete pill buttons, assessment badges |
| `{rounded.circle}` | 50% | Step indicator circles, delete confirm icon container |

Mixpedia's geometry is **flat/square-first** — `{rounded.none}` (0px) is the default for every new interactive or content element. Pills (`{rounded.pill}`) are used exclusively for status indicators and contextual action chips; never for content cards or primary buttons.

## Components

> Per the minimal-hover policy, hover states are only documented where they represent meaningful visual behavior change.

### Buttons

**`button-primary`** — Signature indigo rectangular primary CTA.
- Background `{colors.accent}`, text `#ffffff`, typography `{typography.button}`, padding `0 22px`, height 34px, rounded `{rounded.none}`.
- Hover: background `{colors.accent-hover}` (#5457e0). Disabled: opacity 0.40.

**`button-primary-full`** — Full-width indigo submit (login, model query).
- Same as button-primary, width 100%, height 42px. Used in forms where the button spans the full input width.

**`button-secondary`** — Outlined rectangular secondary action (reset, cancel).
- Background `{colors.surface}`, text `{colors.text-secondary}`, border `1px solid {colors.border}`, typography `{typography.button}`, height 34px, rounded `{rounded.none}`.
- Hover: border-color `{colors.text-secondary}`, text `{colors.text}`.

**`button-ghost`** — Inline back-navigation ghost button.
- Background none, border none, text `{colors.text-secondary}`, typography `{typography.body-sm}` weight 600, padding 0.
- Hover: text `{colors.text}` or `{colors.accent}` depending on context.

**`button-danger-ghost`** — Destructive outline button (데이터 수정 요청).
- Background `#fff5f5`, border `1px solid #fca5a5`, text `#dc2626`, height 30px, padding `0 12px`, rounded `{rounded.none}`.
- Hover: border `#dc2626`, background `#fee2e2`.

**`button-toggle`** — Segmented control button group (KPI type, toggle selectors).
- Inactive: `{colors.surface}` bg, `{colors.border}` border, `{colors.text-secondary}` text, 7px 22px padding.
- Active: `rgba(99,102,241,0.08)` bg, `{colors.accent}` border + text color, `inset 0 -2px 0 {colors.accent}` box-shadow.

**`mmm-btn`** — MMM wizard navigation button (이전 / 다음).
- Background `{colors.surface}`, border `{colors.border}`, text `{colors.text}`, padding `9px 22px`, rounded `{rounded.none}`.
- Hover: border `{colors.accent}`, text `{colors.accent}`.
- `mmm-btn--primary`: `{colors.accent}` background, white text; hover darkens to #5254cc.

**`bulk-action-btn`** — Inline bulk table action (북마크 추가, 해제, 분석).
- Height 26px, padding `0 10px`, border `{colors.border}`, rounded `{rounded.none}`, `{typography.body-xs}` weight 500.
- Analyze variant: `{colors.accent}` border + text at rest.

### Cards & Containers

**`mmm-card`** — Standard content card. The primary section container across all pages.
- Background `{colors.surface}`, border `1px solid {colors.border}`, padding `24px 28px`, rounded `{rounded.none}`.

**`search-panel`** — Filter panel above result tables.
- Background `{colors.surface}`, border `1px solid {colors.border}`, padding `20px 24px`, flex-column with 18px gap.

**`result-section`** — GridJS table container with header strip.
- Background `{colors.surface}`, border `1px solid {colors.border}`. Header: 12px 18px padding, border-bottom, flex with result count and bulk actions.

**`mix-hero`** — MixSearch detail hero card (filename + info table + donut chart).
- Background `{colors.surface}`, border `1px solid {colors.border}`, padding `24px 28px`, position relative for absolute action buttons.

**`media-hero`** — MediaInsight detail hero (media name + stats strip).
- Background `{colors.surface}`, border `1px solid {colors.border}`, padding `24px 28px`.

**`similar-card`** — Clickable similar-mix result card.
- Background `{colors.surface-raised}`, border `{colors.border}`, padding `14px`, rounded `{rounded.none}`.
- Hover: border `{colors.accent}`, background `{colors.surface}`.

**`mmm-detail-header-wrap`** — MMM model detail header band (model name + 5 info cards).
- Background `{colors.surface}`, border `{colors.border}`, padding `20px 28px`.

**`mmm-overview-card`** — Small KPI metric card in overview grid.
- Background `{colors.surface}`, border `{colors.border}`, rounded `{rounded.sm}` (4px), padding `14px 16px`.

**`mmm-info-card`** — Detail header info card (period, KPI variable, media count).
- Background `{colors.bg}`, border `{colors.border}`, padding `14px 16px`, rounded `{rounded.none}`.
- Icon container: 42×42px, rounded `{rounded.lg}` (8px), color-tinted per card type.

**`insight-section`** — MediaInsight chart/rank section panel.
- Background `{colors.surface}`, border `{colors.border}`, rounded `{rounded.none}`. Header strip: 12px 18px, border-bottom.

**`mmm-var-card`** — Step 02/03 variable configuration card.
- Background `{colors.bg}`, border `{colors.border}`, padding `14px 16px`. First child: 2px accent top border. Last child: 2px rose (#e15f4f) top border.

### Inputs & Forms

**`text-input`** — Standard text field.
- Background `{colors.surface-raised}`, border `1px solid {colors.border}`, text `{colors.text}`, height 36–40px, padding `0 12px`, rounded `{rounded.none}`, DM Sans, 0.875rem.
- Focus: border `{colors.accent}`, background `{colors.surface}`.

**`filter-select`** — Select dropdown with custom chevron SVG.
- Same base as text-input, `appearance: none`, custom `background-image` SVG arrow at right 10px.

**`search-text-input`** — Full-width search bar with left icon prefix.
- Height 40px, padding-left 34px (for 14px Search icon). Same border/focus behavior as text-input.

**`mmm-textarea`** — Resize-none edit request textarea.
- Height 110px, same 1px border system, DM Sans 0.825rem, `resize: none`.

**`mmm-number-input`** — Compact numeric input (ROI / settings).
- Width 120px, height ~36px, no spin buttons (webkit appearance none).

**`upload-area`** — Drag-and-drop CSV upload zone.
- `border: 2px dashed {colors.border}`, min-height 130px, centered flex column.
- Hover/drag active: `{colors.accent}` dashed border, `rgba(99,102,241,0.04)` background.
- Upload done: `#4fc98f` border, `rgba(79,201,143,0.04)` background.

### Tabs

**`mmm-tab-bar`** — Detail page three-tab navigation (Overview / Ad Effect / Optimize).
- Background `{colors.surface}`, border `1px solid {colors.border}`, border-bottom: none (merges with content card below), padding `0 8px`.

**`mmm-tab-btn`** — Individual tab button.
- Padding `11px 26px`, `{typography.body-md}` weight 600, DM Sans, border-bottom `2px solid transparent`, margin-bottom -1px (overlap trick), rounded `{rounded.none}`.
- Active: text `{colors.accent}`, border-bottom-color `{colors.accent}`.

**`mmm-toggle-descs`** — Tab-linked description row below segment control.
- Inactive: border-bottom `{colors.border}`, `{colors.text-tertiary}`.
- Active: border-bottom `2px {colors.accent}`, `{colors.accent}`, weight 600.

### Badges & Status

**`mmm-badge--complete`** — 완료 (complete) status badge.
- Background `#d1fae5`, text `#065f46`, rounded `{rounded.pill}` (20px), padding `2px 8px`, weight 700, 13px.

**`mmm-badge--progress`** — 처리 중 (in-progress) status badge.
- Background `#fef3c7`, text `#92400e`, rounded `{rounded.pill}`.

**`mmm-badge--error`** — 오류 (error) status badge.
- Background `#fee2e2`, text `#7f1d1d`, rounded `{rounded.pill}`.

**`mmm-badge--other`** — Neutral / unknown status badge.
- Background `{colors.surface}`, text `{colors.text-secondary}`, border `{colors.border}`, rounded `{rounded.pill}`.

**`mmm-report-btn`** — Indigo pill action chip (결과 보고서).
- Background `rgba(99,102,241,0.08)`, border `rgba(99,102,241,0.25)`, text `#6366f1`, rounded `{rounded.pill}`, 12px, weight 600.

**`mmm-delete-btn`** — Rose pill destructive action chip (삭제).
- Background `rgba(244,63,94,0.07)`, border `rgba(244,63,94,0.2)`, text `#f43f5e`, rounded `{rounded.pill}`.

**`mix-tag`** — Media channel tag chip (indigo tint).
- Background `{colors.accent-muted}`, border `#c7d2fe`, text `{colors.accent}`, padding `3px 10px`, rounded `{rounded.none}`, 0.825rem, weight 600.

**`mix-tag--ind`** — Industry category tag chip (neutral).
- Background `{colors.surface-raised}`, border `{colors.border}`, text `{colors.text-secondary}`.

**`media-type-badge`** — Media insight hero type label.
- Background `{colors.accent-muted}`, border `#c7d2fe`, text `{colors.accent}`, uppercase, letter-spacing 0.05em, 0.7rem weight 600, padding `3px 10px`, rounded `{rounded.none}`.

**`mmm-detail-tag`** — Media variable tag in detail header.
- Background `color-mix(in srgb, {colors.accent} 8%, transparent)`, text `{colors.accent}`, border accent 25%, rounded `{rounded.sm}` (4px), padding `1px 7px`.

**`mmm-section-tag`** — Required / optional section annotation.
- Required: `#4fc98f` text, `rgba(79,201,143,0.1)` bg, `rgba(79,201,143,0.25)` border.
- Optional: `{colors.text-tertiary}` text, `{colors.border}` border, transparent bg.

**`mmm-detail-assess`** — Model quality assessment badge (Good / Warn / Neutral).
- Good: `#d1fae5` bg, `#065f46` text. Warn: `#fef3c7` bg, `#92400e` text. Neutral: `{colors.surface}` bg, `{colors.text-secondary}` text, `{colors.border}` border.
- Rounded `{rounded.pill}` (20px), padding `3px 10px`, weight 700, 0.78rem, DM Sans.

**`result-selected`** — Bulk selection count indicator.
- Background `{colors.accent-muted}`, border `#c7d2fe`, text `{colors.accent}`, JetBrains Mono 0.775rem weight 600, padding `1px 8px`, rounded `{rounded.none}`.

**`mmm-section-num`** — Section number chip inside `mmm-section-hdr`.
- Background `rgba(99,102,241,0.12)`, text `{colors.accent}`, padding `2px 8px`, 0.75rem weight 700, letter-spacing 0.03em, rounded `{rounded.none}`.

### Tables

**`gridjs-table`** — Global GridJS data table theme applied across all pages.
- `font-family: var(--font-body)` (DM Sans), font-size 0.825rem, border-collapse, width 100%.

**`gridjs-th`** — Table header cell.
- Background `{colors.surface-raised}`, border-bottom `1px {colors.border}`, padding `9px 12px`, center-aligned.
- DM Sans, 0.72rem, weight 600, UPPERCASE, letter-spacing 0.06em, `{colors.text-secondary}`.

**`gridjs-td`** — Table data cell.
- Background `{colors.surface}`, border-bottom `1px {colors.border-subtle}`, border-left `2px solid transparent`, padding `9px 12px`, center-aligned.
- DM Sans, 0.825rem, `{colors.text-secondary}`.

**`gridjs-tr:hover td`** — Row hover state.
- Background `{colors.surface-raised}`, text `{colors.text}`, first cell border-left `{colors.accent}`.

**`gridjs-currentPage`** — Active pagination button.
- Background `{colors.accent}`, border-color `{colors.accent}`, text white, weight 600.

**`gridjs-footer`** — Table footer bar.
- Background `{colors.surface-raised}`, border-top `{colors.border}`, padding `8px 14px`.

**`mmm-summary-grid total row`** — Total/summary row highlight in MMM tables.
- `background: rgba(99,102,241,0.05)`, `border-top: 2px solid rgba(99,102,241,0.3)`, weight 600.

### Documentation Components

**`mmm-perf-table`** — Model R²/MAPE performance 2-column comparison table.
- Indigo column header: 2px `{colors.accent}` top border, cells `rgba(99,102,241,0.03)` bg, `{colors.accent}` value text.
- Emerald column header: 2px `#10b981` top border, cells `rgba(16,185,129,0.04)` bg, `#10b981` value text.
- Visual pairing communicates two orthogonal model quality metrics.

**`mmm-detail-stat-strip`** — 5-column KPI stat strip below model header.
- `{colors.bg}` background, border-joined cells. Label: 0.68rem uppercase, `{colors.text-tertiary}`. Big value: JetBrains Mono 1.55rem weight 700, `{colors.accent}`.

**`similar-card-stats`** — Budget stat row at the bottom of each similar-mix card.
- Border-top `{colors.border-subtle}`, 8px padding-top. Label: 0.65rem uppercase. Value: JetBrains Mono 0.775rem.

**`rank-row`** — Industry/program rank bar row in MediaInsight.
- 3-column grid (90px label, 1fr bar, 48px count). Bar height 6px. Target bar: `{colors.accent}` at 70% opacity. Industry bar: `{colors.text-secondary}` at 40% opacity.

**`mmm-example-box`** — CSV format example callout box in Step 01.
- Background `{colors.bg}`, border `{colors.border}`, border-left `3px {colors.accent}`, padding `12px 16px`. `code` snippets: `{colors.accent}` text, JetBrains Mono.

**`mmm-req-box`** — CSV requirements checklist panel.
- Background `{colors.bg}`, border `{colors.border}`, padding `14px 16px`, square. Required badge: `rgba(99,102,241,0.1)` bg, `{colors.accent}` text.

### Navigation

**Sidebar Navigation** — All routing lives in the 248px dark left sidebar.
- Group label: `{colors.sidebar-text}` 0.95rem weight 500, letter-spacing 0.01em.
- Active group label: `{colors.sidebar-active-stripe}` (#a5b4fc).
- Nav link: padding `10px 12px`, rounded `{rounded.sm}` (4px), DM Sans 0.95rem weight 500.
- Active link: `{colors.sidebar-border}` (#1f2937) background, `{colors.sidebar-text-active}` text, 2px left stripe `{colors.sidebar-active-stripe}` (inset 6px top/bottom).
- Sub-link: padding `7px 12px`, 0.8rem weight 400, `{colors.sidebar-sub-text}` (#6b7280).
- Active sub-link: `{colors.sidebar-sub-active}` (#c7d2fe) text, 2px left stripe `{colors.sidebar-active-stripe}`.
- Logout: outlined button, `#374151` border, `{colors.sidebar-text}` text; hover: `#f87171` rose.

### Signature Components

**`app-layout`** — Root two-panel layout.
- `display: flex`, `min-height: 100vh`. Left: 248px fixed sidebar. Right: `flex: 1` content with `padding: 36px 0 0`.

**`login-panel`** — Dark left panel on login / onboarding page.
- Background `#111827`, padding `48px 52px`. Mesh grid overlay: `linear-gradient(rgba(165,180,252,0.04) 1px, transparent 1px)` at 40px pitch.
- Headline: Outfit 2.6rem weight 700, `#f9fafb`, `letter-spacing: -0.02em`. `<em>` accent: `{colors.sidebar-active-stripe}` (#a5b4fc).

**`mmm-section-hdr`** — Accent-bordered section header inside MMM cards.
- `border-left: 3px solid {colors.accent}`. Gradient: `linear-gradient(90deg, rgba(99,102,241,0.04) 0%, transparent 60%)`.
- Contains: section number chip + Outfit 0.95rem weight 700 title + optional required/optional tag.

**`mmm-card-title--section`** — Chart section title with left accent rule (used inside detail tab cards).
- `padding-left: 10px`, `border-left: 3px solid {colors.accent}`, same gradient background as `mmm-section-hdr`.

**`mmm-step-indicator`** — Multi-step wizard progress bar.
- Circle: 26×26px, `{rounded.circle}` (50%), 0.72rem weight 700.
- Default: `{colors.border}` outline, `{colors.surface}` bg, `{colors.text-tertiary}` number.
- Active: `{colors.accent}` border + `rgba(99,102,241,0.08)` bg + `{colors.accent}` number.
- Done: `#4fc98f` fill, white number.
- Connector: 1px `{colors.border}` horizontal line, `flex: 1`, 8px margin.

**`mmm-detail-band`** — MMM model detail top band (model name + period + status chips).
- Flex row, `border-bottom: 2px solid {colors.border}`. Model name: Outfit 1.5rem weight 700. Model ID: JetBrains Mono 0.75rem `{colors.text-tertiary}`. Divider: 1px × 32px `{colors.border}`.

**`mmm-modal` (delete confirm)`** — Destructive action confirmation modal.
- Background white, rounded `{rounded.pill}` (16px), padding `32px 28px 24px`, width 360px, `box-shadow: 0 20px 60px rgba(0,0,0,0.15)`, backdrop blur overlay.
- Icon container: 52×52px, `{rounded.circle}` (50%), `rgba(244,63,94,0.08)` bg.
- Model ID chip: JetBrains Mono, `{colors.surface}` bg, `{colors.border}`, rounded `{rounded.md}` (6px).
- Warning text: `{colors.danger}` (#f43f5e), weight 600.
- Action buttons: `flex: 1`, `{rounded.modal-btn}` (10px) — Cancel: surface/border. Confirm: `{colors.danger}` fill, white text.

## Do's and Don'ts

### Do
- Use `{colors.accent}` (#6366f1 indigo) as the singular primary CTA across all light-surface pages
- Use `{colors.sidebar-active-stripe}` (#a5b4fc periwinkle) exclusively for active sidebar indicators — never in the light content area
- Keep all content cards, inputs, and buttons square (`{rounded.none}` 0px) — the editorial-analytical geometry
- Use pill radius (`{rounded.pill}` 20px) only for status badges (mmm-badge) and contextual action chips (report/delete)
- Apply Outfit for headlines only; DM Sans for all body/labels/buttons; JetBrains Mono for all numeric/data values
- Set `fontFamily: "DM Sans, sans-serif"` explicitly in all ECharts options — never rely on browser defaults
- Apply the section-header pattern (`mmm-section-hdr` / `mmm-card-title--section`) consistently for titled sub-sections within cards
- Use MIXPEDIA palette in sequence: slate (#94a3b8) as index 0 neutral baseline, indigo (#6366f1) onward for media series
- Pair `{colors.accent}` (indigo) with `#10b981` (emerald) for two-metric comparison tables (R² vs MAPE)

### Don't
- Don't apply `border-radius` to primary content cards, panels, or action buttons — keep them square
- Don't use the sidebar periwinkle (`{colors.sidebar-active-stripe}`) in the light content area — sidebar-only token
- Don't mix Outfit into body text, labels, or buttons — it is display-only
- Don't use JetBrains Mono for non-numeric content — reserved for measured data values
- Don't add colored backgrounds to content section panels — keep surfaces white or `{colors.bg}`
- Don't use `inverse: true` on ECharts x-axes — values must increase left to right
- Don't use browser/system default fonts in ECharts or GridJS — always set `font-family` explicitly
- Don't introduce a second accent color — indigo (#6366f1) is the sole accent across all light surfaces

## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Wide Desktop | ≥ 1200px | Info cards 5-column (`repeat(5, 1fr)`); full stat strip layout |
| Desktop | 960–1199px | Info cards 3-column; detail two-column maintained |
| Tablet | 768–959px | `.mmm-detail-two-col` collapses to single column |
| Mobile | < 768px | Layout collapses; fixed sidebar requires hamburger (not yet implemented) |

### Touch Targets
- Primary buttons: 34–42px effective height
- Filter inputs and selects: 36–40px height
- Detail tab buttons: ~42px (11px + 26px vertical padding)
- Bookmark icon button: 28×28px minimum
- Pagination page buttons: ~28px height

### Collapsing Strategy
- **Detail two-column** (`.mmm-detail-two-col`, `1fr / 320px`): collapses to single column below 960px
- **Info cards grid** (`.mmm-info-cards`, 5-column): → 3-column below 1200px
- **Two-column charts** (`.mmm-two-col-charts`): collapses to single column at tablet
- **Stat strip** (`.mmm-detail-stat-strip`, 5 fixed columns): scrolls horizontally on narrow viewports
- **Sidebar**: currently fixed at 248px — no mobile hamburger adapter defined

### Image Behavior
- ECharts charts: fixed px height (220px side-by-side, ~300px full-width) with `width: 100%`
- DonutChart: responsive within its flex container, legend wraps below on narrow widths
- Network graph (MediaNetwork): fills container height, min-height 400px

## Iteration Guide

1. Focus on ONE component at a time
2. Reference component names and token names directly
3. Default to `{rounded.none}` (0px) for any new card, panel, or button
4. Keep `{colors.accent}` (#6366f1) as the singular primary — do not introduce a second accent
5. Set all three font families explicitly — never rely on cascade or browser defaults
6. New chart series: extend from the MIXPEDIA palette in index order
7. Apply `mmm-section-hdr` pattern for all titled sub-sections within cards
8. Add new status types as `mmm-badge--*` variants with semantic color pairs (bg + text)

## Known Gaps

- Mobile / sidebar responsive behavior not fully defined — hamburger menu pattern absent from codebase
- Dark mode not implemented — sidebar tokens are hardcoded hex values, not CSS variable pairs
- Animation/transition timings not formalized — all transitions are `0.15s ease` by convention
- ECharts option tokens not extracted into a shared config — MIXPEDIA array is imported per-chart-file
- Form input validation success state not captured — no green border/icon for valid fields
- Scrollbar styling defined only for thin webkit in dropdown lists — not global
- Sidebar width (248px) is hardcoded — no token for it
