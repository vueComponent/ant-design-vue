import type { CSSProperties, ExtractPropTypes } from 'vue';
import { computed, watchEffect, defineComponent, ref, watch, toRaw } from 'vue';
import PropTypes from '../_util/vue-types';
import { getPropsSlot } from '../_util/props-util';
import classNames from '../_util/classNames';
import List from './list';
import Operation from './operation';
import LocaleReceiver from '../locale-provider/LocaleReceiver';

import defaultLocale from '../locale/en_US';
import type { VueNode, CustomSlotsType } from '../_util/type';
import {
  withInstall,
  stringType,
  arrayType,
  someType,
  booleanType,
  objectType,
  functionType,
} from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';

import type { TransferListBodyProps } from './ListBody';
import type { PaginationType } from './interface';
import { FormItemInputContext, useInjectFormItemContext } from '../form/FormItemContext';
import type { RenderEmptyHandler } from '../config-provider/renderEmpty';
import type { InputStatus } from '../_util/statusUtils';
import { getStatusClassNames, getMergedStatus } from '../_util/statusUtils';
import { groupKeysMap, groupDisabledKeysMap } from '../_util/transKeys';
// CSSINJS
import useStyle from './style';

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
  titles?: VueNode[];
  notFoundContent?: VueNode;
  searchPlaceholder: string;
  itemUnit: string;
  itemsUnit: string;
  remove?: string;
  selectAll?: string;
  selectCurrent?: string;
  selectInvert?: string;
  removeAll?: string;
  removeCurrent?: string;
}

export const transferProps = () => ({
  id: String,
  prefixCls: String,
  dataSource: arrayType<TransferItem[]>([]),
  disabled: booleanType(),
  targetKeys: arrayType<string[]>(),
  selectedKeys: arrayType<string[]>(),
  render: functionType<TransferRender<TransferItem>>(),
  listStyle: someType<((style: ListStyle) => CSSProperties) | CSSProperties>(
    [Function, Object],
    () => ({}),
  ),
  operationStyle: objectType<CSSProperties>(undefined as CSSProperties),
  titles: arrayType<string[]>(),
  operations: arrayType<string[]>(),
  showSearch: booleanType(false),
  filterOption: functionType<(inputValue: string, item: TransferItem) => boolean>(),
  searchPlaceholder: String,
  notFoundContent: PropTypes.any,
  locale: objectType(),
  rowKey: functionType<(record: TransferItem) => string>(),
  showSelectAll: booleanType(),
  selectAllLabels: arrayType<SelectAllLabel[]>(),
  children: functionType<(props: TransferListBodyProps) => VueNode>(),
  oneWay: booleanType(),
  pagination: someType<PaginationType>([Object, Boolean]),
  status: stringType<InputStatus>(),
  onChange:
    functionType<
      (targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => void
    >(),
  onSelectChange:
    functionType<(sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void>(),
  onSearch: functionType<(direction: TransferDirection, value: string) => void>(),
  onScroll: functionType<(direction: TransferDirection, e: UIEvent) => void>(),
  'onUpdate:targetKeys': functionType<(keys: string[]) => void>(),
  'onUpdate:selectedKeys': functionType<(keys: string[]) => void>(),
});

export type TransferProps = Partial<ExtractPropTypes<ReturnType<typeof transferProps>>>;

const Transfer = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATransfer',
  inheritAttrs: false,
  props: transferProps(),
  slots: Object as CustomSlotsType<{
    leftTitle?: any;
    rightTitle?: any;
    children?: any;
    render?: TransferItem;
    notFoundContent?: any;
    leftSelectAllLabel?: any;
    rightSelectAllLabel?: any;
    footer?: any;
    default?: any;
  }>,
  // emits: ['update:targetKeys', 'update:selectedKeys', 'change', 'search', 'scroll', 'selectChange'],
  setup(props, { emit, attrs, slots, expose }) {
    const { configProvider, prefixCls, direction } = useConfigInject('transfer', props);

    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const sourceSelectedKeys = ref([]);
    const targetSelectedKeys = ref([]);

    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));
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
      const dataSourceDisabledKeysMap = groupDisabledKeysMap(dataSource);
      // filter the disabled options
      const newMoveKeys = moveKeys.filter(key => !dataSourceDisabledKeysMap.has(key));
      const newMoveKeysMap = groupKeysMap(newMoveKeys);

      // move items to target box
      const newTargetKeys =
        direction === 'right'
          ? newMoveKeys.concat(targetKeys)
          : targetKeys.filter(targetKey => !newMoveKeysMap.has(targetKey));

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

    const handleScroll = (direction: TransferDirection, e: UIEvent) => {
      emit('scroll', direction, e);
    };

    const handleLeftScroll = (e: UIEvent) => {
      handleScroll('left', e);
    };
    const handleRightScroll = (e: UIEvent) => {
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
      const targetKeysMap = groupKeysMap(targetKeys);
      dataSource.forEach(record => {
        if (rowKey) {
          record.key = rowKey(record);
        }

        // rightData should be ordered by targetKeys
        // leftData should be ordered by dataSource
        if (targetKeysMap.has(record.key)) {
          rd[targetKeysMap.get(record.key)!] = record;
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

      const cls = classNames(
        prefixCls.value,
        className,
        {
          [`${prefixCls.value}-disabled`]: disabled,
          [`${prefixCls.value}-customize-list`]: !!children,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        getStatusClassNames(prefixCls.value, mergedStatus.value, formItemInputContext.hasFeedback),
        hashId.value,
      );
      const titles = props.titles;
      const leftTitle =
        (titles && titles[0]) ?? slots.leftTitle?.() ?? (locale.titles || ['', ''])[0];
      const rightTitle =
        (titles && titles[1]) ?? slots.rightTitle?.() ?? (locale.titles || ['', ''])[1];
      return (
        <div {...attrs} class={cls} style={style as CSSProperties} id={id}>
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
            direction={direction.value === 'rtl' ? 'right' : 'left'}
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
            direction={direction.value === 'rtl' ? 'left' : 'right'}
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
    return () =>
      wrapSSR(
        <LocaleReceiver
          componentName="Transfer"
          defaultLocale={defaultLocale.Transfer}
          children={renderTransfer}
        />,
      );
  },
});

export default withInstall(Transfer);
