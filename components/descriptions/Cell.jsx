import PropTypes from '../_util/vue-types';
import { getClass } from '../_util/props-util';

function notEmpty(val) {
  return val !== undefined && val !== null;
}

export const CellProps = {
  itemPrefixCls: PropTypes.string,
  span: PropTypes.number,
  component: PropTypes.string,
  bordered: PropTypes.bool,
  label: PropTypes.any,
  content: PropTypes.any,
  colon: PropTypes.bool,
};

const Cell = {
  functional: true,
  props: CellProps,
  render(h, ctx) {
    const { itemPrefixCls, component, span, bordered, label, content, colon } = ctx.props;
    const Component = component;
    const className = getClass(ctx);
    if (bordered) {
      return (
        <Component
          class={[
            {
              [`${itemPrefixCls}-item-label`]: notEmpty(label),
              [`${itemPrefixCls}-item-content`]: notEmpty(content),
            },
            className,
          ]}
          colSpan={span}
        >
          {notEmpty(label) ? label : content}
        </Component>
      );
    }

    return (
      <Component class={[`${itemPrefixCls}-item`, className]} colSpan={span}>
        {label && (
          <span
            class={[
              `${itemPrefixCls}-item-label`,
              {
                [`${itemPrefixCls}-item-no-colon`]: !colon,
              },
            ]}
          >
            {label}
          </span>
        )}
        {content && <span class={`${itemPrefixCls}-item-content`}>{content}</span>}
      </Component>
    );
  },
};

export default Cell;
