import type { App, Plugin, ExtractPropTypes, PropType } from 'vue';
import { provide, defineComponent, ref, watch, computed, toRef } from 'vue';
import PropTypes, { withUndefined } from '../_util/vue-types';
import type { RenderEmptyHandler } from '../config-provider';

import Spin from '../spin';
import type { PaginationConfig } from '../pagination';
import Pagination, { paginationConfig } from '../pagination';
import { Row } from '../grid';

import Item from './Item';
import { flattenChildren } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import { tuple } from '../_util/type';
import ItemMeta from './ItemMeta';
import useConfigInject from '../_util/hooks/useConfigInject';
import useBreakpoint from '../_util/hooks/useBreakpoint';
import type { Breakpoint } from '../_util/responsiveObserve';
import { responsiveArray } from '../_util/responsiveObserve';

export { ListItemProps } from './Item';
export type { ListItemMetaProps } from './ItemMeta';

export type ColumnType = 'gutter' | 'column' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export const ListGridType = {
  gutter: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(Number)]),
  column: PropTypes.number,
  xs: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,
  xl: PropTypes.number,
  xxl: PropTypes.number,
};

export const ListSize = tuple('small', 'default', 'large');

export type ListItemLayout = 'horizontal' | 'vertical';

export const listProps = {
  bordered: PropTypes.looseBool,
  dataSource: PropTypes.array,
  extra: PropTypes.any,
  grid: PropTypes.shape(ListGridType).loose,
  itemLayout: PropTypes.oneOf(tuple('horizontal', 'vertical')),
  loading: withUndefined(PropTypes.oneOfType([PropTypes.looseBool, PropTypes.object])),
  loadMore: PropTypes.any,
  pagination: withUndefined(
    PropTypes.oneOfType([
      PropTypes.shape<PaginationConfig>(paginationConfig()).loose,
      PropTypes.looseBool,
    ]),
  ),
  prefixCls: PropTypes.string,
  rowKey: PropTypes.any,
  renderItem: PropTypes.any,
  size: PropTypes.oneOf(ListSize),
  split: PropTypes.looseBool,
  header: PropTypes.any,
  footer: PropTypes.any,
  locale: {
    type: Object as PropType<ListLocale>,
  },
};

export interface ListLocale {
  emptyText: any;
}

export type ListProps = Partial<ExtractPropTypes<typeof listProps>>;

import { ListContextKey } from './contextKey';

