<script setup lang="ts">
import { computed, ref, shallowRef, watch, nextTick, getCurrentInstance, onMounted, useSlots } from 'vue'
import type { Placement } from '@floating-ui/vue'
import { Trigger } from '@/_internal/trigger'
import { useConfigInject } from '@/hooks'
import type {
  CascaderProps, CascaderEmits, CascaderSlots,
  CascaderOption, CascaderPlacement, CascaderValueType, CascaderFieldNames,
} from './types'
import { cascaderDefaultProps } from './types'

defineOptions({ name: 'ACascader', inheritAttrs: false })

const props = withDefaults(defineProps<CascaderProps>(), cascaderDefaultProps)
const emit = defineEmits<CascaderEmits>()
defineSlots<CascaderSlots>()
const slots = useSlots()

const { getPopupContainer } = useConfigInject()

const instance = getCurrentInstance()!
const triggerRef = shallowRef<InstanceType<typeof Trigger> | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const selectorRef = ref<HTMLDivElement | null>(null)

// --- Field names ---
const fieldLabel = computed(() => props.fieldNames?.label ?? 'label')
const fieldValue = computed(() => props.fieldNames?.value ?? 'value')
const fieldChildren = computed(() => props.fieldNames?.children ?? 'children')

function getOptionLabel(opt: any): string {
  return String(opt[fieldLabel.value] ?? opt.label ?? opt[fieldValue.value] ?? '')
}
function getOptionValue(opt: any): string | number {
  return opt[fieldValue.value] ?? opt.value
}
function getOptionChildren(opt: any): CascaderOption[] | undefined {
  return opt[fieldChildren.value] ?? opt.children
}

// --- Internal state ---
const internalValue = ref<(string | number)[][]>(normalizeValue(props.value ?? props.defaultValue))
const internalOpen = ref(props.defaultOpen ?? false)
const internalSearchValue = ref('')
const focused = ref(false)

// Active path tracks which options are expanded at each level
const activePath = ref<CascaderOption[]>([])

const isOpenControlled = computed(() => {
  const rawProps = instance.vnode.props || {}
  return 'open' in rawProps
})

const isSearchable = computed(() => !!props.showSearch)

// --- Value normalization ---
function normalizeValue(val: any): (string | number)[][] {
  if (val == null) return []
  if (!Array.isArray(val)) return []
  if (val.length === 0) return []
  // Check if it's a single path or multiple paths
  if (props.multiple) {
    // Multiple: [[v1, v2], [v3, v4]]
    if (Array.isArray(val[0])) return val as (string | number)[][]
    return [val as (string | number)[]]
  }
  // Single: [v1, v2]
  if (Array.isArray(val[0])) return val as (string | number)[][]
  return [val as (string | number)[]]
}

watch(
  () => props.value,
  (v) => {
    if (v !== undefined) internalValue.value = normalizeValue(v)
  },
)

const selectedPaths = computed(() =>
  props.value !== undefined ? normalizeValue(props.value) : internalValue.value,
)

const currentSearchValue = computed(() =>
  props.searchValue !== undefined ? props.searchValue : internalSearchValue.value,
)

// --- Option tree helpers ---
function findPath(options: CascaderOption[], targetPath: (string | number)[]): CascaderOption[] {
  const result: CascaderOption[] = []
  let currentLevel = options
  for (const val of targetPath) {
    const found = currentLevel.find((o) => getOptionValue(o) === val)
    if (!found) break
    result.push(found)
    currentLevel = getOptionChildren(found) ?? []
  }
  return result
}

// --- Columns to display (based on active path) ---
const columns = computed(() => {
  const result: { options: CascaderOption[]; activeValue?: string | number }[] = []
  const rootOptions = props.options ?? []
  result.push({
    options: rootOptions,
    activeValue: activePath.value.length > 0 ? getOptionValue(activePath.value[0]) : undefined,
  })

  let currentChildren: CascaderOption[] | undefined
  for (let i = 0; i < activePath.value.length; i++) {
    currentChildren = getOptionChildren(activePath.value[i])
    if (currentChildren && currentChildren.length > 0) {
      result.push({
        options: currentChildren,
        activeValue: i + 1 < activePath.value.length ? getOptionValue(activePath.value[i + 1]) : undefined,
      })
    }
  }

  return result
})

