import {
  inject,
  ref,
  App,
  defineComponent,
  PropType,
  VNode,
  HTMLAttributes,
  ExtractPropTypes,
  onMounted,
  onBeforeUnmount,
  Plugin,
} from 'vue';
import warning from '../_util/warning';
import ResponsiveObserve, {
  Breakpoint,
  responsiveArray,
  ScreenMap,
} from '../_util/responsiveObserve';
import { defaultConfigProvider } from '../config-provider';
import Row from './Row';
import PropTypes from '../_util/vue-types';
import { tuple } from '../_util/type';
import { cloneElement } from '../_util/vnode';
import { filterEmpty } from '../_util/props-util';

export const DescriptionsItemProps = {
  prefixCls: PropTypes.string,
  label: PropTypes.any,
  span: PropTypes.number,
};

export const DescriptionsItem = defineComponent({
  name: 'ADescriptionsItem',
  props: {
    prefixCls: PropTypes.string,
    label: PropTypes.VNodeChild,
    span: PropTypes.number.def(1),
  },
  render() {
    return null;
  },
});

const DEFAULT_COLUMN_MAP: Record<Breakpoint, number> = {
  xxl: 3,
  xl: 3,
  lg: 3,
  md: 3,
  sm: 2,
  xs: 1,
};

function getColumn(column: DescriptionsProps['column'], screens: ScreenMap): number {
  if (typeof column === 'number') {
    return column;
  }

  if (typeof column === 'object') {
    for (let i = 0; i < responsiveArray.length; i++) {
      const breakpoint: Breakpoint = responsiveArray[i];
      if (screens[breakpoint] && column[breakpoint] !== undefined) {
        return column[breakpoint] || DEFAULT_COLUMN_MAP[breakpoint];
      }
    }
  }

  return 3;
}

function getFilledItem(node: VNode, span: number | undefined, rowRestCol: number): VNode {
  let clone = node;

  if (span === undefined || span > rowRestCol) {
    clone = cloneElement(node, {
      span: rowRestCol,
    });

    warning(
      span === undefined,
      'Descriptions',
      'Sum of column `span` in a line not match `column` of Descriptions.',
    );
  }

  return clone;
}

function getRows(children: VNode[], column: number) {
  const childNodes = filterEmpty(children);
  const rows: VNode[][] = [];

  let tmpRow: VNode[] = [];
  let rowRestCol = column;

  childNodes.forEach((node, index) => {
    const span: number | undefined = node.props?.span;
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
}

const descriptionsProps = {
  prefixCls: PropTypes.string,
  bordered: PropTypes.looseBool,
  size: PropTypes.oneOf(tuple('default', 'middle', 'small')).def('default'),
  title: PropTypes.VNodeChild,
  extra: PropTypes.VNodeChild,
  column: {
    type: [Number, Object] as PropType<number | Partial<Record<Breakpoint, number>>>,
    default: () => DEFAULT_COLUMN_MAP,
  },
  layout: PropTypes.oneOf(tuple('horizontal', 'vertical')),
  colon: PropTypes.looseBool,
};

export type DescriptionsProps = HTMLAttributes &
  Partial<ExtractPropTypes<typeof descriptionsProps>>;

const Descriptions = defineComponent<DescriptionsProps>({
  name: 'ADescriptions',
  Item: DescriptionsItem,
  setup(props, { slots }) {
    const { getPrefixCls } = inject('configProvider', defaultConfigProvider);

    let token: number;

    const screens = ref<ScreenMap>({});

    onMounted(() => {
      token = ResponsiveObserve.subscribe(screen => {
        if (typeof props.column !== 'object') {
          return;
        }

        screens.value = screen;
      });
    });

    onBeforeUnmount(() => {
      ResponsiveObserve.unsubscribe(token);
    });

    return () => {
      const {
        prefixCls: customizePrefixCls,
        column,
        size,
        bordered = false,
        layout = 'horizontal',
        colon = true,
        title = slots.title?.(),
        extra = slots.extra?.(),
      } = props;

      const prefixCls = getPrefixCls('descriptions', customizePrefixCls);
      const mergeColumn = getColumn(column, screens.value);
      const children = slots.default?.();
      const rows = getRows(children, mergeColumn);

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
          {(title || extra) && (
            <div class={`${prefixCls}-header`}>
              <div class={`${prefixCls}-title`}>{title}</div>
              <div class={`${prefixCls}-extra`}>{extra}</div>
            </div>
          )}
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
    };
  },
});

Descriptions.props = descriptionsProps;

Descriptions.install = function(app: App) {
  app.component(Descriptions.name, Descriptions);
  app.component(Descriptions.Item.name, Descriptions.Item);
  return app;
};

export default Descriptions as typeof Descriptions &
  Plugin & {
    readonly Item: typeof DescriptionsItem;
  };
