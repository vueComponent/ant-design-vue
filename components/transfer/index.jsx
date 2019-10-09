import PropTypes from '../_util/vue-types';
import {
  hasProp,
  initDefaultProps,
  getOptionProps,
  getComponentFromProp,
} from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import classNames from 'classnames';
import List from './list';
import Operation from './operation';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale-provider/default';
import { ConfigConsumerProps } from '../config-provider';
import warning from '../_util/warning';
import Base from '../base';

export const TransferDirection = 'left' | 'right';

export const TransferItem = {
  key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  disabled: PropTypes.bool,
};

export const TransferProps = {
  prefixCls: PropTypes.string,
  dataSource: PropTypes.arrayOf(PropTypes.shape(TransferItem).loose),
  disabled: PropTypes.boolean,
  targetKeys: PropTypes.arrayOf(PropTypes.string),
  selectedKeys: PropTypes.arrayOf(PropTypes.string),
  render: PropTypes.func,
  listStyle: PropTypes.object,
  operationStyle: PropTypes.object,
  titles: PropTypes.arrayOf(PropTypes.string),
  operations: PropTypes.arrayOf(PropTypes.string),
  showSearch: PropTypes.bool,
  filterOption: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  notFoundContent: PropTypes.any,
  locale: PropTypes.object,
  rowKey: PropTypes.func,
  lazy: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

export const TransferLocale = {
  titles: PropTypes.arrayOf(PropTypes.string),
  notFoundContent: PropTypes.string,
  itemUnit: PropTypes.string,
  itemsUnit: PropTypes.string,
};

const Transfer = {
  name: 'ATransfer',
  mixins: [BaseMixin],
  props: initDefaultProps(TransferProps, {
    dataSource: [],
    locale: {},
    showSearch: false,
  }),
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    // vue 中 通过slot，不方便传递，保留notFoundContent及searchPlaceholder
    // warning(
    //   !(getComponentFromProp(this, 'notFoundContent') || hasProp(this, 'searchPlaceholder')),
    //   'Transfer[notFoundContent] and Transfer[searchPlaceholder] will be removed, ' +
    //   'please use Transfer[locale] instead.',
    // )

    this.separatedDataSource =
      {
        leftDataSource: [],
        rightDataSource: [],
      } | null;
    const { selectedKeys = [], targetKeys = [] } = this;
    return {
      leftFilter: '',
      rightFilter: '',
      sourceSelectedKeys: selectedKeys.filter(key => targetKeys.indexOf(key) === -1),
      targetSelectedKeys: selectedKeys.filter(key => targetKeys.indexOf(key) > -1),
    };
  },
  mounted() {
    // this.currentProps = { ...this.$props }
  },
  watch: {
    targetKeys() {
      this.updateState();
      if (this.selectedKeys) {
        const targetKeys = this.targetKeys || [];
        this.setState({
          sourceSelectedKeys: this.selectedKeys.filter(key => !targetKeys.includes(key)),
          targetSelectedKeys: this.selectedKeys.filter(key => targetKeys.includes(key)),
        });
      }
    },
    dataSource() {
      this.updateState();
    },
    selectedKeys() {
      if (this.selectedKeys) {
        const targetKeys = this.targetKeys || [];
        this.setState({
          sourceSelectedKeys: this.selectedKeys.filter(key => !targetKeys.includes(key)),
          targetSelectedKeys: this.selectedKeys.filter(key => targetKeys.includes(key)),
        });
      }
    },
  },
  methods: {
    updateState() {
      const { sourceSelectedKeys, targetSelectedKeys } = this;
      this.separatedDataSource = null;
      if (!this.selectedKeys) {
        // clear key nolonger existed
        // clear checkedKeys according to targetKeys
        const { dataSource, targetKeys = [] } = this;

        const newSourceSelectedKeys = [];
        const newTargetSelectedKeys = [];
        dataSource.forEach(({ key }) => {
          if (sourceSelectedKeys.includes(key) && !targetKeys.includes(key)) {
            newSourceSelectedKeys.push(key);
          }
          if (targetSelectedKeys.includes(key) && targetKeys.includes(key)) {
            newTargetSelectedKeys.push(key);
          }
        });
        this.setState({
          sourceSelectedKeys: newSourceSelectedKeys,
          targetSelectedKeys: newTargetSelectedKeys,
        });
      }
    },
    separateDataSource(props) {
      if (this.separatedDataSource) {
        return this.separatedDataSource;
      }

      const { dataSource, rowKey, targetKeys = [] } = props;

      const leftDataSource = [];
      const rightDataSource = new Array(targetKeys.length);
      dataSource.forEach(record => {
        if (rowKey) {
          record.key = rowKey(record);
        }

        // rightDataSource should be ordered by targetKeys
        // leftDataSource should be ordered by dataSource
        const indexOfKey = targetKeys.indexOf(record.key);
        if (indexOfKey !== -1) {
          rightDataSource[indexOfKey] = record;
        } else {
          leftDataSource.push(record);
        }
      });

      this.separatedDataSource = {
        leftDataSource,
        rightDataSource,
      };

      return this.separatedDataSource;
    },

    moveTo(direction) {
      const { targetKeys = [], dataSource = [] } = this.$props;
      const { sourceSelectedKeys, targetSelectedKeys } = this;
      const moveKeys = direction === 'right' ? sourceSelectedKeys : targetSelectedKeys;
      // filter the disabled options
      const newMoveKeys = moveKeys.filter(
        key => !dataSource.some(data => !!(key === data.key && data.disabled)),
      );
      // move items to target box
      const newTargetKeys =
        direction === 'right'
          ? newMoveKeys.concat(targetKeys)
          : targetKeys.filter(targetKey => newMoveKeys.indexOf(targetKey) === -1);

      // empty checked keys
      const oppositeDirection = direction === 'right' ? 'left' : 'right';
      this.setState({
        [this.getSelectedKeysName(oppositeDirection)]: [],
      });
      this.handleSelectChange(oppositeDirection, []);

      this.$emit('change', newTargetKeys, direction, newMoveKeys);
    },
    moveToLeft() {
      this.moveTo('left');
    },
    moveToRight() {
      this.moveTo('right');
    },

    handleSelectChange(direction, holder) {
      const { sourceSelectedKeys, targetSelectedKeys } = this;

      if (direction === 'left') {
        this.$emit('selectChange', holder, targetSelectedKeys);
      } else {
        this.$emit('selectChange', sourceSelectedKeys, holder);
      }
    },
    handleSelectAll(direction, filteredDataSource, checkAll) {
      const originalSelectedKeys = this[this.getSelectedKeysName(direction)] || [];
      const currentKeys = filteredDataSource.map(item => item.key);
      // Only operate current keys from original selected keys
      const newKeys1 = originalSelectedKeys.filter(key => currentKeys.indexOf(key) === -1);
      const newKeys2 = [...originalSelectedKeys];
      currentKeys.forEach(key => {
        if (newKeys2.indexOf(key) === -1) {
          newKeys2.push(key);
        }
      });
      const holder = checkAll ? newKeys1 : newKeys2;
      this.handleSelectChange(direction, holder);

      if (!this.selectedKeys) {
        this.setState({
          [this.getSelectedKeysName(direction)]: holder,
        });
      }
    },

    handleLeftSelectAll(filteredDataSource, checkAll) {
      this.handleSelectAll('left', filteredDataSource, checkAll);
    },
    handleRightSelectAll(filteredDataSource, checkAll) {
      this.handleSelectAll('right', filteredDataSource, checkAll);
    },

    handleFilter(direction, e) {
      const value = e.target.value;
      this.setState({
        // add filter
        [`${direction}Filter`]: value,
      });
      if (this.$listeners.searchChange) {
        warning(false, '`searchChange` in Transfer is deprecated. Please use `search` instead.');
        this.$emit('searchChange', direction, e);
      }
      this.$emit('search', direction, value);
    },

    handleLeftFilter(e) {
      this.handleFilter('left', e);
    },
    handleRightFilter(e) {
      this.handleFilter('right', e);
    },

    handleClear(direction) {
      this.setState({
        [`${direction}Filter`]: '',
      });
      this.$emit('search', direction, '');
    },

    handleLeftClear() {
      this.handleClear('left');
    },
    handleRightClear() {
      this.handleClear('right');
    },

    handleSelect(direction, selectedItem, checked) {
      const { sourceSelectedKeys, targetSelectedKeys } = this;
      const holder = direction === 'left' ? [...sourceSelectedKeys] : [...targetSelectedKeys];
      const index = holder.indexOf(selectedItem.key);
      if (index > -1) {
        holder.splice(index, 1);
      }
      if (checked) {
        holder.push(selectedItem.key);
      }
      this.handleSelectChange(direction, holder);

      if (!this.selectedKeys) {
        this.setState({
          [this.getSelectedKeysName(direction)]: holder,
        });
      }
    },

    handleLeftSelect(selectedItem, checked) {
      return this.handleSelect('left', selectedItem, checked);
    },

    handleRightSelect(selectedItem, checked) {
      return this.handleSelect('right', selectedItem, checked);
    },

    handleScroll(direction, e) {
      this.$emit('scroll', direction, e);
    },

    handleLeftScroll(e) {
      this.handleScroll('left', e);
    },
    handleRightScroll(e) {
      this.handleScroll('right', e);
    },

    getTitles(transferLocale) {
      if (this.titles) {
        return this.titles;
      }
      return transferLocale.titles || ['', ''];
    },

    getSelectedKeysName(direction) {
      return direction === 'left' ? 'sourceSelectedKeys' : 'targetSelectedKeys';
    },

    getLocale(transferLocale, renderEmpty) {
      const h = this.$createElement;
      // Keep old locale props still working.
      const oldLocale = {
        notFoundContent: renderEmpty(h, 'Transfer'),
      };
      const notFoundContent = getComponentFromProp(this, 'notFoundContent');
      if (notFoundContent) {
        oldLocale.notFoundContent = notFoundContent;
      }
      if (hasProp(this, 'searchPlaceholder')) {
        oldLocale.searchPlaceholder = this.$props.searchPlaceholder;
      }

      return { ...transferLocale, ...oldLocale, ...this.$props.locale };
    },

    renderTransfer(transferLocale) {
      const props = getOptionProps(this);
      const {
        prefixCls: customizePrefixCls,
        disabled,
        operations = [],
        showSearch,
        listStyle,
        operationStyle,
        filterOption,
        lazy,
      } = props;
      const getPrefixCls = this.configProvider.getPrefixCls;
      const prefixCls = getPrefixCls('transfer', customizePrefixCls);

      const renderEmpty = this.configProvider.renderEmpty;
      const locale = this.getLocale(transferLocale, renderEmpty);
      const {
        leftFilter,
        rightFilter,
        sourceSelectedKeys,
        targetSelectedKeys,
        $scopedSlots,
      } = this;
      const { body, footer } = $scopedSlots;
      const renderItem = props.render;
      const { leftDataSource, rightDataSource } = this.separateDataSource(this.$props);
      const leftActive = targetSelectedKeys.length > 0;
      const rightActive = sourceSelectedKeys.length > 0;

      const cls = classNames(prefixCls, disabled && `${prefixCls}-disabled`);

      const titles = this.getTitles(locale);
      return (
        <div class={cls}>
          <List
            prefixCls={`${prefixCls}-list`}
            titleText={titles[0]}
            dataSource={leftDataSource}
            filter={leftFilter}
            filterOption={filterOption}
            style={listStyle}
            checkedKeys={sourceSelectedKeys}
            handleFilter={this.handleLeftFilter}
            handleClear={this.handleLeftClear}
            handleSelect={this.handleLeftSelect}
            handleSelectAll={this.handleLeftSelectAll}
            renderItem={renderItem}
            showSearch={showSearch}
            body={body}
            footer={footer}
            lazy={lazy}
            onScroll={this.handleLeftScroll}
            disabled={disabled}
            itemUnit={locale.itemUnit}
            itemsUnit={locale.itemsUnit}
            notFoundContent={locale.notFoundContent}
            searchPlaceholder={locale.searchPlaceholder}
          />
          <Operation
            class={`${prefixCls}-operation`}
            rightActive={rightActive}
            rightArrowText={operations[0]}
            moveToRight={this.moveToRight}
            leftActive={leftActive}
            leftArrowText={operations[1]}
            moveToLeft={this.moveToLeft}
            style={operationStyle}
            disabled={disabled}
          />
          <List
            prefixCls={`${prefixCls}-list`}
            titleText={titles[1]}
            dataSource={rightDataSource}
            filter={rightFilter}
            filterOption={filterOption}
            style={listStyle}
            checkedKeys={targetSelectedKeys}
            handleFilter={this.handleRightFilter}
            handleClear={this.handleRightClear}
            handleSelect={this.handleRightSelect}
            handleSelectAll={this.handleRightSelectAll}
            renderItem={renderItem}
            showSearch={showSearch}
            body={body}
            footer={footer}
            lazy={lazy}
            onScroll={this.handleRightScroll}
            disabled={disabled}
            itemUnit={locale.itemUnit}
            itemsUnit={locale.itemsUnit}
            notFoundContent={locale.notFoundContent}
            searchPlaceholder={locale.searchPlaceholder}
          />
        </div>
      );
    },
  },
  render() {
    return (
      <LocaleReceiver
        componentName="Transfer"
        defaultLocale={defaultLocale.Transfer}
        scopedSlots={{ default: this.renderTransfer }}
      />
    );
  },
};

/* istanbul ignore next */
Transfer.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Transfer.name, Transfer);
};

export default Transfer;