// --- Search: flatten all paths ---
const searchPaths = computed<{ path: CascaderOption[]; pathValues: (string | number)[] }[]>(() => {
  if (!currentSearchValue.value) return []

  const result: { path: CascaderOption[]; pathValues: (string | number)[] }[] = []

  function traverse(options: CascaderOption[], currentPath: CascaderOption[], currentValues: (string | number)[]) {
    for (const opt of options) {
      const newPath = [...currentPath, opt]
      const newValues = [...currentValues, getOptionValue(opt)]
      const children = getOptionChildren(opt)
      if (children && children.length > 0) {
        traverse(children, newPath, newValues)
      } else {
        result.push({ path: newPath, pathValues: newValues })
      }
    }
  }

  traverse(props.options ?? [], [], [])

  // Filter
  const search = currentSearchValue.value.toLowerCase()
  const searchConfig = typeof props.showSearch === 'object' ? props.showSearch : {}
  const filterFn = searchConfig.filter ?? ((input: string, path: CascaderOption[]) =>
    path.some((o) => getOptionLabel(o).toLowerCase().includes(input.toLowerCase()))
  )

  let filtered = result.filter((r) => filterFn(currentSearchValue.value, r.path))

  if (searchConfig.sort) {
    const sortFn = searchConfig.sort
    filtered.sort((a, b) => sortFn(a.path, b.path, currentSearchValue.value))
  }

  const limit = searchConfig.limit
  if (limit !== false && typeof limit === 'number') {
    filtered = filtered.slice(0, limit)
  } else if (limit === undefined) {
    filtered = filtered.slice(0, 50)
  }

  return filtered
})

// --- Open state ---
const mergedOpen = computed(() => {
  if (isOpenControlled.value) return props.open ?? false
  return internalOpen.value
})

function setOpen(open: boolean) {
  if (props.disabled) return
  internalOpen.value = open
  emit('update:open', open)
  emit('dropdownVisibleChange', open)
  if (!open) {
    internalSearchValue.value = ''
    // Reset active path to selected values
    if (selectedPaths.value.length > 0) {
      activePath.value = findPath(props.options ?? [], selectedPaths.value[0])
    }
  } else if (selectedPaths.value.length > 0) {
    activePath.value = findPath(props.options ?? [], selectedPaths.value[0])
  }
}

// --- Option selection ---
function handleOptionClick(option: CascaderOption, level: number) {
  if (option.disabled) return

  const children = getOptionChildren(option)
  const isLeaf = option.isLeaf !== undefined ? option.isLeaf : (!children || children.length === 0)

  // Update active path
  const newPath = activePath.value.slice(0, level)
  newPath.push(option)
  activePath.value = newPath

  // Load data for async loading
  if (props.loadData && !isLeaf && (!children || children.length === 0) && !option.loading) {
    option.loading = true
    props.loadData(newPath)
    return
  }

  if (isLeaf || props.changeOnSelect) {
    const valuePath = newPath.map((o) => getOptionValue(o))

    if (props.multiple) {
      const current = [...selectedPaths.value]
      const existIdx = current.findIndex((p) =>
        p.length === valuePath.length && p.every((v, i) => v === valuePath[i])
      )
      if (existIdx >= 0) {
        current.splice(existIdx, 1)
      } else {
        current.push(valuePath)
      }
      internalValue.value = current
      emit('update:value', current)
      emit('change', current, newPath)
    } else {
      internalValue.value = [valuePath]
      emit('update:value', valuePath as any)
      emit('change', valuePath as any, newPath)
      if (isLeaf) setOpen(false)
    }
  }
}

function handleOptionHover(option: CascaderOption, level: number) {
  if (option.disabled) return
  if (props.expandTrigger === 'hover') {
    const newPath = activePath.value.slice(0, level)
    newPath.push(option)
    activePath.value = newPath
  }
}

