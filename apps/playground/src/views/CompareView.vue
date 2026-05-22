<template>
  <div v-if="componentName" class="compare">
    <div class="compare-header">
      <h1 class="compare-title">{{ componentName }}</h1>
      <div class="compare-controls">
        <div class="compare-legend">
          <span class="legend-new">New (refactored)</span>
          <span class="legend-old">Old (ant-design-vue@4)</span>
        </div>
        <label v-if="newOnlyDemos.length || oldOnlyDemos.length" class="compare-toggle">
          <input v-model="showUnmatched" type="checkbox" />
          Show unmatched ({{ newOnlyDemos.length + oldOnlyDemos.length }})
        </label>
      </div>
    </div>

    <div v-for="demoName in bothDemos" :key="demoName" class="compare-row">
      <h3 class="compare-demo-name">{{ demoName }}</h3>
      <div class="compare-panels">
        <div class="compare-panel panel-new">
          <div class="panel-label">New</div>
          <div :ref="el => setNewPanelContentRef(demoName, el)" class="panel-content">
            <ConfigProvider :get-popup-container="trigger => getNewPanelPopupContainer(demoName, trigger)">
              <component :is="newDemos[demoName]" />
            </ConfigProvider>
          </div>
        </div>
        <div class="compare-panel panel-old">
          <div class="panel-label">Old</div>
          <div class="panel-content panel-content-iframe">
            <iframe
              :src="oldDemoUrl(demoName)"
              :data-key="`${componentName}-${demoName}`"
              frameborder="0"
              scrolling="no"
              class="old-demo-iframe"
            />
          </div>
        </div>
      </div>
    </div>

    <template v-if="showUnmatched && newOnlyDemos.length">
      <h2 class="compare-section-title">New only</h2>
      <div v-for="demoName in newOnlyDemos" :key="'new-' + demoName" class="compare-row">
        <h3 class="compare-demo-name">{{ demoName }}</h3>
        <div class="compare-panels">
          <div class="compare-panel panel-new">
            <div class="panel-label">New</div>
            <div :ref="el => setNewPanelContentRef(`new-only:${demoName}`, el)" class="panel-content">
              <ConfigProvider :get-popup-container="trigger => getNewPanelPopupContainer(`new-only:${demoName}`, trigger)">
                <component :is="newDemos[demoName]" />
              </ConfigProvider>
            </div>
          </div>
          <div class="compare-panel panel-placeholder">
            <div class="panel-label">Old</div>
            <div class="panel-content">
              <div class="panel-missing">No matching demo in old</div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="showUnmatched && oldOnlyDemos.length">
      <h2 class="compare-section-title">Old only</h2>
      <div v-for="demoName in oldOnlyDemos" :key="'old-' + demoName" class="compare-row">
        <h3 class="compare-demo-name">{{ demoName }}</h3>
        <div class="compare-panels">
          <div class="compare-panel panel-placeholder">
            <div class="panel-label">New</div>
            <div class="panel-content">
              <div class="panel-missing">No matching demo in new</div>
            </div>
          </div>
          <div class="compare-panel panel-old">
            <div class="panel-label">Old</div>
            <div class="panel-content panel-content-iframe">
              <iframe
                :src="oldDemoUrl(demoName)"
                :data-key="`${componentName}-${demoName}`"
                frameborder="0"
                scrolling="no"
                class="old-demo-iframe"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-if="bothDemos.length === 0 && !showUnmatched" class="compare-empty">
      No matching demos found for {{ componentName }}
    </div>
  </div>
  <div v-else class="compare-empty">Select a component to compare</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { ConfigProvider } from '@ant-design-vue/ui'
import { useRoute } from 'vue-router'
import { findComponent } from '#/data/demos'
import { findOldComponent } from '#/data/old-demos'

const route = useRoute()
const componentName = computed(() => route.params.component as string)
const showUnmatched = ref(false)

const newGroup = computed(() => findComponent(componentName.value))
const oldGroup = computed(() => findOldComponent(componentName.value))

const newDemos = computed(() => {
  const map: Record<string, any> = {}
  for (const d of newGroup.value?.demos ?? []) {
    map[d.name] = d.component
  }
  return map
})

