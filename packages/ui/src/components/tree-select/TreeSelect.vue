<script setup lang="ts">
import { computed, ref, shallowRef, watch, nextTick, getCurrentInstance, onMounted, useSlots } from 'vue'
import type { Placement } from '@floating-ui/vue'
import { Trigger } from '@/_internal/trigger'
import { useConfigInject } from '@/hooks'
import type {
  TreeSelectProps, TreeSelectEmits, TreeSelectSlots,
  TreeSelectNode, TreeSelectPlacement, TreeSelectLabeledValue, TreeSelectValue,
} from './types'
import { treeSelectDefaultProps } from './types'

defineOptions({ name: 'ATreeSelect', inheritAttrs: false })

const props = withDefaults(defineProps<TreeSelectProps>(), treeSelectDefaultProps)
const emit = defineEmits<TreeSelectEmits>()
defineSlots<TreeSelectSlots>()
const slots = useSlots()

const { getPopupContainer } = useConfigInject()

const instance = getCurrentInstance()!
const triggerRef = shallowRef<InstanceType<typeof Trigger> | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const selectorRef = ref<HTMLDivElement | null>(null)

// --- Field names ---
const fLabel = computed(() => props.fieldNames?.label ?? 'label')
const fValue = computed(() => props.fieldNames?.value ?? 'value')
const fChildren = computed(() => props.fieldNames?.children ?? 'children')

function getLabel(node: any): string {
  return String(node[fLabel.value] ?? node.label ?? node.title ?? node[fValue.value] ?? '')
}
function getValue(node: any): string | number {
  return node[fValue.value] ?? node.value
}
function getChildren(node: any): TreeSelectNode[] | undefined {
  return node[fChildren.value] ?? node.children
}

// --- Internal state ---
const internalValue = ref<(string | number)[]>(normalizeValue(props.value ?? props.defaultValue))
const internalOpen = ref(props.defaultOpen ?? false)
const internalSearchValue = ref('')
const internalExpandedKeys = ref<(string | number)[]>(
  props.treeExpandedKeys ?? props.treeDefaultExpandedKeys ?? (props.treeDefaultExpandAll ? getAllKeys() : [])
)
const focused = ref(false)

const isOpenControlled = computed(() => {
  const rawProps = instance.vnode.props || {}
  return 'open' in rawProps
})

const isMultiple = computed(() => props.multiple || props.treeCheckable)
const isSearchable = computed(() => props.showSearch ?? isMultiple.value)

// --- Value normalization ---
function normalizeValue(val: any): (string | number)[] {
  if (val == null) return []
  if (Array.isArray(val)) {
    return val.map((v: any) => (typeof v === 'object' && v !== null ? v.value : v))
  }
  if (typeof val === 'object' && val !== null) return [(val as TreeSelectLabeledValue).value]
  return [val as string | number]
}

function getAllKeys(): (string | number)[] {
  const keys: (string | number)[] = []
  function traverse(nodes: TreeSelectNode[]) {
    for (const node of nodes) {
      keys.push(getValue(node))
      const children = getChildren(node)
      if (children) traverse(children)
    }
  }
  traverse(props.treeData ?? [])
  return keys
}

watch(
  () => props.value,
  (v) => { if (v !== undefined) internalValue.value = normalizeValue(v) },
)

watch(
  () => props.treeExpandedKeys,
  (v) => { if (v !== undefined) internalExpandedKeys.value = [...v] },
)

watch(
  () => props.searchValue,
  (v) => { if (v !== undefined) internalSearchValue.value = v },
)

const selectedValues = computed(() =>
  props.value !== undefined ? normalizeValue(props.value) : internalValue.value,
)

const expandedKeys = computed(() =>
  props.treeExpandedKeys !== undefined ? props.treeExpandedKeys : internalExpandedKeys.value,
)

const currentSearchValue = computed(() =>
  props.searchValue !== undefined ? props.searchValue : internalSearchValue.value,
)

// --- Flatten tree for rendering ---
interface FlatNode {
  node: TreeSelectNode
  level: number
  isLeaf: boolean
  expanded: boolean
  hasChildren: boolean
  value: string | number
  label: string
  disabled: boolean
}

