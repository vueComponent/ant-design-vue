<template>
  <Trigger
    ref="triggerRef"
    v-bind="openProps"
    :trigger="props.trigger"
    :placement="floatingPlacement"
    :mouse-enter-delay="props.mouseEnterDelay"
    :mouse-leave-delay="props.mouseLeaveDelay"
    :arrow="showArrow"
    :offset="showArrow ? 12 : 8"
    :auto-adjust-overflow="props.autoAdjustOverflow"
    :destroy-on-hide="props.destroyTooltipOnHide"
    :popup-class="popupClasses"
    :popup-style="props.overlayStyle"
    :disabled="disabled"
    :get-popup-container="resolvedGetContainer"
    :z-index="props.zIndex"
    transition-name="ant-zoom-big-fast"
    @update:open="onOpenChange"
  >
    <slot />
    <template #popup>
      <div :class="innerClasses" :style="innerStyles">
        <slot name="title">{{ props.title }}</slot>
      </div>
    </template>
  </Trigger>
</template>

<script setup lang="ts">
import { computed, shallowRef, useSlots, getCurrentInstance } from 'vue'
import { Trigger } from '@/_internal/trigger'
import { useConfigInject } from '@/hooks'
import type { TooltipProps, TooltipEmits, TooltipSlots } from './types'
import {
  tooltipDefaultProps,
  resolveFloatingPlacement,
  PRESET_COLORS,
  type PresetColor,
} from './types'

defineOptions({ name: 'ATooltip' })

const props = withDefaults(defineProps<TooltipProps>(), {
  trigger: 'hover',
  placement: 'top',
  mouseEnterDelay: 100,
  mouseLeaveDelay: 100,
  destroyTooltipOnHide: false,
  autoAdjustOverflow: true,
})
const emit = defineEmits<TooltipEmits>()
defineSlots<TooltipSlots>()
const slots = useSlots()

const { getPopupContainer } = useConfigInject()

const triggerRef = shallowRef<InstanceType<typeof Trigger> | null>(null)

// --- Resolve open state ---
// Vue boolean casting makes it impossible to distinguish "open not passed" from "open=false"
// Solution: check the raw vnode props from the parent to see if open/visible was actually passed
const instance = getCurrentInstance()!
const isUserControlled = computed(() => {
  const rawProps = instance.vnode.props || {}
  return 'open' in rawProps || 'visible' in rawProps
})

// Only pass `open` to Trigger when user explicitly controls it
const openProps = computed(() => {
  if (!isUserControlled.value) return {}
  const open = props.open ?? props.visible ?? false
  return { open }
})

// --- Disabled: no title = no tooltip ---
const disabled = computed(() => {
  const hasTitle = props.title !== undefined && props.title !== null && props.title !== ''
  const hasTitleSlot = !!slots.title
  return !hasTitle && !hasTitleSlot
})

// --- Arrow config ---
const showArrow = computed(() => {
  if (typeof props.arrow === 'boolean') return props.arrow
  return true
})

// --- Placement ---
const floatingPlacement = computed(() => resolveFloatingPlacement(props.placement!))

// --- Container ---
const resolvedGetContainer = computed(() => {
  if (props.getPopupContainer) {
    return () => props.getPopupContainer!(triggerRef.value?.triggerRef ?? document.body)
  }
  return getPopupContainer.value
})

// --- Color handling ---
const isPresetColor = computed(() =>
  PRESET_COLORS.includes(props.color as PresetColor),
)

const popupClasses = computed(() => {
  const classes: (string | Record<string, boolean>)[] = ['ant-tooltip']
  if (props.overlayClassName) {
    classes.push(props.overlayClassName)
  }
  if (isPresetColor.value) {
    classes.push(`ant-tooltip-${props.color}`)
  }
  return classes
})

const innerClasses = computed(() => {
  return ['ant-tooltip-inner']
})

const innerStyles = computed(() => {
  const style: Record<string, string> = { ...props.overlayInnerStyle }
  if (props.color && !isPresetColor.value) {
    style.background = props.color
  }
  return style
})

// --- Emit handler (bridges deprecated + new API) ---
function onOpenChange(open: boolean) {
  emit('update:open', open)
  emit('openChange', open)
  // Deprecated
  emit('update:visible', open)
  emit('visibleChange', open)
}

// --- Expose ---
defineExpose({
  getPopupDomNode: () => triggerRef.value?.floatingRef,
  forcePopupAlign: () => triggerRef.value?.update?.(),
  open: computed(() => triggerRef.value?.open),
})
</script>
