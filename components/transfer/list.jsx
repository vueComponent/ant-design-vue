import classNames from 'classnames';
import PropTypes from '../_util/vue-types';
import { isValidElement, initDefaultProps } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import getTransitionProps from '../_util/getTransitionProps';
import Checkbox from '../checkbox';
import Search from './search';
import Item from './item';
import triggerEvent from '../_util/triggerEvent';
import addEventListener from '../_util/Dom/addEventListener';

function noop() {}

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
  footer: PropTypes.any,
  lazy: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  disabled: PropTypes.bool,
};

export default {
  name: 'TransferList',
  mixins: [BaseMixin],
  props: initDefaultProps(TransferListProps, {
    dataSource: [],
    titleText: '',
    showSearch: false,
    renderItem: noop,
    lazy: {},
  }),
  data() {
    this.timer = null;
    this.triggerScrollTimer = null;
    return {
      mounted: false,
    };
  },
  mounted() {
    this.timer = setTimeout(() => {
      this.setState({
        mounted: true,
      });
    }, 0);
    this.$nextTick(() => {
      if (this.$refs.listContentWrapper) {
        const listContentWrapperDom = this.$refs.listContentWrapper.$el;
        this.scrollEvent = addEventListener(listContentWrapperDom, 'scroll', this.handleScroll);
      }
    });
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    clearTimeout(this.triggerScrollTimer);
    if (this.scrollEvent) {
      this.scrollEvent.remove();
    }
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
    getCheckStatus(filteredDataSource) {
      const { checkedKeys } = this.$props;
      if (checkedKeys.length === 0) {
        return 'none';
      } else if (filteredDataSource.every(item => checkedKeys.indexOf(item.key) >= 0)) {
        return 'all';
      }
      return 'part';
    },
    _handleSelect(selectedItem) {
      const { checkedKeys } = this.$props;
      const result = checkedKeys.some(key => key === selectedItem.key);
      this.handleSelect(selectedItem, !result);
    },
    _handleFilter(e) {
      this.handleFilter(e);
      if (!e.target.value) {
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
      this.handleClear(e);
    },
    matchFilter(text, item) {
      const { filter, filterOption } = this.$props;
      if (filterOption) {
        return filterOption(filter, item);
      }
      return text.indexOf(filter) >= 0;
    },
    renderItemHtml(item) {
      const { renderItem = noop } = this.$props;
      const renderResult = renderItem(item);
      const isRenderResultPlain = isRenderResultPlainObject(renderResult);
      return {
        renderedText: isRenderResultPlain ? renderResult.value : renderResult,
        renderedEl: isRenderResultPlain ? renderResult.label : renderResult,
      };
    },
    filterNull(arr) {
      return arr.filter(item => {
        return item !== null;
      });
    },
  },

  render() {
    const {
      prefixCls,
      dataSource,
      titleText,
      checkedKeys,
      lazy,
      disabled,
      body,
      footer,
      showSearch,
      filter,
      searchPlaceholder,
      notFoundContent,
      itemUnit,
      itemsUnit,
    } = this.$props;

    // Custom Layout
    const footerDom = footer && footer({ ...this.$props });
    const bodyDom = body && body({ ...this.$props });

    const listCls = classNames(prefixCls, {
      [`${prefixCls}-with-footer`]: !!footerDom,
    });

    const filteredDataSource = [];
    const totalDataSource = [];

    const showItems = dataSource.map(item => {
      const { renderedText, renderedEl } = this.renderItemHtml(item);
      if (filter && filter.trim() && !this.matchFilter(renderedText, item)) {
        return null;
      }

      // all show items
      totalDataSource.push(item);
      if (!item.disabled) {
        // response to checkAll items
        filteredDataSource.push(item);
      }

      const checked = checkedKeys.indexOf(item.key) >= 0;
      return (
        <Item
          disabled={disabled}
          key={item.key}
          item={item}
          lazy={lazy}
          renderedText={renderedText}
          renderedEl={renderedEl}
          checked={checked}
          prefixCls={prefixCls}
          onClick={this._handleSelect}
        />
      );
    });

    const unit = dataSource.length > 1 ? itemsUnit : itemUnit;

    const search = showSearch ? (
      <div class={`${prefixCls}-body-search-wrapper`}>
        <Search
          prefixCls={`${prefixCls}-search`}
          onChange={this._handleFilter}
          handleClear={this.handleClear}
          placeholder={searchPlaceholder}
          value={filter}
          disabled={disabled}
        />
      </div>
    ) : null;
    const transitionName = this.mounted ? `${prefixCls}-content-item-highlight` : '';
    const transitionProps = getTransitionProps(transitionName, {
      leave: noop,
    });

    const searchNotFound = showItems.every(item => item === null) && (
      <div class={`${prefixCls}-body-not-found`}>{notFoundContent}</div>
    );
    const listBody = bodyDom || (
      <div
        class={classNames(
          showSearch ? `${prefixCls}-body ${prefixCls}-body-with-search` : `${prefixCls}-body`,
        )}
      >
        {search}
        {!searchNotFound && (
          <transition-group
            {...transitionProps}
            tag="ul"
            class={`${prefixCls}-content`}
            ref="listContentWrapper"
          >
            {showItems}
          </transition-group>
        )}
        {searchNotFound}
      </div>
    );

    const listFooter = footerDom ? <div class={`${prefixCls}-footer`}>{footerDom}</div> : null;

    const checkStatus = this.getCheckStatus(filteredDataSource);
    const checkedAll = checkStatus === 'all';
    const checkAllCheckbox = (
      <Checkbox
        ref="checkbox"
        disabled={disabled}
        checked={checkedAll}
        indeterminate={checkStatus === 'part'}
        onChange={() => {
          this.handleSelectAll(filteredDataSource, checkedAll);
        }}
      />
    );

    return (
      <div class={listCls}>
        <div class={`${prefixCls}-header`}>
          {checkAllCheckbox}
          <span class={`${prefixCls}-header-selected`}>
            <span>
              {(checkedKeys.length > 0 ? `${checkedKeys.length}/` : '') + totalDataSource.length}{' '}
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