const flattenedNodes = computed<FlatNode[]>(() => {
  const result: FlatNode[] = []
  const search = currentSearchValue.value.toLowerCase()

  function traverse(nodes: TreeSelectNode[], level: number) {
    for (const node of nodes) {
      const value = getValue(node)
      const label = getLabel(node)
      const children = getChildren(node)
      const hasChildren = !!children && children.length > 0
      const isLeaf = node.isLeaf !== undefined ? node.isLeaf : !hasChildren
      const expanded = expandedKeys.value.includes(value)

      // Search filtering
      if (search) {
        const filterProp = props.treeNodeFilterProp ?? 'label'
        const filterFn = typeof props.filterTreeNode === 'function'
          ? props.filterTreeNode
          : (_input: string, treeNode: TreeSelectNode) => {
              const text = String((treeNode as any)[filterProp] ?? getLabel(treeNode))
              return text.toLowerCase().includes(_input.toLowerCase())
            }

        if (props.filterTreeNode !== false) {
          // Check if this node or any descendant matches
          const selfMatch = filterFn(currentSearchValue.value, node)
          let childMatch = false
          if (hasChildren) {
            childMatch = hasMatchingDescendant(children!, search, filterFn)
          }
          if (!selfMatch && !childMatch) continue
        }
      }

      result.push({
        node,
        level,
        isLeaf,
        expanded,
        hasChildren,
        value,
        label,
        disabled: !!node.disabled,
      })

      if (hasChildren && (expanded || search)) {
        traverse(children!, level + 1)
      }
    }
  }

  traverse(props.treeData ?? [], 0)
  return result
})

function hasMatchingDescendant(
  nodes: TreeSelectNode[],
  search: string,
  filterFn: (input: string, node: TreeSelectNode) => boolean,
): boolean {
  for (const node of nodes) {
    if (filterFn(search, node)) return true
    const children = getChildren(node)
    if (children && hasMatchingDescendant(children, search, filterFn)) return true
  }
  return false
}

// --- Node lookup ---
function findNode(value: string | number): TreeSelectNode | undefined {
  function search(nodes: TreeSelectNode[]): TreeSelectNode | undefined {
    for (const node of nodes) {
      if (getValue(node) === value) return node
      const children = getChildren(node)
      if (children) {
        const found = search(children)
        if (found) return found
      }
    }
    return undefined
  }
  return search(props.treeData ?? [])
}

// --- Selected labels ---
const selectedLabels = computed(() =>
  selectedValues.value.map((v) => {
    const node = findNode(v)
    return { value: v, label: node ? getLabel(node) : String(v) }
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
    internalSearchValue.value = ''
    emit('update:searchValue', '')
  }
}

// --- Toggle expand ---
function toggleExpand(value: string | number) {
  const keys = [...expandedKeys.value]
  const idx = keys.indexOf(value)
  if (idx >= 0) {
    keys.splice(idx, 1)
  } else {
    keys.push(value)
  }
  internalExpandedKeys.value = keys
  emit('update:treeExpandedKeys', keys)
  emit('treeExpand', keys)
}

// --- Selection ---
function selectNode(node: TreeSelectNode) {
  if (node.disabled) return

  const value = getValue(node)
  const label = getLabel(node)

  if (isMultiple.value) {
    const current = [...selectedValues.value]
    const idx = current.indexOf(value)
    if (idx >= 0) {
      current.splice(idx, 1)
    } else {
      current.push(value)
    }
    internalValue.value = current
    const outputValue = buildOutputValue(current)
    const labels = current.map((v) => {
      const n = findNode(v)
      return n ? getLabel(n) : String(v)
    })
    emit('update:value', outputValue)
    emit('change', outputValue, labels, { triggerValue: value })
    emit('select', value, node, {})
  } else {
    internalValue.value = [value]
    const outputValue = buildOutputValue([value])
    emit('update:value', outputValue)
    emit('change', outputValue, [label], { triggerValue: value })
    emit('select', value, node, {})
    setOpen(false)
  }
}

function buildOutputValue(values: (string | number)[]): TreeSelectValue {
  if (props.labelInValue) {
    const labeled = values.map((v) => {
      const node = findNode(v)
      return { value: v, label: node ? getLabel(node) : String(v) }
    })
    return isMultiple.value ? labeled : labeled[0] ?? null
  }
  return isMultiple.value ? values : values[0] ?? null
}

function removeTag(value: string | number) {
  if (props.disabled) return
  const current = selectedValues.value.filter((v) => v !== value)
  internalValue.value = current
  const outputValue = buildOutputValue(current)
  const labels = current.map((v) => {
    const node = findNode(v)
    return node ? getLabel(node) : String(v)
  })
  emit('update:value', outputValue)
  emit('change', outputValue, labels, {})
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
  if (e.target !== inputRef.value) e.preventDefault()
}

function handleInputChange(e: Event) {
  const val = (e.target as HTMLInputElement).value
  internalSearchValue.value = val
  emit('update:searchValue', val)
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
  emit('update:value', isMultiple.value ? [] : null)
  emit('change', isMultiple.value ? [] : null, [], {})
  emit('clear')
  internalSearchValue.value = ''
  emit('update:searchValue', '')
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Backspace' && isMultiple.value && !currentSearchValue.value && selectedValues.value.length) {
    removeTag(selectedValues.value[selectedValues.value.length - 1])
  }
  if (e.key === 'Escape') setOpen(false)
}

