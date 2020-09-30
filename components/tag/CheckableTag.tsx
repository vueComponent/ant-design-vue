import { inject, CSSProperties, SetupContext } from 'vue';
import classNames from '../_util/classNames';
import { defaultConfigProvider } from '../config-provider';

export interface CheckableTagProps {
  prefixCls?: string;
  class?: string;
  style?: CSSProperties;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  onClick?: (e: MouseEvent) => void;
}

const CheckableTag = (props: CheckableTagProps, { slots }: SetupContext) => {
  const { getPrefixCls } = inject('configProvider', defaultConfigProvider);
  const handleClick = (e: MouseEvent) => {
    const { checked, onChange, onClick } = props;
    if (onChange) {
      onChange(!checked);
    }
    if (onClick) {
      onClick(e);
    }
  };

  const { prefixCls: customizePrefixCls, checked } = props;
  const prefixCls = getPrefixCls('tag', customizePrefixCls);
  const cls = classNames(prefixCls, {
    [`${prefixCls}-checkable`]: true,
    [`${prefixCls}-checkable-checked`]: checked,
  });

  return (
    <span class={cls} onClick={handleClick}>
      {slots.default?.()}
    </span>
  );
};

export default CheckableTag;
