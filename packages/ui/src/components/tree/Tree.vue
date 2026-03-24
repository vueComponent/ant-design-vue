<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount, nextTick, useSlots } from 'vue'
import { VirtualList } from '@/_internal/virtual-list'
import type {
  TreeProps, TreeEmits, TreeSlots,
  Key, TreeDataNode, FlatNode, EventDataNode,
} from './types'
import { treeDefaultProps } from './types'
import {
  useFieldNames,
  useFlattenedTree,
  useCheckState,
  buildEventDataNode,
  getAllKeys,
  getParentKeys,
} from './composables'

defineOptions({ name: 'ATree', inheritAttrs: false })

const props = withDefaults(defineProps<TreeProps>(), treeDefaultProps)
const emit = defineEmits<TreeEmits>()
defineSlots<TreeSlots>()
const slots = useSlots()

// --- Field names ---
const fields = useFieldNames(() => props.fieldNames)

// --- Expanded keys ---
const internalExpanded = ref<Key[]>(
  props.expandedKeys
    ?? props.defaultExpandedKeys
    ?? (props.defaultExpandAll ? getAllKeys(props.treeData, fields) : []),
)

watch(() => props.expandedKeys, (v) => {
  if (v !== undefined) internalExpanded.value = [...v]
})

watch(() => props.treeData, () => {
  // If defaultExpandAll, re-expand when data changes (lazy load scenario)
  if (props.defaultExpandAll && props.expandedKeys === undefined) {
    internalExpanded.value = getAllKeys(props.treeData, fields)
  }
}, { deep: true })

const expandedKeys = computed(() =>
  props.expandedKeys !== undefined ? props.expandedKeys : internalExpanded.value,
)

// Auto expand parent
if (props.autoExpandParent && expandedKeys.value.length > 0) {
  const parentKeys = new Set<Key>()
  for (const key of expandedKeys.value) {
    for (const pk of getParentKeys(key, props.treeData, fields)) {
      parentKeys.add(pk)
    }
  }
  if (parentKeys.size > 0) {
    const merged = new Set([...expandedKeys.value, ...Array.from(parentKeys)])
    internalExpanded.value = Array.from(merged)
  }
}

// --- Selected keys ---
const internalSelected = ref<Key[]>(props.selectedKeys ?? props.defaultSelectedKeys ?? [])

watch(() => props.selectedKeys, (v) => {
  if (v !== undefined) internalSelected.value = [...v]
})

const selectedKeys = computed(() =>
  props.selectedKeys !== undefined ? props.selectedKeys : internalSelected.value,
)
const selectedSet = computed(() => new Set(selectedKeys.value))

// --- Checked keys ---
const { toggleCheck, resolveCheckedKeys } = useCheckState(
  () => props.treeData,
  fields,
  () => props.checkStrictly,
)

function parseCheckedKeys(raw: Key[] | { checked: Key[]; halfChecked: Key[] } | undefined): Key[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  return raw.checked ?? []
}

const initialChecked = resolveCheckedKeys(
  parseCheckedKeys(props.checkedKeys ?? props.defaultCheckedKeys),
)

const internalChecked = ref<Key[]>(initialChecked.checkedKeys)
const internalHalfChecked = ref<Key[]>(initialChecked.halfCheckedKeys)

watch(() => props.checkedKeys, (v) => {
  if (v !== undefined) {
    const resolved = resolveCheckedKeys(parseCheckedKeys(v))
    internalChecked.value = resolved.checkedKeys
    internalHalfChecked.value = resolved.halfCheckedKeys
  }
})

const checkedKeys = computed(() =>
  props.checkedKeys !== undefined ? parseCheckedKeys(props.checkedKeys) : internalChecked.value,
)
const checkedSet = computed(() => new Set(checkedKeys.value))
const halfCheckedKeys = computed<Key[]>(() =>
  props.checkedKeys !== undefined
    ? (Array.isArray(props.checkedKeys) ? internalHalfChecked.value : (props.checkedKeys as any).halfChecked ?? [])
    : internalHalfChecked.value,
)
const halfCheckedSet = computed(() => new Set<Key>(halfCheckedKeys.value))

