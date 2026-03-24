<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { ColumnsType, Key } from '../types'

interface DataType {
  key: string
  name: string
  age: number
  address: string
}

const state = reactive({
  searchText: '',
  searchedColumn: '',
})

const searchInput = ref()

const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    customFilterDropdown: true,
    onFilter: (value, record) =>
      record.name.toString().toLowerCase().includes(String(value).toLowerCase()),
    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => {
          searchInput.value?.focus()
        }, 100)
      }
    },
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    customFilterDropdown: true,
    onFilter: (value, record) =>
      record.address.toString().toLowerCase().includes(String(value).toLowerCase()),
    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => {
          searchInput.value?.focus()
        }, 100)
      }
    },
  },
]

const data: DataType[] = [
  { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
  { key: '2', name: 'Joe Black', age: 42, address: 'London No. 1 Lake Park' },
  { key: '3', name: 'Jim Green', age: 32, address: 'Sydney No. 1 Lake Park' },
  { key: '4', name: 'Jim Red', age: 32, address: 'London No. 2 Lake Park' },
]

function handleSearch(selectedKeys: Key[], confirm: (params?: { closeDropdown?: boolean }) => void, dataIndex: string | number | (string | number)[]) {
  confirm()
  state.searchText = String(selectedKeys[0] ?? '')
  state.searchedColumn = String(dataIndex)
}

function handleReset(clearFilters?: (params?: { confirm?: boolean; closeDropdown?: boolean }) => void) {
  clearFilters?.({ confirm: true })
  state.searchText = ''
}
</script>

<template>
  <a-table :columns="columns" :data-source="data">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span style="color: #1677ff;">Name</span>
      </template>
    </template>

    <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
      <div style="padding: 8px;">
        <a-input
          ref="searchInput"
          :placeholder="`Search ${column.dataIndex}`"
          :value="selectedKeys[0]"
          style="width: 188px; margin-bottom: 8px; display: block;"
          @change="(e: any) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @press-enter="handleSearch(selectedKeys, confirm, column.dataIndex)"
        />
        <a-button
          type="primary"
          size="small"
          style="width: 90px; margin-right: 8px;"
          @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          Search
        </a-button>
        <a-button
          size="small"
          style="width: 90px;"
          @click="handleReset(clearFilters)"
        >
          Reset
        </a-button>
      </div>
    </template>

    <template #bodyCell="{ text, column }">
      <span v-if="state.searchText && state.searchedColumn === column.dataIndex">
        <template
          v-for="(fragment, i) in String(text)
            .split(new RegExp(`(?<=${state.searchText})|(?=${state.searchText})`, 'i'))"
          :key="i"
        >
          <mark
            v-if="fragment.toLowerCase() === state.searchText.toLowerCase()"
            style="background-color: rgb(255, 192, 105); padding: 0;"
          >
            {{ fragment }}
          </mark>
          <template v-else>{{ fragment }}</template>
        </template>
      </span>
    </template>
  </a-table>
</template>
