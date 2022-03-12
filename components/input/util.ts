import type { Direction, SizeType } from '../config-provider';
import classNames from '../_util/classNames';
import { filterEmpty } from '../_util/props-util';

export function getInputClassName(
  prefixCls: string,
  bordered: boolean,
  size?: SizeType,
  disabled?: boolean,
  direction?: Direction,
) {
  return classNames(prefixCls, {
    [`${prefixCls}-sm`]: size === 'small',
    [`${prefixCls}-lg`]: size === 'large',
    [`${prefixCls}-disabled`]: disabled,
    [`${prefixCls}-rtl`]: direction === 'rtl',
    [`${prefixCls}-borderless`]: !bordered,
  });
}
const isValid = (value: any) => {
  return (
    value !== undefined &&
    value !== null &&
    (Array.isArray(value) ? filterEmpty(value).length : true)
  );
};

export function hasPrefixSuffix(propsAndSlots: any) {
  return (
    isValid(propsAndSlots.prefix) ||
    isValid(propsAndSlots.suffix) ||
    isValid(propsAndSlots.allowClear)
  );
}

export function hasAddon(propsAndSlots: any) {
  return isValid(propsAndSlots.addonBefore) || isValid(propsAndSlots.addonAfter);
}