// --- Loaded & loading keys ---
const internalLoadedKeys = ref<Key[]>(props.loadedKeys ?? [])
const loadingKeys = ref<Key[]>([])

watch(() => props.loadedKeys, (v) => {
  if (v !== undefined) internalLoadedKeys.value = [...v]
})

const loadedSet = computed(() => new Set(internalLoadedKeys.value))
const loadingSet = computed(() => new Set(loadingKeys.value))

// --- Flatten tree ---
const flattenedNodes = useFlattenedTree(
  () => props.treeData,
  () => expandedKeys.value,
  fields,
  () => props.filterTreeNode,
)

// --- Active (focused) key for keyboard nav ---
const activeKey = ref<Key | null>(null)
const treeRef = ref<HTMLDivElement | null>(null)
const virtualListRef = ref<InstanceType<typeof VirtualList> | null>(null)

// --- Drag state ---
const dragNode = ref<FlatNode | null>(null)
const dragOverKey = ref<Key | null>(null)
const dropPosition = ref<-1 | 0 | 1>(0)

// --- Event data node builder ---
function getEventNode(flat: FlatNode): EventDataNode {
  return buildEventDataNode(flat, {
    selectedKeys: selectedSet.value,
    checkedKeys: checkedSet.value,
    halfCheckedKeys: halfCheckedSet.value,
    loadedKeys: loadedSet.value,
    loadingKeys: loadingSet.value,
  })
}

function findFlatByKey(key: Key): FlatNode | undefined {
  return flattenedNodes.value.find((f) => f.key === key)
}

// --- Expand ---
function handleExpand(flat: FlatNode, e: MouseEvent) {
  if (flat.isLeaf) return

  const key = flat.key
  const keys = [...expandedKeys.value]
  const idx = keys.indexOf(key)
  const expanded = idx < 0

  if (expanded) keys.push(key)
  else keys.splice(idx, 1)

  internalExpanded.value = keys
  emit('update:expandedKeys', keys)
  emit('expand', keys, { node: getEventNode(flat), expanded, nativeEvent: e })

  // Async load
  if (expanded && !flat.isLeaf && !flat.hasChildren && props.loadData) {
    handleLoadData(flat)
  }
}

// --- Select ---
function handleSelect(flat: FlatNode, e: MouseEvent) {
  if (flat.disabled || !flat.selectable || !props.selectable) return

  const key = flat.key
  let keys: Key[]

  if (props.multiple) {
    keys = [...selectedKeys.value]
    const idx = keys.indexOf(key)
    if (idx >= 0) keys.splice(idx, 1)
    else keys.push(key)
  } else {
    const wasSelected = selectedKeys.value.includes(key)
    keys = wasSelected ? [] : [key]
  }

  internalSelected.value = keys
  emit('update:selectedKeys', keys)

  const selectedNodes = keys.map((k) => {
    const f = findFlatByKey(k)
    return f?.node
  }).filter(Boolean) as TreeDataNode[]

  emit('select', keys, {
    event: 'select',
    selected: keys.includes(key),
    node: getEventNode(flat),
    selectedNodes,
    nativeEvent: e,
  })
}

// --- Check ---
function handleCheck(flat: FlatNode, e: MouseEvent) {
  if (flat.disabled || flat.disableCheckbox) return

  const checked = !checkedSet.value.has(flat.key)
  const result = toggleCheck(flat.key, checked, checkedKeys.value)

  internalChecked.value = result.checkedKeys
  internalHalfChecked.value = result.halfCheckedKeys

  const outputKeys = props.checkStrictly
    ? { checked: result.checkedKeys, halfChecked: result.halfCheckedKeys }
    : result.checkedKeys

  emit('update:checkedKeys', outputKeys)

  const checkedNodes = result.checkedKeys.map((k) => {
    const f = findFlatByKey(k)
    return f?.node
  }).filter(Boolean) as TreeDataNode[]

  emit('check', outputKeys, {
    event: 'check',
    checked,
    node: getEventNode(flat),
    checkedNodes,
    halfCheckedKeys: result.halfCheckedKeys,
    nativeEvent: e,
  })
}

