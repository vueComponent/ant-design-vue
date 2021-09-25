import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { isValidElement, splitAttrs, filterEmpty } from '../_util/props-util';
import DownOutlined from '@ant-design/icons-vue/DownOutlined';
import Checkbox from '../checkbox';
import Menu from '../menu';
import Dropdown from '../dropdown';
import Search from './search';
import ListBody from './ListBody';
import type { VNode, VNodeTypes, ExtractPropTypes, PropType } from 'vue';
import { watchEffect, computed, defineComponent, ref } from 'vue';
import type { RadioChangeEvent } from '../radio/interface';
import type { TransferItem } from './index';

const defaultRender = () => null;

function isRenderResultPlainObject(result: VNode) {
  return (
    result &&
    !isValidElement(result) &&
    Object.prototype.toString.call(result) === '[object Object]'
  );
}

function getEnabledItemKeys<RecordType extends TransferItem>(items: RecordType[]) {
  return items.filter(data => !data.disabled).map(data => data.key);
}

export const transferListProps = {
  prefixCls: PropTypes.string,
  dataSource: { type: Array as PropType<TransferItem[]>, default: [] },
  filter: PropTypes.string,
  filterOption: PropTypes.func,
  checkedKeys: PropTypes.arrayOf(PropTypes.string),
  handleFilter: PropTypes.func,
  handleClear: PropTypes.func,
  renderItem: PropTypes.func,
  showSearch: PropTypes.looseBool.def(false),
  searchPlaceholder: PropTypes.string,
  notFoundContent: PropTypes.any,
  itemUnit: PropTypes.string,
  itemsUnit: PropTypes.string,
  renderList: PropTypes.any,
  disabled: PropTypes.looseBool,
  direction: PropTypes.string,
  showSelectAll: PropTypes.looseBool,
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
  props: transferListProps,
  emits: ['scroll', 'itemSelectAll', 'itemRemove', 'itemSelect'],
  slots: ['footer', 'titleText'],
  setup(props, { attrs, slots }) {
    const filterValue = ref('');
    const transferNode = ref();
    const defaultListBodyRef = ref();

    const renderListBody = (renderList: any, props: any) => {
      let bodyContent = renderList ? renderList(props) : null;
      const customize = !!bodyContent && filterEmpty(bodyContent).length > 0;
      if (!customize) {
        bodyContent = <ListBody {...props} ref={defaultListBodyRef} />;
      }
      return {
        customize,
        bodyContent,
      };
    };

    const renderItemHtml = (item: TransferItem) => {
      const { renderItem = defaultRender } = props;
      const renderResult = renderItem(item);
      const isRenderResultPlain = isRenderResultPlainObject(renderResult);
      return {
        renderedText: isRenderResultPlain ? renderResult.value : renderResult,
        renderedEl: isRenderResultPlain ? renderResult.label : renderResult,
        item,
      };
    };

    const filteredItems = ref([]);
    const filteredRenderItems = ref([]);

    watchEffect(() => {
      const fItems = [];
      const fRenderItems = [];

      props.dataSource.forEach(item => {
        const renderedItem = renderItemHtml(item);
        const { renderedText } = renderedItem;

        // Filter skip
        if (filterValue.value && filterValue.value.trim() && !matchFilter(renderedText, item)) {
          return null;
        }

        fItems.push(item);
        fRenderItems.push(renderedItem);
      });
      filteredItems.value = fItems;
      filteredRenderItems.value = fRenderItems;
    });

    const checkStatus = computed(() => {
      const { checkedKeys } = props;
      if (checkedKeys.length === 0) {
        return 'none';
      }
      if (
        filteredItems.value.every(item => checkedKeys.indexOf(item.key) >= 0 || !!item.disabled)
      ) {
        return 'all';
      }
      return 'part';
    });

    const enabledItemKeys = computed(() => {
      return getEnabledItemKeys(filteredItems.value);
    });

    const getNewSelectKeys = (keys, unCheckedKeys) => {
      return Array.from(new Set([...keys, ...props.checkedKeys])).filter(
        key => unCheckedKeys.indexOf(key) === -1,
      );
    };

    const getCheckBox = (showSelectAll: boolean, disabled?: boolean, prefixCls?: string) => {
      const checkedAll = checkStatus.value === 'all';
      const checkAllCheckbox = showSelectAll !== false && (
        <Checkbox
          disabled={disabled}
          checked={checkedAll}
          indeterminate={checkStatus.value === 'part'}
          class={`${prefixCls}-checkbox`}
          onChange={() => {
            // Only select enabled items

            const keys = enabledItemKeys.value;
            props.onItemSelectAll(
              getNewSelectKeys(!checkedAll ? keys : [], checkedAll ? props.checkedKeys : []),
            );
          }}
        />
      );

      return checkAllCheckbox;
    };

    const handleFilter = (e: RadioChangeEvent) => {
      const {
        target: { value: filter },
      } = e;
      filterValue.value = filter;
      props.handleFilter?.(e);
    };
    const handleClear = (e: Event) => {
      filterValue.value = '';
      props.handleClear?.(e);
    };
    const matchFilter = (text: string, item: TransferItem) => {
      const { filterOption } = props;
      if (filterOption) {
        return filterOption(filterValue.value, item);
      }
      return text.indexOf(filterValue.value) >= 0;
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
      checkedKeys: string[],
      renderList: Function,
      showSearch: boolean,
      disabled: boolean,
    ) => {
      const search = showSearch ? (
        <div class={`${prefixCls}-body-search-wrapper`}>
          <Search
            prefixCls={`${prefixCls}-search`}
            onChange={handleFilter}
            handleClear={handleClear}
            placeholder={searchPlaceholder}
            value={filterValue.value}
            disabled={disabled}
          />
        </div>
      ) : null;

      let bodyNode: VNodeTypes;
      const { onEvents } = splitAttrs(attrs);
      const { bodyContent, customize } = renderListBody(renderList, {
        ...props,
        filteredItems: filteredItems.value,
        filteredRenderItems: filteredRenderItems.value,
        selectedKeys: checkedKeys,
        ...onEvents,
      });

      // We should wrap customize list body in a classNamed div to use flex layout.
      if (customize) {
        bodyNode = <div class={`${prefixCls}-body-customize-wrapper`}>{bodyContent}</div>;
      } else {
        bodyNode = filteredItems.value.length ? (
          bodyContent
        ) : (
          <div class={`${prefixCls}-body-not-found`}>{props.notFoundContent}</div>
        );
      }

      return (
        <div
          class={
            showSearch ? `${prefixCls}-body ${prefixCls}-body-with-search` : `${prefixCls}-body`
          }
          ref={transferNode}
        >
          {search}
          {bodyNode}
        </div>
      );
    };

    return () => {
      const {
        prefixCls,
        checkedKeys,
        disabled,
        showSearch,
        searchPlaceholder,
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
      const footerDom = slots.footer?.({ ...props });

      const listCls = classNames(prefixCls, {
        [`${prefixCls}-with-pagination`]: !!pagination,
        [`${prefixCls}-with-footer`]: !!footerDom,
      });

      // ================================= List Body =================================

      const listBody = getListBody(
        prefixCls,
        searchPlaceholder,
        checkedKeys,
        renderList,
        showSearch,
        disabled,
      );

      const listFooter = footerDom ? <div class={`${prefixCls}-footer`}>{footerDom}</div> : null;

      const checkAllCheckbox =
        !showRemove && !pagination && getCheckBox(showSelectAll, disabled, prefixCls);

      let menu = null;
      if (showRemove) {
        menu = (
          <Menu>
            {/* Remove Current Page */}
            {pagination && (
              <Menu.Item
                onClick={() => {
                  const pageKeys = getEnabledItemKeys(
                    (defaultListBodyRef.value.items || []).map(entity => entity.item),
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
                onItemRemove?.(enabledItemKeys.value);
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
                const keys = enabledItemKeys.value;
                onItemSelectAll(getNewSelectKeys(keys, []));
              }}
            >
              {selectAll}
            </Menu.Item>
            {pagination && (
              <Menu.Item
                onClick={() => {
                  const pageKeys = getEnabledItemKeys(
                    (defaultListBodyRef.value.items || []).map(entity => entity.item),
                  );
                  onItemSelectAll(getNewSelectKeys(pageKeys, []));
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
                    (defaultListBodyRef.value.items || []).map(entity => entity.item),
                  );
                } else {
                  availableKeys = enabledItemKeys.value;
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
                onItemSelectAll(getNewSelectKeys(newCheckedKeys, newUnCheckedKeys));
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
              <span>{getSelectAllLabel(checkedKeys.length, filteredItems.value.length)}</span>
              <span class={`${prefixCls}-header-title`}>{slots.titleText?.()}</span>
            </span>
          </div>
          {listBody}
          {listFooter}
        </div>
      );
    };
  },
});
