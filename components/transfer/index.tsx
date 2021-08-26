import { defineComponent, inject } from 'vue';
import PropTypes from '../_util/vue-types';
import { hasProp, getOptionProps, getComponent } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import BaseMixin from '../_util/BaseMixin';
import classNames from '../_util/classNames';
import List from './list';
import Operation from './operation';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale-provider/default';
import type { RenderEmptyHandler } from '../config-provider';
import { defaultConfigProvider } from '../config-provider';
import { withInstall } from '../_util/type';

export type TransferDirection = 'left' | 'right';

export const TransferItem = {
  key: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  disabled: PropTypes.looseBool,
};

export const TransferProps = {
  prefixCls: PropTypes.string,
  dataSource: PropTypes.arrayOf(PropTypes.shape(TransferItem).loose),
  disabled: PropTypes.looseBool,
  targetKeys: PropTypes.arrayOf(PropTypes.string),
  selectedKeys: PropTypes.arrayOf(PropTypes.string),
  render: PropTypes.func,
  listStyle: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  operationStyle: PropTypes.object,
  titles: PropTypes.arrayOf(PropTypes.string),
  operations: PropTypes.arrayOf(PropTypes.string),
  showSearch: PropTypes.looseBool,
  filterOption: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  notFoundContent: PropTypes.any,
  locale: PropTypes.object,
  rowKey: PropTypes.func,
  lazy: PropTypes.oneOfType([PropTypes.object, PropTypes.looseBool]),
  showSelectAll: PropTypes.looseBool,
  children: PropTypes.any,
  onChange: PropTypes.func,
  onSelectChange: PropTypes.func,
  onSearchChange: PropTypes.func,
  onSearch: PropTypes.func,
  onScroll: PropTypes.func,
};

export interface TransferLocale {
  titles: string[];
  notFoundContent: string;
  searchPlaceholder: string;
  itemUnit: string;
  itemsUnit: string;
}

