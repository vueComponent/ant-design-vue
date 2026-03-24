<script setup lang="ts">
import { computed, ref, shallowRef, watch, nextTick, getCurrentInstance, onMounted, useSlots } from 'vue'
import type { Placement } from '@floating-ui/vue'
import { Trigger } from '@/_internal/trigger'
import { VirtualList } from '@/_internal/virtual-list'
import { useConfigInject } from '@/hooks'
import type { SelectProps, SelectEmits, SelectSlots, SelectOption, SelectOptGroup, SelectOptionType, SelectPlacement, LabeledValue } from './types'
import { selectDefaultProps, isOptGroup } from './types'

defineOptions({ name: 'ASelect', inheritAttrs: false })

const props = withDefaults(defineProps<SelectProps>(), selectDefaultProps)
const emit = defineEmits<SelectEmits>()
defineSlots<SelectSlots>()
const slots = useSlots()

const { getPopupContainer } = useConfigInject()

const instance = getCurrentInstance()!
const triggerRef = shallowRef<InstanceType<typeof Trigger> | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const selectorRef = ref<HTMLDivElement | null>(null)
const virtualListRef = shallowRef<InstanceType<typeof VirtualList> | null>(null)

// --- Internal state ---
const internalValue = ref<(string | number)[]>(normalizeValue(props.value ?? props.defaultValue))
const internalSearchValue = ref('')
const internalOpen = ref(props.defaultOpen ?? false)
const activeIndex = ref(-1)
const focused = ref(false)

// --- Controlled detection ---
const isOpenControlled = computed(() => {
  const rawProps = instance.vnode.props || {}
  return 'open' in rawProps
})

const isMultiple = computed(() => props.mode === 'multiple' || props.mode === 'tags')
const isSearchable = computed(() => {
  if (props.showSearch !== undefined) return props.showSearch
  return isMultiple.value || props.mode === 'tags'
})

// --- Value normalization ---
function normalizeValue(val: any): (string | number)[] {
  if (val == null) return []
  if (Array.isArray(val)) {
    return val.map((v: any) => (typeof v === 'object' && v !== null ? v.value : v))
  }
  if (typeof val === 'object' && val !== null) return [(val as LabeledValue).value]
  return [val as string | number]
}

// Watch external value changes
watch(
  () => props.value,
  (v) => {
    if (v !== undefined) internalValue.value = normalizeValue(v)
  },
)

// Watch external search value changes
watch(
  () => props.searchValue,
  (v) => {
    if (v !== undefined) internalSearchValue.value = v
  },
)

const selectedValues = computed(() =>
  props.value !== undefined ? normalizeValue(props.value) : internalValue.value,
)

const currentSearchValue = computed(() =>
  props.searchValue !== undefined ? props.searchValue : internalSearchValue.value,
)

// --- Flatten options ---
const flatOptions = computed<SelectOption[]>(() => {
  const result: SelectOption[] = []
  const opts = props.options ?? []
  const fieldLabel = props.fieldNames?.label ?? 'label'
  const fieldValue = props.fieldNames?.value ?? 'value'
  const fieldOptions = props.fieldNames?.options ?? 'options'

  for (const rawOpt of opts) {
    const opt = rawOpt as SelectOptionType
    if (isOptGroup(opt) || (fieldOptions in (opt as any) && Array.isArray((opt as any)[fieldOptions]))) {
      const group = opt as SelectOptGroup
      const children = (group as any)[fieldOptions] ?? group.options ?? []
      for (const child of children) {
        result.push({
          value: (child as any)[fieldValue] ?? child.value,
          label: (child as any)[fieldLabel] ?? child.label ?? String((child as any)[fieldValue] ?? child.value),
          disabled: child.disabled,
          title: child.title,
          class: child.class,
        })
      }
    } else {
      const o = opt as SelectOption
      result.push({
        value: (o as any)[fieldValue] ?? o.value,
        label: (o as any)[fieldLabel] ?? o.label ?? String((o as any)[fieldValue] ?? o.value),
        disabled: o.disabled,
        title: o.title,
        class: o.class,
      })
    }
  }
  return result
})

