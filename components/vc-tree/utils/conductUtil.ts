import { note } from '../../vc-util/warning';
import type { Key, DataEntity, DataNode, GetCheckDisabled, BasicDataNode } from '../interface';

interface ConductReturnType {
  checkedKeys: Key[];
  halfCheckedKeys: Key[];
}

function removeFromCheckedKeys(halfCheckedKeys: Set<Key>, checkedKeys: Set<Key>) {
  const filteredKeys = new Set<Key>();
  halfCheckedKeys.forEach(key => {
    if (!checkedKeys.has(key)) {
      filteredKeys.add(key);
    }
  });
  return filteredKeys;
}

export function isCheckDisabled<TreeDataType>(node: TreeDataType) {
  const { disabled, disableCheckbox, checkable } = (node || {}) as DataNode;
  return !!(disabled || disableCheckbox) || checkable === false;
}

// Fill miss keys
function fillConductCheck<TreeDataType extends BasicDataNode = DataNode>(
  keys: Set<Key>,
  levelEntities: Map<number, Set<DataEntity<TreeDataType>>>,
  maxLevel: number,
  syntheticGetCheckDisabled: GetCheckDisabled<TreeDataType>,
): ConductReturnType {
  const checkedKeys = new Set<Key>(keys);
  const halfCheckedKeys = new Set<Key>();

  // Add checked keys top to bottom
  for (let level = 0; level <= maxLevel; level += 1) {
    const entities = levelEntities.get(level) || new Set();
    entities.forEach(entity => {
      const { key, node, children = [] } = entity;

      if (checkedKeys.has(key) && !syntheticGetCheckDisabled(node)) {
        children
          .filter(childEntity => !syntheticGetCheckDisabled(childEntity.node))
          .forEach(childEntity => {
            checkedKeys.add(childEntity.key);
          });
      }
    });
  }

  // Add checked keys from bottom to top
  const visitedKeys = new Set<Key>();
  for (let level = maxLevel; level >= 0; level -= 1) {
    const entities = levelEntities.get(level) || new Set();
    entities.forEach(entity => {
      const { parent, node } = entity;

      // Skip if no need to check
      if (syntheticGetCheckDisabled(node) || !entity.parent || visitedKeys.has(entity.parent.key)) {
        return;
      }

      // Skip if parent is disabled
      if (syntheticGetCheckDisabled(entity.parent.node)) {
        visitedKeys.add(parent.key);
        return;
      }

      let allChecked = true;
      let partialChecked = false;

      (parent.children || [])
        .filter(childEntity => !syntheticGetCheckDisabled(childEntity.node))
        .forEach(({ key }) => {
          const checked = checkedKeys.has(key);
          if (allChecked && !checked) {
            allChecked = false;
          }
          if (!partialChecked && (checked || halfCheckedKeys.has(key))) {
            partialChecked = true;
          }
        });

      if (allChecked) {
        checkedKeys.add(parent.key);
      }
      if (partialChecked) {
        halfCheckedKeys.add(parent.key);
      }

      visitedKeys.add(parent.key);
    });
  }

  return {
    checkedKeys: Array.from(checkedKeys),
    halfCheckedKeys: Array.from(removeFromCheckedKeys(halfCheckedKeys, checkedKeys)),
  };
}

// Remove useless key
function cleanConductCheck<TreeDataType extends BasicDataNode = DataNode>(
  keys: Set<Key>,
  halfKeys: Key[],
  levelEntities: Map<number, Set<DataEntity<TreeDataType>>>,
  maxLevel: number,
  syntheticGetCheckDisabled: GetCheckDisabled<TreeDataType>,
): ConductReturnType {
  const checkedKeys = new Set<Key>(keys);
  let halfCheckedKeys = new Set<Key>(halfKeys);

  // Remove checked keys from top to bottom
  for (let level = 0; level <= maxLevel; level += 1) {
    const entities = levelEntities.get(level) || new Set();
    entities.forEach(entity => {
      const { key, node, children = [] } = entity;

      if (!checkedKeys.has(key) && !halfCheckedKeys.has(key) && !syntheticGetCheckDisabled(node)) {
        children
          .filter(childEntity => !syntheticGetCheckDisabled(childEntity.node))
          .forEach(childEntity => {
            checkedKeys.delete(childEntity.key);
          });
      }
    });
  }

  // Remove checked keys form bottom to top
  halfCheckedKeys = new Set<Key>();
  const visitedKeys = new Set<Key>();
  for (let level = maxLevel; level >= 0; level -= 1) {
    const entities = levelEntities.get(level) || new Set();

    entities.forEach(entity => {
      const { parent, node } = entity;

      // Skip if no need to check
      if (syntheticGetCheckDisabled(node) || !entity.parent || visitedKeys.has(entity.parent.key)) {
        return;
      }

      // Skip if parent is disabled
      if (syntheticGetCheckDisabled(entity.parent.node)) {
        visitedKeys.add(parent.key);
        return;
      }

      let allChecked = true;
      let partialChecked = false;

      (parent.children || [])
        .filter(childEntity => !syntheticGetCheckDisabled(childEntity.node))
        .forEach(({ key }) => {
          const checked = checkedKeys.has(key);
          if (allChecked && !checked) {
            allChecked = false;
          }
          if (!partialChecked && (checked || halfCheckedKeys.has(key))) {
            partialChecked = true;
          }
        });

      if (!allChecked) {
        checkedKeys.delete(parent.key);
      }
      if (partialChecked) {
        halfCheckedKeys.add(parent.key);
      }

      visitedKeys.add(parent.key);
    });
  }

  return {
    checkedKeys: Array.from(checkedKeys),
    halfCheckedKeys: Array.from(removeFromCheckedKeys(halfCheckedKeys, checkedKeys)),
  };
}

/**
 * Conduct with keys.
 * @param keyList current key list
 * @param keyEntities key - dataEntity map
 * @param mode `fill` to fill missing key, `clean` to remove useless key
 */
export function conductCheck<TreeDataType extends BasicDataNode = DataNode>(
  keyList: Key[],
  checked: true | { checked: false; halfCheckedKeys: Key[] },
  keyEntities: Record<Key, DataEntity<TreeDataType>>,
  maxLevel: number,
  levelEntities: Map<number, Set<DataEntity<TreeDataType>>>,
  getCheckDisabled?: GetCheckDisabled<TreeDataType>,
): ConductReturnType {
  const warningMissKeys: Key[] = [];

  let syntheticGetCheckDisabled: GetCheckDisabled<TreeDataType>;
  if (getCheckDisabled) {
    syntheticGetCheckDisabled = getCheckDisabled;
  } else {
    syntheticGetCheckDisabled = isCheckDisabled;
  }

  // We only handle exist keys
  const keys = new Set<Key>(
    keyList.filter(key => {
      const hasEntity = !!keyEntities[key];
      if (!hasEntity) {
        warningMissKeys.push(key);
      }

      return hasEntity;
    }),
  );

  note(
    !warningMissKeys.length,
    `Tree missing follow keys: ${warningMissKeys
      .slice(0, 100)
      .map(key => `'${key}'`)
      .join(', ')}`,
  );

  let result: ConductReturnType;
  if (checked === true) {
    result = fillConductCheck<TreeDataType>(
      keys,
      levelEntities,
      maxLevel,
      syntheticGetCheckDisabled,
    );
  } else {
    result = cleanConductCheck(
      keys,
      checked.halfCheckedKeys,
      levelEntities,
      maxLevel,
      syntheticGetCheckDisabled,
    );
  }

  return result;
}
