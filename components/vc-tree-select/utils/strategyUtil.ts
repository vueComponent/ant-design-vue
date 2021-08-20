import type { DataEntity } from '../../vc-tree/interface';
import type { RawValueType, Key, DataNode } from '../interface';
import { isCheckDisabled } from './valueUtil';

export const SHOW_ALL = 'SHOW_ALL';
export const SHOW_PARENT = 'SHOW_PARENT';
export const SHOW_CHILD = 'SHOW_CHILD';

export type CheckedStrategy = typeof SHOW_ALL | typeof SHOW_PARENT | typeof SHOW_CHILD;

export function formatStrategyKeys(
  keys: Key[],
  strategy: CheckedStrategy,
  keyEntities: Record<Key, DataEntity>,
): RawValueType[] {
  const keySet = new Set(keys);

  if (strategy === SHOW_CHILD) {
    return keys.filter(key => {
      const entity = keyEntities[key];

      if (
        entity &&
        entity.children &&
        entity.children.every(
          ({ node }) => isCheckDisabled(node) || keySet.has((node as DataNode).key),
        )
      ) {
        return false;
      }
      return true;
    });
  }
  if (strategy === SHOW_PARENT) {
    return keys.filter(key => {
      const entity = keyEntities[key];
      const parent = entity ? entity.parent : null;

      if (parent && !isCheckDisabled(parent.node) && keySet.has((parent.node as DataNode).key)) {
        return false;
      }
      return true;
    });
  }
  return keys;
}
