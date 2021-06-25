import type {
  Ref,
  App,
  PropType,
  VNode,
  HTMLAttributes,
  ExtractPropTypes,
  Plugin,
  CSSProperties,
  InjectionKey,
} from 'vue';
import { ref, defineComponent, onMounted, onBeforeUnmount, provide, toRef, computed } from 'vue';
import warning from '../_util/warning';
import type { Breakpoint, ScreenMap } from '../_util/responsiveObserve';
import ResponsiveObserve, { responsiveArray } from '../_util/responsiveObserve';
import Row from './Row';
import PropTypes from '../_util/vue-types';
import { tuple } from '../_util/type';
import { cloneElement } from '../_util/vnode';
import { flattenChildren } from '../_util/props-util';
import useConfigInject from '../_util/hooks/useConfigInject';

export const DescriptionsItemProps = {
  prefixCls: PropTypes.string,
  label: PropTypes.any,
  span: PropTypes.number,
};

const descriptionsItemProp = {
  prefixCls: PropTypes.string,
  label: PropTypes.VNodeChild,
  labelStyle: PropTypes.style,
  contentStyle: PropTypes.style,
  span: PropTypes.number.def(1),
};

export type DescriptionsItemProp = Partial<ExtractPropTypes<typeof descriptionsItemProp>>;

export const DescriptionsItem = defineComponent({
  name: 'ADescriptionsItem',
  props: descriptionsItemProp,
  slots: ['label'],
  setup(_, { slots }) {
    return () => slots.default?.();
  },
});

const DEFAULT_COLUMN_MAP: Partial<Record<Breakpoint, number>> = {
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
  const childNodes = flattenChildren(children);
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
    default: (): number | Partial<Record<Breakpoint, number>> => DEFAULT_COLUMN_MAP,
  },
  layout: PropTypes.oneOf(tuple('horizontal', 'vertical')),
  colon: PropTypes.looseBool,
  labelStyle: PropTypes.style,
  contentStyle: PropTypes.style,
};

export type DescriptionsProps = HTMLAttributes &
  Partial<ExtractPropTypes<typeof descriptionsProps>>;

export interface DescriptionsContextProp {
  labelStyle?: Ref<CSSProperties>;
  contentStyle?: Ref<CSSProperties>;
}

export const descriptionsContext: InjectionKey<DescriptionsContextProp> =
  Symbol('descriptionsContext');

const Descriptions = defineComponent({
  name: 'ADescriptions',
  props: descriptionsProps,
  slots: ['title', 'extra'],
  Item: DescriptionsItem,
  setup(props, { slots }) {
    const { prefixCls, direction } = useConfigInject('descriptions', props);

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

    provide(descriptionsContext, {
      labelStyle: toRef(props, 'labelStyle'),
      contentStyle: toRef(props, 'contentStyle'),
    });

    const mergeColumn = computed(() => getColumn(props.column, screens.value));

    return () => {
      const {
        size,
        bordered = false,
        layout = 'horizontal',
        colon = true,
        title = slots.title?.(),
        extra = slots.extra?.(),
      } = props;

      const children = slots.default?.();
      const rows = getRows(children, mergeColumn.value);

      return (
        <div
          class={[
            prefixCls.value,
            {
              [`${prefixCls.value}-${size}`]: size !== 'default',
              [`${prefixCls.value}-bordered`]: !!bordered,
              [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
            },
          ]}
        >
          {(title || extra) && (
            <div class={`${prefixCls.value}-header`}>
              {title && <div class={`${prefixCls.value}-title`}>{title}</div>}
              {extra && <div class={`${prefixCls.value}-extra`}>{extra}</div>}
            </div>
          )}
          <div class={`${prefixCls.value}-view`}>
            <table>
              <tbody>
                {rows.map((row, index) => (
                  <Row
                    key={index}
                    index={index}
                    colon={colon}
                    prefixCls={prefixCls.value}
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

Descriptions.install = function (app: App) {
  app.component(Descriptions.name, Descriptions);
  app.component(Descriptions.Item.name, Descriptions.Item);
  return app;
};
export default Descriptions as typeof Descriptions &
  Plugin & {
    readonly Item: typeof DescriptionsItem;
  };