// --- Async load ---
async function handleLoadData(flat: FlatNode) {
  if (!props.loadData || loadingSet.value.has(flat.key) || loadedSet.value.has(flat.key)) return

  loadingKeys.value = [...loadingKeys.value, flat.key]

  try {
    await props.loadData(getEventNode(flat))

    const loaded = [...internalLoadedKeys.value, flat.key]
    internalLoadedKeys.value = loaded
    emit('update:loadedKeys', loaded)
    emit('load', loaded, { event: 'load', node: getEventNode(flat) })
  } finally {
    loadingKeys.value = loadingKeys.value.filter((k) => k !== flat.key)
  }
}

// --- Drag and drop ---
function isDraggable(flat: FlatNode): boolean {
  if (!props.draggable) return false
  if (typeof props.draggable === 'function') return props.draggable(flat.node)
  return true
}

function handleDragStart(e: DragEvent, flat: FlatNode) {
  dragNode.value = flat
  e.dataTransfer?.setData('text/plain', String(flat.key))
  emit('dragstart', { event: e, node: getEventNode(flat) })
}

function handleDragEnter(e: DragEvent, flat: FlatNode) {
  e.preventDefault()
  dragOverKey.value = flat.key
  emit('dragenter', {
    event: e,
    node: getEventNode(flat),
    expandedKeys: expandedKeys.value,
  })
}

function handleDragOver(e: DragEvent, flat: FlatNode) {
  e.preventDefault()
  // Calculate drop position based on mouse Y position
  const target = (e.currentTarget as HTMLElement)
  const rect = target.getBoundingClientRect()
  const offsetY = e.clientY - rect.top
  const height = rect.height

  if (offsetY < height * 0.25) {
    dropPosition.value = -1 // before
  } else if (offsetY > height * 0.75) {
    dropPosition.value = 1 // after
  } else {
    dropPosition.value = 0 // inside
  }

  dragOverKey.value = flat.key
  emit('dragover', { event: e, node: getEventNode(flat) })
}

function handleDragLeave(e: DragEvent, flat: FlatNode) {
  if (dragOverKey.value === flat.key) {
    dragOverKey.value = null
  }
  emit('dragleave', { event: e, node: getEventNode(flat) })
}

function handleDragEnd(e: DragEvent, flat: FlatNode) {
  dragNode.value = null
  dragOverKey.value = null
  emit('dragend', { event: e, node: getEventNode(flat) })
}

function handleDrop(e: DragEvent, flat: FlatNode) {
  e.preventDefault()
  e.stopPropagation()

  if (!dragNode.value) return

  const dropNodeFlat = flat
  const dragFlat = dragNode.value
  const pos = dropPosition.value
  const dropToGap = pos !== 0

  // Check allowDrop
  if (props.allowDrop) {
    const allowed = props.allowDrop({
      dragNode: dragFlat.node,
      dropNode: dropNodeFlat.node,
      dropPosition: pos,
    })
    if (!allowed) return
  }

  // Collect all drag node descendant keys
  const dragNodesKeys: Key[] = [dragFlat.key]
  function collectKeys(nodes: TreeDataNode[] | undefined) {
    if (!nodes) return
    for (const node of nodes) {
      dragNodesKeys.push(fields.getKey(node))
      collectKeys(fields.getChildren(node))
    }
  }
  collectKeys(fields.getChildren(dragFlat.node))

  emit('drop', {
    event: e,
    node: getEventNode(dropNodeFlat),
    dragNode: getEventNode(dragFlat),
    dragNodesKeys,
    dropPosition: pos,
    dropToGap,
  })

  dragNode.value = null
  dragOverKey.value = null
}

// --- Right click ---
function handleRightClick(e: MouseEvent, flat: FlatNode) {
  emit('rightClick', { event: e, node: getEventNode(flat) })
}