// --- Grouped options for rendering ---
const groupedOptions = computed(() => {
  const opts = props.options ?? []
  const fieldLabel = props.fieldNames?.label ?? 'label'
  const fieldValue = props.fieldNames?.value ?? 'value'
  const fieldOptions = props.fieldNames?.options ?? 'options'
  const groups: { label?: string; isGroup: boolean; options: SelectOption[] }[] = []

  for (const rawOpt of opts) {
    const opt = rawOpt as SelectOptionType
    if (isOptGroup(opt) || (fieldOptions in (opt as any) && Array.isArray((opt as any)[fieldOptions]))) {
      const group = opt as any
      const children = group[fieldOptions] ?? group.options ?? []
      groups.push({
        label: group[fieldLabel] ?? group.label,
        isGroup: true,
        options: children.map((c: any) => ({
          value: c[fieldValue] ?? c.value,
          label: c[fieldLabel] ?? c.label ?? String(c[fieldValue] ?? c.value),
          disabled: c.disabled,
          title: c.title,
          class: c.class,
        })),
      })
    } else {
      const o = opt as any
      groups.push({
        label: undefined,
        isGroup: false,
        options: [{
          value: o[fieldValue] ?? o.value,
          label: o[fieldLabel] ?? o.label ?? String(o[fieldValue] ?? o.value),
          disabled: o.disabled,
          title: o.title,
          class: o.class,
        }],
      })
    }
  }
  return groups
})

// --- Filtered options ---
const filteredOptions = computed<SelectOption[]>(() => {
  const search = currentSearchValue.value
  if (!search) return flatOptions.value

  if (props.filterOption === false) return flatOptions.value

  const filterFn = typeof props.filterOption === 'function'
    ? props.filterOption
    : (input: string, option: SelectOption) => {
        const field = props.optionFilterProp ?? 'label'
        const text = String((option as any)[field] ?? option.label ?? '')
        return text.toLowerCase().includes(input.toLowerCase())
      }

  let result = flatOptions.value.filter((opt) => filterFn(search, opt))

  if (props.filterSort) {
    result = [...result].sort(props.filterSort)
  }

  return result
})

// --- Tags mode: add custom value if not in options ---
const displayOptions = computed<SelectOption[]>(() => {
  if (props.mode === 'tags' && currentSearchValue.value) {
    const exists = filteredOptions.value.some((o) => String(o.value) === currentSearchValue.value)
    if (!exists) {
      return [
        { value: currentSearchValue.value, label: currentSearchValue.value },
        ...filteredOptions.value,
      ]
    }
  }
  return filteredOptions.value
})

// --- Selected option lookup ---
function findOption(value: string | number): SelectOption | undefined {
  return flatOptions.value.find((o) => o.value === value)
}

// --- Display labels for selected values ---
const selectedLabels = computed(() =>
  selectedValues.value.map((v) => {
    const opt = findOption(v)
    return { value: v, label: opt?.label ?? String(v) }
  }),
)

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
    // Clear search when closing
    if (internalSearchValue.value) {
      internalSearchValue.value = ''
      emit('update:searchValue', '')
      emit('search', '')
    }
    activeIndex.value = -1
  } else if (props.defaultActiveFirstOption && displayOptions.value.length) {
    activeIndex.value = 0
  }
}

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
  // Prevent input blur when clicking the selector
  if (e.target !== inputRef.value) {
    e.preventDefault()
  }
}

function handleInputChange(e: Event) {
  const val = (e.target as HTMLInputElement).value
  internalSearchValue.value = val
  emit('update:searchValue', val)
  emit('search', val)
  if (!mergedOpen.value) {
    setOpen(true)
  }
  activeIndex.value = props.defaultActiveFirstOption ? 0 : -1
}

