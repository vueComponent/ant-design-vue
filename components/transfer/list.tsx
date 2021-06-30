import classNames from '../_util/classNames';
import PropTypes, { withUndefined } from '../_util/vue-types';
import { isValidElement, splitAttrs, filterEmpty } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import DownOutlined from '@ant-design/icons-vue/DownOutlined';
import Checkbox from '../checkbox';
import Menu from '../menu';
import Dropdown from '../dropdown';
import Search from './search';
import defaultRenderList from './renderListBody';
import triggerEvent from '../_util/triggerEvent';
import type { VNode, VNodeTypes, ExtractPropTypes } from 'vue';
import { defineComponent, onBeforeUnmount, ref } from 'vue';
import type { RadioChangeEvent } from '../radio/interface';

const defaultRender = () => null;

const transferItem = {
  key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  disabled: PropTypes.looseBool,
};

export interface DataSourceItem {
  key: string;
  title: string;
  description?: string;
  disabled?: boolean;
}

function isRenderResultPlainObject(result: VNode) {
  return (
    result &&
    !isValidElement(result) &&
    Object.prototype.toString.call(result) === '[object Object]'
  );
}

function getEnabledItemKeys<RecordType extends DataSourceItem>(items: RecordType[]) {
  return items.filter(data => !data.disabled).map(data => data.key);
}

export const transferListProps = {
  prefixCls: PropTypes.string,
  titleText: PropTypes.string,
  dataSource: PropTypes.arrayOf(PropTypes.shape(transferItem).loose),
  filter: PropTypes.string,
  filterOption: PropTypes.func,
  checkedKeys: PropTypes.arrayOf(PropTypes.string),
  handleFilter: PropTypes.func,
  handleClear: PropTypes.func,
  renderItem: PropTypes.func,
  showSearch: PropTypes.looseBool,
  searchPlaceholder: PropTypes.string,
  notFoundContent: PropTypes.any,
  itemUnit: PropTypes.string,
  itemsUnit: PropTypes.string,
  body: PropTypes.any,
  renderList: PropTypes.any,
  footer: PropTypes.any,
  lazy: withUndefined(PropTypes.oneOfType([PropTypes.looseBool, PropTypes.object])),
  disabled: PropTypes.looseBool,
  direction: PropTypes.string,
  showSelectAll: PropTypes.looseBool,
  titles: PropTypes.any,
  remove: PropTypes.string,
  selectAll: PropTypes.string,
  selectCurrent: PropTypes.string,
  selectInvert: PropTypes.string,
  removeAll: PropTypes.string,
  removeCurrent: PropTypes.string,
  selectAllLabel: PropTypes.any,
  showRemove: PropTypes.looseBool,
  pagination: PropTypes.any,
  onItemSelect: PropTypes.func,
  onItemSelectAll: PropTypes.func,
  onItemRemove: PropTypes.func,
  onScroll: PropTypes.func,
};

export type TransferListProps = Partial<ExtractPropTypes<typeof transferListProps>>;

