import classNames from '../_util/classNames';
import PropTypes, { withUndefined } from '../_util/vue-types';
import { isValidElement, splitAttrs, findDOMNode, filterEmpty } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import BaseMixin from '../_util/BaseMixin';
import Checkbox from '../checkbox';
import Search from './search';
import defaultRenderList from './renderListBody';
import triggerEvent from '../_util/triggerEvent';
import type { VNode, VNodeTypes } from 'vue';
import { defineComponent, nextTick } from 'vue';
import type { RadioChangeEvent } from '../radio/interface';

const defaultRender = () => null;

const TransferItem = {
  key: PropTypes.string,
  title: PropTypes.string,
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

export const TransferListProps = {
  prefixCls: PropTypes.string,
  titleText: PropTypes.string,
  dataSource: PropTypes.arrayOf(PropTypes.shape(TransferItem).loose),
  filter: PropTypes.string,
  filterOption: PropTypes.func,
  checkedKeys: PropTypes.arrayOf(PropTypes.string),
  handleFilter: PropTypes.func,
  handleSelect: PropTypes.func,
  handleSelectAll: PropTypes.func,
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
  onItemSelect: PropTypes.func,
  onItemSelectAll: PropTypes.func,
  onScroll: PropTypes.func,
};

function renderListNode(renderList: Function, props: any) {
  let bodyContent = renderList ? renderList(props) : null;
  const customize = !!bodyContent && filterEmpty(bodyContent).length > 0;
  if (!customize) {
    bodyContent = defaultRenderList(props);
  }
  return {
    customize,
    bodyContent,
  };
}

export default defineComponent({
  name: 'TransferList',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: initDefaultProps(TransferListProps, {
    dataSource: [],
    titleText: '',
    showSearch: false,
    lazy: {},
  }),
  setup() {
    return {
      timer: null,
      triggerScrollTimer: null,
      scrollEvent: null,
    };
  },
  data() {
    return {
      filterValue: '',
    };
  },
  beforeUnmount() {
    clearTimeout(this.triggerScrollTimer);
    // if (this.scrollEvent) {
    //   this.scrollEvent.remove();
    // }
  },
  updated() {
    nextTick(() => {
      if (this.scrollEvent) {
        this.scrollEvent.remove();
      }
    });
  },
  methods: {
    handleScroll(e: Event) {
      this.$emit('scroll', e);
    },
    getCheckStatus(filteredItems: DataSourceItem[]) {
      const { checkedKeys } = this.$props;
      if (checkedKeys.length === 0) {
        return 'none';
      }
      if (filteredItems.every(item => checkedKeys.indexOf(item.key) >= 0 || !!item.disabled)) {
        return 'all';
      }
      return 'part';
    },

    getFilteredItems(dataSource: DataSourceItem[], filterValue: string) {
      const filteredItems = [];
      const filteredRenderItems = [];

      dataSource.forEach(item => {
        const renderedItem = this.renderItemHtml(item);
        const { renderedText } = renderedItem;

        // Filter skip
        if (filterValue && filterValue.trim() && !this.matchFilter(renderedText, item)) {
          return null;
        }

        filteredItems.push(item);
        filteredRenderItems.push(renderedItem);
      });

      return { filteredItems, filteredRenderItems };
    },

    getListBody(
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
    ) {
      const search = showSearch ? (
        <div class={`${prefixCls}-body-search-wrapper`}>
          <Search
            prefixCls={`${prefixCls}-search`}
            onChange={this._handleFilter}
            handleClear={this._handleClear}
            placeholder={searchPlaceholder}
            value={filterValue}
            disabled={disabled}
          />
        </div>
      ) : null;

      let listBody = bodyDom;
      if (!listBody) {
        let bodyNode: VNodeTypes;
        const { onEvents } = splitAttrs(this.$attrs);
        const { bodyContent, customize } = renderListNode(renderList, {
          ...this.$props,
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
          >
            {search}
            {bodyNode}
          </div>
        );
      }
      return listBody;
    },

    getCheckBox(filteredItems: DataSourceItem[], showSelectAll: boolean, disabled: boolean) {
      const checkStatus = this.getCheckStatus(filteredItems);
      const checkedAll = checkStatus === 'all';
      const checkAllCheckbox = showSelectAll !== false && (
        <Checkbox
          disabled={disabled}
          checked={checkedAll}
          indeterminate={checkStatus === 'part'}
          onChange={() => {
            // Only select enabled items
            this.$emit(
              'itemSelectAll',
              filteredItems.filter(item => !item.disabled).map(({ key }) => key),
              !checkedAll,
            );
          }}
        />
      );

      return checkAllCheckbox;
    },

    _handleSelect(selectedItem: DataSourceItem) {
      const { checkedKeys } = this.$props;
      const result = checkedKeys.some(key => key === selectedItem.key);
      this.handleSelect(selectedItem, !result);
    },
    _handleFilter(e: RadioChangeEvent) {
      const { handleFilter } = this.$props;
      const {
        target: { value: filterValue },
      } = e;
      this.setState({ filterValue });
      handleFilter(e);
      if (!filterValue) {
        return;
      }
      // Manually trigger scroll event for lazy search bug
      // https://github.com/ant-design/ant-design/issues/5631
      this.triggerScrollTimer = setTimeout(() => {
        const transferNode = findDOMNode(this);
        const listNode = transferNode.querySelectorAll('.ant-transfer-list-content')[0];
        if (listNode) {
          triggerEvent(listNode, 'scroll');
        }
      }, 0);
    },
    _handleClear(e: Event) {
      this.setState({ filterValue: '' });
      this.handleClear(e);
    },
    matchFilter(text: string, item: DataSourceItem) {
      const { filterValue } = this.$data;
      const { filterOption } = this.$props;
      if (filterOption) {
        return filterOption(filterValue, item);
      }
      return text.indexOf(filterValue) >= 0;
    },
    renderItemHtml(item: DataSourceItem) {
      const { renderItem = defaultRender } = this.$props;
      const renderResult = renderItem(item);
      const isRenderResultPlain = isRenderResultPlainObject(renderResult);
      return {
        renderedText: isRenderResultPlain ? renderResult.value : renderResult,
        renderedEl: isRenderResultPlain ? renderResult.label : renderResult,
        item,
      };
    },
    filterNull(arr: unknown[]) {
      return arr.filter(item => {
        return item !== null;
      });
    },
  },

  render() {
    const { filterValue } = this.$data;
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
      itemUnit,
      itemsUnit,
      renderList,
      showSelectAll,
    } = this.$props;

    // Custom Layout
    const footerDom = footer && footer({ ...this.$props });
    const bodyDom = body && body({ ...this.$props });

    const listCls = classNames(prefixCls, {
      [`${prefixCls}-with-footer`]: !!footerDom,
    });

    // ====================== Get filtered, checked item list ======================

    const { filteredItems, filteredRenderItems } = this.getFilteredItems(dataSource, filterValue);

    // ================================= List Body =================================

    const unit = dataSource.length > 1 ? itemsUnit : itemUnit;

    const listBody = this.getListBody(
      prefixCls,
      searchPlaceholder,
      filterValue,
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

    const checkAllCheckbox = this.getCheckBox(filteredItems, showSelectAll, disabled);

    return (
      <div class={listCls} style={this.$attrs.style}>
        <div class={`${prefixCls}-header`}>
          {checkAllCheckbox}
          <span class={`${prefixCls}-header-selected`}>
            <span>
              {(checkedKeys.length > 0 ? `${checkedKeys.length}/` : '') + filteredItems.length}{' '}
              {unit}
            </span>
            <span class={`${prefixCls}-header-title`}>{titleText}</span>
          </span>
        </div>
        {listBody}
        {listFooter}
      </div>
    );
  },
});
