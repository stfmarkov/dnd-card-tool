# Item Cards — Roadmap

## Pre-Beta: Core gaps (must ship before any public build)

These are missing pieces in the current flow that would confuse or frustrate any first-time user.

### 1. Delete card
The Go backend already exposes `DeleteCardData(id)` and the TS bindings are generated — there is simply no UI for it. Every card management tool needs a delete action. Add a delete button to the `GridItem` thumbnail (with a confirmation dialog) and wire it to the backend.

### 2. Unsaved-changes protection
Triggering "New card" from the OS menu, or clicking a card in the grid, silently replaces the in-progress editor state with no warning. A dirty-state flag (any field changed since last save) should gate these navigation actions behind a "You have unsaved changes — discard?" dialog.

### 3. New vs. editing indicator in the editor
The editor gives no visual feedback about whether the user is creating a new card or editing an existing one. A heading like *"New card"* / *"Editing — Flame Tongue"* (sourced from the store's `id` and `name`) makes the current context obvious and prevents accidental duplicate saves.

### 4. Empty state in the grid library
When `cards.json` is empty the grid renders blank. A placeholder ("No cards yet — create your first one!") with a CTA button pointing to the editor improves first-run UX significantly.

---

## Beta: Feature-complete for single-card workflow

The app becomes publicly shareable after these land.

### 5. Rich text editor for description
The description field is a plain `<textarea>` today, but the stored value is already treated as HTML (see the placeholder in `newCard()`). Replace the textarea with a lightweight rich-text editor (e.g. [Tiptap](https://tiptap.dev/) or [Quill](https://quilljs.com/)) that supports:
- Bold, italic, underline
- Bullet lists (for charge rules, properties)
- Inline dividers / section breaks

The raw HTML should remain the storage format so nothing in the backend changes.

### 6. Search & filter in the grid library
Once a user has more than ~15 cards, browsing the grid without any filter becomes painful. Add a search bar (filter by name) and a rarity dropdown. These are client-side filters on the already-loaded `itemCards` store — no backend changes needed.

### 7. Duplicate card
A "Duplicate" action on a `GridItem` (or in the editor toolbar when editing an existing card) creates a copy with `id = ''` so it saves as a new row on the next save. Essential for creating variants of the same item.

### 8. Rarity color accent on the preview card
The `GridItem` already uses a `data-rarity` attribute for CSS. The same rarity accent (border colour, badge, or header tint) should appear on the `ItemCardPreview` so the printed PNG reflects rarity at a glance.

---

## v1.0: Content & template system

These are the features that make the tool genuinely useful for a full campaign.

### 9. SRD item browser
Embed the [D&D 5e SRD](https://dnd.wizards.com/resources/systems-reference-document) item list as a bundled JSON dataset. Add a "Browse SRD" panel in the grid or editor that lets the user:
- Browse / search all official items
- Load an item directly into the editor for export as-is
- Load it as a starting point for a custom edit (auto-populates name, type line, description)

This is also the foundation for the Item Effects feature below.

### 10. Item effects library
Instead of typing every property from scratch, the user can open an "Add effect" picker inside the description editor. Selecting an effect (e.g. *+1 to attack and damage rolls*, *Flaming (1d6 fire)*, *Charges: 3, regain 1d3 at dawn*) appends a pre-formatted block of text **into the description field** where it can be freely edited like any other text. Effects are just data — a curated JSON list of name + snippet pairs. They are not stored separately; once inserted they become plain description content.

### 11. Card templates (visual designs)
A "template" in this context means a completely different card layout/design — not a content preset. The first template is the **standard single-sided card** (current design). Additional templates are full redesigns of the preview chrome. Each template is a distinct Vue component that receives the same `ItemCard` props.

Proposed initial template set:
- **Standard** — current design
- **Minimalist** — text-only, no ornamental border
- **Scroll** — parchment scroll aesthetic with illustrated top/bottom borders

The selected template is stored per-card and serialised to `cards.json` as a `template` field.

### 12. Two-sided card template *(client request)*
A special template variant where the card has two faces:
- **Front** — full-bleed artwork only (item name optional as an overlay)
- **Back** — description, stats, type line, footer; no large artwork (thumbnail or icon only)

The PNG export for a two-sided card produces **two separate files** (`{name}-front.png` and `{name}-back.png`) so they can be sent to a print-on-demand service.

The editor gains a face-toggle (Front / Back) when this template is active.

### 13. Import / export collection as JSON
Allow the user to export their entire `cards.json` (and optionally a zip that bundles the art files) as a backup or for sharing. Import reads a previously exported file and merges or replaces the local collection. This is critical for moving a campaign between machines.

---

## v1.1 — Quality of life updates

### 14. Print sheet (multi-card export)
Select multiple cards from the grid and export them as a single printable PDF or PNG sheet — typically 3×3 cards at standard poker card size (63×88 mm). Useful for physical printing before a session.

### 15. Tags / custom categories
A freeform tag system (e.g. `Session 3`, `Boss Loot`, `Shop Inventory`) attached to each card. Tags are filterable in the grid. Separate from rarity and type line — purely for the user's own organisation.

### 16. Drag-to-reorder in the grid
Reorder cards in the grid by dragging. Order is persisted to `cards.json` via an `order` field (or array index). Useful for grouping cards by session or encounter without needing tags.

---

## Release summary

| Milestone | What ships |
|---|---|
| **Pre-beta** | Delete, unsaved-changes guard, editor context header, empty grid state |
| **Beta** | Rich text description, search/filter, duplicate, rarity on preview |
| **v1.0** | SRD browser, item effects, card templates (incl. two-sided), JSON import/export |
| **v1.1** | Print sheet, tags, drag-to-reorder |
