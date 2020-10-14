import CalendarOutlined from '@ant-design/icons-vue/CalendarOutlined';
import { isValidElement } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import classNames from '../_util/classNames';

const InputIcon = (_: any, { attrs }) => {
  const { suffixIcon, prefixCls } = attrs;
  return (
    (suffixIcon && isValidElement(suffixIcon) ? (
      cloneElement(suffixIcon, {
        class: classNames({
          [suffixIcon.props?.class]: suffixIcon.props?.class,
          [`${prefixCls}-picker-icon`]: true,
        }),
      })
    ) : (
      <span class={`${prefixCls}-picker-icon`}>{suffixIcon}</span>
    )) || <CalendarOutlined class={`${prefixCls}-picker-icon`} />
  );
};
InputIcon.inheritAttrs = false;
export default InputIcon;