const List = defineComponent({
  name: 'AList',
  Item,
  props: initDefaultProps(listProps, {
    dataSource: [],
    bordered: false,
    split: true,
    loading: false,
    pagination: false,
  }),
  slots: ['extra', 'loadMore', 'renderItem', 'header', 'footer'],
  setup(props, { slots }) {
    provide(ListContextKey, {
      grid: toRef(props, 'grid'),
      itemLayout: toRef(props, 'itemLayout'),
    });
    const defaultPaginationProps = {
      current: 1,
      total: 0,
    };
    const { prefixCls, direction, renderEmpty } = useConfigInject('list', props);
    const paginationObj = computed(() =>
      props.pagination && typeof props.pagination === 'object' ? props.pagination : {},
    );
    const paginationCurrent = ref(paginationObj.value.defaultCurrent ?? 1);
    const paginationSize = ref(paginationObj.value.defaultPageSize ?? 10);
    watch(paginationObj, () => {
      if ('current' in paginationObj.value) {
        paginationCurrent.value = paginationObj.value.current;
      }
      if ('pageSize' in paginationObj.value) {
        paginationSize.value = paginationObj.value.pageSize;
      }
    });

    const triggerPaginationEvent = (eventName: string) => (page: number, pageSize: number) => {
      paginationCurrent.value = page;
      paginationSize.value = pageSize;
      if (paginationObj.value[eventName]) {
        paginationObj.value[eventName](page, pageSize);
      }
    };

    const onPaginationChange = triggerPaginationEvent('onChange');

    const onPaginationShowSizeChange = triggerPaginationEvent('onShowSizeChange');

    const renderEmptyFunc = (renderEmptyHandler: RenderEmptyHandler) => (
      <div class={`${prefixCls.value}-empty-text`}>
        {props.locale?.emptyText || renderEmptyHandler('List')}
      </div>
    );

    const loadingProp = computed(() => {
      if (typeof props.loading === 'boolean') {
        return {
          spinning: props.loading,
        };
      } else {
        return props.loading;
      }
    });

    const isLoading = computed(() => loadingProp.value && loadingProp.value.spinning);

    const sizeCls = computed(() => {
      let size = '';
      switch (props.size) {
        case 'large':
          size = 'lg';
          break;
        case 'small':
          size = 'sm';
          break;
        default:
          break;
      }
      return size;
    });

    const classObj = computed(() => ({
      [`${prefixCls.value}`]: true,
      [`${prefixCls.value}-vertical`]: props.itemLayout === 'vertical',
      [`${prefixCls.value}-${sizeCls.value}`]: sizeCls.value,
      [`${prefixCls.value}-split`]: props.split,
      [`${prefixCls.value}-bordered`]: props.bordered,
      [`${prefixCls.value}-loading`]: isLoading.value,
      [`${prefixCls.value}-grid`]: !!props.grid,
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
    }));

    const paginationProps = computed(() => {
      const pp = {
        ...defaultPaginationProps,
        total: props.dataSource.length,
        current: paginationCurrent.value,
        pageSize: paginationSize.value,
        ...((props.pagination as PaginationConfig) || {}),
      };

      const largestPage = Math.ceil(pp.total / pp.pageSize);
      if (pp.current > largestPage) {
        pp.current = largestPage;
      }
      return pp;
    });

    const splitDataSource = computed(() => {
      let dd = [...props.dataSource];
      if (props.pagination) {
        if (
          props.dataSource.length >
          (paginationProps.value.current - 1) * paginationProps.value.pageSize
        ) {
          dd = [...props.dataSource].splice(
            (paginationProps.value.current - 1) * paginationProps.value.pageSize,
            paginationProps.value.pageSize,
          );
        }
      }
      return dd;
    });

    const screens = useBreakpoint();

    const currentBreakpoint = computed(() => {
      for (let i = 0; i < responsiveArray.length; i += 1) {
        const breakpoint: Breakpoint = responsiveArray[i];
        if (screens.value[breakpoint]) {
          return breakpoint;
        }
      }
      return undefined;
    });

    const colStyle = computed(() => {
      if (!props.grid) {
        return undefined;
      }
      const columnCount =
        currentBreakpoint.value && props.grid[currentBreakpoint.value]
          ? props.grid[currentBreakpoint.value]
          : props.grid.column;
      if (columnCount) {
        return {
          width: `${100 / columnCount}%`,
          maxWidth: `${100 / columnCount}%`,
        };
      }
      return undefined;
    });

    const renderInnerItem = (keys: number[], item: any, index: number) => {
      const renderItem = props.renderItem ?? slots.renderItem;
      if (!renderItem) return null;

      let key;

      if (typeof props.rowKey === 'function') {
        key = props.rowKey(item);
      } else if (typeof props.rowKey === 'string') {
        key = item[props.rowKey];
      } else {
        key = item.key;
      }

      if (!key) {
        key = `list-item-${index}`;
      }

      keys[index] = key;

      return renderItem({ item, index });
    };

    return () => {
      const loadMore = props.loadMore ?? slots.loadMore?.();
      const footer = props.footer ?? slots.footer?.();
      const header = props.header ?? slots.header?.();
      const children = flattenChildren(slots.default?.());
      const keys = [];
      const isSomethingAfterLastItem = !!(loadMore || props.pagination || footer);
      const classString = {
        ...classObj.value,
        [`${prefixCls.value}-something-after-last-item`]: isSomethingAfterLastItem,
      };
      const paginationContent = props.pagination ? (
        <div class={`${prefixCls.value}-pagination`}>
          <Pagination
            {...paginationProps.value}
            onChange={onPaginationChange}
            onShowSizeChange={onPaginationShowSizeChange}
          />
        </div>
      ) : null;

      let childrenContent = isLoading.value && <div style={{ minHeight: '53px' }} />;
      if (splitDataSource.value.length > 0) {
        const items = splitDataSource.value.map((item: any, index: number) =>
          renderInnerItem(keys, item, index),
        );
        const childrenList = items.map((child: any, index) => (
          <div key={keys[index]} style={colStyle.value}>
            {child}
          </div>
        ));
        childrenContent = props.grid ? (
          <Row gutter={props.grid.gutter}>{childrenList}</Row>
        ) : (
          <ul class={`${prefixCls.value}-items`}>{items}</ul>
        );
      } else if (!children.length && !isLoading.value) {
        childrenContent = renderEmptyFunc(renderEmpty.value);
      }

      const paginationPosition = paginationProps.value.position || 'bottom';
      return (
        <div class={classString}>
          {(paginationPosition === 'top' || paginationPosition === 'both') && paginationContent}
          {header && <div class={`${prefixCls.value}-header`}>{header}</div>}
          <Spin {...loadingProp.value}>
            {childrenContent}
            {children}
          </Spin>
          {footer && <div class={`${prefixCls.value}-footer`}>{footer}</div>}
          {loadMore ||
            ((paginationPosition === 'bottom' || paginationPosition === 'both') &&
              paginationContent)}
        </div>
      );
    };
  },
});

/* istanbul ignore next */
List.install = function (app: App) {
  app.component(List.name, List);
  app.component(List.Item.name, List.Item);
  app.component(List.Item.Meta.name, List.Item.Meta);
  return app;
};

export { ItemMeta as ListItemMeta, Item as ListItem };

export default List as typeof List &
  Plugin & {
    readonly Item: typeof Item & {
      readonly Meta: typeof ItemMeta;
    };
  };