function handleFocus(e: FocusEvent) {
  focused.value = true
  emit('focus', e)
}

function handleBlur(e: FocusEvent) {
  focused.value = false
  emit('blur', e)
  // For tags mode: create tag from input on blur
  if (props.mode === 'tags' && currentSearchValue.value) {
    selectValue(currentSearchValue.value)
  }
}

function handleClear(e: MouseEvent) {
  e.stopPropagation()
  const newVal = isMultiple.value ? [] : undefined
  internalValue.value = normalizeValue(newVal)
  emitValue(newVal, [])
  emit('clear')
  internalSearchValue.value = ''
  emit('update:searchValue', '')
}

function selectValue(value: string | number) {
  const option = findOption(value) ?? { value, label: String(value) }

  if (isMultiple.value) {
    const current = [...selectedValues.value]
    const idx = current.indexOf(value)
    if (idx >= 0) {
      // Deselect
      current.splice(idx, 1)
      internalValue.value = current
      emitValue(buildOutputValue(current), current.map((v) => findOption(v) ?? { value: v, label: String(v) }))
      emit('deselect', value, option)
    } else {
      // Select
      current.push(value)
      internalValue.value = current
      emitValue(buildOutputValue(current), current.map((v) => findOption(v) ?? { value: v, label: String(v) }))
      emit('select', value, option)
    }
    // Clear search after selection in multiple mode
    if (props.autoClearSearchValue) {
      internalSearchValue.value = ''
      emit('update:searchValue', '')
      emit('search', '')
    }
    nextTick(() => inputRef.value?.focus())
  } else {
    // Single select
    internalValue.value = [value]
    emitValue(buildOutputValue([value]), option)
    emit('select', value, option)
    setOpen(false)
    // Clear search
    internalSearchValue.value = ''
    emit('update:searchValue', '')
  }
}

function buildOutputValue(values: (string | number)[]): any {
  if (props.labelInValue) {
    const labeled = values.map((v) => {
      const opt = findOption(v)
      return { value: v, label: opt?.label ?? String(v), key: v }
    })
    return isMultiple.value ? labeled : labeled[0] ?? null
  }
  return isMultiple.value ? values : values[0] ?? null
}

function emitValue(value: any, option: SelectOption | SelectOption[]) {
  emit('update:value', value)
  emit('change', value, option)
}

function removeTag(value: string | number) {
  if (props.disabled) return
  const current = selectedValues.value.filter((v) => v !== value)
  internalValue.value = current
  const option = findOption(value) ?? { value, label: String(value) }
  emitValue(buildOutputValue(current), current.map((v) => findOption(v) ?? { value: v, label: String(v) }))
  emit('deselect', value, option)
}

function handleOptionClick(option: SelectOption) {
  if (option.disabled) return
  selectValue(option.value)
}

function handleKeydown(e: KeyboardEvent) {
  emit('inputKeydown', e)
  const opts = displayOptions.value.filter((o) => !o.disabled)
  if (!opts.length) return

  switch (e.key) {
    case 'ArrowDown': {
      e.preventDefault()
      if (!mergedOpen.value) {
        setOpen(true)
        return
      }
      activeIndex.value = activeIndex.value < displayOptions.value.length - 1
        ? findNextEnabled(activeIndex.value, 1)
        : findNextEnabled(-1, 1)
      scrollToActive()
      break
    }
    case 'ArrowUp': {
      e.preventDefault()
      if (!mergedOpen.value) {
        setOpen(true)
        return
      }
      activeIndex.value = activeIndex.value > 0
        ? findNextEnabled(activeIndex.value, -1)
        : findNextEnabled(displayOptions.value.length, -1)
      scrollToActive()
      break
    }
    case 'Enter': {
      e.preventDefault()
      if (mergedOpen.value && activeIndex.value >= 0 && activeIndex.value < displayOptions.value.length) {
        const opt = displayOptions.value[activeIndex.value]
        if (!opt.disabled) handleOptionClick(opt)
      } else if (!mergedOpen.value) {
        setOpen(true)
      }
      break
    }
    case 'Escape': {
      setOpen(false)
      break
    }
    case 'Backspace': {
      if (isMultiple.value && !currentSearchValue.value && selectedValues.value.length) {
        removeTag(selectedValues.value[selectedValues.value.length - 1])
      }
      break
    }
  }

  // Tags mode: token separators
  if (props.mode === 'tags' && props.tokenSeparators?.length && currentSearchValue.value) {
    const char = e.key
    if (props.tokenSeparators.includes(char)) {
      e.preventDefault()
      const val = currentSearchValue.value.trim()
      if (val) selectValue(val)
    }
  }
}

