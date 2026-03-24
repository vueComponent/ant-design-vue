<template>
  <span
    ref="triggerRef"
    class="ant-trigger-wrapper"
    v-bind="triggerListeners"
  >
    <slot />
  </span>
  <Portal :visible="shouldRender" :get-container="props.getPopupContainer">
    <Transition :name="props.transitionName" @after-leave="onAfterLeave">
      <div
        v-if="shouldRender"
        v-show="mergedOpen"
        ref="floatingRef"
        :class="popupClasses"
        :style="floatingStyles"
        role="tooltip"
        v-bind="popupListeners"
      >
        <div
          v-if="props.arrow"
          ref="arrowRef"
          class="ant-trigger-arrow"
          :style="arrowStyles"
        />
        <slot name="popup" />
      </div>
    </Transition>
  </Portal>
</template>

<script setup lang="ts">
import { ref, shallowRef, computed, watch, onBeforeUnmount, nextTick, getCurrentInstance } from 'vue'
import {
  useFloating,
  autoUpdate,
  offset as offsetMiddleware,
  flip,
  shift,
  arrow as arrowMiddleware,
  type Placement,
} from '@floating-ui/vue'
import { Portal } from '../portal'
import type { TriggerProps, TriggerEmits, TriggerSlots, TriggerType } from './types'
import { triggerDefaultProps } from './types'

defineOptions({ name: 'Trigger' })

const props = withDefaults(defineProps<TriggerProps>(), triggerDefaultProps)
const emit = defineEmits<TriggerEmits>()
defineSlots<TriggerSlots>()

// --- State ---
const triggerRef = shallowRef<HTMLElement | null>(null)
const floatingRef = shallowRef<HTMLElement | null>(null)
const arrowRef = shallowRef<HTMLElement | null>(null)

const internalOpen = ref(props.defaultOpen ?? false)

// Detect controlled mode: check if parent passed the `open` prop in vnode.props
// (Vue boolean casting makes props.open always false when absent, so we can't check that)
const instance = getCurrentInstance()!
const isControlled = computed(() => {
  const rawProps = instance.vnode.props || {}
  return 'open' in rawProps
})
const mergedOpen = computed(() => (isControlled.value ? !!props.open : internalOpen.value))

// Track whether popup has ever been opened (for lazy rendering)
const hasBeenOpened = ref(mergedOpen.value)

const shouldRender = computed(() => {
  if (props.destroyOnHide) return mergedOpen.value
  return hasBeenOpened.value
})

watch(mergedOpen, (val) => {
  if (val) hasBeenOpened.value = true
})

// --- Floating UI ---
const { floatingStyles, placement: actualPlacement, middlewareData, update } = useFloating(
  triggerRef,
  floatingRef,
  {
    placement: computed(() => props.placement),
    strategy: computed(() => props.strategy),
    middleware: computed(() => [
      offsetMiddleware(props.offset),
      ...(props.autoAdjustOverflow ? [flip(), shift({ padding: 8 })] : []),
      ...(props.arrow
        ? [arrowMiddleware({ element: arrowRef, padding: 4 })]
        : []),
    ]),
    whileElementsMounted: autoUpdate,
    transform: true,
  },
)

const arrowStyles = computed(() => {
  const arrowData = middlewareData.value?.arrow
  if (!arrowData) return {}

  const { x, y } = arrowData
  const side = actualPlacement.value.split('-')[0]
  const staticSide: Record<string, string> = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }

  return {
    left: x != null ? `${x}px` : '',
    top: y != null ? `${y}px` : '',
    right: '',
    bottom: '',
    [staticSide[side]]: '-4px',
  }
})

// --- Timer management ---
let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

function clearTimers() {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

function setOpen(open: boolean) {
  if (props.disabled) return
  if (!isControlled.value) {
    internalOpen.value = open
  }
  emit('update:open', open)
  emit('openChange', open)
}

function delaySetOpen(open: boolean) {
  clearTimers()
  const delay = open ? props.mouseEnterDelay : props.mouseLeaveDelay
  if (delay && delay > 0) {
    const timer = setTimeout(() => {
      setOpen(open)
    }, delay)
    if (open) showTimer = timer
    else hideTimer = timer
  } else {
    setOpen(open)
  }
}

// --- Event handlers ---
const triggerTypes = computed<TriggerType[]>(() => {
  const t = props.trigger
  return Array.isArray(t) ? t : [t]
})

function onMouseEnter() {
  if (triggerTypes.value.includes('hover')) {
    delaySetOpen(true)
  }
}

function onMouseLeave() {
  if (triggerTypes.value.includes('hover')) {
    delaySetOpen(false)
  }
}

function onClick() {
  if (triggerTypes.value.includes('click')) {
    setOpen(!mergedOpen.value)
  }
}

function onFocusIn() {
  if (triggerTypes.value.includes('focus')) {
    setOpen(true)
  }
}

function onFocusOut() {
  if (triggerTypes.value.includes('focus')) {
    setOpen(false)
  }
}

function onContextMenu(e: MouseEvent) {
  if (triggerTypes.value.includes('contextmenu')) {
    e.preventDefault()
    setOpen(!mergedOpen.value)
  }
}

// Build trigger listeners based on trigger type
const triggerListeners = computed(() => {
  const listeners: Record<string, any> = {}
  const types = triggerTypes.value

  if (types.includes('hover')) {
    listeners.onMouseenter = onMouseEnter
    listeners.onMouseleave = onMouseLeave
  }
  if (types.includes('click')) {
    listeners.onClick = onClick
  }
  if (types.includes('focus')) {
    listeners.onFocusin = onFocusIn
    listeners.onFocusout = onFocusOut
  }
  if (types.includes('contextmenu')) {
    listeners.onContextmenu = onContextMenu
  }
  return listeners
})

// Popup listeners for hover trigger (keep open when hovering popup)
const popupListeners = computed(() => {
  const listeners: Record<string, any> = {}
  if (triggerTypes.value.includes('hover')) {
    listeners.onMouseenter = onMouseEnter
    listeners.onMouseleave = onMouseLeave
  }
  return listeners
})

// --- Close on click outside ---
function onDocumentClick(e: MouseEvent) {
  if (!mergedOpen.value) return
  const target = e.target as Node
  if (triggerRef.value?.contains(target)) return
  if (floatingRef.value?.contains(target)) return
  setOpen(false)
}

watch(mergedOpen, (val) => {
  if (typeof document === 'undefined') return
  if (val) {
    // Delay to avoid the opening click from immediately closing
    nextTick(() => {
      document.addEventListener('mousedown', onDocumentClick, true)
    })
  } else {
    document.removeEventListener('mousedown', onDocumentClick, true)
  }
}, { flush: 'post' })

// --- Popup classes ---
const popupClasses = computed(() => {
  const classes: any[] = ['ant-trigger-popup']
  if (props.popupClass) {
    if (Array.isArray(props.popupClass)) {
      classes.push(...props.popupClass)
    } else {
      classes.push(props.popupClass)
    }
  }
  if (actualPlacement.value) {
    classes.push(`ant-trigger-placement-${actualPlacement.value}`)
  }
  return classes
})

// --- Transition callback ---
function onAfterLeave() {
  if (props.destroyOnHide) {
    hasBeenOpened.value = false
  }
}

// --- Cleanup ---
onBeforeUnmount(() => {
  clearTimers()
  if (typeof document !== 'undefined') {
    document.removeEventListener('mousedown', onDocumentClick, true)
  }
})

// --- Expose ---
defineExpose({
  triggerRef,
  floatingRef,
  update,
  open: mergedOpen,
})
</script>