function handleSearchOptionClick(pathValues: (string | number)[], path: CascaderOption[]) {
  if (props.multiple) {
    const current = [...selectedPaths.value]
    const existIdx = current.findIndex((p) =>
      p.length === pathValues.length && p.every((v, i) => v === pathValues[i])
    )
    if (existIdx >= 0) {
      current.splice(existIdx, 1)
    } else {
      current.push(pathValues)
    }
    internalValue.value = current
    emit('update:value', current)
    emit('change', current, path)
  } else {
    internalValue.value = [pathValues]
    emit('update:value', pathValues as any)
    emit('change', pathValues as any, path)
    setOpen(false)
  }
}

// --- Display text ---
const displayLabels = computed(() => {
  if (selectedPaths.value.length === 0) return []
  if (props.multiple) {
    return selectedPaths.value.map((path) => {
      const optPath = findPath(props.options ?? [], path)
      return optPath.map((o) => getOptionLabel(o))
    })
  }
  const optPath = findPath(props.options ?? [], selectedPaths.value[0])
  return [optPath.map((o) => getOptionLabel(o))]
})

const displayText = computed(() => {
  if (displayLabels.value.length === 0) return ''
  if (props.multiple) return ''
  return displayLabels.value[0]?.join(' / ') ?? ''
})

// --- Event handlers ---
function handleSelectorClick() {
  if (props.disabled) return
  if (isSearchable.value) {
    setOpen(true)
    nextTick(() => inputRef.value?.focus())
  } else {
    setOpen(!mergedOpen.value)
  }
}

function handleSelectorMousedown(e: MouseEvent) {
  if (e.target !== inputRef.value) e.preventDefault()
}

function handleInputChange(e: Event) {
  const val = (e.target as HTMLInputElement).value
  internalSearchValue.value = val
  emit('search', val)
  if (!mergedOpen.value) setOpen(true)
}

function handleFocus(e: FocusEvent) {
  focused.value = true
  emit('focus', e)
}

function handleBlur(e: FocusEvent) {
  focused.value = false
  emit('blur', e)
}

function handleClear(e: MouseEvent) {
  e.stopPropagation()
  internalValue.value = []
  emit('update:value', (props.multiple ? [] : []) as any)
  emit('change', (props.multiple ? [] : []) as any, [])
  emit('clear')
  internalSearchValue.value = ''
}

function removeTag(pathValues: (string | number)[]) {
  if (props.disabled) return
  const current = selectedPaths.value.filter((p) =>
    !(p.length === pathValues.length && p.every((v, i) => v === pathValues[i]))
  )
  internalValue.value = current
  emit('update:value', current)
  emit('change', current, [])
}

// --- Is path selected ---
function isPathSelected(pathValues: (string | number)[]): boolean {
  return selectedPaths.value.some((p) =>
    p.length === pathValues.length && p.every((v, i) => v === pathValues[i])
  )
}

// --- Placement ---
const floatingPlacement = computed<Placement>(() => {
  const map: Record<CascaderPlacement, Placement> = {
    bottomLeft: 'bottom-start',
    bottomRight: 'bottom-end',
    topLeft: 'top-start',
    topRight: 'top-end',
  }
  return map[props.placement!] ?? 'bottom-start'
})

const resolvedGetContainer = computed(() => {
  if (props.getPopupContainer) {
    return () => props.getPopupContainer!(selectorRef.value ?? document.body)
  }
  return getPopupContainer.value
})

const openProps = computed(() => {
  if (!isOpenControlled.value) return { open: internalOpen.value }
  return { open: props.open ?? false }
})

const showClear = computed(
  () => props.allowClear && selectedPaths.value.length > 0 && !props.disabled,
)

const shouldShowArrow = computed(() => {
  if (props.showArrow !== undefined) return props.showArrow
  return true
})

const showPlaceholder = computed(() => selectedPaths.value.length === 0 && !currentSearchValue.value)

const selectorClasses = computed(() => ({
  'ant-select': true,
  'ant-cascader': true,
  'ant-select-open': mergedOpen.value,
  'ant-select-focused': focused.value,
  'ant-select-disabled': props.disabled,
  'ant-select-single': !props.multiple,
  'ant-select-multiple': props.multiple,
  'ant-select-show-search': isSearchable.value,
  'ant-select-show-arrow': shouldShowArrow.value,
  'ant-select-allow-clear': props.allowClear,
  'ant-select-sm': props.size === 'small',
  'ant-select-lg': props.size === 'large',
  'ant-select-borderless': !props.bordered,
  [`ant-select-status-${props.status}`]: !!props.status,
  'ant-select-loading': props.loading,
}))

