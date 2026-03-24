<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue'
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined'
import { Wave } from '../wave'
import type { SwitchProps, SwitchEmits, SwitchSlots } from './types'
import { switchDefaultProps } from './types'

defineOptions({ name: 'ASwitch' })
const props = withDefaults(defineProps<SwitchProps>(), switchDefaultProps)
const emit = defineEmits<SwitchEmits>()
defineSlots<SwitchSlots>()
const instance = getCurrentInstance()

const buttonRef = ref<HTMLButtonElement | null>(null)
const isControlled = computed(() => {
  return Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, 'checked')
})

// Internal state for uncontrolled mode
const internalChecked = ref<boolean | string | number>(
  isControlled.value ? props.checked! : props.unCheckedValue!,
)

// In controlled mode, keep internal state in sync with the prop
watch(
  () => props.checked,
  (val) => {
    if (isControlled.value) {
      internalChecked.value = val
    }
  },
)

const mergedChecked = computed(() => {
  return isControlled.value ? props.checked : internalChecked.value
})

const isChecked = computed(() => mergedChecked.value === props.checkedValue)

const classes = computed(() => ({
  'ant-switch': true,
  'ant-switch-checked': isChecked.value,
  'ant-switch-disabled': props.disabled,
  'ant-switch-loading': props.loading,
  'ant-switch-small': props.size === 'small',
}))

function setChecked(newValue: boolean | string | number, event: MouseEvent | KeyboardEvent) {
  if (!isControlled.value) {
    internalChecked.value = newValue
  }
  emit('update:checked', newValue)
  emit('change', newValue, event)
}

function toggle(event: MouseEvent) {
  if (props.disabled || props.loading) return

  const newValue = isChecked.value ? props.unCheckedValue! : props.checkedValue!
  setChecked(newValue, event)
  emit('click', newValue, event)
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled || props.loading) return
  if (event.key === 'ArrowRight' && !isChecked.value) {
    event.preventDefault()
    setChecked(props.checkedValue!, event)
  } else if (event.key === 'ArrowLeft' && isChecked.value) {
    event.preventDefault()
    setChecked(props.unCheckedValue!, event)
  }
  emit('keydown', event)
}

function handleMouseup(event: MouseEvent) {
  blur()
  emit('mouseup', event)
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

function focus() {
  buttonRef.value?.focus()
}

function blur() {
  buttonRef.value?.blur()
}

onMounted(() => {
  if (props.autofocus) {
    buttonRef.value?.focus()
  }
})

defineExpose({ focus, blur })
</script>

<template>
  <button
    :id="id"
    ref="buttonRef"
    type="button"
    role="switch"
    :aria-checked="isChecked"
    :aria-disabled="(disabled || loading) || undefined"
    :class="classes"
    :disabled="disabled || loading"
    :tabindex="tabindex"
    @click="toggle"
    @keydown="handleKeydown"
    @mouseup="handleMouseup"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <Wave :target="buttonRef" :disabled="disabled || loading" />
    <div class="ant-switch-handle">
      <span v-if="loading" class="ant-switch-loading-icon">
        <LoadingOutlined />
      </span>
    </div>
    <span class="ant-switch-inner">
      <span class="ant-switch-inner-checked">
        <slot name="checkedChildren" />
      </span>
      <span class="ant-switch-inner-unchecked">
        <slot name="unCheckedChildren" />
      </span>
    </span>
  </button>
</template>
