<script lang="ts" setup>
import { computed, onUnmounted } from 'vue'

/** Shipped placeholder when no art is set (user uploads are not in the build). */
import placeholderUrl from '../assets/images/placeholder.svg?url'
import { useItemCardStore } from '../store/itemCard';
import { EventsOn, EventsOff } from '../../wailsjs/runtime/runtime';
import { printCard } from '../utils/printCard';

const itemCardStore = useItemCardStore();

const name = computed(() => itemCardStore.name || 'Item Name')
const typeLine = computed(() => itemCardStore.typeLine || 'Wondrous item')
const description = computed(() => itemCardStore.description || '<p>This is a <b>cool</b> description of the item. Flavor text can run a few lines and stay readable on print.</p>')
const footerText = computed(() => itemCardStore.footerText || 'D&amp;D 5e — item card (preview)')
const rarity = computed(() => itemCardStore.rarity || 'common')

const artSrc = computed(() => itemCardStore.artwork || placeholderUrl)

EventsOn('menu:action', async (event) => {
  if (event !== 'print-card') return
  await printCard('.item-card__card', `${name.value}-${typeLine.value}-${rarity.value}`)
})

onUnmounted(() => {
  EventsOff('menu:action');
});

</script>

<template>
  <div class="item-card__container">
    <div class="item-card__card" role="article" aria-label="Item card preview">
      <header class="item-card__header">
        <div class="item-card__header-bar">
          <h2 class="item-card__title">{{ name }}</h2>
        </div>
        <p class="item-card__type-line">{{ typeLine }}, {{ rarity }}</p>
      </header>

      <div class="item-card__body">
        <figure class="item-card__art">
          <div class="item-card__art-frame">
            <img :src="artSrc" alt="" class="item-card__art-img" width="280" height="280" />
          </div>
        </figure>

        <div class="item-card__description" v-html="description" />
      </div>

      <footer class="item-card__footer">
        <div class="item-card__footer-rule" aria-hidden="true" />
        <p class="item-card__footer-text">{{ footerText }}</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.item-card__container {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--ds-space-4);
  box-sizing: border-box;
  background: var(--ds-workspace-bg);
}

/* Poker-style aspect — printable without odd stretching */
.item-card__card {
  --card-w: min(100%, 20rem, 42vh);
  width: var(--card-w);
  aspect-ratio: 2.5 / 3.5;
  max-height: min(88vh, 100%);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: linear-gradient(180deg,
      var(--ds-parchment) 0%,
      var(--ds-parchment-dark) 100%);
  border-radius: var(--ds-card-radius);
  box-shadow: var(--ds-shadow-card), 0 0 0 1px var(--ds-hairline),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
  border: 1px solid var(--ds-rule-light);
  overflow: hidden;
  container-type: inline-size;
}

.item-card__header {
  flex-shrink: 0;
  text-align: center;
}

.item-card__header-bar {
  background: linear-gradient(180deg, var(--ds-burgundy-mid) 0%, var(--ds-burgundy) 100%);
  padding: var(--ds-space-3) var(--ds-space-3);
  box-shadow: inset 0 -2px 0 var(--ds-gold-mid);
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}

.item-card__title {
  margin: 0;
  font-family: var(--ds-font-card);
  font-size: clamp(0.9rem, 0.1cqw + 0.6rem, 1.2rem);
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.2;
  color: #f5ecd8;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.45);
}

.item-card__type-line {
  margin: 0;
  padding: var(--ds-space-2) var(--ds-space-3);
  font-family: var(--ds-font-stat);
  font-size: var(--ds-text-xs);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--ds-ink-muted);
  background: var(--ds-parchment-dark);
  border-bottom: 1px solid var(--ds-hairline);
}

.item-card__body {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: var(--ds-space-2) var(--ds-space-3) var(--ds-space-3);
  gap: var(--ds-space-2);
  overflow: auto;
  color: var(--ds-ink);
  font-family: var(--ds-font-card);
  font-size: var(--ds-text-sm);
  line-height: 1.45;
  text-align: left;
}

.item-card__art {
  margin: 0;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Art is ~38% of card height — room for text; feels like reference cards */
.item-card__art-frame {
  width: 72%;
  max-width: 12rem;
  aspect-ratio: 1;
  box-sizing: border-box;
  background: var(--ds-parchment-shadow);
  box-shadow: var(--ds-shadow-inset), inset 0 0 0 1px var(--ds-hairline);
  border: 1px solid var(--ds-gold);
  border-radius: 2px;
  overflow: hidden;
}

.item-card__art-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.item-card__description {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  padding: 0 var(--ds-space-0);
  hyphens: auto;
  -webkit-font-smoothing: antialiased;
}

.item-card__description :deep(p) {
  margin: 0 0 var(--ds-space-2);
}

.item-card__description :deep(p:last-child) {
  margin-bottom: 0;
}

.item-card__description :deep(b) {
  font-weight: 700;
  color: var(--ds-ink);
}

.item-card__footer {
  flex-shrink: 0;
  padding: 0 var(--ds-space-3) var(--ds-space-2);
}

.item-card__footer-rule {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--ds-gold-mid) 20%, var(--ds-gold-mid) 80%, transparent);
  margin-bottom: var(--ds-space-2);
  opacity: 0.9;
}

.item-card__footer-text {
  margin: 0;
  font-family: var(--ds-font-stat);
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ds-ink-faint);
  text-align: center;
}

/* Print: flatten chrome; card fills a sensible area */
@media print {
  .item-card__container {
    background: none;
    padding: 0;
  }

  .item-card__card {
    max-height: none;
    width: 2.5in;
    min-height: 3.5in;
    height: 3.5in;
    box-shadow: none;
  }
}
</style>