// --- Keyboard navigation ---
function handleKeydown(e: KeyboardEvent) {
  const nodes = flattenedNodes.value
  if (nodes.length === 0) return

  const currentIdx = nodes.findIndex((f) => f.key === activeKey.value)

  switch (e.key) {
    case 'ArrowDown': {
      e.preventDefault()
      const nextIdx = currentIdx < nodes.length - 1 ? currentIdx + 1 : 0
      activeKey.value = nodes[nextIdx].key
      break
    }
    case 'ArrowUp': {
      e.preventDefault()
      const prevIdx = currentIdx > 0 ? currentIdx - 1 : nodes.length - 1
      activeKey.value = nodes[prevIdx].key
      break
    }
    case 'ArrowRight': {
      e.preventDefault()
      if (currentIdx >= 0) {
        const flat = nodes[currentIdx]
        if (!flat.isLeaf && !flat.expanded) {
          handleExpand(flat, e as any)
        } else if (flat.expanded && flat.hasChildren) {
          // Move to first child
          const nextIdx = currentIdx + 1
          if (nextIdx < nodes.length) activeKey.value = nodes[nextIdx].key
        }
      }
      break
    }
    case 'ArrowLeft': {
      e.preventDefault()
      if (currentIdx >= 0) {
        const flat = nodes[currentIdx]
        if (!flat.isLeaf && flat.expanded) {
          handleExpand(flat, e as any)
        } else if (flat.parent) {
          // Move to parent
          activeKey.value = flat.parent.key
        }
      }
      break
    }
    case 'Enter':
    case ' ': {
      e.preventDefault()
      if (currentIdx >= 0) {
        const flat = nodes[currentIdx]
        if (props.checkable) {
          handleCheck(flat, e as any)
        } else {
          handleSelect(flat, e as any)
        }
      }
      break
    }
    case 'Home': {
      e.preventDefault()
      if (nodes.length > 0) activeKey.value = nodes[0].key
      break
    }
    case 'End': {
      e.preventDefault()
      if (nodes.length > 0) activeKey.value = nodes[nodes.length - 1].key
      break
    }
  }
}

// --- Node click handler ---
function handleNodeClick(e: MouseEvent, flat: FlatNode) {
  // Set active key
  activeKey.value = flat.key

  // Selection
  handleSelect(flat, e)
}

// --- Node double click ---
function handleNodeDblClick(e: MouseEvent, flat: FlatNode) {
  // Toggle expand on double click
  if (!flat.isLeaf) {
    handleExpand(flat, e)
  }
}

// --- Switcher click ---
function handleSwitcherClick(e: MouseEvent, flat: FlatNode) {
  e.stopPropagation()
  handleExpand(flat, e)
}

// --- Checkbox click ---
function handleCheckboxClick(e: MouseEvent, flat: FlatNode) {
  e.stopPropagation()
  handleCheck(flat, e)
}

// --- Show line logic ---
const showLineConfig = computed(() => {
  if (!props.showLine) return null
  if (typeof props.showLine === 'object') return props.showLine
  return { showLeafIcon: false }
})

// --- Classes ---
const treeClasses = computed(() => ({
  'ant-tree': true,
  'ant-tree-show-line': !!props.showLine,
  'ant-tree-block-node': props.blockNode,
  'ant-tree-directory': false,
  'ant-tree-icon-hide': !props.showIcon,
}))

function nodeClasses(flat: FlatNode) {
  return {
    'ant-tree-treenode': true,
    'ant-tree-treenode-disabled': flat.disabled,
    'ant-tree-treenode-selected': selectedSet.value.has(flat.key),
    'ant-tree-treenode-active': activeKey.value === flat.key,
    'ant-tree-treenode-leaf-last': false,
    [`ant-tree-treenode-dragging`]: dragNode.value?.key === flat.key,
  }
}

function switcherClasses(flat: FlatNode) {
  return {
    'ant-tree-switcher': true,
    'ant-tree-switcher_open': flat.expanded && !flat.isLeaf,
    'ant-tree-switcher_close': !flat.expanded && !flat.isLeaf,
    'ant-tree-switcher-noop': flat.isLeaf,
    'ant-tree-switcher-leaf-line': !!showLineConfig.value && flat.isLeaf,
    'ant-tree-switcher-line-icon': !!showLineConfig.value && !flat.isLeaf,
  }
}

function checkboxClasses(flat: FlatNode) {
  return {
    'ant-tree-checkbox': true,
    'ant-tree-checkbox-checked': checkedSet.value.has(flat.key),
    'ant-tree-checkbox-indeterminate': halfCheckedSet.value.has(flat.key),
    'ant-tree-checkbox-disabled': flat.disabled || flat.disableCheckbox,
  }
}

