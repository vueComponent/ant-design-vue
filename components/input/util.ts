import type { Direction, SizeType } from '../config-provider';
import classNames from '../_util/classNames';

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

export function hasPrefixSuffix(propsAndSlots: any) {
  return !!(propsAndSlots.prefix || propsAndSlots.suffix || propsAndSlots.allowClear);
}
