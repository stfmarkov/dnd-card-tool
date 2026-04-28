<script lang="ts" setup>
import { ref, watch } from 'vue'
import EditorField from './EditorField.vue';
import EditorSection from './EditorSection.vue';
import EditorUploader from './EditorUploader.vue';
import { useItemCardStore } from '../store/itemCard';
import { EventsOn } from '../../wailsjs/runtime/runtime';

const itemCardStore = useItemCardStore();

// Local values so the form is usable in the layout; not wired to the preview or uploads yet.
const name = ref('')
const typeLine = ref('')
const rarity = ref('')
const description = ref('')
const footerText = ref('')
const artwork = ref('');

EventsOn('menu:action', (event) => {
    if (event === 'new-card') {
        itemCardStore.newCard();
        name.value = '';
        typeLine.value = '';
        rarity.value = '';
        description.value = '';
        footerText.value = '';
        artwork.value = '';
    }
});

watch(name, (newValue) => {
    itemCardStore.setName(newValue);
});
watch(typeLine, (newValue) => {
    itemCardStore.setTypeLine(newValue);
});
watch(description, (newValue) => {
    itemCardStore.setDescription(newValue);
});
watch(footerText, (newValue) => {
    itemCardStore.setFooterText(newValue);
});
watch(artwork, (newValue) => {
    itemCardStore.setArtwork(newValue);
});
watch(rarity, (newValue) => {
    itemCardStore.setRarity(newValue);
});
</script>

<template>
    <div class="editor">
        <form class="editor__form" @submit.prevent>
            <EditorSection title="Name &amp; type">
                <EditorField label="Item name" placeholder="E.g. Flame tongue" v-model="name" />
                <EditorField label="Type line" placeholder="E.g. Weapon (longsword), rare (requires attunement)"
                    v-model="typeLine" />
                <EditorField label="Rarity" placeholder="E.g. rare" v-model="rarity" />
            </EditorSection>

            <EditorSection title="Artwork">
                <EditorUploader v-model="artwork" />
            </EditorSection>

            <EditorSection title="Description">
                <EditorField type="textarea" label="Text" placeholder="Properties, charge rules, flavor …"
                    v-model="description" />
            </EditorSection>

            <EditorSection title="Footer">
                <EditorField label="Footer line" placeholder="E.g. D&amp;D 5e — home game" v-model="footerText" />
            </EditorSection>
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

.editor__form {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
    max-width: 32rem;
    width: 100%;
}
</style>
