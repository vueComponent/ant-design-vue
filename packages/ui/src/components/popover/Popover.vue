<template>
  <Trigger
    ref="triggerRef"
    v-bind="triggerProps"
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
      <div class="ant-popover-content">
        <div class="ant-popover-inner" :style="props.overlayInnerStyle">
          <div v-if="hasTitle" class="ant-popover-title">
            <slot name="title">{{ props.title }}</slot>
          </div>
          <div class="ant-popover-inner-content">
            <slot name="content">{{ props.content }}</slot>
          </div>
        </div>
      </div>
    </template>
  </Trigger>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUpdate, shallowRef, useSlots } from 'vue'
import { Trigger } from '@/_internal/trigger'
import { useConfigInject } from '@/hooks'
import { resolveFloatingPlacement } from '../tooltip/types'
import type { PopoverProps, PopoverEmits, PopoverSlots } from './types'
import { popoverDefaultProps } from './types'

defineOptions({ name: 'APopover' })

const props = withDefaults(defineProps<PopoverProps>(), popoverDefaultProps)
const emit = defineEmits<PopoverEmits>()
defineSlots<PopoverSlots>()
const slots = useSlots()

const { getPopupContainer } = useConfigInject()

const triggerRef = shallowRef<InstanceType<typeof Trigger> | null>(null)

// --- Resolve open state ---
const instance = getCurrentInstance()!
const rawProps = shallowRef<Record<string, unknown>>((instance.vnode.props || {}) as Record<string, unknown>)

function syncRawProps() {
  rawProps.value = (instance.vnode.props || {}) as Record<string, unknown>
}

onBeforeUpdate(syncRawProps)

function hasExplicitProp(propName: string) {
  return propName in rawProps.value
}

const isUserControlled = computed(() => {
  return (
    (hasExplicitProp('open') && props.open != null) ||
    (hasExplicitProp('visible') && props.visible != null)
  )
})

const openProps = computed(() => {
  if (isUserControlled.value) {
    return { open: props.open ?? props.visible ?? false }
  }

  if (props.defaultOpen !== undefined) {
    return { defaultOpen: props.defaultOpen }
  }

  return {}
})

// --- Check for content ---
const hasTitle = computed(() => {
  return (props.title !== undefined && props.title !== null && props.title !== '') || !!slots.title
})

const hasContent = computed(() => {
  return (props.content !== undefined && props.content !== null && props.content !== '') || !!slots.content
})

const disabled = computed(() => !hasTitle.value && !hasContent.value)

// --- Arrow ---
const showArrow = computed(() => {
  if (typeof props.arrow === 'boolean') return props.arrow
  return true
})

const triggerArrowProps = computed(() => {
  if (typeof props.arrow === 'object') {
    return { arrowPointAtCenter: !!props.arrow.pointAtCenter }
  }

  return {}
})

const triggerProps = computed(() => {
  return {
    ...openProps.value,
    ...triggerArrowProps.value,
  }
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

// --- Popup classes ---
const popupClasses = computed(() => {
  const classes: string[] = ['ant-popover']
  if (props.overlayClassName) {
    classes.push(props.overlayClassName)
  }
  return classes
})

// --- Emit handler ---
function onOpenChange(open: boolean) {
  emit('update:open', open)
  emit('openChange', open)
  emit('update:visible', open)
  emit('visibleChange', open)
}

// --- Expose ---
defineExpose({
  getPopupDomNode: () => triggerRef.value?.floatingRef,
  forcePopupAlign: () => triggerRef.value?.update?.(),
})
</script>
