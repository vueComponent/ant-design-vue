<template>
  <div style="width: 300px; border: 1px solid #d9d9d9; border-radius: 4px;">
    <a-calendar v-model:value="value" :fullscreen="false" @panelChange="onPanelChange">
      <template #headerRender="{ value: current, type, onChange, onTypeChange }">
        <div style="padding: 10px;">
          <div style="margin-bottom: 10px;">Custom header</div>
          <div style="display: flex; justify-content: space-between; gap: 8px;">
            <a-radio-group
              size="small"
              :value="type"
              @change="(e: any) => onTypeChange(e.target.value)"
            >
              <a-radio-button value="month">Month</a-radio-button>
              <a-radio-button value="year">Year</a-radio-button>
            </a-radio-group>
            <select
              style="width: 80px;"
              :value="String(current.year())"
              @change="(e: Event) => onChange(current.year(+(e.target as HTMLSelectElement).value))"
            >
              <option
                v-for="y in getYears(current)"
                :key="y"
                :value="String(y)"
              >
                {{ y }}
              </option>
            </select>
            <select
              style="width: 80px;"
              :value="String(current.month())"
              @change="(e: Event) => onChange(current.month(parseInt((e.target as HTMLSelectElement).value, 10)))"
            >
              <option
                v-for="(m, index) in getMonths(current)"
                :key="index"
                :value="String(index)"
              >
                {{ m }}
              </option>
            </select>
          </div>
        </div>
      </template>
    </a-calendar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import type { Dayjs } from 'dayjs'

dayjs.extend(localeData)

const value = ref<Dayjs>(dayjs())

function onPanelChange(val: Dayjs, mode: string) {
  console.log(val, mode)
}

function getMonths(val: Dayjs) {
  const localeData = val.localeData()
  const months: string[] = []
  for (let i = 0; i < 12; i++) {
    months.push(localeData.monthsShort(val.month(i)) as unknown as string)
  }
  return months
}

function getYears(val: Dayjs) {
  const year = val.year()
  const years: number[] = []
  for (let i = year - 10; i < year + 10; i++) {
    years.push(i)
  }
  return years
}
</script>