// Tags display for multiple
const displayTags = computed(() => {
  if (!props.multiple) return []
  const max = props.maxTagCount
  const tags = displayLabels.value.map((labels, i) => ({
    labels,
    pathValues: selectedPaths.value[i],
    displayText: labels.join(' / '),
  }))
  if (max !== undefined && typeof max === 'number') return tags.slice(0, max)
  return tags
})

const omittedCount = computed(() => {
  if (!props.multiple || props.maxTagCount === undefined) return 0
  return Math.max(0, selectedPaths.value.length - (props.maxTagCount as number))
})

onMounted(() => {
  if (props.autofocus) {
    nextTick(() => {
      if (isSearchable.value) inputRef.value?.focus()
      else selectorRef.value?.focus()
    })
  }
})

defineExpose({
  focus: (opts?: FocusOptions) => {
    if (isSearchable.value) inputRef.value?.focus(opts)
    else selectorRef.value?.focus(opts)
  },
  blur: () => {
    inputRef.value?.blur()
    selectorRef.value?.blur()
  },
})
</script>

<template>
  <Trigger
    ref="triggerRef"
    v-bind="openProps"
    trigger="click"
    :placement="floatingPlacement"
    :arrow="false"
    :offset="4"
    :auto-adjust-overflow="true"
    :popup-class="['ant-cascader-dropdown', popupClassName]"
    :disabled="props.disabled"
    :get-popup-container="resolvedGetContainer"
    :transition-name="'ant-slide-up'"
    :destroy-on-hide="false"
    @update:open="setOpen"
  >
    <!-- Selector -->
    <div
      ref="selectorRef"
      :class="selectorClasses"
      :tabindex="isSearchable ? undefined : (disabled ? undefined : 0)"
      v-bind="$attrs"
      @click="handleSelectorClick"
      @mousedown="handleSelectorMousedown"
    >
      <div class="ant-select-selector">
        <!-- Multiple mode tags -->
        <template v-if="multiple">
          <span
            v-for="tag in displayTags"
            :key="tag.pathValues.join('-')"
            class="ant-select-selection-item"
          >
            <span class="ant-select-selection-item-content">{{ tag.displayText }}</span>
            <span
              v-if="!disabled"
              class="ant-select-selection-item-remove"
              @click.stop="removeTag(tag.pathValues)"
            >
              <slot name="removeIcon"><span class="ant-select-selection-item-remove-icon">&times;</span></slot>
            </span>
          </span>
          <span v-if="omittedCount > 0" class="ant-select-selection-item ant-select-selection-item-overflow">
            <slot name="maxTagPlaceholder" :omitted-values="selectedPaths.slice(maxTagCount as number)">
              + {{ omittedCount }} ...
            </slot>
          </span>

          <!-- Search input for multiple -->
          <span class="ant-select-selection-search">
            <input
              v-if="isSearchable"
              ref="inputRef"
              class="ant-select-selection-search-input"
              :value="currentSearchValue"
              :disabled="disabled"
              autocomplete="off"
              role="combobox"
              :aria-expanded="mergedOpen"
              aria-haspopup="listbox"
              @input="handleInputChange"
              @focus="handleFocus"
              @blur="handleBlur"
            />
          </span>
          <span v-if="showPlaceholder" class="ant-select-selection-placeholder">
            {{ placeholder }}
          </span>
        </template>

        <!-- Single mode -->
        <template v-else>
          <span class="ant-select-selection-search">
            <input
              v-if="isSearchable"
              ref="inputRef"
              class="ant-select-selection-search-input"
              :value="currentSearchValue"
              :disabled="disabled"
              autocomplete="off"
              role="combobox"
              :aria-expanded="mergedOpen"
              aria-haspopup="listbox"
              @input="handleInputChange"
              @focus="handleFocus"
              @blur="handleBlur"
            />
            <input
              v-else
              ref="inputRef"
              class="ant-select-selection-search-input"
              readonly
              :disabled="disabled"
              role="combobox"
              :tabindex="-1"
              style="opacity: 0; width: 0; position: absolute"
              @focus="handleFocus"
              @blur="handleBlur"
            />
          </span>
          <span
            v-if="selectedPaths.length > 0 && !currentSearchValue"
            class="ant-select-selection-item"
          >
            <slot name="displayRender" :labels="displayLabels[0] ?? []" :selected-options="findPath(options ?? [], selectedPaths[0])">
              {{ displayText }}
            </slot>
          </span>
          <span v-if="showPlaceholder" class="ant-select-selection-placeholder">
            {{ placeholder }}
          </span>
        </template>
      </div>

      <!-- Clear -->
      <span v-if="showClear" class="ant-select-clear" @click="handleClear">
        <slot name="clearIcon"><span class="ant-select-clear-icon">&times;</span></slot>
      </span>

      <!-- Arrow -->
      <span v-if="shouldShowArrow || props.loading" class="ant-select-arrow">
        <slot name="suffixIcon">
          <span v-if="loading" class="ant-select-arrow-loading"><span class="ant-select-arrow-loading-icon" /></span>
          <span v-else class="ant-select-arrow-icon" />
        </slot>
      </span>
    </div>

    <!-- Dropdown -->
    <template #popup>
      <!-- Search results -->
      <div v-if="currentSearchValue" class="ant-cascader-dropdown-content ant-cascader-search-list">
        <div
          v-for="result in searchPaths"
          :key="result.pathValues.join('-')"
          :class="{
            'ant-cascader-search-item': true,
            'ant-cascader-search-item-selected': isPathSelected(result.pathValues),
          }"
          @click="handleSearchOptionClick(result.pathValues, result.path)"
        >
          <span
            v-for="(opt, i) in result.path"
            :key="i"
          >
            <span v-if="i > 0" class="ant-cascader-search-item-separator"> / </span>
            {{ getOptionLabel(opt) }}
          </span>
        </div>
        <div v-if="searchPaths.length === 0" class="ant-cascader-search-item ant-cascader-search-item-empty">
          <slot name="notFoundContent">{{ notFoundContent ?? 'No data' }}</slot>
        </div>
      </div>

      <!-- Cascading columns -->
      <div v-else class="ant-cascader-dropdown-content ant-cascader-menus">
        <ul
          v-for="(col, colIdx) in columns"
          :key="colIdx"
          class="ant-cascader-menu"
          role="listbox"
        >
          <li
            v-for="opt in col.options"
            :key="getOptionValue(opt)"
            :class="{
              'ant-cascader-menu-item': true,
              'ant-cascader-menu-item-active': col.activeValue === getOptionValue(opt),
              'ant-cascader-menu-item-disabled': opt.disabled,
              'ant-cascader-menu-item-loading': opt.loading,
            }"
            role="option"
            :aria-selected="col.activeValue === getOptionValue(opt)"
            @click="handleOptionClick(opt, colIdx)"
            @mouseenter="handleOptionHover(opt, colIdx)"
          >
            <span class="ant-cascader-menu-item-content">
              {{ getOptionLabel(opt) }}
            </span>
            <span
              v-if="multiple"
              class="ant-cascader-menu-item-checkbox"
              :class="{ 'ant-cascader-menu-item-checkbox-checked': isPathSelected([...activePath.slice(0, colIdx).map(o => getOptionValue(o)), getOptionValue(opt)]) }"
            />
            <span
              v-if="getOptionChildren(opt)?.length || (!opt.isLeaf && opt.isLeaf !== true)"
              class="ant-cascader-menu-item-expand-icon"
            >
              <slot name="expandIcon">
                <span class="ant-cascader-menu-item-expand-arrow">&#8250;</span>
              </slot>
            </span>
            <span v-if="opt.loading" class="ant-cascader-menu-item-loading-icon">
              <span class="ant-select-arrow-loading-icon" />
            </span>
          </li>
        </ul>
        <div v-if="(options ?? []).length === 0" class="ant-cascader-menu ant-cascader-menu-empty">
          <slot name="notFoundContent">{{ notFoundContent ?? 'No data' }}</slot>
        </div>
      </div>
    </template>
  </Trigger>
</template>
