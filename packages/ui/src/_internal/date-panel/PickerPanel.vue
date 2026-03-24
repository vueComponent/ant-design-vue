<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import DatePanel from './DatePanel.vue'
import WeekPanel from './WeekPanel.vue'
import MonthPanel from './MonthPanel.vue'
import QuarterPanel from './QuarterPanel.vue'
import YearPanel from './YearPanel.vue'
import DecadePanel from './DecadePanel.vue'
import TimePanel from './TimePanel.vue'
import type { PanelMode, PickerMode, DateLocale, TimeProps, PresetDate } from './types'
import { defaultLocale } from './types'

defineOptions({ name: 'PickerPanel' })

const props = withDefaults(defineProps<{
  value?: Dayjs | null
  defaultValue?: Dayjs | null
  picker?: PickerMode
  mode?: PanelMode
  viewDate?: Dayjs
  disabledDate?: (date: Dayjs) => boolean
  locale?: DateLocale
  showTime?: boolean | TimeProps
  showToday?: boolean
  showNow?: boolean
  presets?: PresetDate[]
  /** For range picker: start of range */
  rangeStart?: Dayjs | null
  /** For range picker: end of range */
  rangeEnd?: Dayjs | null
  /** For range picker: hover date */
  hoverValue?: Dayjs | null
}>(), {
  picker: 'date',
  showToday: true,
  showNow: true,
})

const emit = defineEmits<{
  (e: 'select', date: Dayjs): void
  (e: 'panelChange', mode: PanelMode): void
  (e: 'viewDateChange', date: Dayjs): void
  (e: 'cellHover', date: Dayjs): void
  (e: 'ok'): void
  (e: 'presetSelect', value: Dayjs): void
}>()

const loc = computed(() => props.locale ?? defaultLocale)

// Determine the initial panel mode based on picker
function getInitialMode(): PanelMode {
  if (props.mode) return props.mode
  return props.picker
}

const currentMode = ref<PanelMode>(getInitialMode())

watch(() => props.mode, (val) => {
  if (val) currentMode.value = val
})

watch(() => props.picker, () => {
  currentMode.value = getInitialMode()
})

// View date (the month/year currently displayed for navigation)
const internalViewDate = ref<Dayjs>(props.viewDate ?? props.value ?? props.defaultValue ?? dayjs())

watch(() => props.viewDate, (val) => {
  if (val) internalViewDate.value = val
})

const activeViewDate = computed(() => props.viewDate ?? internalViewDate.value)

function handleViewDateChange(date: Dayjs) {
  internalViewDate.value = date
  emit('viewDateChange', date)
}

// Panel drill-up mapping: date → month → year → decade
const drillUpMap: Partial<Record<PanelMode, PanelMode>> = {
  date: 'month',
  week: 'month',
  month: 'year',
  quarter: 'year',
  year: 'decade',
}

function handleTitleClick() {
  const nextMode = drillUpMap[currentMode.value]
  if (nextMode) {
    currentMode.value = nextMode
    emit('panelChange', nextMode)
  }
}

// When a cell is selected in a drill-up panel, drill back down
function handleDrillDownSelect(date: Dayjs, fromMode: PanelMode) {
  internalViewDate.value = date
  emit('viewDateChange', date)

  // Determine which mode to go back to
  if (fromMode === 'decade') {
    currentMode.value = 'year'
    emit('panelChange', 'year')
  } else if (fromMode === 'year') {
    // If the picker is 'year', this is a final selection
    if (props.picker === 'year') {
      emit('select', date)
    } else {
      currentMode.value = props.picker === 'quarter' ? 'quarter' : 'month'
      emit('panelChange', currentMode.value)
    }
  } else if (fromMode === 'month') {
    if (props.picker === 'month') {
      emit('select', date)
    } else {
      currentMode.value = props.picker === 'week' ? 'week' : 'date'
      emit('panelChange', currentMode.value)
    }
  }
}

function handleDateSelect(date: Dayjs) {
  emit('select', date)
}

// Time panel support
const showTimePanel = computed(() => {
  if (!props.showTime) return false
  return currentMode.value === 'date'
})

