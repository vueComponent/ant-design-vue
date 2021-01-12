import warning from '../_util/warning';
import ResponsiveObserve, { responsiveArray } from '../_util/responsiveObserve';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Col from './Col';
import PropTypes from '../_util/vue-types';
import {
  initDefaultProps,
  isValidElement,
  getOptionProps,
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

/**
 * Convert children into `column` groups.
 * @param children: DescriptionsItem
 * @param column: number
 */
const generateChildrenRows = (children, column) => {
  const rows = [];
  let columns = null;
  let leftSpans;

  const itemNodes = toArray(children);
  itemNodes.forEach((node, index) => {
    const itemProps = getOptionProps(node);
    let itemNode = node;

    if (!columns) {
      leftSpans = column;
      columns = [];
      rows.push(columns);
    }

    // Always set last span to align the end of Descriptions
    const lastItem = index === itemNodes.length - 1;
    let lastSpanSame = true;
    if (lastItem) {
      lastSpanSame = !itemProps.span || itemProps.span === leftSpans;
      itemNode = cloneElement(itemNode, {
        props: {
          span: leftSpans,
        },
      });
    }

    // Calculate left fill span
    const { span = 1 } = itemProps;
    columns.push(itemNode);
    leftSpans -= span;

    if (leftSpans <= 0) {
      columns = null;

      warning(
        leftSpans === 0 && lastSpanSame,
        'Descriptions',
        'Sum of column `span` in a line exceeds `column` of Descriptions.',
      );
    }
  });

  return rows;
};

const defaultColumnMap = {
  xxl: 3,
  xl: 3,
  lg: 3,
  md: 3,
  sm: 2,
  xs: 1,
};

const Descriptions = {
  name: 'ADescriptions',
  Item: DescriptionsItem,
  mixins: [BaseMixin],
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  props: initDefaultProps(DescriptionsProps, {
    column: defaultColumnMap,
  }),
  data() {
    return {
      screens: {},
      token: undefined,
    };
  },
  methods: {
    getColumn() {
      const { column } = this.$props;
      if (typeof column === 'object') {
        for (let i = 0; i < responsiveArray.length; i++) {
          const breakpoint = responsiveArray[i];
          if (this.screens[breakpoint] && column[breakpoint] !== undefined) {
            return column[breakpoint] || defaultColumnMap[breakpoint];
          }
        }
      }
      // If the configuration is not an object, it is a number, return number
      if (typeof column === 'number') {
        return column;
      }
      // If it is an object, but no response is found, this happens only in the test.
      // Maybe there are some strange environments
      return 3;
    },
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
      size,
      bordered = false,
      layout = 'horizontal',
      colon = true,
    } = this.$props;
    const title = getComponentFromProp(this, 'title') || null;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('descriptions', customizePrefixCls);

    const column = this.getColumn();
    const children = this.$slots.default;
    const cloneChildren = toArray(children)
      .map(child => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            props: {
              prefixCls,
            },
          });
        }
        return null;
      })
      .filter(node => node);

    const childrenArray = generateChildrenRows(cloneChildren, column);
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
              {childrenArray.map((child, index) =>
                this.renderRow(
                  child,
                  index,
                  {
                    prefixCls,
                  },
                  bordered,
                  layout,
                  colon,
                ),
              )}
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
