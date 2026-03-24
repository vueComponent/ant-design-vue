<script setup lang="ts">
import { computed, ref, watch, getCurrentInstance, nextTick } from 'vue'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Trigger } from '@/_internal/trigger'
import { PickerPanel } from '@/_internal/date-panel'
import { useConfigInject } from '@/hooks'
import CalendarOutlined from '@ant-design/icons-vue/CalendarOutlined'
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled'
import type { DatePickerProps, DatePickerEmits, DatePickerSlots } from './types'
import { datePickerDefaultProps, getDefaultFormat, resolveSize } from './types'

dayjs.extend(weekOfYear)
dayjs.extend(quarterOfYear)
dayjs.extend(advancedFormat)
dayjs.extend(customParseFormat)

defineOptions({ name: 'ADatePicker', inheritAttrs: false })

const props = withDefaults(defineProps<DatePickerProps>(), datePickerDefaultProps)
const emit = defineEmits<DatePickerEmits>()
defineSlots<DatePickerSlots>()

const instance = getCurrentInstance()!
const { size: globalSize, getPopupContainer, disabled: globalDisabled } = useConfigInject()

const inputRef = ref<HTMLInputElement | null>(null)
const triggerRef = ref<InstanceType<typeof Trigger> | null>(null)

// ---- Resolved props ----
const isDisabled = computed(() => props.disabled ?? globalDisabled.value)
const resolvedSize = computed(() => resolveSize(props.size ?? globalSize.value))
const displayFormat = computed(() => props.format ?? getDefaultFormat(props.picker!, props.showTime))

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
const viewDate = ref<Dayjs>(parseDayjs(props.defaultPickerValue) ?? internalValue.value ?? dayjs())

const isValueControlled = computed(() => {
  const rawProps = instance.vnode.props || {}
  return 'value' in rawProps
})

const selectedValue = computed(() =>
  isValueControlled.value ? parseDayjs(props.value) : internalValue.value,
)

watch(() => props.value, (v) => {
  if (v !== undefined) {
    const parsed = parseDayjs(v)
    internalValue.value = parsed
    if (parsed) viewDate.value = parsed
  }
})

// ---- Input text ----
const inputText = ref('')

watch(selectedValue, (val) => {
  inputText.value = val ? val.format(displayFormat.value) : ''
}, { immediate: true })

// ---- Selection ----
function handleSelect(date: Dayjs) {
  // If showTime is enabled, just update the preview; user must click "OK" to confirm
  if (props.showTime) {
    internalValue.value = date
    viewDate.value = date
    return
  }

  confirmValue(date)
}

function confirmValue(date: Dayjs) {
  if (!isValueControlled.value) internalValue.value = date
  viewDate.value = date
  inputText.value = date.format(displayFormat.value)

  const output = toOutput(date)
  emit('update:value', output)
  emit('change', output, date.format(displayFormat.value))

  if (!props.showTime) {
    setOpen(false)
  }
}

function handleOk() {
  const val = internalValue.value ?? dayjs()
  confirmValue(val)
  emit('ok', toOutput(val))
  setOpen(false)
}

function handlePresetSelect(date: Dayjs) {
  confirmValue(date)
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
function handleInputChange(e: Event) {
  const val = (e.target as HTMLInputElement).value
  inputText.value = val
}

function handleInputBlur(e: FocusEvent) {
  emit('blur', e)
  // Try to parse the input text
  if (inputText.value) {
    const parsed = dayjs(inputText.value, displayFormat.value, true)
    if (parsed.isValid() && !(props.disabledDate?.(parsed))) {
      confirmValue(parsed)
    } else {
      // Revert to current value
      inputText.value = selectedValue.value ? selectedValue.value.format(displayFormat.value) : ''
    }
  }
}

function handleInputFocus(e: FocusEvent) {
  emit('focus', e)
}

function handleInputKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    if (inputText.value) {
      const parsed = dayjs(inputText.value, displayFormat.value, true)
      if (parsed.isValid() && !(props.disabledDate?.(parsed))) {
        confirmValue(parsed)
      }
    }
    setOpen(false)
  } else if (e.key === 'Escape') {
    setOpen(false)
  }
}

// ---- Panel callbacks ----
function handleViewDateChange(date: Dayjs) {
  viewDate.value = date
}

function handlePanelChange(mode: string) {
  emit('panelChange', toOutput(selectedValue.value), mode as any)
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
  [`ant-picker-${resolvedSize.value}`]: true,
  'ant-picker-disabled': isDisabled.value,
  'ant-picker-focused': isOpen.value,
  'ant-picker-borderless': !props.bordered,
  [`ant-picker-status-${props.status}`]: props.status,
}))

const showClear = computed(() =>
  props.allowClear && selectedValue.value && !isDisabled.value,
)

// Determine time props from showTime
const timeProps = computed(() => {
  if (!props.showTime) return undefined
  if (typeof props.showTime === 'object') {
    return { ...props.showTime, disabledTime: props.disabledTime }
  }
  return { disabledTime: props.disabledTime }
})

// Expose
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
})
</script>

<template>
  <Trigger
    ref="triggerRef"
    :open="isOpen"
    trigger="click"
    :placement="(placement ?? 'bottomLeft') as any"
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
          :placeholder="placeholder ?? 'Select date'"
          :disabled="isDisabled"
          :readonly="inputReadOnly"
          :autofocus="autofocus"
          autocomplete="off"
          @input="handleInputChange"
          @focus="handleInputFocus"
          @blur="handleInputBlur"
          @keydown="handleInputKeydown"
        />
        <span class="ant-picker-suffix">
          <slot name="suffixIcon">
            <CalendarOutlined />
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
      <PickerPanel
        :value="selectedValue"
        :view-date="viewDate"
        :picker="picker"
        :mode="mode"
        :disabled-date="disabledDate"
        :show-time="showTime"
        :show-today="showToday"
        :show-now="showNow"
        :presets="presets"
        @select="handleSelect"
        @view-date-change="handleViewDateChange"
        @panel-change="handlePanelChange"
        @ok="handleOk"
        @preset-select="handlePresetSelect"
      />
    </template>
  </Trigger>
</template>
