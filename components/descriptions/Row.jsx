import Cell from './Cell';
import PropTypes from '../_util/vue-types';
import Fragment from '../_util/fragment';
import {
  getOptionProps,
  getSlots,
  getClass,
  getStyle,
  getComponentFromProp,
} from '../_util/props-util';

export const RowProps = {
  prefixCls: PropTypes.string,
  vertical: PropTypes.bool,
  row: PropTypes.array,
  bordered: PropTypes.bool,
  colon: PropTypes.bool,
  index: PropTypes.number,
};

const Row = {
  functional: true,
  props: RowProps,
  render(h, ctx) {
    const renderCells = (
      items,
      { colon, prefixCls, bordered },
      { component, type, showLabel, showContent },
    ) => {
      return items.map((item, index) => {
        const { prefixCls: itemPrefixCls = prefixCls, span = 1 } = getOptionProps(item);
        const label = getComponentFromProp(item, 'label');

        const children = getSlots(item).default;
        const className = getClass(item);
        const style = getStyle(item);
        const { key } = item;
        if (typeof component === 'string') {
          return (
            <Cell
              key={`${type}-${key || index}`}
              class={className}
              style={style}
              span={span}
              colon={colon}
              component={component}
              itemPrefixCls={itemPrefixCls}
              bordered={bordered}
              label={showLabel ? label : null}
              content={showContent ? children : null}
            />
          );
        }

        return [
          <Cell
            key={`label-${key || index}`}
            class={className}
            style={style}
            span={1}
            colon={colon}
            component={component[0]}
            itemPrefixCls={itemPrefixCls}
            bordered={bordered}
            label={label}
          />,
          <Cell
            key={`content-${key || index}`}
            class={className}
            style={style}
            span={span * 2 - 1}
            component={component[1]}
            itemPrefixCls={itemPrefixCls}
            bordered={bordered}
            content={children}
          />,
        ];
      });
    };

    const props = ctx.props;
    const { prefixCls, vertical, row, index, bordered } = props;
    if (vertical) {
      return (
        <Fragment>
          <tr key={`label-${index}`} class={`${prefixCls}-row`}>
            {renderCells(row, props, { component: 'th', type: 'label', showLabel: true })}
          </tr>
          <tr key={`content-${index}`} class={`${prefixCls}-row`}>
            {renderCells(row, props, {
              component: 'td',
              type: 'content',
              showContent: true,
            })}
          </tr>
        </Fragment>
      );
    }

    return (
      <tr key={index} class={`${prefixCls}-row`}>
        {renderCells(row, props, {
          component: bordered ? ['th', 'td'] : 'td',
          type: 'item',
          showLabel: true,
          showContent: true,
        })}
      </tr>
    );
  },
};

export default Row;
