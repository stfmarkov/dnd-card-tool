# Item Cards — Roadmap

## ~~Pre-Beta~~ — Shipped ✓

All four pre-beta items are done. Summary of what landed:

- **Delete card** — `DeleteCardData` wired in the `itemCards` store; `GridItem` exposes an Edit / Delete dropdown menu (`DropdownMenu` component); `GridItems` triggers a typed confirmation dialog before executing the delete.
- **Unsaved-changes protection** — `isSaved` flag added to the `itemCard` store, set to `false` on every field mutation and `true` after a successful save or `setSelectedItem`. Guards are active on both the OS "New card" menu action (in `ItemCardEditor`) and on selecting a different card from the grid (in `GridItems`), both routing through the new `Confirmation` modal.
- **New vs. editing indicator** — A small `item-card__status` label above the preview card shows **"New item"** (green) when `id` is empty and **"ID: \<uuid\>"** (gold) when editing a saved card. Hidden from print output.
- **Empty state in the grid library** — `GridItems` renders a styled placeholder with a "Create new card" `ButtonMain` CTA when `items.length === 0`.

Infrastructure also shipped as part of this phase: `Confirmation.vue` modal with scale animation, `DropdownMenu.vue`, `ButtonMain.vue`, and a hardened `saveCard()` that snapshots reactive state before any `await` to prevent mid-save race conditions.

---

## Beta: Feature-complete for single-card workflow

The app becomes publicly shareable after these land.

### ~~1. Rich text editor for description~~ ✓
Replaced the plain textarea with a [Tiptap](https://tiptap.dev/)-based editor featuring a floating bubble toolbar with bold and italic. Additional formatting options (underline, bullet lists, dividers) can be added on request. Raw HTML storage format unchanged.

### ~~2. Search & filter in the grid library~~ ✓
Debounced name search plus rarity and type dropdowns in `GridItems`. Filters pass through to `GetCardData` on the backend; a separate "no results" empty state handles the filtered-but-empty case.

### ~~3. Duplicate card~~ ✓
"Duplicate" added to the `GridItem` dropdown alongside Edit / Delete. Calls `DuplicateCardData` on the backend, refreshes the grid, and shows a success toast.

### ~~4. Rarity color accent on the preview card~~ ✓
The type line on `ItemCardPreview` is tinted using the same `--ds-tint-*` tokens as `GridItem`, giving a subtle rarity cue without altering the card's visual design. More expressive rarity treatments (border accents, backgrounds, etc.) are deferred to the card templates milestone where each template can define its own rarity language.

---

## v1.0: Content & template system

These are the features that make the tool genuinely useful for a full campaign.

### ~~5. Item effects library~~ ✓
A curated `itemEffects.json` dataset of 36 name + HTML snippet pairs across 11 categories (Attunement, Attack & Damage, Armor Class, Elemental Damage, Charges, On-Hit Conditions, Special Weapon Properties, Resistances & Saves, On-Critical Properties, Curses, Misc). An "Add effect" button in the Description section header opens a searchable, category-filterable popup; selecting an effect appends its pre-formatted HTML block into the description field where it can be freely edited like any other text. Effects are not stored separately — once inserted they become plain description content.

### ~~6. Card templates (visual designs)~~ ✓
A "template" means a completely different card layout and visual design — not a content preset. Each template is a distinct Vue component receiving the same `ItemCard` props.

Shipped template set:
- **Standard** — original design; burgundy header bar, gold art frame, ruled footer
- **Minimalist** — clean text-focused layout; no coloured header, no ornamental border; art renders full-width without a frame
- **Scroll** — parchment scroll aesthetic; warm aged-paper background, dark wood scroll caps with floral ornaments, gold dividers

The selected template is stored per-card and serialised to `cards.json` as a `template` field. A "Card template" dropdown sits at the top of the editor and updates the preview in real time. The grid shows the template name next to the type line for non-standard cards.

### ~~7. Two-sided card template~~ ✓ *(client request)*
A template with two faces toggled by a flip button on the right edge of the card:
- **Back** (default) — minimalist text layout on a clean white background; name, type line, description, footer; no background texture
- **Front** (flipped) — full-bleed artwork cover with a gradient overlay at the bottom showing the item name and type line

The flip button is a circular burgundy tab on the right edge of the card; hidden from print output. On print, only the back (text) face is rendered. Two-file PNG export (`{name}-front.png` / `{name}-back.png`) is deferred to the print sheet milestone.

---

## v1.1 — Quality of life updates

### 8. Print sheet (multi-card export)
Select multiple cards from the grid and export them as a single printable PDF or PNG sheet — typically 3×3 cards at standard poker card size (63×88 mm). Useful for physical printing before a session.

### 9. Tags / custom categories
A freeform tag system (e.g. `Session 3`, `Boss Loot`, `Shop Inventory`) attached to each card. Tags are filterable in the grid. Separate from rarity and type line — purely for the user's own organisation.

### 10. Drag-to-reorder in the grid
Reorder cards in the grid by dragging. Order is persisted to `cards.json` via an `order` field (or array index). Useful for grouping cards by session or encounter without needing tags.

---

## Future — Requires server infrastructure

Features held until a backend service exists, since they depend on external data or cross-machine sync that a local-only app can't reasonably bundle.

### SRD item browser
Browse and import official D&D 5e SRD items directly into the editor. Requires a server-side API (or a very large bundled dataset that is impractical to ship locally). When implemented, will allow:
- Browsing / searching all official items
- Loading an item as-is or as a starting point for a custom edit

Deferred because the full SRD item list is too large to bundle as a local JSON file and there is no standard interchange format worth supporting at this stage.

---

## Platform support

| Platform | Status | Notes |
|---|---|---|
| **Windows** | ✅ Supported | Primary target |
| **Linux** | Planned | After v1.0 feature set is stable; Wails supports it with minimal changes |
| **macOS** | Not planned | No current demand |
| **Web** | Not planned | Only if a sustainable funding model exists (hosting + storage costs make a free web version unviable) |

---

## Release summary

| Milestone | Status | What ships |
|---|---|---|
| **Pre-beta** | ✅ Shipped | Delete, unsaved-changes guard, new/editing indicator, empty grid state |
| **Beta** | ✅ Shipped | Rich text description, search/filter, duplicate, rarity on preview |
| **v1.0** | ✅ Shipped | Item effects, card templates (Standard / Minimalist / Scroll / Two-sided) |
| **v1.1** | Planned | Print sheet, tags, drag-to-reorder |
| **Future** | Deferred | SRD browser (needs server) |
