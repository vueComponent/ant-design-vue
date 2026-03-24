<template>
  <div
    v-if="shouldRender"
    v-show="isActive"
    :class="['ant-tabs-tabpane', { 'ant-tabs-tabpane-active': isActive }]"
    role="tabpanel"
    :aria-hidden="!isActive"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  inject,
  onMounted,
  onBeforeUnmount,
  useSlots,
  getCurrentInstance,
} from 'vue'
import type { TabPaneProps, TabPaneSlots, TabsContext, InternalTab } from './types'
import { TABS_KEY } from './types'

defineOptions({ name: 'ATabPane' })

const props = defineProps<TabPaneProps>()
defineSlots<TabPaneSlots>()
const slots = useSlots()

const tabsContext = inject(TABS_KEY, null)

// The key must be passed via the `key` attribute on the VNode, or via a `name`/`key` prop.
// We'll use the parent component's expose to register ourselves.
const instance = getCurrentInstance()!

// Derive key from the VNode key
const paneKey = computed(() => {
  return (instance.vnode.key ?? '') as string | number
})

const isActive = computed(() => {
  return tabsContext?.activeKey.value === paneKey.value
})

const shouldRender = computed(() => {
  if (props.forceRender) return true
  if (tabsContext?.destroyInactiveTabPane.value) {
    return isActive.value
  }
  return true
})

// Register with parent Tabs component
onMounted(() => {
  const parent = instance.parent
  if (parent?.exposed?._registerPane) {
    const tab: InternalTab = {
      key: paneKey.value,
      label: props.tab,
      disabled: props.disabled,
      closable: props.closable,
      forceRender: props.forceRender,
    }
    parent.exposed._registerPane(tab)
  }
})

onBeforeUnmount(() => {
  const parent = instance.parent
  if (parent?.exposed?._unregisterPane) {
    parent.exposed._unregisterPane(paneKey.value)
  }
})
</script>
