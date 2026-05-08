<script lang="ts" setup>
import { computed, ref } from 'vue'
import Field from './utils/Field.vue';
import ComboBox from './utils/selects/ComboBox.vue';
import Select from './utils/selects/Select.vue';
import EditorSection from './EditorSection.vue';
import EditorUploader from './EditorUploader.vue';
import DescriptionEditor from './DescriptionEditor.vue';
import EffectPickerPopup from './utils/popups/EffectPickerPopup.vue';
import { useItemCardStore } from '../store/itemCard';
import type { CardTemplate } from '../store/itemCard';
import { rarityOptions, templateOptions, typeOptions } from '../utils/cardOptions';

const itemCardStore = useItemCardStore();

const name = computed({ get: () => itemCardStore.name, set: (v: string) => itemCardStore.setName(v) });
const typeLine = computed({ get: () => itemCardStore.typeLine, set: (v: string) => itemCardStore.setTypeLine(v) });
const rarity = computed({ get: () => itemCardStore.rarity, set: (v: string) => itemCardStore.setRarity(v) });
const template = computed({ get: () => itemCardStore.template, set: (v: string) => itemCardStore.setTemplate(v as CardTemplate) });
const description = computed({ get: () => itemCardStore.description, set: (v: string) => itemCardStore.setDescription(v) });
const footerText = computed({ get: () => itemCardStore.footerText, set: (v: string) => itemCardStore.setFooterText(v) });
const artwork = computed({ get: () => itemCardStore.artwork, set: (v: string) => itemCardStore.setArtwork(v) });

const isPickerOpen = ref(false)

const insertEffect = (snippet: string) => {
    description.value = description.value + snippet
}
</script>

<template>
    <div class="editor">
        <form class="editor__form" @submit.prevent>
            <EditorSection title="Card template">
                <Select label="Template" :options="templateOptions" v-model="template" />
            </EditorSection>

            <EditorSection title="Name &amp; type">
                <Field horizontal label="Item name" labelWidth="70px" placeholder="E.g. Flame tongue" v-model="name" />
                <ComboBox label="Item type" labelWidth="70px" :options="typeOptions" v-model="typeLine" />
                <ComboBox label="Rarity" labelWidth="70px" :options="rarityOptions" v-model="rarity" />
            </EditorSection>

            <EditorSection title="Artwork">
                <EditorUploader v-model="artwork" @update:source-file="itemCardStore.setArtworkSourceFile" />
            </EditorSection>

            <EditorSection title="Description">
                <template #header-actions>
                    <button type="button" class="editor__effect-btn" @click="isPickerOpen = true">
                        + Add effect
                    </button>
                </template>
                <DescriptionEditor v-model="description" />
            </EditorSection>

            <EditorSection title="Footer">
                <Field placeholder="E.g. D&amp;D 5e — home game" v-model="footerText" />
            </EditorSection>
        </form>
    </div>

    <EffectPickerPopup
        :show="isPickerOpen"
        @select="insertEffect"
        @close="isPickerOpen = false"
    />
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

.editor__form {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
    max-width: 32rem;
    width: 100%;
}

.editor__effect-btn {
    background: transparent;
    border: none;
    padding: 0;
    font-family: var(--ds-font-ui);
    font-size: var(--ds-text-xs);
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--ds-gold-mid);
    cursor: pointer;
    transition: color 0.15s ease;
    line-height: 1;
}

.editor__effect-btn:hover {
    color: var(--ds-gold-bright);
}

.editor__effect-btn:focus-visible {
    outline: 2px solid var(--ds-gold-mid);
    outline-offset: 2px;
    border-radius: 2px;
}
</style>
