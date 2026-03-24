<template>
  <a-calendar v-model:value="value">
    <template #dateCellRender="{ current }">
      <ul v-if="getListData(current).length" class="events">
        <li v-for="item in getListData(current)" :key="item.content">
          <a-badge :status="item.type" :text="item.content" />
        </li>
      </ul>
    </template>
    <template #monthCellRender="{ current }">
      <div v-if="getMonthData(current)" class="notes-month">
        <section>{{ getMonthData(current) }}</section>
        <span>Backlog number</span>
      </div>
    </template>
  </a-calendar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import type { PresetStatusColor } from '../../badge/types'

const value = ref<Dayjs>(dayjs())

function getListData(date: Dayjs): { type: PresetStatusColor; content: string }[] {
  switch (date.date()) {
    case 8:
      return [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'success', content: 'This is usual event.' },
      ]
    case 10:
      return [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'success', content: 'This is usual event.' },
        { type: 'error', content: 'This is error event.' },
      ]
    case 15:
      return [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'success', content: 'This is very long usual event.' },
        { type: 'error', content: 'This is error event 1.' },
        { type: 'error', content: 'This is error event 2.' },
      ]
    default:
      return []
  }
}

function getMonthData(date: Dayjs) {
  if (date.month() === 8) {
    return 1394
  }
  return null
}
</script>

<style scoped>
.events {
  list-style: none;
  margin: 0;
  padding: 0;
}

.notes-month {
  text-align: center;
  font-size: 28px;
}

.notes-month span {
  font-size: 14px;
  color: #999;
}
</style>
