import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import omit from 'omit.js';
import { ConfigConsumerProps } from '../config-provider';

import Spin from '../spin';
import Pagination, { PaginationConfig } from '../pagination';
import { Row } from '../grid';

import Item from './Item';
import { initDefaultProps, getComponent, getSlot } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import { provide, inject } from 'vue';

export { ListItemProps, ListItemMetaProps } from './Item';

export const ColumnCount = ['', 1, 2, 3, 4, 6, 8, 12, 24];

export const ColumnType = ['gutter', 'column', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

export const ListGridType = {
  gutter: PropTypes.number,
  column: PropTypes.oneOf(ColumnCount),
  xs: PropTypes.oneOf(ColumnCount),
  sm: PropTypes.oneOf(ColumnCount),
  md: PropTypes.oneOf(ColumnCount),
  lg: PropTypes.oneOf(ColumnCount),
  xl: PropTypes.oneOf(ColumnCount),
  xxl: PropTypes.oneOf(ColumnCount),
};

export const ListSize = ['small', 'default', 'large'];

export const ListProps = () => ({
  bordered: PropTypes.bool,
  dataSource: PropTypes.array,
  extra: PropTypes.any,
  grid: PropTypes.shape(ListGridType).loose,
  itemLayout: PropTypes.string,
  loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  loadMore: PropTypes.any,
  pagination: PropTypes.oneOfType([PropTypes.shape(PaginationConfig()).loose, PropTypes.bool]),
  prefixCls: PropTypes.string,
  rowKey: PropTypes.any,
  renderItem: PropTypes.any,
  size: PropTypes.oneOf(ListSize),
  split: PropTypes.bool,
  header: PropTypes.any,
  footer: PropTypes.any,
  locale: PropTypes.object,
});

const List = {
  inheritAttrs: false,
  Item,
  name: 'AList',
  props: initDefaultProps(ListProps(), {
    dataSource: [],
    bordered: false,
    split: true,
    loading: false,
    pagination: false,
  }),
  created() {
    provide('listContext', this);
  },
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },

  data() {
    this.keys = [];
    this.defaultPaginationProps = {
      current: 1,
      pageSize: 10,
      onChange: (page, pageSize) => {
        const { pagination } = this;
        this.paginationCurrent = page;
        if (pagination && pagination.onChange) {
          pagination.onChange(page, pageSize);
        }
      },
      total: 0,
    };
    this.onPaginationChange = this.triggerPaginationEvent('onChange');
    this.onPaginationShowSizeChange = this.triggerPaginationEvent('onShowSizeChange');
    const { pagination } = this.$props;
    const paginationObj = pagination && typeof pagination === 'object' ? pagination : {};
    return {
      paginationCurrent: paginationObj.defaultCurrent || 1,
      paginationSize: paginationObj.defaultPageSize || 10,
    };
  },
  methods: {
    triggerPaginationEvent(eventName) {
      return (page, pageSize) => {
        const { pagination } = this.$props;
        this.paginationCurrent = page;
        this.paginationSize = pageSize;
        if (pagination && pagination[eventName]) {
          pagination[eventName](page, pageSize);
        }
      };
    },
    innerRenderItem(item, index) {
      const {
        $slots: { renderItem },
        rowKey,
      } = this;
      const renderer = this.renderItem || renderItem;
      if (!renderer) return null;
      let key;
      if (typeof rowKey === 'function') {
        key = rowKey(item);
      } else if (typeof rowKey === 'string') {
        key = item[rowKey];
      } else {
        key = item.key;
      }

      if (!key) {
        key = `list-item-${index}`;
      }

      this.keys[index] = key;

      return renderer({ item, index });
    },

    isSomethingAfterLastItem() {
      const { pagination } = this;
      const loadMore = getComponent(this, 'loadMore');
      const footer = getComponent(this, 'footer');
      return !!(loadMore || pagination || footer);
    },

    renderEmpty(prefixCls, renderEmpty) {
      const { locale } = this;
      return (
        <div class={`${prefixCls}-empty-text`}>
          {(locale && locale.emptyText) || renderEmpty('List')}
        </div>
      );
    },
  },

  render() {
    const {
      prefixCls: customizePrefixCls,
      bordered,
      split,
      itemLayout,
      pagination,
      grid,
      dataSource = [],
      size,
      loading,
      paginationCurrent,
      paginationSize,
      $attrs,
    } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('list', customizePrefixCls);
    const { class: className, ...restAttrs } = $attrs;
    const loadMore = getComponent(this, 'loadMore');
    const footer = getComponent(this, 'footer');
    const header = getComponent(this, 'header');
    const children = getSlot(this);
    let loadingProp = loading;
    if (typeof loadingProp === 'boolean') {
      loadingProp = {
        spinning: loadingProp,
      };
    }
    const isLoading = loadingProp && loadingProp.spinning;

    // large => lg
    // small => sm
    let sizeCls = '';
    switch (size) {
      case 'large':
        sizeCls = 'lg';
        break;
      case 'small':
        sizeCls = 'sm';
        break;
      default:
        break;
    }
    const classString = classNames(
      prefixCls,
      {
        [`${prefixCls}-vertical`]: itemLayout === 'vertical',
        [`${prefixCls}-${sizeCls}`]: sizeCls,
        [`${prefixCls}-split`]: split,
        [`${prefixCls}-bordered`]: bordered,
        [`${prefixCls}-loading`]: isLoading,
        [`${prefixCls}-grid`]: grid,
        [`${prefixCls}-something-after-last-item`]: this.isSomethingAfterLastItem(),
      },
      className,
    );
    const paginationProps = {
      ...this.defaultPaginationProps,
      total: dataSource.length,
      current: paginationCurrent,
      pageSize: paginationSize,
      ...(pagination || {}),
    };
    classString;
    const largestPage = Math.ceil(paginationProps.total / paginationProps.pageSize);
    if (paginationProps.current > largestPage) {
      paginationProps.current = largestPage;
    }
    const { class: cls, style, ...restProps } = paginationProps;
    const paginationContent = pagination ? (
      <div class={`${prefixCls}-pagination`}>
        <Pagination
          {...{
            ...omit(restProps, ['onChange']),
            class: cls,
            style,
            onChange: this.onPaginationChange,
            onShowSizeChange: this.onPaginationShowSizeChange,
          }}
        />
      </div>
    ) : null;

    let splitDataSource = [...dataSource];
    if (pagination) {
      if (dataSource.length > (paginationProps.current - 1) * paginationProps.pageSize) {
        splitDataSource = [...dataSource].splice(
          (paginationProps.current - 1) * paginationProps.pageSize,
          paginationProps.pageSize,
        );
      }
    }

    let childrenContent;
    childrenContent = isLoading && <div style={{ minHeight: 53 }} />;
    if (splitDataSource.length > 0) {
      const items = splitDataSource.map((item, index) => this.innerRenderItem(item, index));
      const childrenList = items.map((child, index) =>
        cloneElement(child, {
          key: this.keys[index],
        }),
      );

      childrenContent = grid ? (
        <Row gutter={grid.gutter}>{childrenList}</Row>
      ) : (
        <ul class={`${prefixCls}-items`}>{childrenList}</ul>
      );
    } else if (!children.length && !isLoading) {
      const renderEmpty = this.configProvider.renderEmpty;
      childrenContent = this.renderEmpty(prefixCls, renderEmpty);
    }
    const paginationPosition = paginationProps.position || 'bottom';

    return (
      <div class={classString} {...restAttrs}>
        {(paginationPosition === 'top' || paginationPosition === 'both') && paginationContent}
        {header && <div class={`${prefixCls}-header`}>{header}</div>}
        <Spin {...loadingProp}>
          {childrenContent}
          {children}
        </Spin>
        {footer && <div class={`${prefixCls}-footer`}>{footer}</div>}
        {loadMore ||
          ((paginationPosition === 'bottom' || paginationPosition === 'both') && paginationContent)}
      </div>
    );
  },
};

/* istanbul ignore next */
List.install = function(app) {
  app.component(List.name, List);
  app.component(List.Item.name, List.Item);
  app.component(List.Item.Meta.displayName, List.Item.Meta);
};

export default List;
