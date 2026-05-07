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

### 5. SRD item browser
Embed the [D&D 5e SRD](https://dnd.wizards.com/resources/systems-reference-document) item list as a bundled JSON dataset. Add a "Browse SRD" panel in the grid or editor that lets the user:
- Browse / search all official items
- Load an item directly into the editor for export as-is
- Load it as a starting point for a custom edit (auto-populates name, type line, description)

This is also the foundation for the Item Effects feature below.

### 6. Item effects library
Instead of typing every property from scratch, the user can open an "Add effect" picker inside the description editor. Selecting an effect (e.g. *+1 to attack and damage rolls*, *Flaming (1d6 fire)*, *Charges: 3, regain 1d3 at dawn*) appends a pre-formatted block of text **into the description field** where it can be freely edited like any other text. Effects are just data — a curated JSON list of name + snippet pairs. They are not stored separately; once inserted they become plain description content.

Requires the rich text editor (Beta item 1) to be in place first.

### 7. Card templates (visual designs)
A "template" means a completely different card layout and visual design — not a content preset. The first template is the **standard single-sided card** (current design). Additional templates are full redesigns of the preview chrome, each a distinct Vue component receiving the same `ItemCard` props.

Proposed initial template set:
- **Standard** — current design
- **Minimalist** — text-only, no ornamental border
- **Scroll** — parchment scroll aesthetic with illustrated top/bottom borders

The selected template is stored per-card and serialised to `cards.json` as a `template` field.

### 8. Two-sided card template *(client request)*
A special template variant where the card has two faces:
- **Front** — full-bleed artwork only (item name optional as an overlay)
- **Back** — description, stats, type line, footer; no large artwork (thumbnail or icon only)

The PNG export for a two-sided card produces **two separate files** (`{name}-front.png` and `{name}-back.png`) so they can be sent to a print-on-demand service.

The editor gains a face-toggle (Front / Back) when this template is active.

### 9. Import / export collection as JSON
Allow the user to export their entire `cards.json` (and optionally a zip that bundles the art files) as a backup or for sharing. Import reads a previously exported file and merges or replaces the local collection. Critical for moving a campaign between machines.

---

## v1.1 — Quality of life updates

### 10. Print sheet (multi-card export)
Select multiple cards from the grid and export them as a single printable PDF or PNG sheet — typically 3×3 cards at standard poker card size (63×88 mm). Useful for physical printing before a session.

### 11. Tags / custom categories
A freeform tag system (e.g. `Session 3`, `Boss Loot`, `Shop Inventory`) attached to each card. Tags are filterable in the grid. Separate from rarity and type line — purely for the user's own organisation.

### 12. Drag-to-reorder in the grid
Reorder cards in the grid by dragging. Order is persisted to `cards.json` via an `order` field (or array index). Useful for grouping cards by session or encounter without needing tags.

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
| **v1.0** | Planned | SRD browser, item effects, card templates (incl. two-sided), JSON import/export |
| **v1.1** | Planned | Print sheet, tags, drag-to-reorder |