function contentClasses(flat: FlatNode) {
  return {
    'ant-tree-node-content-wrapper': true,
    'ant-tree-node-content-wrapper-open': flat.expanded && !flat.isLeaf,
    'ant-tree-node-content-wrapper-close': !flat.expanded && !flat.isLeaf,
    'ant-tree-node-content-wrapper-normal': flat.isLeaf,
    'ant-tree-node-selected': selectedSet.value.has(flat.key),
  }
}

function dragOverClasses(flat: FlatNode) {
  if (dragOverKey.value !== flat.key) return {}
  return {
    'ant-tree-treenode-drag-over': dropPosition.value === 0,
    'ant-tree-treenode-drag-over-gap-top': dropPosition.value === -1,
    'ant-tree-treenode-drag-over-gap-bottom': dropPosition.value === 1,
  }
}

// --- Indent ---
function indentElements(flat: FlatNode) {
  const indents: { key: string; isLast: boolean }[] = []
  for (let i = 0; i < flat.level; i++) {
    indents.push({ key: `${flat.key}-indent-${i}`, isLast: false })
  }
  return indents
}

// --- Slot props builder ---
function getSlotProps(flat: FlatNode) {
  return {
    key: flat.key,
    title: flat.title,
    data: flat.node,
    expanded: flat.expanded,
    selected: selectedSet.value.has(flat.key),
    checked: checkedSet.value.has(flat.key),
    halfChecked: halfCheckedSet.value.has(flat.key),
    isLeaf: flat.isLeaf,
    disabled: flat.disabled,
    pos: flat.pos,
    loading: loadingSet.value.has(flat.key),
  }
}

// --- Virtual scroll ---
const useVirtual = computed(() => props.virtual && !!props.height)

// --- scrollTo exposed method ---
function scrollTo(info: { key: Key; align?: string; offset?: number }) {
  const idx = flattenedNodes.value.findIndex((f) => f.key === info.key)
  if (idx >= 0 && virtualListRef.value) {
    virtualListRef.value.scrollTo(idx)
  }
}

defineExpose({ scrollTo })
</script>