// --- Async load ---
async function handleLoadData(node: TreeSelectNode) {
  if (!props.loadData || node.loading) return
  node.loading = true
  try {
    await props.loadData(node)
  } finally {
    node.loading = false
  }
}

function handleExpandClick(e: MouseEvent, flatNode: FlatNode) {
  e.stopPropagation()
  toggleExpand(flatNode.value)

  // Lazy load
  if (!flatNode.isLeaf && !flatNode.hasChildren && props.loadData) {
    handleLoadData(flatNode.node)
  }
}

// --- Placement ---
const floatingPlacement = computed<Placement>(() => {
  const map: Record<TreeSelectPlacement, Placement> = {
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
  () => props.allowClear && selectedValues.value.length > 0 && !props.disabled,
)

const shouldShowArrow = computed(() => {
  if (props.showArrow !== undefined) return props.showArrow
  return !isMultiple.value
})

const showPlaceholder = computed(() => selectedValues.value.length === 0 && !currentSearchValue.value)

const selectorClasses = computed(() => ({
  'ant-select': true,
  'ant-tree-select': true,
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

const dropdownStyle = computed(() => {
  const style: Record<string, string> = { ...props.dropdownStyle }
  if (typeof props.dropdownMatchSelectWidth === 'number') {
    style.width = `${props.dropdownMatchSelectWidth}px`
  }
  return style
})

// Single label
const singleLabel = computed(() => {
  if (isMultiple.value) return ''
  return selectedLabels.value.length > 0 ? selectedLabels.value[0].label : ''
})

// Tags display
const displayTags = computed(() => {
  if (!isMultiple.value) return selectedLabels.value
  const max = props.maxTagCount
  if (max !== undefined && typeof max === 'number') return selectedLabels.value.slice(0, max)
  return selectedLabels.value
})

const omittedValues = computed(() => {
  if (!isMultiple.value || props.maxTagCount === undefined) return []
  return selectedLabels.value.slice(props.maxTagCount as number)
})

function isSelected(value: string | number): boolean {
  return selectedValues.value.includes(value)
}

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
    :popup-class="['ant-select-dropdown ant-tree-select-dropdown', popupClassName]"
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
    >
      <div class="ant-select-selector">
        <!-- Multiple mode -->
        <template v-if="isMultiple">
          <template v-for="tag in displayTags" :key="tag.value">
            <slot
              name="tagRender"
              :value="tag.value"
              :label="tag.label"
              :closable="!disabled"
              :on-close="() => removeTag(tag.value)"
            >
              <span class="ant-select-selection-item">
                <span class="ant-select-selection-item-content">{{ tag.label }}</span>
                <span
                  v-if="!disabled"
                  class="ant-select-selection-item-remove"
                  @click.stop="removeTag(tag.value)"
                >
                  <span class="ant-select-selection-item-remove-icon">&times;</span>
                </span>
              </span>
            </slot>
          </template>

          <span v-if="omittedValues.length > 0" class="ant-select-selection-item ant-select-selection-item-overflow">
            <slot name="maxTagPlaceholder" :omitted-values="omittedValues">
              + {{ omittedValues.length }} ...
            </slot>
          </span>

          <span class="ant-select-selection-search">
            <input
              ref="inputRef"
              class="ant-select-selection-search-input"
              :value="currentSearchValue"
              :disabled="disabled"
              autocomplete="off"
              role="combobox"
              :aria-expanded="mergedOpen"
              aria-haspopup="tree"
              @input="handleInputChange"
              @keydown="handleKeydown"
              @focus="handleFocus"
              @blur="handleBlur"
            />
          </span>

          <span v-if="showPlaceholder" class="ant-select-selection-placeholder">
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
              aria-haspopup="tree"
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
              :tabindex="-1"
              style="opacity: 0; width: 0; position: absolute"
              @focus="handleFocus"
              @blur="handleBlur"
            />
          </span>
          <span
            v-if="selectedValues.length > 0 && !currentSearchValue"
            class="ant-select-selection-item"
            :title="singleLabel"
          >
            {{ singleLabel }}
          </span>
          <span v-if="showPlaceholder" class="ant-select-selection-placeholder">
            <slot name="placeholder">{{ placeholder }}</slot>
          </span>
        </template>
      </div>

      <!-- Clear -->
      <span v-if="showClear" class="ant-select-clear" @click="handleClear">
        <span class="ant-select-clear-icon">&times;</span>
      </span>

      <!-- Arrow -->
      <span v-if="shouldShowArrow || props.loading" class="ant-select-arrow">
        <slot name="suffixIcon">
          <span v-if="loading" class="ant-select-arrow-loading"><span class="ant-select-arrow-loading-icon" /></span>
          <span v-else class="ant-select-arrow-icon" />
        </slot>
      </span>
    </div>

    <!-- Dropdown tree -->
    <template #popup>
      <div class="ant-tree-select-dropdown-content">
        <template v-if="flattenedNodes.length > 0">
          <div role="tree" class="ant-tree-select-tree">
            <div
              v-for="flat in flattenedNodes"
              :key="flat.value"
              :class="{
                'ant-tree-select-tree-node': true,
                'ant-tree-select-tree-node-selected': isSelected(flat.value),
                'ant-tree-select-tree-node-disabled': flat.disabled,
              }"
              :style="{ paddingLeft: `${flat.level * 20 + 4}px` }"
              role="treeitem"
              :aria-selected="isSelected(flat.value)"
              :aria-expanded="flat.hasChildren ? flat.expanded : undefined"
              :aria-disabled="flat.disabled"
            >
              <!-- Switcher / expand icon -->
              <span
                :class="{
                  'ant-tree-select-tree-switcher': true,
                  'ant-tree-select-tree-switcher-leaf': flat.isLeaf,
                  'ant-tree-select-tree-switcher-open': flat.expanded && !flat.isLeaf,
                  'ant-tree-select-tree-switcher-close': !flat.expanded && !flat.isLeaf,
                }"
                @click="handleExpandClick($event, flat)"
              >
                <template v-if="!flat.isLeaf">
                  <slot name="switcherIcon" :expanded="flat.expanded" :is-leaf="false">
                    <span class="ant-tree-select-tree-switcher-icon">{{ flat.expanded ? '▾' : '▸' }}</span>
                  </slot>
                </template>
              </span>

              <!-- Checkbox -->
              <span
                v-if="treeCheckable"
                :class="{
                  'ant-tree-select-tree-checkbox': true,
                  'ant-tree-select-tree-checkbox-checked': isSelected(flat.value),
                  'ant-tree-select-tree-checkbox-disabled': flat.disabled || flat.node.disableCheckbox,
                }"
                @click.stop="!(flat.disabled || flat.node.disableCheckbox) && selectNode(flat.node)"
              >
                <span class="ant-tree-select-tree-checkbox-inner" />
              </span>

              <!-- Content -->
              <span
                class="ant-tree-select-tree-node-content"
                @click="flat.node.selectable !== false && selectNode(flat.node)"
              >
                <slot name="title" v-bind="flat.node">
                  {{ flat.label }}
                </slot>
              </span>

              <!-- Loading indicator -->
              <span v-if="flat.node.loading" class="ant-tree-select-tree-node-loading">
                <span class="ant-select-arrow-loading-icon" />
              </span>
            </div>
          </div>
        </template>
        <div v-else class="ant-tree-select-empty">
          <slot name="notFoundContent">
            {{ notFoundContent ?? 'No data' }}
          </slot>
        </div>
      </div>
    </template>
  </Trigger>
</template>
