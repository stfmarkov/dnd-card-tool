<script lang="ts" setup>
import { ref, watch } from 'vue'
import EditorField from './EditorField.vue';

// Local values so the form is usable in the layout; not wired to the preview or uploads yet.
const name = ref('')
const typeLine = ref('')
const description = ref('')
const footerText = ref('')

const watchName = watch(name, (newValue) => {
    console.log('name', newValue);
});
const watchTypeLine = watch(typeLine, (newValue) => {
    console.log('typeLine', newValue);
});
const watchDescription = watch(description, (newValue) => {
    console.log('description', newValue);
});
const watchFooterText = watch(footerText, (newValue) => {
    console.log('footerText', newValue);
});
</script>

<template>
    <div class="editor">
        <header class="editor__masthead">
            <h2 class="editor__title">Item card</h2>
            <p class="editor__subtitle">Layout for everything that appears on the print preview</p>
        </header>

        <form class="editor__form" @submit.prevent>
            <section class="editor__section" aria-labelledby="label-identity">
                <h2 id="label-identity" class="editor__section-title">Name &amp; type</h2>
                <p class="editor__section-hint">Header bar and type line (category, rarity, attunement …).</p>
                <EditorField label="Item name" placeholder="E.g. Flame tongue" v-model="name" />
                <EditorField label="Type line" placeholder="E.g. Weapon (longsword), rare (requires attunement)"
                    v-model="typeLine" />
            </section>

            <section class="editor__section" aria-labelledby="label-art">
                <h2 id="label-art" class="editor__section-title">Artwork</h2>
                <p class="editor__section-hint">Replaces the placeholder in the art frame. Upload behavior comes later.
                </p>
                <label class="editor__upload">
                    <input type="file" class="editor__file" accept="image/*" />
                    <span class="editor__upload-box">
                        <span class="editor__upload-icon" aria-hidden="true" />
                        <span class="editor__upload-text">
                            <span class="editor__upload-lead">Choose image or drop here</span>
                            <span class="editor__upload-meta">PNG, JPG, WebP — for layout only; no import yet</span>
                        </span>
                        <span class="editor__upload-btn" aria-hidden="true">Browse</span>
                    </span>
                </label>
            </section>

            <section class="editor__section" aria-labelledby="label-body">
                <h2 id="label-body" class="editor__section-title">Description</h2>
                <p class="editor__section-hint">Body text (HTML on the card later; single block for now).</p>
                <EditorField type="textarea" label="Text" placeholder="Properties, charge rules, flavor …"
                    v-model="description" />
            </section>

            <section class="editor__section" aria-labelledby="label-footer">
                <h2 id="label-footer" class="editor__section-title">Footer</h2>
                <p class="editor__section-hint">Small line under the gold rule (attribution, version, or blank).</p>
                <EditorField label="Footer line" placeholder="E.g. D&amp;D 5e — home game" v-model="footerText" />
            </section>
        </form>
    </div>
</template>

<style scoped>
.editor {
    min-height: 100%;
    box-sizing: border-box;
    padding: var(--ds-space-5) var(--ds-space-6);
    background: var(--ds-workspace-bg);
    color: var(--ds-workspace-text);
    font-family: var(--ds-font-ui);
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-5);
    max-height: 100%;
    overflow-y: scroll;
    scrollbar-color: var(--ds-gold-mid) var(--ds-workspace-bg-elevated);
    scrollbar-width: thin;
}

.editor::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

.editor::-webkit-scrollbar-track {
    background: var(--ds-workspace-bg-elevated);
    border-left: 1px solid var(--ds-workspace-border);
}

.editor::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, var(--ds-gold) 0%, var(--ds-gold-mid) 45%, #6e5820 100%);
    border-radius: 4px;
    border: 2px solid rgba(0, 0, 0, 0.25);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.editor::-webkit-scrollbar-thumb:hover {
    background: var(--ds-gold-bright);
    border-color: rgba(0, 0, 0, 0.2);
}

