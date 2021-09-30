import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { watchEffect, defineComponent, ref, watch, toRaw } from 'vue';
import PropTypes from '../_util/vue-types';
import { getPropsSlot } from '../_util/props-util';
import classNames from '../_util/classNames';
import List from './list';
import Operation from './operation';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale-provider/default';
import type { RenderEmptyHandler } from '../config-provider';
import type { VueNode } from '../_util/type';
import { withInstall } from '../_util/type';
import useConfigInject from '../_util/hooks/useConfigInject';
import type { TransferListBodyProps } from './ListBody';
import type { PaginationType } from './interface';
import { useInjectFormItemContext } from '../form/FormItemContext';

export type { TransferListProps } from './list';
export type { TransferOperationProps } from './operation';
export type { TransferSearchProps } from './search';

export type TransferDirection = 'left' | 'right';

export interface RenderResultObject {
  label: VueNode;
  value: string;
}

export type RenderResult = VueNode | RenderResultObject | string | null;

export interface TransferItem {
  key?: string;
  title?: string;
  description?: string;
  disabled?: boolean;
  [name: string]: any;
}

export type KeyWise<T> = T & { key: string };

export type KeyWiseTransferItem = KeyWise<TransferItem>;

type TransferRender<RecordType> = (item: RecordType) => RenderResult;

export interface ListStyle {
  direction: TransferDirection;
}

export type SelectAllLabel =
  | VueNode
  | ((info: { selectedCount: number; totalCount: number }) => VueNode);

export interface TransferLocale {
  titles: VueNode[];
  notFoundContent?: VueNode;
  searchPlaceholder: string;
  itemUnit: string;
  itemsUnit: string;
  remove: string;
  selectAll: string;
  selectCurrent: string;
  selectInvert: string;
  removeAll: string;
  removeCurrent: string;
}

export const transferProps = {
  id: String,
  prefixCls: String,
  dataSource: { type: Array as PropType<TransferItem[]>, default: [] },
  disabled: { type: Boolean, default: undefined },
  targetKeys: { type: Array as PropType<string[]>, default: undefined },
  selectedKeys: { type: Array as PropType<string[]>, default: undefined },
  render: { type: Function as PropType<TransferRender<TransferItem>> },
  listStyle: {
    type: [Function, Object] as PropType<((style: ListStyle) => CSSProperties) | CSSProperties>,
    default: () => ({}),
  },
  operationStyle: PropTypes.style,
  titles: { type: Array as PropType<string[]> },
  operations: { type: Array as PropType<string[]> },
  showSearch: { type: Boolean, default: false },
  filterOption: { type: Function as PropType<(inputValue: string, item: TransferItem) => boolean> },
  searchPlaceholder: String,
  notFoundContent: PropTypes.any,
  locale: { type: Object as PropType<Partial<TransferLocale>>, default: () => ({}) },
  rowKey: { type: Function as PropType<(record: TransferItem) => string> },
  showSelectAll: { type: Boolean, default: undefined },
  selectAllLabels: { type: Array as PropType<SelectAllLabel[]> },
  children: { type: Function as PropType<(props: TransferListBodyProps) => VueNode> },
  oneWay: { type: Boolean, default: undefined },
  pagination: { type: [Object, Boolean] as PropType<PaginationType>, default: undefined },
};

export type TransferProps = Partial<ExtractPropTypes<typeof transferProps>>;