const Transfer = defineComponent({
  name: 'ATransfer',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: initDefaultProps(TransferProps, {
    dataSource: [],
    locale: {},
    showSearch: false,
    listStyle: () => {},
  }),
  setup() {
    return {
      separatedDataSource: null,
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  data() {
    // vue 中 通过slot，不方便传递，保留notFoundContent及searchPlaceholder
    // warning(
    //   !(getComponent(this, 'notFoundContent') || hasProp(this, 'searchPlaceholder')),
    //   'Transfer[notFoundContent] and Transfer[searchPlaceholder] will be removed, ' +
    //   'please use Transfer[locale] instead.',
    // )
    const { selectedKeys = [], targetKeys = [] } = this;
    return {
      leftFilter: '',
      rightFilter: '',
      sourceSelectedKeys: selectedKeys.filter(key => targetKeys.indexOf(key) === -1),
      targetSelectedKeys: selectedKeys.filter(key => targetKeys.indexOf(key) > -1),
    };
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
  mounted() {
    // this.currentProps = { ...this.$props }
  },
  methods: {
    getSelectedKeysName(direction) {
      return direction === 'left' ? 'sourceSelectedKeys' : 'targetSelectedKeys';
    },

    getTitles(transferLocale: TransferLocale) {
      if (this.titles) {
        return this.titles;
      }
      return transferLocale.titles || ['', ''];
    },

    getLocale(transferLocale: TransferLocale, renderEmpty: RenderEmptyHandler) {
      // Keep old locale props still working.
      const oldLocale: { notFoundContent?: any; searchPlaceholder?: string } = {
        notFoundContent: renderEmpty('Transfer'),
      };
      const notFoundContent = getComponent(this, 'notFoundContent');
      if (notFoundContent) {
        oldLocale.notFoundContent = notFoundContent;
      }
      if (hasProp(this, 'searchPlaceholder')) {
        oldLocale.searchPlaceholder = this.$props.searchPlaceholder;
      }

      return { ...transferLocale, ...oldLocale, ...this.$props.locale };
    },
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

    moveTo(direction: TransferDirection) {
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

    onItemSelectAll(direction: TransferDirection, selectedKeys: string[], checkAll: boolean) {
      const originalSelectedKeys = this.$data[this.getSelectedKeysName(direction)] || [];

      let mergedCheckedKeys = [];
      if (checkAll) {
        // Merge current keys with origin key
        mergedCheckedKeys = Array.from(new Set([...originalSelectedKeys, ...selectedKeys]));
      } else {
        // Remove current keys from origin keys
        mergedCheckedKeys = originalSelectedKeys.filter(key => selectedKeys.indexOf(key) === -1);
      }

      this.handleSelectChange(direction, mergedCheckedKeys);

      if (!this.$props.selectedKeys) {
        this.setState({
          [this.getSelectedKeysName(direction)]: mergedCheckedKeys,
        });
      }
    },

    handleSelectAll(direction, filteredDataSource, checkAll) {
      this.onItemSelectAll(
        direction,
        filteredDataSource.map(({ key }) => key),
        !checkAll,
      );
    },

    // [Legacy] Old prop `body` pass origin check as arg. It's confusing.
    // TODO: Remove this in next version.
    handleLeftSelectAll(filteredDataSource, checkAll) {
      return this.handleSelectAll('left', filteredDataSource, !checkAll);
    },

    handleRightSelectAll(filteredDataSource, checkAll) {
      return this.handleSelectAll('right', filteredDataSource, !checkAll);
    },

    onLeftItemSelectAll(selectedKeys, checkAll) {
      return this.onItemSelectAll('left', selectedKeys, checkAll);
    },

    onRightItemSelectAll(selectedKeys, checkAll) {
      return this.onItemSelectAll('right', selectedKeys, checkAll);
    },

    handleFilter(direction, e) {
      const value = e.target.value;
      // if (getListeners(this).searchChange) {
      //   warning(
      //     false,
      //     'Transfer',
      //     '`searchChange` in Transfer is deprecated. Please use `search` instead.',
      //   );
      //   this.$emit('searchChange', direction, e);
      // }
      this.$emit('search', direction, value);
    },

    handleLeftFilter(e) {
      this.handleFilter('left', e);
    },
    handleRightFilter(e) {
      this.handleFilter('right', e);
    },

    handleClear(direction) {
      this.$emit('search', direction, '');
    },

    handleLeftClear() {
      this.handleClear('left');
    },
    handleRightClear() {
      this.handleClear('right');
    },

    onItemSelect(direction, selectedKey, checked) {
      const { sourceSelectedKeys, targetSelectedKeys } = this;
      const holder = direction === 'left' ? [...sourceSelectedKeys] : [...targetSelectedKeys];
      const index = holder.indexOf(selectedKey);
      if (index > -1) {
        holder.splice(index, 1);
      }
      if (checked) {
        holder.push(selectedKey);
      }
      this.handleSelectChange(direction, holder);

      if (!this.selectedKeys) {
        this.setState({
          [this.getSelectedKeysName(direction)]: holder,
        });
      }
    },

    // handleSelect(direction, selectedItem, checked) {
    //   warning(false, 'Transfer', '`handleSelect` will be removed, please use `onSelect` instead.');
    //   this.onItemSelect(direction, selectedItem.key, checked);
    // },

    // handleLeftSelect(selectedItem, checked) {
    //   return this.handleSelect('left', selectedItem, checked);
    // },

    // handleRightSelect(selectedItem, checked) {
    //   return this.handleSelect('right', selectedItem, checked);
    // },

    onLeftItemSelect(selectedKey, checked) {
      return this.onItemSelect('left', selectedKey, checked);
    },
    onRightItemSelect(selectedKey, checked) {
      return this.onItemSelect('right', selectedKey, checked);
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

    handleSelectChange(direction: TransferDirection, holder: string[]) {
      const { sourceSelectedKeys, targetSelectedKeys } = this;

      if (direction === 'left') {
        this.$emit('selectChange', holder, targetSelectedKeys);
      } else {
        this.$emit('selectChange', sourceSelectedKeys, holder);
      }
    },
    handleListStyle(listStyle, direction) {
      if (typeof listStyle === 'function') {
        return listStyle({ direction });
      }
      return listStyle;
    },

    separateDataSource() {
      const { dataSource, rowKey, targetKeys = [] } = this.$props;

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

      return {
        leftDataSource,
        rightDataSource,
      };
    },

    renderTransfer(transferLocale: TransferLocale) {
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
        showSelectAll,
      } = props;
      const { class: className, style } = this.$attrs;
      const children = getComponent(this, 'children', {}, false);
      const getPrefixCls = this.configProvider.getPrefixCls;
      const prefixCls = getPrefixCls('transfer', customizePrefixCls);

      const renderEmpty = this.configProvider.renderEmpty;
      const locale = this.getLocale(transferLocale, renderEmpty);
      const { sourceSelectedKeys, targetSelectedKeys, $slots } = this;
      const { body, footer } = $slots;
      const renderItem = props.render || this.$slots.render;
      const { leftDataSource, rightDataSource } = this.separateDataSource();
      const leftActive = targetSelectedKeys.length > 0;
      const rightActive = sourceSelectedKeys.length > 0;

      const cls = classNames(prefixCls, className, {
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-customize-list`]: !!children,
      });
      const titles = this.getTitles(locale);
      return (
        <div class={cls} style={style}>
          <List
            key="leftList"
            prefixCls={`${prefixCls}-list`}
            titleText={titles[0]}
            dataSource={leftDataSource}
            filterOption={filterOption}
            style={this.handleListStyle(listStyle, 'left')}
            checkedKeys={sourceSelectedKeys}
            handleFilter={this.handleLeftFilter}
            handleClear={this.handleLeftClear}
            // handleSelect={this.handleLeftSelect}
            handleSelectAll={this.handleLeftSelectAll}
            onItemSelect={this.onLeftItemSelect}
            onItemSelectAll={this.onLeftItemSelectAll}
            renderItem={renderItem}
            showSearch={showSearch}
            body={body}
            renderList={children}
            footer={footer}
            lazy={lazy}
            onScroll={this.handleLeftScroll}
            disabled={disabled}
            direction="left"
            showSelectAll={showSelectAll}
            itemUnit={locale.itemUnit}
            itemsUnit={locale.itemsUnit}
            notFoundContent={locale.notFoundContent}
            searchPlaceholder={locale.searchPlaceholder}
          />
          <Operation
            key="operation"
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
            key="rightList"
            prefixCls={`${prefixCls}-list`}
            titleText={titles[1]}
            dataSource={rightDataSource}
            filterOption={filterOption}
            style={this.handleListStyle(listStyle, 'right')}
            checkedKeys={targetSelectedKeys}
            handleFilter={this.handleRightFilter}
            handleClear={this.handleRightClear}
            // handleSelect={this.handleRightSelect}
            handleSelectAll={this.handleRightSelectAll}
            onItemSelect={this.onRightItemSelect}
            onItemSelectAll={this.onRightItemSelectAll}
            renderItem={renderItem}
            showSearch={showSearch}
            body={body}
            renderList={children}
            footer={footer}
            lazy={lazy}
            onScroll={this.handleRightScroll}
            disabled={disabled}
            direction="right"
            showSelectAll={showSelectAll}
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
        children={this.renderTransfer}
      />
    );
  },
});

export default withInstall(Transfer);
