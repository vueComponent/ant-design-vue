import { inject, CSSProperties, SetupContext } from 'vue';
import classNames from 'classnames';
import { ConfigConsumerProps } from '../config-provider';

export interface CheckableTagProps {
  prefixCls?: string;
  class?: string;
  style?: CSSProperties;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  onClick?: (e: Event) => void;
}

const CheckableTag = (props: CheckableTagProps, { slots }: SetupContext) => {
  const { getPrefixCls } = inject('configProvider', ConfigConsumerProps);
  const handleClick = (e: Event) => {
    const { checked, onChange, onClick } = props;
    if (onChange) {
      onChange(!checked);
    }
    if (onClick) {
      onClick(e);
    }
  };

  const { prefixCls: customizePrefixCls, class: className, checked } = props;
  const prefixCls = getPrefixCls('tag', customizePrefixCls);
  const cls = classNames(
    prefixCls,
    {
      [`${prefixCls}-checkable`]: true,
      [`${prefixCls}-checkable-checked`]: checked,
    },
    className,
  );

  return (
    <span class={cls} onClick={handleClick}>
      {slots.default?.()}
    </span>
  );
};

export default CheckableTag;