function findNextEnabled(from: number, direction: 1 | -1): number {
  const opts = displayOptions.value
  let idx = from + direction
  while (idx >= 0 && idx < opts.length) {
    if (!opts[idx].disabled) return idx
    idx += direction
  }
  return from >= 0 && from < opts.length ? from : -1
}

function scrollToActive() {
  if (activeIndex.value >= 0 && virtualListRef.value) {
    virtualListRef.value.scrollTo(activeIndex.value)
  }
}

function handlePopupScroll(e: Event) {
  emit('popupScroll', e)
}

// --- Placement mapping ---
const floatingPlacement = computed<Placement>(() => {
  const map: Record<SelectPlacement, Placement> = {
    bottomLeft: 'bottom-start',
    bottomRight: 'bottom-end',
    topLeft: 'top-start',
    topRight: 'top-end',
  }
  return map[props.placement!] ?? 'bottom-start'
})

// --- Container ---
const resolvedGetContainer = computed(() => {
  if (props.getPopupContainer) {
    return () => props.getPopupContainer!(selectorRef.value ?? document.body)
  }
  return getPopupContainer.value
})

// --- Open props for Trigger ---
const openProps = computed(() => {
  if (!isOpenControlled.value) return { open: internalOpen.value }
  return { open: props.open ?? false }
})

// --- Show clear ---
const showClear = computed(
  () => props.allowClear && selectedValues.value.length > 0 && !props.disabled,
)

// --- Show arrow ---
const shouldShowArrow = computed(() => {
  if (props.showArrow !== undefined) return props.showArrow
  return !isMultiple.value
})

// --- CSS classes ---
const selectorClasses = computed(() => ({
  'ant-select': true,
  'ant-select-open': mergedOpen.value,
  'ant-select-focused': focused.value,
  'ant-select-disabled': props.disabled,
  'ant-select-single': !isMultiple.value,
  'ant-select-multiple': isMultiple.value,
  'ant-select-show-search': isSearchable.value,
  'ant-select-show-arrow': shouldShowArrow.value,
  'ant-select-allow-clear': props.allowClear,
  'ant-select-sm': props.size === 'small',
  'ant-select-lg': props.size === 'large',
  'ant-select-borderless': !props.bordered,
  [`ant-select-status-${props.status}`]: !!props.status,
  'ant-select-loading': props.loading,
}))

// --- Dropdown width ---
const dropdownStyle = computed(() => {
  const style: Record<string, string> = { ...props.dropdownStyle }
  if (typeof props.dropdownMatchSelectWidth === 'number') {
    style.width = `${props.dropdownMatchSelectWidth}px`
  }
  return style
})

// --- Display tags with maxTagCount ---
const displayTags = computed(() => {
  if (!isMultiple.value) return selectedLabels.value
  const max = props.maxTagCount
  if (max === undefined || max === 'responsive') return selectedLabels.value
  return selectedLabels.value.slice(0, max)
})

const omittedValues = computed(() => {
  if (!isMultiple.value) return []
  const max = props.maxTagCount
  if (max === undefined || max === 'responsive') return []
  if (typeof max === 'number' && selectedLabels.value.length > max) {
    return selectedLabels.value.slice(max)
  }
  return []
})

