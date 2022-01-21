import type { MouseEventHandler } from '../../_util/EventInterface';
import { useInjectCascader } from '../context';

export interface CheckboxProps {
  prefixCls: string;
  checked?: boolean;
  halfChecked?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler;
}

export default function Checkbox({
  prefixCls,
  checked,
  halfChecked,
  disabled,
  onClick,
}: CheckboxProps) {
  const { customSlots, checkable } = useInjectCascader();

  const mergedCheckable = checkable.value !== false ? customSlots.value.checkable : checkable.value;
  const customCheckbox =
    typeof mergedCheckable === 'function'
      ? mergedCheckable()
      : typeof mergedCheckable === 'boolean'
      ? null
      : mergedCheckable;
  return (
    <span
      class={{
        [prefixCls]: true,
        [`${prefixCls}-checked`]: checked,
        [`${prefixCls}-indeterminate`]: !checked && halfChecked,
        [`${prefixCls}-disabled`]: disabled,
      }}
      onClick={onClick}
    >
      {customCheckbox}
    </span>
  );
}
Checkbox.props = ['prefixCls', 'checked', 'halfChecked', 'disabled', 'onClick'];
Checkbox.displayName = 'Checkbox';
Checkbox.inheritAttrs = false;
