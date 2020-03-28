import CalendarOutlined from '@ant-design/icons-vue/CalendarOutlined';
import { isValidElement } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';

export default {
  functional: true,
  render(h, context) {
    const { props } = context;
    const { suffixIcon, prefixCls } = props;
    return (
      (suffixIcon && isValidElement(suffixIcon) ? (
        cloneElement(suffixIcon, {
          class: `${prefixCls}-picker-icon`,
        })
      ) : (
        <span class={`${prefixCls}-picker-icon`}>{suffixIcon}</span>
      )) || <CalendarOutlined class={`${prefixCls}-picker-icon`} />
    );
  },
};