const timeProps = computed(() => {
  if (typeof props.showTime === 'object') return props.showTime
  return {}
})

function handleTimeSelect(date: Dayjs) {
  emit('select', date)
}

function handleNowClick() {
  const now = dayjs()
  internalViewDate.value = now
  emit('viewDateChange', now)
  emit('select', now)
}

function handleTodayClick() {
  const today = dayjs().startOf('day')
  internalViewDate.value = today
  emit('viewDateChange', today)
  emit('select', today)
}

function handlePresetClick(preset: PresetDate) {
  const val = typeof preset.value === 'function' ? preset.value() : preset.value
  emit('presetSelect', val)
}

function handleOk() {
  emit('ok')
}
</script>

<template>
  <div class="ant-picker-panel">
    <!-- Presets sidebar -->
    <div v-if="presets?.length" class="ant-picker-presets">
      <ul>
        <li
          v-for="preset in presets"
          :key="preset.label"
          @click="handlePresetClick(preset)"
        >
          {{ preset.label }}
        </li>
      </ul>
    </div>

    <div class="ant-picker-panel-inner">
      <!-- Date panel -->
      <DatePanel
        v-if="currentMode === 'date'"
        :view-date="activeViewDate"
        :value="value"
        :disabled-date="disabledDate"
        :locale="loc"
        :range-start="rangeStart"
        :range-end="rangeEnd"
        :hover-value="hoverValue"
        @select="handleDateSelect"
        @view-date-change="handleViewDateChange"
        @title-click="handleTitleClick"
        @cell-hover="emit('cellHover', $event)"
      />

      <!-- Week panel -->
      <WeekPanel
        v-else-if="currentMode === 'week'"
        :view-date="activeViewDate"
        :value="value"
        :disabled-date="disabledDate"
        :locale="loc"
        @select="handleDateSelect"
        @view-date-change="handleViewDateChange"
        @title-click="handleTitleClick"
      />

      <!-- Month panel -->
      <MonthPanel
        v-else-if="currentMode === 'month'"
        :view-date="activeViewDate"
        :value="value"
        :disabled-date="disabledDate"
        :locale="loc"
        @select="(d) => handleDrillDownSelect(d, 'month')"
        @view-date-change="handleViewDateChange"
        @title-click="handleTitleClick"
      />

      <!-- Quarter panel -->
      <QuarterPanel
        v-else-if="currentMode === 'quarter'"
        :view-date="activeViewDate"
        :value="value"
        :disabled-date="disabledDate"
        @select="handleDateSelect"
        @view-date-change="handleViewDateChange"
        @title-click="handleTitleClick"
      />

      <!-- Year panel -->
      <YearPanel
        v-else-if="currentMode === 'year'"
        :view-date="activeViewDate"
        :value="value"
        :disabled-date="disabledDate"
        @select="(d) => handleDrillDownSelect(d, 'year')"
        @view-date-change="handleViewDateChange"
        @title-click="handleTitleClick"
      />

      <!-- Decade panel -->
      <DecadePanel
        v-else-if="currentMode === 'decade'"
        :view-date="activeViewDate"
        :value="value"
        @select="(d) => handleDrillDownSelect(d, 'decade')"
        @view-date-change="handleViewDateChange"
      />

      <!-- Time panel (shown below date panel when showTime) -->
      <TimePanel
        v-if="showTimePanel"
        :value="value"
        v-bind="(timeProps as any)"
        @select="handleTimeSelect"
      />

      <!-- Footer -->
      <div v-if="showTimePanel || (showToday && currentMode === 'date')" class="ant-picker-footer">
        <div class="ant-picker-footer-extra">
          <a
            v-if="showToday && !showTime && currentMode === 'date'"
            class="ant-picker-today-btn"
            @click="handleTodayClick"
          >
            {{ loc.today }}
          </a>
          <template v-if="showTimePanel">
            <a
              v-if="showNow"
              class="ant-picker-now-btn"
              @click="handleNowClick"
            >
              {{ loc.now }}
            </a>
            <button type="button" class="ant-picker-ok-btn" @click="handleOk">
              {{ loc.ok }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
