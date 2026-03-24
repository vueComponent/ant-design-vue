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
import type { RangePickerProps, RangePickerEmits, RangePickerSlots, RangeValue } from './types'
import { rangePickerDefaultProps, getDefaultFormat, resolveSize } from './types'

dayjs.extend(weekOfYear)
dayjs.extend(quarterOfYear)
dayjs.extend(advancedFormat)
dayjs.extend(customParseFormat)

defineOptions({ name: 'ARangePicker', inheritAttrs: false })

const props = withDefaults(defineProps<RangePickerProps>(), rangePickerDefaultProps)
const emit = defineEmits<RangePickerEmits>()
defineSlots<RangePickerSlots>()

const instance = getCurrentInstance()!
const { size: globalSize, getPopupContainer, disabled: globalDisabled } = useConfigInject()

const startInputRef = ref<HTMLInputElement | null>(null)
const endInputRef = ref<HTMLInputElement | null>(null)

// ---- Resolved props ----
const isStartDisabled = computed(() => {
  if (typeof props.disabled === 'boolean') return props.disabled || globalDisabled.value
  return props.disabled?.[0] ?? globalDisabled.value
})
const isEndDisabled = computed(() => {
  if (typeof props.disabled === 'boolean') return props.disabled || globalDisabled.value
  return props.disabled?.[1] ?? globalDisabled.value
})
const isDisabled = computed(() => isStartDisabled.value && isEndDisabled.value)
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

// ---- Value parsing ----
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

function parseRangeValue(val: RangePickerProps['value']): [Dayjs | null, Dayjs | null] {
  if (!val || !Array.isArray(val)) return [null, null]
  return [parseDayjs(val[0]), parseDayjs(val[1])]
}

function toOutput(val: Dayjs | null): Dayjs | string | null {
  if (!val) return null
  if (props.valueFormat) return val.format(props.valueFormat)
  return val
}

// ---- Internal state ----
const internalValue = ref<[Dayjs | null, Dayjs | null]>(parseRangeValue(props.value ?? props.defaultValue))
const activeInput = ref<'start' | 'end'>('start')
const hoverDate = ref<Dayjs | null>(null)

// Two view dates for the two panels
const leftViewDate = ref<Dayjs>(internalValue.value[0] ?? dayjs())
const rightViewDate = ref<Dayjs>(
  internalValue.value[1] ?? (internalValue.value[0] ?? dayjs()).add(1, 'month'),
)

// Keep right panel at least one month after left
watch(leftViewDate, (left) => {
  if (!left.isBefore(rightViewDate.value, 'month')) {
    rightViewDate.value = left.add(1, 'month')
  }
})

const isValueControlled = computed(() => {
  const rawProps = instance.vnode.props || {}
  return 'value' in rawProps
})

const selectedValue = computed<[Dayjs | null, Dayjs | null]>(() =>
  isValueControlled.value ? parseRangeValue(props.value) : internalValue.value,
)

watch(() => props.value, (v) => {
  if (v !== undefined) {
    internalValue.value = parseRangeValue(v)
  }
})

// ---- Input text ----
const startText = ref('')
const endText = ref('')

watch(selectedValue, ([s, e]) => {
  startText.value = s ? s.format(displayFormat.value) : ''
  endText.value = e ? e.format(displayFormat.value) : ''
}, { immediate: true })

// ---- Selection (two-click flow) ----
// The user is picking either 'start' or 'end'
const pickingStart = ref<Dayjs | null>(null)

function handleSelect(date: Dayjs) {
  if (!pickingStart.value) {
    // First click — picking the start
    pickingStart.value = date
    activeInput.value = 'end'

    emit('calendarChange',
      [toOutput(date) as any, null],
      [date.format(displayFormat.value), ''],
      { range: 'start' },
    )
  } else {
    // Second click — picking the end
    let start = pickingStart.value
    let end = date

    // Ensure start <= end
    if (end.isBefore(start, 'day')) {
      ;[start, end] = [end, start]
    }

    const newValue: [Dayjs | null, Dayjs | null] = [start, end]

    if (!isValueControlled.value) internalValue.value = newValue
    startText.value = start.format(displayFormat.value)
    endText.value = end.format(displayFormat.value)

    const outputValue = [toOutput(start), toOutput(end)] as any
    emit('update:value', outputValue)
    emit('change', outputValue, [start.format(displayFormat.value), end.format(displayFormat.value)])
    emit('calendarChange',
      outputValue,
      [start.format(displayFormat.value), end.format(displayFormat.value)],
      { range: 'end' },
    )

    pickingStart.value = null
    activeInput.value = 'start'
    setOpen(false)
  }
}

