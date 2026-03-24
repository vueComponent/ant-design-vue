import { computed, ref, watch, getCurrentInstance } from 'vue'
import type { Key, TreeDataNode, FieldNames, FlatNode, EventDataNode } from './types'

// ---------------------------------------------------------------------------
// Field name helpers
// ---------------------------------------------------------------------------

export function useFieldNames(fieldNames: () => FieldNames | undefined) {
  const fKey = computed(() => fieldNames()?.key ?? 'key')
  const fTitle = computed(() => fieldNames()?.title ?? 'title')
  const fChildren = computed(() => fieldNames()?.children ?? 'children')

  function getKey(node: any): Key {
    return node[fKey.value] ?? node.key
  }
  function getTitle(node: any): string {
    return String(node[fTitle.value] ?? node.title ?? node[fKey.value] ?? '')
  }
  function getChildren(node: any): TreeDataNode[] | undefined {
    return node[fChildren.value] ?? node.children
  }

  return { fKey, fTitle, fChildren, getKey, getTitle, getChildren }
}

// ---------------------------------------------------------------------------
// Controlled/uncontrolled state pattern
// ---------------------------------------------------------------------------

export function useControlledState<T>(
  propGetter: () => T | undefined,
  defaultValue: T,
) {
  const instance = getCurrentInstance()!
  const internal = ref(defaultValue) as { value: T }

  // Watch prop changes
  watch(propGetter, (v) => {
    if (v !== undefined) internal.value = v
  })

  const merged = computed(() => {
    const propVal = propGetter()
    return propVal !== undefined ? propVal : internal.value
  })

  return { value: merged, setInternalValue: (v: T) => { internal.value = v } }
}

// ---------------------------------------------------------------------------
// Flatten tree
// ---------------------------------------------------------------------------

export function useFlattenedTree(
  treeData: () => TreeDataNode[] | undefined,
  expandedKeys: () => Key[],
  fields: ReturnType<typeof useFieldNames>,
  filterFn?: () => ((node: TreeDataNode) => boolean) | undefined,
) {
  return computed<FlatNode[]>(() => {
    const result: FlatNode[] = []
    const expandedSet = new Set(expandedKeys())
    const filter = filterFn?.()

    function traverse(nodes: TreeDataNode[], level: number, pos: string, parent: FlatNode | null) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        const key = fields.getKey(node)
        const title = fields.getTitle(node)
        const children = fields.getChildren(node)
        const hasChildren = !!children && children.length > 0
        const isLeaf = node.isLeaf !== undefined ? node.isLeaf : !hasChildren
        const expanded = expandedSet.has(key)
        const nodePos = pos ? `${pos}-${i}` : `${i}`

        // If filtering, skip nodes that don't match and have no matching descendants
        if (filter) {
          const selfMatch = filter(node)
          const childMatch = hasChildren && hasMatchingDescendant(children!, fields, filter)
          if (!selfMatch && !childMatch) continue
        }

        const flat: FlatNode = {
          key,
          title,
          node,
          level,
          isLeaf,
          expanded,
          hasChildren,
          disabled: !!node.disabled,
          disableCheckbox: !!node.disableCheckbox,
          selectable: node.selectable !== false,
          pos: nodePos,
          parent,
        }
        result.push(flat)

        if (hasChildren && (expanded || filter)) {
          traverse(children!, level + 1, nodePos, flat)
        }
      }
    }

    traverse(treeData() ?? [], 0, '', null)
    return result
  })
}

function hasMatchingDescendant(
  nodes: TreeDataNode[],
  fields: ReturnType<typeof useFieldNames>,
  filter: (node: TreeDataNode) => boolean,
): boolean {
  for (const node of nodes) {
    if (filter(node)) return true
    const children = fields.getChildren(node)
    if (children && hasMatchingDescendant(children, fields, filter)) return true
  }
  return false
}

// ---------------------------------------------------------------------------
// Check propagation
// ---------------------------------------------------------------------------

interface CheckResult {
  checkedKeys: Key[]
  halfCheckedKeys: Key[]
}