// --- Input mirror width for multiple mode ---
const inputMirrorWidth = computed(() => {
  if (!isMultiple.value) return undefined
  const len = currentSearchValue.value.length
  return `${Math.max(4, len * 8 + 10)}px`
})

// --- Autofocus ---
onMounted(() => {
  if (props.autofocus) {
    nextTick(() => {
      if (isSearchable.value) {
        inputRef.value?.focus()
      } else {
        selectorRef.value?.focus()
      }
    })
  }
})

// --- Selection label for single mode ---
const singleLabel = computed(() => {
  if (isMultiple.value) return ''
  if (selectedLabels.value.length > 0) return String(selectedLabels.value[0].label)
  return ''
})

// Show placeholder
const showPlaceholder = computed(() => selectedValues.value.length === 0 && !currentSearchValue.value)

// Is selected helper
function isSelected(value: string | number) {
  return selectedValues.value.includes(value)
}

// --- Expose ---
defineExpose({
  focus: (opts?: FocusOptions) => {
    if (isSearchable.value) inputRef.value?.focus(opts)
    else selectorRef.value?.focus(opts)
  },
  blur: () => {
    inputRef.value?.blur()
    selectorRef.value?.blur()
  },
  scrollTo: (index: number) => virtualListRef.value?.scrollTo(index),
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
    :popup-class="['ant-select-dropdown', popupClassName]"
    :popup-style="dropdownStyle"
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
      @keydown="!isSearchable && handleKeydown($event)"
    >
      <div class="ant-select-selector">
        <!-- Multiple mode -->
        <template v-if="isMultiple">
          <!-- Selected tags -->
          <template v-for="tag in displayTags" :key="tag.value">
            <slot
              name="tagRender"
              :value="tag.value"
              :label="tag.label"
              :closable="!disabled"
              :on-close="() => removeTag(tag.value)"
            >
              <span class="ant-select-selection-item">
                <span class="ant-select-selection-item-content">
                  {{ props.maxTagTextLength && String(tag.label).length > props.maxTagTextLength
                    ? String(tag.label).slice(0, props.maxTagTextLength) + '...'
                    : tag.label
                  }}
                </span>
                <span
                  v-if="!disabled"
                  class="ant-select-selection-item-remove"
                  @click.stop="removeTag(tag.value)"
                >
                  <slot name="removeIcon">
                    <span class="ant-select-selection-item-remove-icon">&times;</span>
                  </slot>
                </span>
              </span>
            </slot>
          </template>

          <!-- Overflow indicator -->
          <span v-if="omittedValues.length > 0" class="ant-select-selection-item ant-select-selection-item-overflow">
            <slot name="maxTagPlaceholder" :omitted-values="omittedValues">
              + {{ omittedValues.length }} ...
            </slot>
          </span>

          <!-- Search input for multiple -->
          <span class="ant-select-selection-search" :style="{ width: inputMirrorWidth }">
            <input
              ref="inputRef"
              class="ant-select-selection-search-input"
              :value="currentSearchValue"
              :disabled="disabled"
              :autofocus="autofocus"
              autocomplete="off"
              role="combobox"
              :aria-expanded="mergedOpen"
              aria-haspopup="listbox"
              aria-autocomplete="list"
              @input="handleInputChange"
              @keydown="handleKeydown"
              @focus="handleFocus"
              @blur="handleBlur"
            />
          </span>

          <!-- Placeholder -->
          <span
            v-if="showPlaceholder"
            class="ant-select-selection-placeholder"
          >
            <slot name="placeholder">{{ placeholder }}</slot>
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
              aria-autocomplete="list"
              @input="handleInputChange"
              @keydown="handleKeydown"
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
              :aria-expanded="mergedOpen"
              aria-haspopup="listbox"
              :tabindex="-1"
              style="opacity: 0; width: 0; position: absolute"
              @focus="handleFocus"
              @blur="handleBlur"
            />
          </span>
          <span
            v-if="selectedValues.length > 0 && !currentSearchValue"
            class="ant-select-selection-item"
            :title="String(singleLabel)"
          >
            {{ singleLabel }}
          </span>
          <span
            v-if="showPlaceholder"
            class="ant-select-selection-placeholder"
          >
            <slot name="placeholder">{{ placeholder }}</slot>
          </span>
        </template>
      </div>

      <!-- Clear icon -->
      <span
        v-if="showClear"
        class="ant-select-clear"
        @click="handleClear"
      >
        <slot name="clearIcon">
          <span class="ant-select-clear-icon">&times;</span>
        </slot>
      </span>

      <!-- Arrow / Loading -->
      <span v-if="shouldShowArrow || props.loading" class="ant-select-arrow">
        <slot name="suffixIcon">
          <span v-if="loading" class="ant-select-arrow-loading">
            <span class="ant-select-arrow-loading-icon" />
          </span>
          <span v-else class="ant-select-arrow-icon" />
        </slot>
      </span>
    </div>

    <!-- Dropdown -->
    <template #popup>
      <div
        class="ant-select-dropdown-content"
        @scroll="handlePopupScroll"
      >
        <slot name="dropdownRender" :menu-node="undefined as any">
          <!-- Virtual list for large datasets -->
          <template v-if="virtual && displayOptions.length > 0">
            <VirtualList
              ref="virtualListRef"
              :data="displayOptions"
              :item-height="listItemHeight!"
              :height="listHeight!"
              item-key="value"
            >
              <template #default="{ item, index, style }">
                <div
                  :key="item.value"
                  :class="{
                    'ant-select-item': true,
                    'ant-select-item-option': true,
                    'ant-select-item-option-active': index === activeIndex,
                    'ant-select-item-option-selected': isSelected(item.value),
                    'ant-select-item-option-disabled': item.disabled,
                    [item.class || '']: !!item.class,
                  }"
                  :style="style"
                  :title="item.title || String(item.label)"
                  role="option"
                  :aria-selected="isSelected(item.value)"
                  :aria-disabled="item.disabled"
                  @click="handleOptionClick(item)"
                  @mouseenter="activeIndex = index"
                >
                  <div class="ant-select-item-option-content">
                    <slot name="option" :value="item.value" :label="item.label" :disabled="item.disabled">
                      {{ item.label }}
                    </slot>
                  </div>
                  <span v-if="isSelected(item.value) && isMultiple" class="ant-select-item-option-state">
                    &#10003;
                  </span>
                </div>
              </template>
            </VirtualList>
          </template>

          <!-- Non-virtual list -->
          <template v-else-if="displayOptions.length > 0">
            <div role="listbox" class="ant-select-item-list">
              <div
                v-for="(item, index) in displayOptions"
                :key="item.value"
                :class="{
                  'ant-select-item': true,
                  'ant-select-item-option': true,
                  'ant-select-item-option-active': index === activeIndex,
                  'ant-select-item-option-selected': isSelected(item.value),
                  'ant-select-item-option-disabled': item.disabled,
                  [item.class || '']: !!item.class,
                }"
                :title="item.title || String(item.label)"
                role="option"
                :aria-selected="isSelected(item.value)"
                :aria-disabled="item.disabled"
                @click="handleOptionClick(item)"
                @mouseenter="activeIndex = index"
              >
                <div class="ant-select-item-option-content">
                  <slot name="option" :value="item.value" :label="item.label" :disabled="item.disabled">
                    {{ item.label }}
                  </slot>
                </div>
                <span v-if="isSelected(item.value) && isMultiple" class="ant-select-item-option-state">
                  &#10003;
                </span>
              </div>
            </div>
          </template>

          <!-- Not found content -->
          <div v-else class="ant-select-item ant-select-item-empty">
            <slot name="notFoundContent">
              {{ notFoundContent ?? 'No data' }}
            </slot>
          </div>
        </slot>
      </div>
    </template>
  </Trigger>
</template>