export default defineComponent({
  name: 'TransferList',
  inheritAttrs: false,
  props: initDefaultProps(transferListProps, {
    dataSource: [],
    titleText: '',
    showSearch: false,
    lazy: {},
  }),
  emits: ['scroll', 'itemSelectAll'],
  setup(props, { emit, attrs }) {
    const filterValue = ref('');
    const transferNode = ref();
    const defaultListBodyRef = ref();
    const triggerScrollTimer = ref<number>();
    onBeforeUnmount(() => {
      window.clearTimeout(triggerScrollTimer.value);
    });

    const renderListNode = (renderList: any, props: any) => {
      let bodyContent = renderList ? renderList(props) : null;
      const customize = !!bodyContent && filterEmpty(bodyContent).length > 0;
      if (!customize) {
        bodyContent = defaultRenderList(props, defaultListBodyRef);
      }
      return {
        customize,
        bodyContent,
      };
    };

    const getCheckStatus = (filteredItems: DataSourceItem[]) => {
      const { checkedKeys } = props;
      if (checkedKeys.length === 0) {
        return 'none';
      }
      if (filteredItems.every(item => checkedKeys.indexOf(item.key) >= 0 || !!item.disabled)) {
        return 'all';
      }
      return 'part';
    };

    const getFilteredItems = (dataSource: DataSourceItem[], filterValue: string) => {
      const filteredItems = [];
      const filteredRenderItems = [];

      dataSource.forEach(item => {
        const renderedItem = renderItemHtml(item);
        const { renderedText } = renderedItem;

        // Filter skip
        if (filterValue && filterValue.trim() && !matchFilter(renderedText, item)) {
          return null;
        }

        filteredItems.push(item);
        filteredRenderItems.push(renderedItem);
      });

      return { filteredItems, filteredRenderItems };
    };

    const getCheckBox = (
      filteredItems: DataSourceItem[],
      showSelectAll: boolean,
      disabled?: boolean,
      prefixCls?: string,
    ) => {
      const checkStatus = getCheckStatus(filteredItems);
      const checkedAll = checkStatus === 'all';
      const checkAllCheckbox = showSelectAll !== false && (
        <Checkbox
          disabled={disabled}
          checked={checkedAll}
          indeterminate={checkStatus === 'part'}
          class={`${prefixCls}-checkbox`}
          onChange={() => {
            // Only select enabled items
            emit(
              'itemSelectAll',
              filteredItems.filter(item => !item.disabled).map(({ key }) => key),
              !checkedAll,
            );
          }}
        />
      );

      return checkAllCheckbox;
    };

    const _handleFilter = (e: RadioChangeEvent) => {
      const { handleFilter } = props;
      const {
        target: { value: filter },
      } = e;
      handleFilter(e);
      filterValue.value = filter;
      if (!filter) {
        return;
      }
      // Manually trigger scroll event for lazy search bug
      // https://github.com/ant-design/ant-design/issues/5631
      triggerScrollTimer.value = window.setTimeout(() => {
        const listNode = transferNode.value.querySelectorAll('.ant-transfer-list-content')[0];
        if (listNode) {
          triggerEvent(listNode, 'scroll');
        }
      }, 0);
    };
    const _handleClear = (e: Event) => {
      filterValue.value = '';
      props?.handleClear(e);
    };
    const matchFilter = (text: string, item: DataSourceItem) => {
      const { filterOption } = props;
      if (filterOption) {
        return filterOption(filterValue.value, item);
      }
      return text.indexOf(filterValue.value) >= 0;
    };
    const renderItemHtml = (item: DataSourceItem) => {
      const { renderItem = defaultRender } = props;
      const renderResult = renderItem(item);
      const isRenderResultPlain = isRenderResultPlainObject(renderResult);
      return {
        renderedText: isRenderResultPlain ? renderResult.value : renderResult,
        renderedEl: isRenderResultPlain ? renderResult.label : renderResult,
        item,
      };
    };
    const getSelectAllLabel = (selectedCount: number, totalCount: number) => {
      const { itemsUnit, itemUnit, selectAllLabel } = props;
      if (selectAllLabel) {
        return typeof selectAllLabel === 'function'
          ? selectAllLabel({ selectedCount, totalCount })
          : selectAllLabel;
      }
      const unit = totalCount > 1 ? itemsUnit : itemUnit;
      return (
        <>
          {(selectedCount > 0 ? `${selectedCount}/` : '') + totalCount} {unit}
        </>
      );
    };

    const getListBody = (
      prefixCls: string,
      searchPlaceholder: string,
      filterValue: string,
      filteredItems: DataSourceItem[],
      notFoundContent: unknown,
      bodyDom: unknown,
      filteredRenderItems: unknown,
      checkedKeys: string[],
      renderList: Function,
      showSearch: boolean,
      disabled: boolean,
    ) => {
      const search = showSearch ? (
        <div class={`${prefixCls}-body-search-wrapper`}>
          <Search
            prefixCls={`${prefixCls}-search`}
            onChange={_handleFilter}
            handleClear={_handleClear}
            placeholder={searchPlaceholder}
            value={filterValue}
            disabled={disabled}
          />
        </div>
      ) : null;

      let listBody = bodyDom;
      if (!listBody) {
        let bodyNode: VNodeTypes;
        const { onEvents } = splitAttrs(attrs);
        const { bodyContent, customize } = renderListNode(renderList, {
          ...props,
          filteredItems,
          filteredRenderItems,
          selectedKeys: checkedKeys,
          ...onEvents,
        });

        // We should wrap customize list body in a classNamed div to use flex layout.
        if (customize) {
          bodyNode = <div class={`${prefixCls}-body-customize-wrapper`}>{bodyContent}</div>;
        } else {
          bodyNode = filteredItems.length ? (
            bodyContent
          ) : (
            <div class={`${prefixCls}-body-not-found`}>{notFoundContent}</div>
          );
        }

        listBody = (
          <div
            class={classNames(
              showSearch ? `${prefixCls}-body ${prefixCls}-body-with-search` : `${prefixCls}-body`,
            )}
            ref={transferNode}
          >
            {search}
            {bodyNode}
          </div>
        );
      }
      return listBody;
    };
    return () => {
      const {
        prefixCls,
        dataSource,
        titleText,
        checkedKeys,
        disabled,
        body,
        footer,
        showSearch,
        searchPlaceholder,
        notFoundContent,
        selectAll,
        selectCurrent,
        selectInvert,
        removeAll,
        removeCurrent,
        renderList,
        onItemSelectAll,
        onItemRemove,
        showSelectAll,
        showRemove,
        pagination,
      } = props;

      // Custom Layout
      const footerDom = footer && footer({ ...props });
      const bodyDom = body && body({ ...props });

      const listCls = classNames(prefixCls, {
        [`${prefixCls}-with-pagination`]: !!pagination,
        [`${prefixCls}-with-footer`]: !!footerDom,
      });

      // ====================== Get filtered, checked item list ======================

      const { filteredItems, filteredRenderItems } = getFilteredItems(
        dataSource,
        filterValue.value,
      );

      // ================================= List Body =================================

      const listBody = getListBody(
        prefixCls,
        searchPlaceholder,
        filterValue.value,
        filteredItems,
        notFoundContent,
        bodyDom,
        filteredRenderItems,
        checkedKeys,
        renderList,
        showSearch,
        disabled,
      );

      const listFooter = footerDom ? <div class={`${prefixCls}-footer`}>{footerDom}</div> : null;

      const checkAllCheckbox =
        !showRemove &&
        !pagination &&
        getCheckBox(filteredItems, showSelectAll, disabled, prefixCls);

      let menu = null;
      if (showRemove) {
        menu = (
          <Menu>
            {/* Remove Current Page */}
            {pagination && (
              <Menu.Item
                onClick={() => {
                  const pageKeys = getEnabledItemKeys(
                    (defaultListBodyRef.value.getItems?.() || []).map(entity => entity.item),
                  );
                  onItemRemove?.(pageKeys);
                }}
              >
                {removeCurrent}
              </Menu.Item>
            )}

            {/* Remove All */}
            <Menu.Item
              onClick={() => {
                onItemRemove?.(getEnabledItemKeys(filteredItems));
              }}
            >
              {removeAll}
            </Menu.Item>
          </Menu>
        );
      } else {
        menu = (
          <Menu>
            <Menu.Item
              onClick={() => {
                const keys = getEnabledItemKeys(filteredItems);
                onItemSelectAll(keys, keys.length !== checkedKeys.length);
              }}
            >
              {selectAll}
            </Menu.Item>
            {pagination && (
              <Menu.Item
                onClick={() => {
                  const pageItems = defaultListBodyRef.value?.getItems() || [];
                  onItemSelectAll(getEnabledItemKeys(pageItems.map(entity => entity.item)), true);
                }}
              >
                {selectCurrent}
              </Menu.Item>
            )}
            <Menu.Item
              onClick={() => {
                let availableKeys: string[];
                if (pagination) {
                  availableKeys = getEnabledItemKeys(
                    (defaultListBodyRef.value?.getItems() || []).map(entity => entity.item),
                  );
                } else {
                  availableKeys = getEnabledItemKeys(filteredItems);
                }

                const checkedKeySet = new Set(checkedKeys);
                const newCheckedKeys: string[] = [];
                const newUnCheckedKeys: string[] = [];

                availableKeys.forEach(key => {
                  if (checkedKeySet.has(key)) {
                    newUnCheckedKeys.push(key);
                  } else {
                    newCheckedKeys.push(key);
                  }
                });

                onItemSelectAll(newCheckedKeys, true);
                onItemSelectAll(newUnCheckedKeys, false);
              }}
            >
              {selectInvert}
            </Menu.Item>
          </Menu>
        );
      }

      const dropdown = (
        <Dropdown class={`${prefixCls}-header-dropdown`} overlay={menu} disabled={disabled}>
          <DownOutlined />
        </Dropdown>
      );

      return (
        <div class={listCls} style={attrs.style}>
          <div class={`${prefixCls}-header`}>
            {checkAllCheckbox}
            {dropdown}
            <span class={`${prefixCls}-header-selected`}>
              <span>{getSelectAllLabel(checkedKeys.length, filteredItems.length)}</span>
              <span class={`${prefixCls}-header-title`}>{titleText}</span>
            </span>
          </div>
          {listBody}
          {listFooter}
        </div>
      );
    };
  },
});
