import type {
  DefaultOptionType,
  FieldNames,
  InternalFieldNames,
  SingleValueType,
} from '../Cascader';

export const VALUE_SPLIT = '__RC_CASCADER_SPLIT__';

export function toPathKey(value: SingleValueType) {
  return value.join(VALUE_SPLIT);
}

export function toPathKeys(value: SingleValueType[]) {
  return value.map(toPathKey);
}

export function toPathValueStr(pathKey: string) {
  return pathKey.split(VALUE_SPLIT);
}

export function fillFieldNames(fieldNames?: FieldNames): InternalFieldNames {
  const { label, value, children } = fieldNames || {};
  const val = value || 'value';
  return {
    label: label || 'label',
    value: val,
    key: val,
    children: children || 'children',
  };
}

export function isLeaf(option: DefaultOptionType, fieldNames: FieldNames) {
  return option.isLeaf ?? !option[fieldNames.children]?.length;
}
