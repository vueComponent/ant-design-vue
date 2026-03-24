<script setup lang="ts">
import { computed, ref, watch, getCurrentInstance, nextTick } from 'vue'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Trigger } from '@/_internal/trigger'
import { TimePanel, defaultLocale } from '@/_internal/date-panel'
import { useConfigInject } from '@/hooks'
import ClockCircleOutlined from '@ant-design/icons-vue/ClockCircleOutlined'
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled'
import type { TimePickerProps, TimePickerEmits, TimePickerSlots } from './types'
import { timePickerDefaultProps, getDefaultTimeFormat } from './types'

dayjs.extend(customParseFormat)

defineOptions({ name: 'ATimePicker', inheritAttrs: false })

const props = withDefaults(defineProps<TimePickerProps>(), timePickerDefaultProps)
const emit = defineEmits<TimePickerEmits>()
defineSlots<TimePickerSlots>()

const instance = getCurrentInstance()!
const { size: globalSize, getPopupContainer, disabled: globalDisabled } = useConfigInject()

const inputRef = ref<HTMLInputElement | null>(null)

// ---- Resolved props ----
const isDisabled = computed(() => props.disabled ?? globalDisabled.value)
const resolvedSize = computed(() => {
  const s = props.size ?? globalSize.value
  const map: Record<string, string> = { large: 'lg', middle: 'md', small: 'sm' }
  return map[s ?? ''] ?? s ?? 'md'
})

const displayFormat = computed(() => props.format ?? getDefaultTimeFormat(props))

// ---- Open state ----
const internalOpen = ref(props.defaultOpen ?? false)
const isOpenControlled = computed(() => {
  const rawProps = instance.vnode.props || {}
  return 'open' in rawProps
})
const isOpen = computed(() => isOpenControlled.value ? props.open! : internalOpen.value)

function setOpen(val: boolean) {
  if (isDisabled.value) return
  if (!isOpenControlled.value) internalOpen.value = val
  emit('update:open', val)
  emit('openChange', val)
}

// ---- Value ----
function parseDayjs(val: Dayjs | string | null | undefined): Dayjs | null {
  if (!val) return null
  if (dayjs.isDayjs(val)) return val as Dayjs
  if (typeof val === 'string') {
    const fmt = props.valueFormat || displayFormat.value
    const d = dayjs(val, fmt)
    return d.isValid() ? d : null
  }
  return null
}

function toOutput(val: Dayjs | null): Dayjs | string | null {
  if (!val) return null
  if (props.valueFormat) return val.format(props.valueFormat)
  return val
}

const internalValue = ref<Dayjs | null>(parseDayjs(props.value ?? props.defaultValue))
const isValueControlled = computed(() => {
  const rawProps = instance.vnode.props || {}
  return 'value' in rawProps
})

const selectedValue = computed(() =>
  isValueControlled.value ? parseDayjs(props.value) : internalValue.value,
)

watch(() => props.value, (v) => {
  if (v !== undefined) internalValue.value = parseDayjs(v)
})

// ---- Input text ----
const inputText = ref('')
watch(selectedValue, (val) => {
  inputText.value = val ? val.format(displayFormat.value) : ''
}, { immediate: true })

// ---- Selection ----
function handleSelect(date: Dayjs) {
  if (!isValueControlled.value) internalValue.value = date
  inputText.value = date.format(displayFormat.value)

  const output = toOutput(date)
  emit('update:value', output)
  emit('change', output, date.format(displayFormat.value))
}

function handleNowClick() {
  handleSelect(dayjs())
  setOpen(false)
}

function handleOk() {
  setOpen(false)
}

// ---- Clear ----
function handleClear(e: MouseEvent) {
  e.stopPropagation()
  if (!isValueControlled.value) internalValue.value = null
  inputText.value = ''
  emit('update:value', null)
  emit('change', null, '')
}

// ---- Input handling ----
function handleInputBlur(e: FocusEvent) {
  emit('blur', e)
  if (inputText.value) {
    const parsed = dayjs(inputText.value, displayFormat.value, true)
    if (parsed.isValid()) {
      handleSelect(parsed)
    } else {
      inputText.value = selectedValue.value ? selectedValue.value.format(displayFormat.value) : ''
    }
  }
}

function handleInputKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    if (inputText.value) {
      const parsed = dayjs(inputText.value, displayFormat.value, true)
      if (parsed.isValid()) handleSelect(parsed)
    }
    setOpen(false)
  } else if (e.key === 'Escape') {
    setOpen(false)
  }
}

// ---- Trigger ----
function handleTriggerClick() {
  if (isDisabled.value) return
  setOpen(!isOpen.value)
  nextTick(() => inputRef.value?.focus())
}

// ---- Classes ----
const rootClass = computed(() => ({
  'ant-picker': true,
  'ant-picker-time': true,
  [`ant-picker-${resolvedSize.value}`]: true,
  'ant-picker-disabled': isDisabled.value,
  'ant-picker-focused': isOpen.value,
  'ant-picker-borderless': !props.bordered,
  [`ant-picker-status-${props.status}`]: props.status,
}))

const showClear = computed(() =>
  props.allowClear && selectedValue.value && !isDisabled.value,
)

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
})
</script>

<template>
  <Trigger
    :open="isOpen"
    trigger="click"
    :placement="('bottomLeft' as any)"
    :get-popup-container="getPopupContainer ?? props.getPopupContainer"
    :popup-class-name="popupClassName"
    :destroy-on-hide="false"
    @update:open="setOpen"
  >
    <div
      :class="rootClass"
      v-bind="$attrs"
      @click="handleTriggerClick"
    >
      <div class="ant-picker-input">
        <input
          ref="inputRef"
          :value="inputText"
          :placeholder="placeholder ?? 'Select time'"
          :disabled="isDisabled"
          :readonly="inputReadOnly"
          :autofocus="autofocus"
          autocomplete="off"
          @input="inputText = ($event.target as HTMLInputElement).value"
          @focus="emit('focus', $event)"
          @blur="handleInputBlur"
          @keydown="handleInputKeydown"
        />
        <span class="ant-picker-suffix">
          <slot name="suffixIcon">
            <ClockCircleOutlined />
          </slot>
        </span>
        <span
          v-if="showClear"
          class="ant-picker-clear"
          @click="handleClear"
        >
          <slot name="clearIcon">
            <CloseCircleFilled />
          </slot>
        </span>
      </div>
    </div>

    <template #popup>
      <div class="ant-picker-panel ant-picker-time-panel-wrapper">
        <TimePanel
          :value="selectedValue"
          :show-hour="showHour"
          :show-minute="showMinute"
          :show-second="showSecond"
          :use12-hours="use12Hours"
          :hour-step="hourStep"
          :minute-step="minuteStep"
          :second-step="secondStep"
          :disabled-time="disabledTime"
          :hide-disabled-options="hideDisabledOptions"
          @select="handleSelect"
        />
        <div class="ant-picker-footer">
          <div class="ant-picker-footer-extra">
            <a v-if="showNow" class="ant-picker-now-btn" @click="handleNowClick">
              Now
            </a>
            <button type="button" class="ant-picker-ok-btn" @click="handleOk">
              OK
            </button>
          </div>
        </div>
      </div>
    </template>
  </Trigger>
</template>
