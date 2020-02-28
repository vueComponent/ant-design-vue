import classNames from 'classnames';
import PropTypes from '../_util/vue-types';
import { isValidElement, initDefaultProps, getListeners } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import Checkbox from '../checkbox';
import Search from './search';
import defaultRenderList from './renderListBody';
import triggerEvent from '../_util/triggerEvent';
import addEventListener from '../vc-util/Dom/addEventListener';

const defaultRender = () => null;

const TransferItem = {
  key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  disabled: PropTypes.bool,
};

function isRenderResultPlainObject(result) {
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
  showSearch: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  notFoundContent: PropTypes.any,
  itemUnit: PropTypes.string,
  itemsUnit: PropTypes.string,
  body: PropTypes.any,
  renderList: PropTypes.any,
  footer: PropTypes.any,
  lazy: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  disabled: PropTypes.bool,
  direction: PropTypes.string,
  showSelectAll: PropTypes.bool,
};

function renderListNode(h, renderList, props) {
  let bodyContent = renderList ? renderList(props) : null;
  const customize = !!bodyContent;
  if (!customize) {
    bodyContent = defaultRenderList(h, props);
  }
  return {
    customize,
    bodyContent,
  };
}

export default {
  name: 'TransferList',
  mixins: [BaseMixin],
  props: initDefaultProps(TransferListProps, {
    dataSource: [],
    titleText: '',
    showSearch: false,
    lazy: {},
  }),
  data() {
    this.timer = null;
    this.triggerScrollTimer = null;
    return {
      filterValue: '',
    };
  },
  // mounted() {
  //   this.timer = setTimeout(() => {
  //     this.setState({
  //       mounted: true,
  //     });
  //   }, 0);
  //   this.$nextTick(() => {
  //     if (this.$refs.listContentWrapper) {
  //       const listContentWrapperDom = this.$refs.listContentWrapper.$el;
  //       this.scrollEvent = addEventListener(listContentWrapperDom, 'scroll', this.handleScroll);
  //     }
  //   });
  // },
  beforeDestroy() {
    clearTimeout(this.triggerScrollTimer);
    // if (this.scrollEvent) {
    //   this.scrollEvent.remove();
    // }
  },
  updated() {
    this.$nextTick(() => {
      if (this.scrollEvent) {
        this.scrollEvent.remove();
      }
      if (this.$refs.listContentWrapper) {
        const listContentWrapperDom = this.$refs.listContentWrapper.$el;
        this.scrollEvent = addEventListener(listContentWrapperDom, 'scroll', this.handleScroll);
      }
    });
  },
  methods: {
    handleScroll(e) {
      this.$emit('scroll', e);
    },
    getCheckStatus(filteredItems) {
      const { checkedKeys } = this.$props;
      if (checkedKeys.length === 0) {
        return 'none';
      }
      if (filteredItems.every(item => checkedKeys.indexOf(item.key) >= 0 || !!item.disabled)) {
        return 'all';
      }
      return 'part';
    },

    getFilteredItems(dataSource, filterValue) {
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
        let bodyNode;

        const { bodyContent, customize } = renderListNode(this.$createElement, renderList, {
          props: { ...this.$props, filteredItems, filteredRenderItems, selectedKeys: checkedKeys },
          on: getListeners(this),
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

    getCheckBox(filteredItems, showSelectAll, disabled) {
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

    _handleSelect(selectedItem) {
      const { checkedKeys } = this.$props;
      const result = checkedKeys.some(key => key === selectedItem.key);
      this.handleSelect(selectedItem, !result);
    },
    _handleFilter(e) {
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
        const transferNode = this.$el;
        const listNode = transferNode.querySelectorAll('.ant-transfer-list-content')[0];
        if (listNode) {
          triggerEvent(listNode, 'scroll');
        }
      }, 0);
    },
    _handleClear(e) {
      this.setState({ filterValue: '' });
      this.handleClear(e);
    },
    matchFilter(text, item) {
      const { filterValue } = this.$data;
      const { filterOption } = this.$props;
      if (filterOption) {
        return filterOption(filterValue, item);
      }
      return text.indexOf(filterValue) >= 0;
    },
    renderItemHtml(item) {
      const { renderItem = defaultRender } = this.$props;
      const renderResult = renderItem(item);
      const isRenderResultPlain = isRenderResultPlainObject(renderResult);
      return {
        renderedText: isRenderResultPlain ? renderResult.value : renderResult,
        renderedEl: isRenderResultPlain ? renderResult.label : renderResult,
        item,
      };
    },
    filterNull(arr) {
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
      <div class={listCls}>
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
};
