import warning from '../_util/warning';
import ResponsiveObserve, { responsiveArray } from '../_util/responsiveObserve';
import { ConfigConsumerProps } from '../config-provider';
import Row from './Row';
import PropTypes from '../_util/vue-types';
import {
  filterEmpty,
  initDefaultProps,
  getPropsData,
  getComponentFromProp,
} from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import Base from '../base';
import { cloneElement } from '../_util/vnode';

export const DescriptionsItemProps = {
  prefixCls: PropTypes.string,
  label: PropTypes.any,
  span: PropTypes.number,
};

function toArray(value) {
  let ret = value;
  if (value === undefined) {
    ret = [];
  } else if (!Array.isArray(value)) {
    ret = [value];
  }
  return ret;
}

export const DescriptionsItem = {
  name: 'ADescriptionsItem',
  props: initDefaultProps(DescriptionsItemProps, { span: 1 }),
};

export const DescriptionsProps = {
  prefixCls: PropTypes.string,
  bordered: PropTypes.bool,
  size: PropTypes.oneOf(['default', 'middle', 'small']).def('default'),
  title: PropTypes.any,
  column: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
  colon: PropTypes.bool,
};

const DEFAULT_COLUMN_MAP = {
  xxl: 3,
  xl: 3,
  lg: 3,
  md: 3,
  sm: 2,
  xs: 1,
};

const getColumn = (column, screens) => {
  if (typeof column === 'number') {
    return column;
  }

  if (typeof column === 'object') {
    for (let i = 0; i < responsiveArray.length; i++) {
      const breakpoint = responsiveArray[i];
      if (screens[breakpoint] && column[breakpoint] !== undefined) {
        return column[breakpoint] || DEFAULT_COLUMN_MAP[breakpoint];
      }
    }
  }

  return 3;
};

const getFilledItem = (node, span, rowRestCol) => {
  let clone = node;

  if (span === undefined || span > rowRestCol) {
    clone = cloneElement(node, {
      props: {
        span: rowRestCol,
      },
    });
    warning(
      span === undefined,
      'Descriptions',
      'Sum of column `span` in a line not match `column` of Descriptions.',
    );
  }

  return clone;
};

const getRows = (children, column) => {
  const childNodes = toArray(children).filter(n => n);
  const rows = [];

  let tmpRow = [];
  let rowRestCol = column;

  childNodes.forEach((node, index) => {
    const itemProps = getPropsData(node);
    const { span } = itemProps;
    const mergedSpan = span || 1;

    // Additional handle last one
    if (index === childNodes.length - 1) {
      tmpRow.push(getFilledItem(node, span, rowRestCol));
      rows.push(tmpRow);
      return;
    }

    if (mergedSpan < rowRestCol) {
      rowRestCol -= mergedSpan;
      tmpRow.push(node);
    } else {
      tmpRow.push(getFilledItem(node, mergedSpan, rowRestCol));
      rows.push(tmpRow);
      rowRestCol = column;
      tmpRow = [];
    }
  });

  return rows;
};

const Descriptions = {
  name: 'ADescriptions',
  Item: DescriptionsItem,
  mixins: [BaseMixin],
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  props: initDefaultProps(DescriptionsProps, {
    column: DEFAULT_COLUMN_MAP,
  }),
  data() {
    return {
      screens: {},
      token: undefined,
    };
  },
  methods: {
    renderRow(children, index, { prefixCls }, bordered, layout, colon) {
      const renderCol = (colItem, type, idx) => {
        return (
          <Col
            child={colItem}
            bordered={bordered}
            colon={colon}
            type={type}
            key={`${type}-${colItem.key || idx}`}
            layout={layout}
          />
        );
      };

      const cloneChildren = [];
      const cloneContentChildren = [];
      toArray(children).forEach((childrenItem, idx) => {
        cloneChildren.push(renderCol(childrenItem, 'label', idx));
        if (layout === 'vertical') {
          cloneContentChildren.push(renderCol(childrenItem, 'content', idx));
        } else if (bordered) {
          cloneChildren.push(renderCol(childrenItem, 'content', idx));
        }
      });

      if (layout === 'vertical') {
        return [
          <tr class={`${prefixCls}-row`} key={`label-${index}`}>
            {cloneChildren}
          </tr>,
          <tr class={`${prefixCls}-row`} key={`content-${index}`}>
            {cloneContentChildren}
          </tr>,
        ];
      }

      return (
        <tr class={`${prefixCls}-row`} key={index}>
          {cloneChildren}
        </tr>
      );
    },
  },
  mounted() {
    const { column } = this.$props;
    this.token = ResponsiveObserve.subscribe(screens => {
      if (typeof column !== 'object') {
        return;
      }
      this.setState({
        screens,
      });
    });
  },
  beforeDestroy() {
    ResponsiveObserve.unsubscribe(this.token);
  },
  render() {
    const {
      prefixCls: customizePrefixCls,
      column,
      size,
      bordered = false,
      layout = 'horizontal',
      colon = true,
    } = this.$props;
    const title = getComponentFromProp(this, 'title') || null;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('descriptions', customizePrefixCls);

    const mergedColumn = getColumn(column, this.screens);
    const children = filterEmpty(this.$slots.default);
    const rows = getRows(children, mergedColumn);

    return (
      <div
        class={[
          prefixCls,
          {
            [`${prefixCls}-${size}`]: size !== 'default',
            [`${prefixCls}-bordered`]: !!bordered,
          },
        ]}
      >
        {title && <div class={`${prefixCls}-title`}>{title}</div>}
        <div class={`${prefixCls}-view`}>
          <table>
            <tbody>
              {rows.map((row, index) => (
                <Row
                  key={index}
                  index={index}
                  colon={colon}
                  prefixCls={prefixCls}
                  vertical={layout === 'vertical'}
                  bordered={bordered}
                  row={row}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
};

Descriptions.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Descriptions.name, Descriptions);
  Vue.component(Descriptions.Item.name, Descriptions.Item);
};

export default Descriptions;