.editor::-webkit-scrollbar-thumb:active {
    background: var(--ds-gold-mid);
}

.editor::-webkit-scrollbar-corner {
    background: var(--ds-workspace-bg-elevated);
}

.editor__masthead {
    border-bottom: 1px solid var(--ds-workspace-border);
    padding-bottom: var(--ds-space-4);
    box-shadow: 0 1px 0 0 rgba(200, 160, 58, 0.12);
}

.editor__title {
    margin: 0 0 var(--ds-space-1);
    font-size: var(--ds-text-title);
    font-weight: 700;
    letter-spacing: 0.02em;
    color: var(--ds-workspace-text);
}

.editor__subtitle {
    margin: 0;
    font-size: var(--ds-text-sm);
    color: var(--ds-workspace-muted);
    line-height: 1.45;
    max-width: 36rem;
}

.editor__form {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
    max-width: 32rem;
    width: 100%;
}

.editor__section {
    margin: 0;
    padding: var(--ds-space-4);
    background: var(--ds-workspace-bg-elevated);
    border: 1px solid var(--ds-workspace-border);
    border-radius: 4px;
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.04) inset;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
}

.editor__section-title {
    margin: 0;
    font-size: var(--ds-text-xs);
    text-transform: uppercase;
    letter-spacing: 0.11em;
    color: #e8d9b8;
    font-weight: 600;
    border-left: 3px solid var(--ds-gold-mid);
    padding-left: var(--ds-space-3);
}

.editor__section-hint {
    margin: calc(-1 * var(--ds-space-1)) 0 0;
    padding-left: calc(var(--ds-space-3) + 3px);
    font-size: var(--ds-text-xs);
    color: var(--ds-workspace-muted);
    line-height: 1.4;
}

/* Upload: label + visually hidden file input (opens picker; no handler yet) */
.editor__upload {
    position: relative;
    display: block;
    cursor: pointer;
    border-radius: 3px;
    margin: 0;
}

.editor__file {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
    opacity: 0;
}

.editor__upload-box {
    display: flex;
    align-items: center;
    gap: var(--ds-space-3);
    min-height: 5.5rem;
    padding: var(--ds-space-3) var(--ds-space-4);
    border: 1px dashed rgba(168, 134, 50, 0.45);
    background: linear-gradient(160deg, rgba(0, 0, 0, 0.2) 0%, rgba(36, 48, 68, 0.6) 100%);
    border-radius: 3px;
    transition: border-color 0.15s ease, background 0.15s ease;
}

.editor__upload:hover .editor__upload-box,
.editor__upload:focus-within .editor__upload-box {
    border-color: var(--ds-gold-mid);
    background: linear-gradient(160deg, rgba(0, 0, 0, 0.15) 0%, rgba(50, 62, 82, 0.75) 100%);
}

.editor__upload-icon {
    flex-shrink: 0;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 2px;
    background: var(--ds-burgundy-mid);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
    position: relative;
}

.editor__upload-icon::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 1rem;
    height: 0.9rem;
    border: 2px solid var(--ds-gold-bright);
    border-radius: 1px;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
    background: linear-gradient(180deg, rgba(240, 226, 200, 0.15) 0%, rgba(0, 0, 0, 0) 100%);
}

.editor__upload-text {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-0);
    min-width: 0;
    flex: 1;
    text-align: left;
}

.editor__upload-lead {
    font-size: var(--ds-text-sm);
    font-weight: 600;
    color: var(--ds-workspace-text);
}

.editor__upload-meta {
    font-size: var(--ds-text-xs);
    color: var(--ds-workspace-muted);
    line-height: 1.35;
}

.editor__upload-btn {
    flex-shrink: 0;
    font-size: var(--ds-text-xs);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #f0e6d2;
    padding: var(--ds-space-2) var(--ds-space-3);
    background: var(--ds-burgundy);
    border: 1px solid var(--ds-gold);
    border-radius: 2px;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);
    pointer-events: none;
}
</style>