function handleCellHover(date: Dayjs) {
  if (pickingStart.value) {
    hoverDate.value = date
  }
}

// ---- Clear ----
function handleClear(e: MouseEvent) {
  e.stopPropagation()
  if (!isValueControlled.value) internalValue.value = [null, null]
  startText.value = ''
  endText.value = ''
  pickingStart.value = null
  emit('update:value', null)
  emit('change', null, ['', ''])
}

// ---- Trigger ----
function handleTriggerClick() {
  if (isDisabled.value) return
  setOpen(!isOpen.value)
  nextTick(() => startInputRef.value?.focus())
}

// ---- View date changes ----
function handleLeftViewDateChange(date: Dayjs) {
  leftViewDate.value = date
}

function handleRightViewDateChange(date: Dayjs) {
  rightViewDate.value = date
}

// ---- Classes ----
const rootClass = computed(() => ({
  'ant-picker': true,
  'ant-picker-range': true,
  [`ant-picker-${resolvedSize.value}`]: true,
  'ant-picker-disabled': isDisabled.value,
  'ant-picker-focused': isOpen.value,
  'ant-picker-borderless': !props.bordered,
  [`ant-picker-status-${props.status}`]: props.status,
}))

const showClear = computed(() =>
  props.allowClear && (selectedValue.value[0] || selectedValue.value[1]) && !isDisabled.value,
)

// Range highlighting for panels
const rangeStart = computed(() => pickingStart.value ?? selectedValue.value[0])
const rangeEnd = computed(() => pickingStart.value ? null : selectedValue.value[1])
const panelHoverValue = computed(() => pickingStart.value ? hoverDate.value : null)

defineExpose({
  focus: () => startInputRef.value?.focus(),
  blur: () => startInputRef.value?.blur(),
})
</script>

<template>
  <Trigger
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
      <div class="ant-picker-input ant-picker-input-start">
        <input
          ref="startInputRef"
          :value="startText"
          :placeholder="placeholder?.[0] ?? 'Start date'"
          :disabled="isStartDisabled"
          :readonly="inputReadOnly"
          autocomplete="off"
          @focus="activeInput = 'start'"
        />
      </div>
      <div class="ant-picker-range-separator">
        <slot name="separator">
          <span class="ant-picker-separator">{{ separator }}</span>
        </slot>
      </div>
      <div class="ant-picker-input ant-picker-input-end">
        <input
          ref="endInputRef"
          :value="endText"
          :placeholder="placeholder?.[1] ?? 'End date'"
          :disabled="isEndDisabled"
          :readonly="inputReadOnly"
          autocomplete="off"
          @focus="activeInput = 'end'"
        />
      </div>
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

    <template #popup>
      <div class="ant-picker-range-panel">
        <PickerPanel
          :value="selectedValue[0]"
          :view-date="leftViewDate"
          :picker="picker"
          :disabled-date="disabledDate"
          :range-start="rangeStart"
          :range-end="rangeEnd"
          :hover-value="panelHoverValue"
          :show-today="false"
          @select="handleSelect"
          @view-date-change="handleLeftViewDateChange"
          @cell-hover="handleCellHover"
        />
        <PickerPanel
          :value="selectedValue[1]"
          :view-date="rightViewDate"
          :picker="picker"
          :disabled-date="disabledDate"
          :range-start="rangeStart"
          :range-end="rangeEnd"
          :hover-value="panelHoverValue"
          :show-today="false"
          @select="handleSelect"
          @view-date-change="handleRightViewDateChange"
          @cell-hover="handleCellHover"
        />
      </div>
    </template>
  </Trigger>
</template>
