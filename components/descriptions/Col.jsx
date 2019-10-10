import PropTypes from '../_util/vue-types';
import { getOptionProps, getSlots, getComponentFromProp } from '../_util/props-util';

const ColProps = {
  child: PropTypes.any,
  bordered: PropTypes.bool,
  colon: PropTypes.bool,
  type: PropTypes.oneOf(['label', 'content']),
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
};

const Col = {
  props: ColProps,
  render() {
    const { child, bordered, colon, type, layout } = this.$props;
    const { prefixCls, span = 1 } = getOptionProps(child);

    const label = getComponentFromProp(child, 'label');
    const slots = getSlots(child);
    const labelProps = {
      attrs: {},
      class: [`${prefixCls}-item-label`, {
        [`${prefixCls}-item-colon`]: colon,
        [`${prefixCls}-item-no-label`]: !label,
      }],
      key: 'label',
    };
    if (layout === 'vertical') {
      labelProps.attrs.colSpan = span * 2 - 1;
    }

    if (bordered) {
      if (type === 'label') {
        return <th {...labelProps}>{label}</th>;
      }
      return (
        <td class={`${prefixCls}-item-content`} key="content" colSpan={span * 2 - 1}>
          {slots.default}
        </td>
      );
    }
    if (layout === 'vertical') {
      if (type === 'content') {
        return (
          <td colSpan={span} class={`${prefixCls}-item`}>
            <span class={`${prefixCls}-item-content`} key="content">
              {slots.default}
            </span>
          </td>
        );
      }
      return (
        <td colSpan={span} class={`${prefixCls}-item`}>
          <span
            class={[`${prefixCls}-item-label`, { [`${prefixCls}-item-colon`]: colon }]}
            key="label"
          >
            {label}
          </span>
        </td>
      );
    }
    return (
      <td colSpan={span} class={`${prefixCls}-item`}>
        <span {...labelProps}>{label}</span>
        <span class={`${prefixCls}-item-content`} key="content">
          {slots.default}
        </span>
      </td>
    );
  },
};

export default Col;
