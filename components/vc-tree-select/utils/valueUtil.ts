import type {
  FlattenDataNode,
  Key,
  RawValueType,
  DataNode,
  DefaultValueType,
  LabelValueType,
  LegacyDataNode,
  FieldNames,
  InternalDataEntity,
} from '../interface';
import { fillLegacyProps } from './legacyUtil';
import type { SkipType } from '../hooks/useKeyValueMapping';
import type { FlattenNode } from '../../vc-tree/interface';
import { flattenTreeData } from '../../vc-tree/utils/treeUtil';
import type { FilterFunc } from '../../vc-select/interface/generator';

type CompatibleDataNode = Omit<FlattenDataNode, 'level'>;

export function toArray<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  return value !== undefined ? [value] : [];
}

/**
 * Fill `fieldNames` with default field names.
 *
 * @param fieldNames passed props
 * @param skipTitle Skip if no need fill `title`. This is useful since we have 2 name as same title level
 * @returns
 */
export function fillFieldNames(fieldNames?: FieldNames, skipTitle = false) {
  const { label, value, children } = fieldNames || {};

  const filledNames: FieldNames = {
    value: value || 'value',
    children: children || 'children',
  };

  if (!skipTitle || label) {
    filledNames.label = label || 'label';
  }

  return filledNames;
}

export function findValueOption(values: RawValueType[], options: CompatibleDataNode[]): DataNode[] {
  const optionMap: Map<RawValueType, DataNode> = new Map();

  options.forEach(flattenItem => {
    const { data, value } = flattenItem;
    optionMap.set(value, data.node);
  });

  return values.map(val => fillLegacyProps(optionMap.get(val)));
}

export function isValueDisabled(value: RawValueType, options: CompatibleDataNode[]): boolean {
  const option = findValueOption([value], options)[0];
  if (option) {
    return option.disabled;
  }

  return false;
}

export function isCheckDisabled(node: DataNode) {
  return node.disabled || node.disableCheckbox || node.checkable === false;
}

interface TreeDataNode extends InternalDataEntity {
  key: Key;
  children?: TreeDataNode[];
}

function getLevel({ parent }: FlattenNode): number {
  let level = 0;
  let current = parent;

  while (current) {
    current = current.parent;
    level += 1;
  }

  return level;
}

/**
 * Before reuse `rc-tree` logic, we need to add key since TreeSelect use `value` instead of `key`.
 */
export function flattenOptions(options: any): FlattenDataNode[] {
  const typedOptions = options as InternalDataEntity[];

  // Add missing key
  function fillKey(list: InternalDataEntity[]): TreeDataNode[] {
    return (list || []).map(node => {
      const { value, key, children } = node;

      const clone: TreeDataNode = {
        ...node,
        key: 'key' in node ? key : value,
      };

      if (children) {
        clone.children = fillKey(children);
      }

      return clone;
    });
  }

  const flattenList = flattenTreeData(fillKey(typedOptions), true, null);

  const cacheMap = new Map<Key, FlattenDataNode>();
  const flattenDateNodeList: (FlattenDataNode & { parentKey?: Key })[] = flattenList.map(option => {
    const { data, key, value } = option as any as Omit<FlattenNode, 'data'> & {
      value: RawValueType;
      data: InternalDataEntity;
    };

    const flattenNode = {
      key,
      value,
      data,
      level: getLevel(option),
      parentKey: option.parent?.data.key,
    };

    cacheMap.set(key, flattenNode);

    return flattenNode;
  });

  // Fill parent
  flattenDateNodeList.forEach(flattenNode => {
    // eslint-disable-next-line no-param-reassign
    flattenNode.parent = cacheMap.get(flattenNode.parentKey);
  });

  return flattenDateNodeList;
}

function getDefaultFilterOption(optionFilterProp: string) {
  return (searchValue: string, dataNode: LegacyDataNode) => {
    const value = dataNode[optionFilterProp];

    return String(value).toLowerCase().includes(String(searchValue).toLowerCase());
  };
}

/** Filter options and return a new options by the search text */
export function filterOptions(
  searchValue: string,
  options: DataNode[],
  {
    optionFilterProp,
    filterOption,
  }: {
    optionFilterProp: string;
    filterOption: boolean | FilterFunc<LegacyDataNode>;
  },
): DataNode[] {
  if (filterOption === false) {
    return options;
  }

  let filterOptionFunc: FilterFunc<LegacyDataNode>;
  if (typeof filterOption === 'function') {
    filterOptionFunc = filterOption;
  } else {
    filterOptionFunc = getDefaultFilterOption(optionFilterProp);
  }

  function dig(list: DataNode[], keepAll = false) {
    return list
      .map(dataNode => {
        const { children } = dataNode;

        const match = keepAll || filterOptionFunc(searchValue, fillLegacyProps(dataNode));
        const childList = dig(children || [], match);

        if (match || childList.length) {
          return {
            ...dataNode,
            children: childList,
          };
        }
        return null;
      })
      .filter(node => node);
  }

  return dig(options);
}

export function getRawValueLabeled(
  values: RawValueType[],
  prevValue: DefaultValueType,
  getEntityByValue: (
    value: RawValueType,
    skipType?: SkipType,
    ignoreDisabledCheck?: boolean,
  ) => FlattenDataNode,
  getLabelProp: (entity: FlattenDataNode) => any,
): LabelValueType[] {
  const valueMap = new Map<RawValueType, LabelValueType>();

  toArray(prevValue).forEach(item => {
    if (item && typeof item === 'object' && 'value' in item) {
      valueMap.set(item.value, item);
    }
  });

  return values.map(val => {
    const item: LabelValueType = { value: val };
    const entity = getEntityByValue(val, 'select', true);
    const label = entity ? getLabelProp(entity) : val;

    if (valueMap.has(val)) {
      const labeledValue = valueMap.get(val);
      item.label = 'label' in labeledValue ? labeledValue.label : label;
      if ('halfChecked' in labeledValue) {
        item.halfChecked = labeledValue.halfChecked;
      }
    } else {
      item.label = label;
    }

    return item;
  });
}

export function addValue(rawValues: RawValueType[], value: RawValueType) {
  const values = new Set(rawValues);
  values.add(value);
  return Array.from(values);
}
export function removeValue(rawValues: RawValueType[], value: RawValueType) {
  const values = new Set(rawValues);
  values.delete(value);
  return Array.from(values);
}