export function useCheckState(
  treeData: () => TreeDataNode[] | undefined,
  fields: ReturnType<typeof useFieldNames>,
  checkStrictly: () => boolean,
) {
  // Build key→children and key→parent maps for propagation
  function buildMaps() {
    const keyToChildren = new Map<Key, Key[]>()
    const keyToParent = new Map<Key, Key>()
    const keyToNode = new Map<Key, TreeDataNode>()
    const allKeys: Key[] = []

    function traverse(nodes: TreeDataNode[], parentKey: Key | null) {
      for (const node of nodes) {
        const key = fields.getKey(node)
        const children = fields.getChildren(node)
        keyToNode.set(key, node)
        allKeys.push(key)

        if (parentKey !== null) {
          keyToParent.set(key, parentKey)
        }

        const childKeys: Key[] = []
        if (children && children.length > 0) {
          for (const child of children) {
            childKeys.push(fields.getKey(child))
          }
          keyToChildren.set(key, childKeys)
          traverse(children, key)
        }
      }
    }

    traverse(treeData() ?? [], null)
    return { keyToChildren, keyToParent, keyToNode, allKeys }
  }

  // Get all descendant keys (not disabled)
  function getAllDescendants(key: Key, maps: ReturnType<typeof buildMaps>): Key[] {
    const result: Key[] = []
    const stack = maps.keyToChildren.get(key) ?? []
    const visited = new Set<Key>()
    for (const childKey of stack) {
      if (visited.has(childKey)) continue
      visited.add(childKey)
      const node = maps.keyToNode.get(childKey)
      if (node && !node.disabled && !node.disableCheckbox) {
        result.push(childKey)
      }
      const grandChildren = maps.keyToChildren.get(childKey)
      if (grandChildren) {
        for (const gc of grandChildren) stack.push(gc)
      }
    }
    return result
  }

  // Propagate check state from leaf to root
  function propagateUp(checkedSet: Set<Key>, maps: ReturnType<typeof buildMaps>): CheckResult {
    const halfCheckedSet = new Set<Key>()

    // Walk all keys with children to determine half-checked
    for (const [parentKey, childKeys] of Array.from(maps.keyToChildren)) {
      const node = maps.keyToNode.get(parentKey)
      if (node?.disabled || node?.disableCheckbox) continue

      // Get all descendants that are checkable
      const allDescs = getAllDescendants(parentKey, maps)
      if (allDescs.length === 0) continue

      const allChecked = allDescs.every((k) => checkedSet.has(k))
      const someChecked = allDescs.some((k) => checkedSet.has(k))

      if (allChecked) {
        checkedSet.add(parentKey)
        halfCheckedSet.delete(parentKey)
      } else if (someChecked) {
        checkedSet.delete(parentKey)
        halfCheckedSet.add(parentKey)
      } else {
        checkedSet.delete(parentKey)
        halfCheckedSet.delete(parentKey)
      }
    }

    return {
      checkedKeys: Array.from(checkedSet),
      halfCheckedKeys: Array.from(halfCheckedSet),
    }
  }

  /** Toggle a node's check state with propagation */
  function toggleCheck(
    key: Key,
    checked: boolean,
    currentChecked: Key[],
  ): CheckResult {
    if (checkStrictly()) {
      // No propagation in strict mode
      const set = new Set(currentChecked)
      if (checked) set.add(key)
      else set.delete(key)
      return { checkedKeys: Array.from(set), halfCheckedKeys: [] }
    }

    const maps = buildMaps()
    const checkedSet = new Set(currentChecked)

    // Toggle self
    if (checked) checkedSet.add(key)
    else checkedSet.delete(key)

    // Propagate down: check/uncheck all descendants
    const descendants = getAllDescendants(key, maps)
    for (const desc of descendants) {
      if (checked) checkedSet.add(desc)
      else checkedSet.delete(desc)
    }

    // Propagate up
    return propagateUp(checkedSet, maps)
  }

  /** Compute initial check state from raw keys (resolves propagation) */
  function resolveCheckedKeys(rawKeys: Key[]): CheckResult {
    if (checkStrictly()) {
      return { checkedKeys: [...rawKeys], halfCheckedKeys: [] }
    }

    const maps = buildMaps()
    const checkedSet = new Set(rawKeys)

    // Propagate down for each checked key
    for (const key of rawKeys) {
      const node = maps.keyToNode.get(key)
      if (node?.disabled || node?.disableCheckbox) continue
      const descendants = getAllDescendants(key, maps)
      for (const desc of descendants) {
        checkedSet.add(desc)
      }
    }

    return propagateUp(checkedSet, maps)
  }

  return { toggleCheck, resolveCheckedKeys }
}

// ---------------------------------------------------------------------------
// Build EventDataNode from FlatNode
// ---------------------------------------------------------------------------

export function buildEventDataNode(
  flat: FlatNode,
  opts: {
    selectedKeys: Set<Key>
    checkedKeys: Set<Key>
    halfCheckedKeys: Set<Key>
    loadedKeys: Set<Key>
    loadingKeys: Set<Key>
  },
): EventDataNode {
  return {
    ...flat.node,
    key: flat.key,
    isLeaf: flat.isLeaf,
    expanded: flat.expanded,
    selected: opts.selectedKeys.has(flat.key),
    checked: opts.checkedKeys.has(flat.key),
    halfChecked: opts.halfCheckedKeys.has(flat.key),
    loaded: opts.loadedKeys.has(flat.key),
    loading: opts.loadingKeys.has(flat.key),
    pos: flat.pos,
    parent: flat.parent?.node,
  }
}

// ---------------------------------------------------------------------------
// Expand helpers
// ---------------------------------------------------------------------------

export function getAllKeys(
  treeData: TreeDataNode[] | undefined,
  fields: ReturnType<typeof useFieldNames>,
): Key[] {
  const keys: Key[] = []
  function traverse(nodes: TreeDataNode[]) {
    for (const node of nodes) {
      keys.push(fields.getKey(node))
      const children = fields.getChildren(node)
      if (children && children.length > 0) traverse(children)
    }
  }
  traverse(treeData ?? [])
  return keys
}

export function getParentKeys(
  key: Key,
  treeData: TreeDataNode[] | undefined,
  fields: ReturnType<typeof useFieldNames>,
): Key[] {
  const parents: Key[] = []
  function traverse(nodes: TreeDataNode[], ancestors: Key[]): boolean {
    for (const node of nodes) {
      const nodeKey = fields.getKey(node)
      if (nodeKey === key) {
        parents.push(...ancestors)
        return true
      }
      const children = fields.getChildren(node)
      if (children && children.length > 0) {
        if (traverse(children, [...ancestors, nodeKey])) return true
      }
    }
    return false
  }
  traverse(treeData ?? [], [])
  return parents
}

// ---------------------------------------------------------------------------
// Range keys for DirectoryTree shift+click
// ---------------------------------------------------------------------------

export function calcRangeKeys(
  flatNodes: FlatNode[],
  startKey: Key,
  endKey: Key,
): Key[] {
  let started = false
  const keys: Key[] = []
  for (const flat of flatNodes) {
    if (flat.key === startKey || flat.key === endKey) {
      keys.push(flat.key)
      if (started) break
      started = true
      continue
    }
    if (started) {
      keys.push(flat.key)
    }
  }
  return keys
}