const Transfer = defineComponent({
  name: 'ATransfer',
  inheritAttrs: false,
  props: transferProps,
  slots: [
    'leftTitle',
    'rightTitle',
    'children',
    'render',
    'notFoundContent',
    'leftSelectAllLabel',
    'rightSelectAllLabel',
    'footer',
  ],
  emits: ['update:targetKeys', 'update:selectedKeys', 'change', 'search', 'scroll', 'selectChange'],
  setup(props, { emit, attrs, slots, expose }) {
    const { configProvider, prefixCls, direction } = useConfigInject('transfer', props);
    const sourceSelectedKeys = ref([]);
    const targetSelectedKeys = ref([]);

    const formItemContext = useInjectFormItemContext();
    watch(
      () => props.selectedKeys,
      () => {
        sourceSelectedKeys.value =
          props.selectedKeys?.filter(key => props.targetKeys.indexOf(key) === -1) || [];
        targetSelectedKeys.value =
          props.selectedKeys?.filter(key => props.targetKeys.indexOf(key) > -1) || [];
      },
      { immediate: true },
    );

    const getLocale = (transferLocale: TransferLocale, renderEmpty: RenderEmptyHandler) => {
      // Keep old locale props still working.
      const oldLocale: { notFoundContent?: any; searchPlaceholder?: string } = {
        notFoundContent: renderEmpty('Transfer'),
      };
      const notFoundContent = getPropsSlot(slots, props, 'notFoundContent');
      if (notFoundContent) {
        oldLocale.notFoundContent = notFoundContent;
      }
      if (props.searchPlaceholder !== undefined) {
        oldLocale.searchPlaceholder = props.searchPlaceholder;
      }

      return { ...transferLocale, ...oldLocale, ...props.locale };
    };

    const moveTo = (direction: TransferDirection) => {
      const { targetKeys = [], dataSource = [] } = props;
      const moveKeys = direction === 'right' ? sourceSelectedKeys.value : targetSelectedKeys.value;
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
      direction === 'right' ? (sourceSelectedKeys.value = []) : (targetSelectedKeys.value = []);
      emit('update:targetKeys', newTargetKeys);
      handleSelectChange(oppositeDirection, []);
      emit('change', newTargetKeys, direction, newMoveKeys);
      formItemContext.onFieldChange();
    };

    const moveToLeft = () => {
      moveTo('left');
    };
    const moveToRight = () => {
      moveTo('right');
    };

    const onItemSelectAll = (direction: TransferDirection, selectedKeys: string[]) => {
      handleSelectChange(direction, selectedKeys);
    };

    const onLeftItemSelectAll = (selectedKeys: string[]) => {
      return onItemSelectAll('left', selectedKeys);
    };

    const onRightItemSelectAll = (selectedKeys: string[]) => {
      return onItemSelectAll('right', selectedKeys);
    };

    const handleSelectChange = (direction: TransferDirection, holder: string[]) => {
      if (direction === 'left') {
        if (!props.selectedKeys) {
          sourceSelectedKeys.value = holder;
        }
        emit('update:selectedKeys', [...holder, ...targetSelectedKeys.value]);
        emit('selectChange', holder, toRaw(targetSelectedKeys.value));
      } else {
        if (!props.selectedKeys) {
          targetSelectedKeys.value = holder;
        }
        emit('update:selectedKeys', [...holder, ...sourceSelectedKeys.value]);
        emit('selectChange', toRaw(sourceSelectedKeys.value), holder);
      }
    };

    const handleFilter = (direction: TransferDirection, e) => {
      const value = e.target.value;
      emit('search', direction, value);
    };

    const handleLeftFilter = (e: Event) => {
      handleFilter('left', e);
    };
    const handleRightFilter = (e: Event) => {
      handleFilter('right', e);
    };

    const handleClear = (direction: TransferDirection) => {
      emit('search', direction, '');
    };

    const handleLeftClear = () => {
      handleClear('left');
    };

    const handleRightClear = () => {
      handleClear('right');
    };

    const onItemSelect = (direction: TransferDirection, selectedKey: string, checked: boolean) => {
      const holder =
        direction === 'left' ? [...sourceSelectedKeys.value] : [...targetSelectedKeys.value];
      const index = holder.indexOf(selectedKey);
      if (index > -1) {
        holder.splice(index, 1);
      }
      if (checked) {
        holder.push(selectedKey);
      }
      handleSelectChange(direction, holder);
    };

    const onLeftItemSelect = (selectedKey: string, checked: boolean) => {
      return onItemSelect('left', selectedKey, checked);
    };
    const onRightItemSelect = (selectedKey: string, checked: boolean) => {
      return onItemSelect('right', selectedKey, checked);
    };
    const onRightItemRemove = (targetedKeys: string[]) => {
      const { targetKeys = [] } = props;
      const newTargetKeys = targetKeys.filter(key => !targetedKeys.includes(key));
      emit('update:targetKeys', newTargetKeys);
      emit('change', newTargetKeys, 'left', [...targetedKeys]);
    };

    const handleScroll = (direction: TransferDirection, e: Event) => {
      emit('scroll', direction, e);
    };

    const handleLeftScroll = (e: Event) => {
      handleScroll('left', e);
    };
    const handleRightScroll = (e: Event) => {
      handleScroll('right', e);
    };
    const handleListStyle = (
      listStyle: ((style: ListStyle) => CSSProperties) | CSSProperties,
      direction: TransferDirection,
    ) => {
      if (typeof listStyle === 'function') {
        return listStyle({ direction });
      }
      return listStyle;
    };

    const leftDataSource = ref([]);
    const rightDataSource = ref([]);

    watchEffect(() => {
      const { dataSource, rowKey, targetKeys = [] } = props;

      const ld = [];
      const rd = new Array(targetKeys.length);
      dataSource.forEach(record => {
        if (rowKey) {
          record.key = rowKey(record);
        }

        // rightDataSource should be ordered by targetKeys
        // leftDataSource should be ordered by dataSource
        const indexOfKey = targetKeys.indexOf(record.key);
        if (indexOfKey !== -1) {
          rd[indexOfKey] = record;
        } else {
          ld.push(record);
        }
      });

      leftDataSource.value = ld;
      rightDataSource.value = rd;
    });

    expose({ handleSelectChange });

    const renderTransfer = (transferLocale: TransferLocale) => {
      const {
        disabled,
        operations = [],
        showSearch,
        listStyle,
        operationStyle,
        filterOption,
        showSelectAll,
        selectAllLabels = [],
        oneWay,
        pagination,
        id = formItemContext.id.value,
      } = props;
      const { class: className, style } = attrs;

      const children = slots.children;
      const mergedPagination = !children && pagination;

      const renderEmpty = configProvider.renderEmpty;
      const locale = getLocale(transferLocale, renderEmpty);
      const { footer } = slots;
      const renderItem = props.render || slots.render;
      const leftActive = targetSelectedKeys.value.length > 0;
      const rightActive = sourceSelectedKeys.value.length > 0;

      const cls = classNames(prefixCls.value, className, {
        [`${prefixCls.value}-disabled`]: disabled,
        [`${prefixCls.value}-customize-list`]: !!children,
      });
      const titles = props.titles;
      const leftTitle =
        (titles && titles[0]) ?? slots.leftTitle?.() ?? (locale.titles || ['', ''])[0];
      const rightTitle =
        (titles && titles[1]) ?? slots.rightTitle?.() ?? (locale.titles || ['', ''])[1];
      return (
        <div class={cls} style={style} id={id}>
          <List
            key="leftList"
            prefixCls={`${prefixCls.value}-list`}
            dataSource={leftDataSource.value}
            filterOption={filterOption}
            style={handleListStyle(listStyle, 'left')}
            checkedKeys={sourceSelectedKeys.value}
            handleFilter={handleLeftFilter}
            handleClear={handleLeftClear}
            onItemSelect={onLeftItemSelect}
            onItemSelectAll={onLeftItemSelectAll}
            renderItem={renderItem}
            showSearch={showSearch}
            renderList={children}
            onScroll={handleLeftScroll}
            disabled={disabled}
            direction="left"
            showSelectAll={showSelectAll}
            selectAllLabel={selectAllLabels[0] || slots.leftSelectAllLabel}
            pagination={mergedPagination}
            {...locale}
            v-slots={{ titleText: () => leftTitle, footer }}
          />
          <Operation
            key="operation"
            class={`${prefixCls.value}-operation`}
            rightActive={rightActive}
            rightArrowText={operations[0]}
            moveToRight={moveToRight}
            leftActive={leftActive}
            leftArrowText={operations[1]}
            moveToLeft={moveToLeft}
            style={operationStyle}
            disabled={disabled}
            direction={direction.value}
            oneWay={oneWay}
          />
          <List
            key="rightList"
            prefixCls={`${prefixCls.value}-list`}
            dataSource={rightDataSource.value}
            filterOption={filterOption}
            style={handleListStyle(listStyle, 'right')}
            checkedKeys={targetSelectedKeys.value}
            handleFilter={handleRightFilter}
            handleClear={handleRightClear}
            onItemSelect={onRightItemSelect}
            onItemSelectAll={onRightItemSelectAll}
            onItemRemove={onRightItemRemove}
            renderItem={renderItem}
            showSearch={showSearch}
            renderList={children}
            onScroll={handleRightScroll}
            disabled={disabled}
            direction="right"
            showSelectAll={showSelectAll}
            selectAllLabel={selectAllLabels[1] || slots.rightSelectAllLabel}
            showRemove={oneWay}
            pagination={mergedPagination}
            {...locale}
            v-slots={{ titleText: () => rightTitle, footer }}
          />
        </div>
      );
    };
    return () => (
      <LocaleReceiver
        componentName="Transfer"
        defaultLocale={defaultLocale.Transfer}
        children={renderTransfer}
      />
    );
  },
});

export default withInstall(Transfer);
