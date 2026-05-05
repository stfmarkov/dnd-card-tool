<script lang="ts" setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const props = defineProps<{
    label?: string;
    modelValue: string;
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

// --- Floating toolbar state ---
const bubbleStyle = ref({ top: '0px', left: '0px' })
const showBubble = ref(false)

const updateBubble = (): void => {
    if (!editor.value) return
    const { state, view } = editor.value
    const { from, to, empty } = state.selection

    if (empty || !view.hasFocus()) {
        showBubble.value = false
        return
    }

    const start = view.coordsAtPos(from)
    const end = view.coordsAtPos(to)
    const editorRect = view.dom.closest('.desc-editor__content')?.getBoundingClientRect()
        ?? view.dom.getBoundingClientRect()

    // Centre the bubble over the selection, above the first line
    const midX = (start.left + end.left) / 2 - editorRect.left
    const topY = start.top - editorRect.top

    bubbleStyle.value = {
        top: `${topY}px`,
        left: `${midX}px`,
    }
    showBubble.value = true
}

// --- Editor setup ---
const editor = useEditor({
    content: props.modelValue,
    extensions: [
        StarterKit.configure({
            blockquote: false,
            bulletList: false,
            code: false,
            codeBlock: false,
            hardBreak: false,
            heading: false,
            horizontalRule: false,
            listItem: false,
            orderedList: false,
            strike: false,
        }),
    ],
    onUpdate({ editor }) {
        const html = editor.getHTML()
        if (html !== props.modelValue) emit('update:modelValue', html)
        updateBubble()
    },
    onSelectionUpdate() { updateBubble() },
    onBlur() { showBubble.value = false },
    onFocus() { updateBubble() },
})

// Sync editor when a different card is loaded
watch(() => props.modelValue, (newVal) => {
    if (!editor.value) return
    if (editor.value.getHTML() !== newVal) {
        editor.value.commands.setContent(newVal, { emitUpdate: false } as any)
    }
})

onBeforeUnmount(() => editor.value?.destroy())
</script>

<template>
    <div class="desc-editor">
        <label v-if="label" class="desc-editor__label">{{ label }}</label>

        <div class="desc-editor__content">
            <!-- Floating bubble toolbar -->
            <Transition name="bubble">
                <div v-if="showBubble" ref="bubble" class="desc-editor__bubble" :style="bubbleStyle">
                    <button type="button" class="desc-editor__bubble-btn"
                        :class="{ 'desc-editor__bubble-btn--active': editor?.isActive('bold') }"
                        @mousedown.prevent="editor?.chain().focus().toggleBold().run()" title="Bold (Ctrl+B)">
                        <strong>B</strong>
                    </button>
                    <button type="button" class="desc-editor__bubble-btn"
                        :class="{ 'desc-editor__bubble-btn--active': editor?.isActive('italic') }"
                        @mousedown.prevent="editor?.chain().focus().toggleItalic().run()" title="Italic (Ctrl+I)">
                        <em>I</em>
                    </button>
                </div>
            </Transition>

            <EditorContent :editor="editor" />
        </div>
    </div>
</template>

<style scoped>
.desc-editor {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
}

.desc-editor__label {
    font-size: var(--ds-text-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--ds-workspace-muted);
    font-weight: 600;
}

.desc-editor__content {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid var(--ds-workspace-border);
    border-radius: 3px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    cursor: text;
}

.desc-editor__content:has(.tiptap:focus) {
    border-color: var(--ds-gold-mid);
    box-shadow: 0 0 0 1px var(--ds-gold-mid);
}

.desc-editor__content:hover:not(:has(.tiptap:focus)) {
    border-color: rgba(200, 168, 100, 0.4);
}

/* ProseMirror editable area */
.desc-editor__content :deep(.tiptap) {
    padding: var(--ds-space-2) var(--ds-space-3);
    font: inherit;
    font-size: var(--ds-text-base);
    line-height: 1.4;
    color: var(--ds-workspace-text);
    min-height: 7.5rem;
    outline: none;
}

.desc-editor__content :deep(.tiptap p) {
    margin: 0 0 0.4em;
}

.desc-editor__content :deep(.tiptap p:last-child) {
    margin-bottom: 0;
}

/* Floating bubble */
.desc-editor__bubble {
    position: absolute;
    z-index: 10;
    transform: translate(-50%, calc(-100% - 6px));
    display: flex;
    gap: 2px;
    background: var(--ds-workspace-bg-elevated);
    border: 1px solid var(--ds-workspace-border);
    border-radius: 4px;
    padding: 3px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    pointer-events: auto;
    white-space: nowrap;
}

.desc-editor__bubble-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 3px;
    color: var(--ds-workspace-text);
    font-size: var(--ds-text-base);
    cursor: pointer;
    transition: background 0.1s ease, border-color 0.1s ease;
}

.desc-editor__bubble-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--ds-workspace-border);
}

.desc-editor__bubble-btn--active {
    background: rgba(168, 134, 50, 0.25);
    border-color: var(--ds-gold-mid);
    color: var(--ds-gold-bright);
}

/* Bubble appear/disappear transition */
.bubble-enter-active,
.bubble-leave-active {
    transition: opacity 0.1s ease, transform 0.1s ease;
}

.bubble-enter-from,
.bubble-leave-to {
    opacity: 0;
    transform: translate(-50%, calc(-100% - 2px));
}
</style>
