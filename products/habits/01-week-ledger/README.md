# Habits 01: week ledger

**Idea:** A week as a ledger: habits are rows, days are columns, today is gold.

**Intensity:** Medium (assumed: worked example)

**Reference:** none (DERIVE; structure from paper habit trackers)

**Mode:** DERIVE

**Shape:** AppShell with a Night rail of areas, Paper main with a summary strip, a filter toolbar and the ledger table.

## Anatomy

| Region | Objects | Actions | States |
| --- | --- | --- | --- |
| Rail | areas with counts, "left today" | filter by area | current area (gold), left today (sakura count) |
| Header | week kicker, title | Add habit (primary) | |
| Notice | quiet-day banner | dismiss | |
| Summary | ring, ticks text, per-day bars, five-week bars | | today's bar gold |
| Toolbar | area segmented, count shown | filter | selected (lacquer) |
| Ledger | habit rows × 7 days, week total | tick / untick a day | done (lacquer), today column (gold), future (disabled), target met (success) |
| Modal | habit name field | add, cancel | disabled until named |
| Toast | "Added …" | | leaves after 4s |

## Must-keep

- [x] Areas you can filter by, with counts — `RailItem`
- [x] One primary action, adding a habit — `variant="primary"`
- [x] Today's column is clearly "now" — `is-today`
- [x] A tick is one tap and shows as done — `xha01-check`
- [x] Future days can't be ticked — `disabled={future}`
- [x] Progress toward the week's goal — `Ring`
- [x] Days compared at a glance — `Bars`
- [x] Filter by area in the main view too — `Segmented`
- [x] Per-habit total against its target — `xha01-met`
- [x] Empty area says what to do — `EmptyState`
- [x] Confirmation after adding — `Toast`

## Translation

- paper tracker grid → Paper table on washi with hairline rows
- highlighter on today → gold tint column (current)
- ink tick → lacquer square with grain (done)

## Surfaces

Night: rail. Paper: the whole main column, ledger, modal.

## New patterns

- Tick cell (`.xha01-check`): 44px square, `--radius-md`, lacquer + `ds-grain` when on, `--border-subtle` when off. Candidate for a system `Check` component.

## Kept / changed / dropped

- Kept: grid of habits × days, weekly totals.
- Changed: streak counters became a week total against a target (less guilt).
- Dropped: per-habit colours (colour jobs only allow lacquer for done).

## Gives up

History beyond this week is only a five-bar summary; no calendar view.

## System tension

No checkbox/tick component; built `.xha01-check` from tokens (see patterns.md). Table component is for data rows, not a grid of controls, so the ledger uses its own table styled with tokens.
