import PropTypes from '../_util/vue-types';
import { getOptionProps } from '../_util/props-util';

const ColProps = {
  child: PropTypes.any,
  bordered: PropTypes.bool,
  colon: PropTypes.bool,
  type: PropTypes.oneOf(['label', 'content']),
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
};

const Col = (_, { attrs }) => {
  // props: {
  //   child: PropTypes.any,
  //   bordered: PropTypes.bool,
  //   colon: PropTypes.bool,
  //   type: PropTypes.oneOf(['label', 'content']),
  //   layout: PropTypes.oneOf(['horizontal', 'vertical']),
  // }
  const { child, bordered, colon, type, layout } = attrs;
  const { prefixCls, span = 1 } = getOptionProps(child);
  const { key, children = {} } = child || {};
  const label = children.label && children.label();
  const defaultSlot = children.default && children.default();

  const someLabelProps = {
    class: [
      `${prefixCls}-item-label`,
      {
        [`${prefixCls}-item-colon`]: colon,
        [`${prefixCls}-item-no-label`]: !label,
      },
    ],
    key: `${key}-label`,
  };

  if (layout === 'vertical') {
    someLabelProps.colSpan = span * 2 - 1;
  }

  if (bordered) {
    if (type === 'label') {
      return <th {...someLabelProps}>{label}</th>;
    }
    return (
      <td class={`${prefixCls}-item-content`} key={`${key}-content`} colSpan={span * 2 - 1}>
        {defaultSlot}
      </td>
    );
  }
  if (layout === 'vertical') {
    if (type === 'content') {
      return (
        <td colSpan={span} class={`${prefixCls}-item`}>
          <span class={`${prefixCls}-item-content`} key={`${key}-content`}>
            {defaultSlot}
          </span>
        </td>
      );
    }
    return (
      <td colSpan={span} class={`${prefixCls}-item`}>
        <span
          class={[`${prefixCls}-item-label`, { [`${prefixCls}-item-colon`]: colon }]}
          key={`${key}-label`}
        >
          {label}
        </span>
      </td>
    );
  }
  return (
    <td colSpan={span} class={`${prefixCls}-item`}>
      <span {...someLabelProps}>{label}</span>
      <span class={`${prefixCls}-item-content`} key={`${key}-content`}>
        {defaultSlot}
      </span>
    </td>
  );
};

export default Col;