const oldDemos = computed(() => {
  const map: Record<string, any> = {}
  for (const d of oldGroup.value?.demos ?? []) {
    map[d.name] = d.component
  }
  return map
})

const newNames = computed(() => new Set(Object.keys(newDemos.value)))
const oldNames = computed(() => new Set(Object.keys(oldDemos.value)))

const bothDemos = computed(() =>
  [...newNames.value].filter(n => oldNames.value.has(n)).sort(),
)

const newOnlyDemos = computed(() =>
  [...newNames.value].filter(n => !oldNames.value.has(n)).sort(),
)

const oldOnlyDemos = computed(() =>
  [...oldNames.value].filter(n => !newNames.value.has(n)).sort(),
)

const newPanelContentRefs = new Map<string, HTMLElement>()

function setNewPanelContentRef(
  key: string,
  el: Element | ComponentPublicInstance | null,
) {
  if (el instanceof HTMLElement) {
    newPanelContentRefs.set(key, el)
    return
  }

  newPanelContentRefs.delete(key)
}

function getNewPanelPopupContainer(key: string, triggerNode?: HTMLElement) {
  const closestPanelContent = triggerNode?.closest('.panel-content')

  return (
    newPanelContentRefs.get(key) ??
    (closestPanelContent instanceof HTMLElement ? closestPanelContent : document.body)
  )
}

function oldDemoUrl(demoName: string) {
  return `/old-demo.html?component=${encodeURIComponent(componentName.value)}&demo=${encodeURIComponent(demoName)}`
}

// Auto-resize iframes based on content height
function onMessage(e: MessageEvent) {
  if (e.data?.type !== 'old-demo-resize') return
  const height = e.data.height
  // Find the iframe whose src matches the origin
  const iframes = document.querySelectorAll<HTMLIFrameElement>('.old-demo-iframe')
  for (const iframe of iframes) {
    if (iframe.contentWindow === e.source) {
      iframe.style.height = `${height}px`
      break
    }
  }
}

onMounted(() => window.addEventListener('message', onMessage))
onUnmounted(() => window.removeEventListener('message', onMessage))
</script>

<style>
.compare {
  padding: 24px 32px;
  max-width: 1400px;
}

.compare-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.compare-title {
  font-size: 24px;
  font-weight: 600;
  text-transform: capitalize;
  margin: 0;
}

.compare-legend {
  display: flex;
  gap: 16px;
  font-size: 13px;
}

.legend-new {
  padding: 2px 8px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  color: #096dd9;
}

.legend-old {
  padding: 2px 8px;
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 4px;
  color: #d46b08;
}

.compare-row {
  margin-bottom: 32px;
}

.compare-demo-name {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #333;
}

.compare-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.compare-panel {
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  overflow: hidden;
}

.panel-new {
  border-color: #91d5ff;
}

.panel-old {
  border-color: #ffd591;
}

.panel-label {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 12px;
  color: #666;
}

.panel-new .panel-label {
  background: #e6f7ff;
  color: #096dd9;
}

.panel-old .panel-label {
  background: #fff7e6;
  color: #d46b08;
}

.panel-content {
  position: relative;
  padding: 16px;
}

.panel-content-iframe {
  padding: 0;
}

.old-demo-iframe {
  width: 100%;
  height: 200px;
  border: none;
  display: block;
}

.panel-missing {
  color: #999;
  font-style: italic;
  font-size: 13px;
}

.panel-error {
  color: #f5222d;
  font-size: 12px;
  background: #fff1f0;
  padding: 8px 12px;
  border-radius: 4px;
}

.compare-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.compare-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  user-select: none;
}

.compare-toggle input {
  cursor: pointer;
}

.compare-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #999;
  margin: 32px 0 16px;
  padding-top: 16px;
  border-top: 1px dashed #e8e8e8;
}

.panel-placeholder {
  border-color: #e8e8e8;
  background: #fafafa;
}

.panel-placeholder .panel-label {
  background: #f5f5f5;
  color: #bbb;
}

.compare-empty {
  padding: 48px;
  text-align: center;
  color: #999;
}
</style>