<template>
  <div
    ref="treeRef"
    :class="[treeClasses, $attrs.class]"
    :style="$attrs.style as any"
    role="tree"
    :tabindex="0"
    :aria-multiselectable="multiple || undefined"
    @keydown="handleKeydown"
  >
    <!-- Virtual scroll mode -->
    <template v-if="useVirtual">
      <VirtualList
        ref="virtualListRef"
        :data="flattenedNodes"
        :item-height="itemHeight!"
        :height="height!"
        item-key="key"
      >
        <template #default="{ item: flat, style }">
          <div
            :class="[nodeClasses(flat), dragOverClasses(flat), flat.node.class]"
            :style="[style, flat.node.style]"
            role="treeitem"
            :aria-expanded="flat.isLeaf ? undefined : flat.expanded"
            :aria-selected="selectedSet.has(flat.key)"
            :aria-checked="checkable ? checkedSet.has(flat.key) : undefined"
            :aria-disabled="flat.disabled"
            :aria-level="flat.level + 1"
            :draggable="isDraggable(flat) || undefined"
            @dragstart="isDraggable(flat) && handleDragStart($event, flat)"
            @dragenter="handleDragEnter($event, flat)"
            @dragover="handleDragOver($event, flat)"
            @dragleave="handleDragLeave($event, flat)"
            @dragend="handleDragEnd($event, flat)"
            @drop="handleDrop($event, flat)"
            @contextmenu="handleRightClick($event, flat)"
          >
            <!-- Indent -->
            <span v-for="indent in indentElements(flat)" :key="indent.key" :class="['ant-tree-indent-unit', { 'ant-tree-indent-unit-end': indent.isLast }]" aria-hidden="true" />

            <!-- Switcher -->
            <span
              :class="switcherClasses(flat)"
              @click="handleSwitcherClick($event, flat)"
            >
              <template v-if="!flat.isLeaf">
                <slot name="switcherIcon" :expanded="flat.expanded" :is-leaf="false" :loading="loadingSet.has(flat.key)">
                  <span v-if="loadingSet.has(flat.key)" class="ant-tree-switcher-loading-icon" />
                  <span v-else class="ant-tree-switcher-icon" />
                </slot>
              </template>
              <template v-else-if="showLineConfig?.showLeafIcon">
                <slot name="leafIcon">
                  <span class="ant-tree-switcher-leaf-icon" />
                </slot>
              </template>
            </span>

            <!-- Checkbox -->
            <span
              v-if="checkable && flat.node.checkable !== false"
              :class="checkboxClasses(flat)"
              @click="handleCheckboxClick($event, flat)"
            >
              <span class="ant-tree-checkbox-inner" />
            </span>

            <!-- Content -->
            <span
              :class="contentClasses(flat)"
              @click="handleNodeClick($event, flat)"
              @dblclick="handleNodeDblClick($event, flat)"
            >
              <!-- Icon -->
              <span v-if="showIcon" class="ant-tree-iconEle">
                <slot name="icon" v-bind="getSlotProps(flat)">
                  <span v-if="flat.node.icon" class="ant-tree-icon__customize">{{ flat.node.icon }}</span>
                </slot>
              </span>

              <!-- Title -->
              <span class="ant-tree-title">
                <slot name="title" v-bind="getSlotProps(flat)">
                  {{ flat.title }}
                </slot>
              </span>
            </span>
          </div>
        </template>
      </VirtualList>
    </template>

    <!-- Non-virtual mode -->
    <template v-else>
      <div
        v-for="flat in flattenedNodes"
        :key="flat.key"
        :class="[nodeClasses(flat), dragOverClasses(flat), flat.node.class]"
        :style="flat.node.style"
        role="treeitem"
        :aria-expanded="flat.isLeaf ? undefined : flat.expanded"
        :aria-selected="selectedSet.has(flat.key)"
        :aria-checked="checkable ? checkedSet.has(flat.key) : undefined"
        :aria-disabled="flat.disabled"
        :aria-level="flat.level + 1"
        :draggable="isDraggable(flat) || undefined"
        @dragstart="isDraggable(flat) && handleDragStart($event, flat)"
        @dragenter="handleDragEnter($event, flat)"
        @dragover="handleDragOver($event, flat)"
        @dragleave="handleDragLeave($event, flat)"
        @dragend="handleDragEnd($event, flat)"
        @drop="handleDrop($event, flat)"
        @contextmenu="handleRightClick($event, flat)"
      >
        <!-- Indent -->
        <span class="ant-tree-indent" aria-hidden="true">
          <span v-for="indent in indentElements(flat)" :key="indent.key" :class="['ant-tree-indent-unit', { 'ant-tree-indent-unit-end': indent.isLast }]" />
        </span>

        <!-- Switcher -->
        <span
          :class="switcherClasses(flat)"
          @click="handleSwitcherClick($event, flat)"
        >
          <template v-if="!flat.isLeaf">
            <slot name="switcherIcon" :expanded="flat.expanded" :is-leaf="false" :loading="loadingSet.has(flat.key)">
              <span v-if="loadingSet.has(flat.key)" class="ant-tree-switcher-loading-icon" />
              <span v-else class="ant-tree-switcher-icon" />
            </slot>
          </template>
          <template v-else-if="showLineConfig?.showLeafIcon">
            <slot name="leafIcon">
              <span class="ant-tree-switcher-leaf-icon" />
            </slot>
          </template>
        </span>

        <!-- Checkbox -->
        <span
          v-if="checkable && flat.node.checkable !== false"
          :class="checkboxClasses(flat)"
          @click="handleCheckboxClick($event, flat)"
        >
          <span class="ant-tree-checkbox-inner" />
        </span>

        <!-- Content -->
        <span
          :class="contentClasses(flat)"
          @click="handleNodeClick($event, flat)"
          @dblclick="handleNodeDblClick($event, flat)"
        >
          <!-- Icon -->
          <span v-if="showIcon" class="ant-tree-iconEle">
            <slot name="icon" v-bind="getSlotProps(flat)">
              <span v-if="flat.node.icon" class="ant-tree-icon__customize">{{ flat.node.icon }}</span>
            </slot>
          </span>

          <!-- Title -->
          <span class="ant-tree-title">
            <slot name="title" v-bind="getSlotProps(flat)">
              {{ flat.title }}
            </slot>
          </span>
        </span>
      </div>
    </template>
  </div>
</template>
