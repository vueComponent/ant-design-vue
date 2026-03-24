<template>
  <Trigger
    ref="triggerRef"
    :open="mergedOpen"
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
    :disabled="props.disabled"
    :get-popup-container="resolvedGetContainer"
    :z-index="props.zIndex"
    transition-name="ant-zoom-big-fast"
    @update:open="onOpenChange"
  >
    <slot />
    <template #popup>
      <div class="ant-popconfirm-inner" @keydown.esc="onCancel">
        <div class="ant-popconfirm-message">
          <span class="ant-popconfirm-message-icon">
            <slot name="icon">
              <ExclamationCircleFilled />
            </slot>
          </span>
          <div class="ant-popconfirm-message-text">
            <div class="ant-popconfirm-title">
              <slot name="title">{{ props.title }}</slot>
            </div>
            <div v-if="hasDescription" class="ant-popconfirm-description">
              <slot name="description">{{ props.description }}</slot>
            </div>
          </div>
        </div>
        <div class="ant-popconfirm-buttons">
          <slot name="cancelButton" :cancel="onCancel">
            <a-button
              v-if="props.showCancel"
              size="sm"
              v-bind="props.cancelButtonProps"
              @click="onCancel"
            >
              <slot name="cancelText">{{ props.cancelText }}</slot>
            </a-button>
          </slot>
          <slot name="okButton" :confirm="onConfirm">
            <a-button
              :type="props.okType"
              size="sm"
              v-bind="props.okButtonProps"
              @click="onConfirm"
            >
              <slot name="okText">{{ props.okText }}</slot>
            </a-button>
          </slot>
        </div>
      </div>
    </template>
  </Trigger>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, useSlots, getCurrentInstance } from 'vue'
import { Trigger } from '@/_internal/trigger'
import { useConfigInject } from '@/hooks'
import { resolveFloatingPlacement } from '../tooltip/types'
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled'
import type { PopconfirmProps, PopconfirmEmits, PopconfirmSlots } from './types'
import { popconfirmDefaultProps } from './types'

defineOptions({ name: 'APopconfirm' })

const props = withDefaults(defineProps<PopconfirmProps>(), {
  trigger: 'click',
  placement: 'top',
  mouseEnterDelay: 100,
  mouseLeaveDelay: 100,
  destroyTooltipOnHide: false,
  autoAdjustOverflow: true,
  disabled: false,
  okType: 'primary',
  showCancel: true,
  okText: 'OK',
  cancelText: 'Cancel',
})
const emit = defineEmits<PopconfirmEmits>()
defineSlots<PopconfirmSlots>()
const slots = useSlots()

const { getPopupContainer } = useConfigInject()

const triggerRef = shallowRef<InstanceType<typeof Trigger> | null>(null)
const internalOpen = ref(props.defaultOpen ?? false)

// --- Open state ---
// Popconfirm manages its own open state (for confirm/cancel close behavior)
// Check raw vnode props to detect user-controlled mode
const instance = getCurrentInstance()!
const isUserControlled = computed(() => {
  const rawProps = instance.vnode.props || {}
  return 'open' in rawProps || 'visible' in rawProps
})

const mergedOpen = computed(() => {
  if (isUserControlled.value) {
    return props.open ?? props.visible ?? false
  }
  return internalOpen.value
})

// --- Check for description ---
const hasDescription = computed(() => {
  return (props.description !== undefined && props.description !== null && props.description !== '') || !!slots.description
})

// --- Arrow ---
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

// --- Popup classes ---
const popupClasses = computed(() => {
  const classes: string[] = ['ant-popconfirm', 'ant-popover']
  if (props.overlayClassName) {
    classes.push(props.overlayClassName)
  }
  return classes
})

// --- Handlers ---
function setOpen(val: boolean) {
  if (!isUserControlled.value) {
    internalOpen.value = val
  }
  emit('update:open', val)
  emit('openChange', val)
  emit('update:visible', val)
  emit('visibleChange', val)
}

function onOpenChange(val: boolean) {
  setOpen(val)
}

function onConfirm(e: MouseEvent) {
  emit('confirm', e)
  setOpen(false)
}

function onCancel(e: MouseEvent | KeyboardEvent) {
  emit('cancel', e as MouseEvent)
  setOpen(false)
}

// --- Expose ---
defineExpose({
  getPopupDomNode: () => triggerRef.value?.floatingRef,
})
</script>
