import OptionList from './OptionList';
import { formatStrategyValues, SHOW_CHILD } from './utils/strategyUtil';
import type { CheckedStrategy } from './utils/strategyUtil';
import { useProvideSelectContext } from './TreeSelectContext';
import type { TreeSelectContextProps } from './TreeSelectContext';
import type { LegacyContextProps } from './LegacyContext';
import { useProvideLegacySelectContext } from './LegacyContext';
import useTreeData from './hooks/useTreeData';
import { toArray, fillFieldNames, isNil } from './utils/valueUtil';
import useCache from './hooks/useCache';
import useDataEntities from './hooks/useDataEntities';
import { fillAdditionalInfo, fillLegacyProps } from './utils/legacyUtil';
import useCheckedKeys from './hooks/useCheckedKeys';
import useFilterTreeData from './hooks/useFilterTreeData';
import warningProps from './utils/warningPropsUtil';
import type { Key } from './interface';
import type { DisplayValueType } from '../vc-select/BaseSelect';
import { baseSelectPropsWithoutPrivate } from '../vc-select/BaseSelect';
import { computed, defineComponent, ref, shallowRef, toRaw, toRef, toRefs, watchEffect } from 'vue';
import type { ExtractPropTypes, PropType } from 'vue';
import omit from '../_util/omit';
import PropTypes from '../_util/vue-types';
import type { SelectProps, BaseSelectProps, BaseSelectRef } from '../vc-select';
import { BaseSelect } from '../vc-select';
import { initDefaultProps } from '../_util/props-util';
import useId from '../vc-select/hooks/useId';
import useMergedState from '../_util/hooks/useMergedState';
import type { VueNode } from '../_util/type';
import { conductCheck } from '../vc-tree/utils/conductUtil';
import { warning } from '../vc-util/warning';
import { toReactive } from '../_util/toReactive';
import useMaxLevel from '../vc-tree/useMaxLevel';
import type { ExpandAction } from '../vc-tree/props';

export type OnInternalSelect = (value: RawValueType, info: { selected: boolean }) => void;

export type RawValueType = string | number;

export interface LabeledValueType {
  key?: Key;
  value?: RawValueType;
  label?: any;
  /** Only works on `treeCheckStrictly` */
  halfChecked?: boolean;
}

export type SelectSource = 'option' | 'selection' | 'input' | 'clear';

export type DraftValueType = RawValueType | LabeledValueType | (RawValueType | LabeledValueType)[];

/** @deprecated This is only used for legacy compatible. Not works on new code. */
export interface LegacyCheckedNode {
  pos: string;
  node: any;
  children?: LegacyCheckedNode[];
}

export interface ChangeEventExtra {
  /** @deprecated Please save prev value by control logic instead */
  preValue: LabeledValueType[];
  triggerValue: RawValueType;
  /** @deprecated Use `onSelect` or `onDeselect` instead. */
  selected?: boolean;
  /** @deprecated Use `onSelect` or `onDeselect` instead. */
  checked?: boolean;

  // Not sure if exist user still use this. We have to keep but not recommend user to use
  /** @deprecated This prop not work as react node anymore. */
  triggerNode: any;
  /** @deprecated This prop not work as react node anymore. */
  allCheckedNodes: LegacyCheckedNode[];
}

export interface FieldNames {
  value?: string;
  label?: string;
  children?: string;
}

export interface InternalFieldName extends Omit<FieldNames, 'label'> {
  _title: string[];
}

export interface SimpleModeConfig {
  id?: Key;
  pId?: Key;
  rootPId?: Key;
}

export interface BaseOptionType {
  disabled?: boolean;
  checkable?: boolean;
  disableCheckbox?: boolean;
  children?: BaseOptionType[];
  [name: string]: any;
}

export interface DefaultOptionType extends BaseOptionType {
  value?: RawValueType;
  title?: any;
  label?: any;
  key?: Key;
  children?: DefaultOptionType[];
}

export interface LegacyDataNode extends DefaultOptionType {
  props: any;
}

export function treeSelectProps<
  ValueType = any,
  OptionType extends BaseOptionType = DefaultOptionType,
>() {
  return {
    ...omit(baseSelectPropsWithoutPrivate(), ['mode']),

    prefixCls: String,
    id: String,
    value: { type: [String, Number, Object, Array] as PropType<ValueType> },
    defaultValue: { type: [String, Number, Object, Array] as PropType<ValueType> },
    onChange: {
      type: Function as PropType<
        (value: ValueType, labelList: any[], extra: ChangeEventExtra) => void
      >,
    },
    searchValue: String,
    /** @deprecated Use `searchValue` instead */
    inputValue: String,
    onSearch: { type: Function as PropType<(value: string) => void> },
    autoClearSearchValue: { type: Boolean, default: undefined },

    filterTreeNode: {
      type: [Boolean, Function] as PropType<
        boolean | ((inputValue: string, treeNode: DefaultOptionType) => boolean)
      >,
      default: undefined,
    },
    treeNodeFilterProp: String,

    // >>> Select
    onSelect: Function as PropType<SelectProps['onSelect']>,
    onDeselect: Function as PropType<SelectProps['onDeselect']>,

    showCheckedStrategy: { type: String as PropType<CheckedStrategy> },
    treeNodeLabelProp: String,

    fieldNames: { type: Object as PropType<FieldNames> },

    // >>> Mode
    multiple: { type: Boolean, default: undefined },
    treeCheckable: { type: Boolean, default: undefined },
    treeCheckStrictly: { type: Boolean, default: undefined },
    labelInValue: { type: Boolean, default: undefined },

    // >>> Data
    treeData: { type: Array as PropType<OptionType[]> },
    treeDataSimpleMode: {
      type: [Boolean, Object] as PropType<boolean | SimpleModeConfig>,
      default: undefined,
    },
    loadData: { type: Function as PropType<(dataNode: LegacyDataNode) => Promise<unknown>> },
    treeLoadedKeys: { type: Array as PropType<Key[]> },
    onTreeLoad: { type: Function as PropType<(loadedKeys: Key[]) => void> },

    // >>> Expanded
    treeDefaultExpandAll: { type: Boolean, default: undefined },
    treeExpandedKeys: { type: Array as PropType<Key[]> },
    treeDefaultExpandedKeys: { type: Array as PropType<Key[]> },
    onTreeExpand: { type: Function as PropType<(expandedKeys: Key[]) => void> },

    // >>> Options
    virtual: { type: Boolean, default: undefined },
    listHeight: Number,
    listItemHeight: Number,
    onDropdownVisibleChange: { type: Function as PropType<(open: boolean) => void> },

    // >>> Tree
    treeLine: { type: [Boolean, Object], default: undefined },
    treeIcon: PropTypes.any,
    showTreeIcon: { type: Boolean, default: undefined },
    switcherIcon: PropTypes.any,
    treeMotion: PropTypes.any,
    children: Array as PropType<VueNode[]>,
    treeExpandAction: String as PropType<ExpandAction>,

    showArrow: { type: Boolean, default: undefined },
    showSearch: { type: Boolean, default: undefined },
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: undefined },

    disabled: { type: Boolean, default: undefined },

    placeholder: PropTypes.any,

    maxTagPlaceholder: { type: Function as PropType<(omittedValues: DisplayValueType[]) => any> },

    dropdownPopupAlign: PropTypes.any,
    customSlots: Object,
  };
}

export type TreeSelectProps = Partial<ExtractPropTypes<ReturnType<typeof treeSelectProps>>>;

function isRawValue(value: RawValueType | LabeledValueType): value is RawValueType {
  return !value || typeof value !== 'object';
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'TreeSelect',
  inheritAttrs: false,
  props: initDefaultProps(treeSelectProps(), {
    treeNodeFilterProp: 'value',
    autoClearSearchValue: true,
    showCheckedStrategy: SHOW_CHILD,
    listHeight: 200,
    listItemHeight: 20,
    prefixCls: 'vc-tree-select',
  }),
  setup(props, { attrs, expose, slots }) {
    const mergedId = useId(toRef(props, 'id'));
    const treeConduction = computed(() => props.treeCheckable && !props.treeCheckStrictly);
    const mergedCheckable = computed(() => props.treeCheckable || props.treeCheckStrictly);
    const mergedLabelInValue = computed(() => props.treeCheckStrictly || props.labelInValue);
    const mergedMultiple = computed(() => mergedCheckable.value || props.multiple);

    // ========================== Warning ===========================
    if (process.env.NODE_ENV !== 'production') {
      watchEffect(() => {
        warningProps(props);
      });
    }

    // ========================= FieldNames =========================
    const mergedFieldNames = computed<InternalFieldName>(() => fillFieldNames(props.fieldNames));

    // =========================== Search ===========================
    const [mergedSearchValue, setSearchValue] = useMergedState('', {
      value: computed(() =>
        props.searchValue !== undefined ? props.searchValue : props.inputValue,
      ),
      postState: search => search || '',
    });

    const onInternalSearch: BaseSelectProps['onSearch'] = searchText => {
      setSearchValue(searchText);
      props.onSearch?.(searchText);
    };

    // ============================ Data ============================
    // `useTreeData` only do convert of `children` or `simpleMode`.
    // Else will return origin `treeData` for perf consideration.
    // Do not do anything to loop the data.
    const mergedTreeData = useTreeData(
      toRef(props, 'treeData'),
      toRef(props, 'children'),
      toRef(props, 'treeDataSimpleMode'),
    );

    const { keyEntities, valueEntities } = useDataEntities(mergedTreeData, mergedFieldNames);

    /** Get `missingRawValues` which not exist in the tree yet */
    const splitRawValues = (newRawValues: RawValueType[]) => {
      const missingRawValues = [];
      const existRawValues = [];

      // Keep missing value in the cache
      newRawValues.forEach(val => {
        if (valueEntities.value.has(val)) {
          existRawValues.push(val);
        } else {
          missingRawValues.push(val);
        }
      });

      return { missingRawValues, existRawValues };
    };

    // Filtered Tree
    const filteredTreeData = useFilterTreeData(mergedTreeData, mergedSearchValue, {
      fieldNames: mergedFieldNames,
      treeNodeFilterProp: toRef(props, 'treeNodeFilterProp'),
      filterTreeNode: toRef(props, 'filterTreeNode'),
    });

    // =========================== Label ============================
    const getLabel = (item: DefaultOptionType) => {
      if (item) {
        if (props.treeNodeLabelProp) {
          return item[props.treeNodeLabelProp];
        }

        // Loop from fieldNames
        const { _title: titleList } = mergedFieldNames.value;

        for (let i = 0; i < titleList.length; i += 1) {
          const title = item[titleList[i]];
          if (title !== undefined) {
            return title;
          }
        }
      }
    };

    // ========================= Wrap Value =========================
    const toLabeledValues = (draftValues: DraftValueType) => {
      const values = toArray(draftValues);

      return values.map(val => {
        if (isRawValue(val)) {
          return { value: val };
        }
        return val;
      });
    };

    const convert2LabelValues = (draftValues: DraftValueType) => {
      const values = toLabeledValues(draftValues);

      return values.map(item => {
        let { label: rawLabel } = item;
        const { value: rawValue, halfChecked: rawHalfChecked } = item;

        let rawDisabled: boolean | undefined;

        const entity = valueEntities.value.get(rawValue);

        // Fill missing label & status
        if (entity) {
          rawLabel = rawLabel ?? getLabel(entity.node);
          rawDisabled = entity.node.disabled;
        }

        return {
          label: rawLabel,
          value: rawValue,
          halfChecked: rawHalfChecked,
          disabled: rawDisabled,
        };
      });
    };

    // =========================== Values ===========================
    const [internalValue, setInternalValue] = useMergedState(props.defaultValue, {
      value: toRef(props, 'value'),
    });

    const rawMixedLabeledValues = computed(() => toLabeledValues(internalValue.value));

    // Split value into full check and half check
    const rawLabeledValues = shallowRef([]);
    const rawHalfLabeledValues = shallowRef([]);
    watchEffect(() => {
      const fullCheckValues: LabeledValueType[] = [];
      const halfCheckValues: LabeledValueType[] = [];

      rawMixedLabeledValues.value.forEach(item => {
        if (item.halfChecked) {
          halfCheckValues.push(item);
        } else {
          fullCheckValues.push(item);
        }
      });

      rawLabeledValues.value = fullCheckValues;
      rawHalfLabeledValues.value = halfCheckValues;
    });

    // const [mergedValues] = useCache(rawLabeledValues);
    const rawValues = computed(() => rawLabeledValues.value.map(item => item.value));
    const { maxLevel, levelEntities } = useMaxLevel(keyEntities);
    // Convert value to key. Will fill missed keys for conduct check.
    const [rawCheckedValues, rawHalfCheckedValues] = useCheckedKeys(
      rawLabeledValues,
      rawHalfLabeledValues,
      treeConduction,
      keyEntities,
      maxLevel,
      levelEntities,
    );

    // Convert rawCheckedKeys to check strategy related values
    const displayValues = computed(() => {
      // Collect keys which need to show
      const displayKeys = formatStrategyValues(
        rawCheckedValues.value,
        props.showCheckedStrategy,
        keyEntities.value,
        mergedFieldNames.value,
      );

      // Convert to value and filled with label
      const values = displayKeys.map(
        key => keyEntities.value[key]?.node?.[mergedFieldNames.value.value] ?? key,
      );
      // Back fill with origin label
      const labeledValues = values.map(val => {
        const targetItem = rawLabeledValues.value.find(item => item.value === val);
        return {
          value: val,
          label: targetItem?.label,
        };
      });
      const rawDisplayValues = convert2LabelValues(labeledValues);

      const firstVal = rawDisplayValues[0];

      if (!mergedMultiple.value && firstVal && isNil(firstVal.value) && isNil(firstVal.label)) {
        return [];
      }
      return rawDisplayValues.map(item => ({
        ...item,
        label: item.label ?? item.value,
      }));
    });

    const [cachedDisplayValues] = useCache(displayValues);

    // =========================== Change ===========================
    const triggerChange = (
      newRawValues: RawValueType[],
      extra: { triggerValue?: RawValueType; selected?: boolean },
      source: SelectSource,
    ) => {
      const labeledValues = convert2LabelValues(newRawValues);
      setInternalValue(labeledValues);

      // Clean up if needed
      if (props.autoClearSearchValue) {
        setSearchValue('');
      }

      // Generate rest parameters is costly, so only do it when necessary
      if (props.onChange) {
        let eventValues: RawValueType[] = newRawValues;
        if (treeConduction.value) {
          const formattedKeyList = formatStrategyValues(
            newRawValues,
            props.showCheckedStrategy,
            keyEntities.value,
            mergedFieldNames.value,
          );
          eventValues = formattedKeyList.map(key => {
            const entity = valueEntities.value.get(key);
            return entity ? entity.node[mergedFieldNames.value.value] : key;
          });
        }

        const { triggerValue, selected } = extra || {
          triggerValue: undefined,
          selected: undefined,
        };

        let returnRawValues: (LabeledValueType | RawValueType)[] = eventValues;

        // We need fill half check back
        if (props.treeCheckStrictly) {
          const halfValues = rawHalfLabeledValues.value.filter(
            item => !eventValues.includes(item.value),
          );

          returnRawValues = [...returnRawValues, ...halfValues];
        }

        const returnLabeledValues = convert2LabelValues(returnRawValues);
        const additionalInfo = {
          // [Legacy] Always return as array contains label & value
          preValue: rawLabeledValues.value,
          triggerValue,
        } as ChangeEventExtra;

        // [Legacy] Fill legacy data if user query.
        // This is expansive that we only fill when user query
        // https://github.com/react-component/tree-select/blob/fe33eb7c27830c9ac70cd1fdb1ebbe7bc679c16a/src/Select.jsx
        let showPosition = true;
        if (props.treeCheckStrictly || (source === 'selection' && !selected)) {
          showPosition = false;
        }

        fillAdditionalInfo(
          additionalInfo,
          triggerValue,
          newRawValues,
          mergedTreeData.value,
          showPosition,
          mergedFieldNames.value,
        );

        if (mergedCheckable.value) {
          additionalInfo.checked = selected;
        } else {
          additionalInfo.selected = selected;
        }

        const returnValues = mergedLabelInValue.value
          ? returnLabeledValues
          : returnLabeledValues.map(item => item.value);

        props.onChange(
          mergedMultiple.value ? returnValues : returnValues[0],
          mergedLabelInValue.value ? null : returnLabeledValues.map(item => item.label),
          additionalInfo,
        );
      }
    };

    // ========================== Options ===========================
    /** Trigger by option list */
    const onOptionSelect = (
      selectedKey: Key,
      { selected, source }: { selected: boolean; source: SelectSource },
    ) => {
      const keyEntitiesValue = toRaw(keyEntities.value);
      const valueEntitiesValue = toRaw(valueEntities.value);
      const entity = keyEntitiesValue[selectedKey];
      const node = entity?.node;
      const selectedValue = node?.[mergedFieldNames.value.value] ?? selectedKey;

      // Never be falsy but keep it safe
      if (!mergedMultiple.value) {
        // Single mode always set value
        triggerChange([selectedValue], { selected: true, triggerValue: selectedValue }, 'option');
      } else {
        let newRawValues = selected
          ? [...rawValues.value, selectedValue]
          : rawCheckedValues.value.filter(v => v !== selectedValue);

        // Add keys if tree conduction
        if (treeConduction.value) {
          // Should keep missing values
          const { missingRawValues, existRawValues } = splitRawValues(newRawValues);
          const keyList = existRawValues.map(val => valueEntitiesValue.get(val).key);

          // Conduction by selected or not
          let checkedKeys: Key[];
          if (selected) {
            ({ checkedKeys } = conductCheck(
              keyList,
              true,
              keyEntitiesValue,
              maxLevel.value,
              levelEntities.value,
            ));
          } else {
            ({ checkedKeys } = conductCheck(
              keyList,
              { checked: false, halfCheckedKeys: rawHalfCheckedValues.value },
              keyEntitiesValue,
              maxLevel.value,
              levelEntities.value,
            ));
          }

          // Fill back of keys
          newRawValues = [
            ...missingRawValues,
            ...checkedKeys.map(key => keyEntitiesValue[key].node[mergedFieldNames.value.value]),
          ];
        }
        triggerChange(newRawValues, { selected, triggerValue: selectedValue }, source || 'option');
      }

      // Trigger select event
      if (selected || !mergedMultiple.value) {
        props.onSelect?.(selectedValue, fillLegacyProps(node));
      } else {
        props.onDeselect?.(selectedValue, fillLegacyProps(node));
      }
    };

    // ========================== Dropdown ==========================
    const onInternalDropdownVisibleChange = (open: boolean) => {
      if (props.onDropdownVisibleChange) {
        const legacyParam = {};

        Object.defineProperty(legacyParam, 'documentClickClose', {
          get() {
            warning(false, 'Second param of `onDropdownVisibleChange` has been removed.');
            return false;
          },
        });

        (props.onDropdownVisibleChange as any)(open, legacyParam);
      }
    };

    // ====================== Display Change ========================
    const onDisplayValuesChange: BaseSelectProps['onDisplayValuesChange'] = (newValues, info) => {
      const newRawValues = newValues.map(item => item.value);

      if (info.type === 'clear') {
        triggerChange(newRawValues, {}, 'selection');
        return;
      }

      // TreeSelect only have multiple mode which means display change only has remove
      if (info.values.length) {
        onOptionSelect(info.values[0].value, { selected: false, source: 'selection' });
      }
    };
    const {
      treeNodeFilterProp,

      // Data
      loadData,
      treeLoadedKeys,
      onTreeLoad,

      // Expanded
      treeDefaultExpandAll,
      treeExpandedKeys,
      treeDefaultExpandedKeys,
      onTreeExpand,

      // Options
      virtual,
      listHeight,
      listItemHeight,

      // Tree
      treeLine,
      treeIcon,
      showTreeIcon,
      switcherIcon,
      treeMotion,
      customSlots,

      dropdownMatchSelectWidth,
      treeExpandAction,
    } = toRefs(props);
    useProvideLegacySelectContext(
      toReactive({
        checkable: mergedCheckable,

        loadData,
        treeLoadedKeys,
        onTreeLoad,
        checkedKeys: rawCheckedValues,
        halfCheckedKeys: rawHalfCheckedValues,
        treeDefaultExpandAll,
        treeExpandedKeys,
        treeDefaultExpandedKeys,
        onTreeExpand,
        treeIcon,
        treeMotion,
        showTreeIcon,
        switcherIcon,
        treeLine,
        treeNodeFilterProp,
        keyEntities,
        customSlots,
      } as unknown as LegacyContextProps),
    );
    useProvideSelectContext(
      toReactive({
        virtual,
        listHeight,
        listItemHeight,
        treeData: filteredTreeData,
        fieldNames: mergedFieldNames,
        onSelect: onOptionSelect,
        dropdownMatchSelectWidth,
        treeExpandAction,
      } as unknown as TreeSelectContextProps),
    );
    const selectRef = ref<BaseSelectRef>();
    expose({
      focus() {
        selectRef.value?.focus();
      },
      blur() {
        selectRef.value?.blur();
      },
      scrollTo(arg) {
        selectRef.value?.scrollTo(arg);
      },
    } as BaseSelectRef);
    return () => {
      const restProps = omit(props, [
        'id',
        'prefixCls',
        'customSlots',

        // Value
        'value',
        'defaultValue',
        'onChange',
        'onSelect',
        'onDeselect',

        // Search
        'searchValue',
        'inputValue',
        'onSearch',
        'autoClearSearchValue',
        'filterTreeNode',
        'treeNodeFilterProp',

        // Selector
        'showCheckedStrategy',
        'treeNodeLabelProp',

        //  Mode
        'multiple',
        'treeCheckable',
        'treeCheckStrictly',
        'labelInValue',

        // FieldNames
        'fieldNames',

        // Data
        'treeDataSimpleMode',
        'treeData',
        'children',
        'loadData',
        'treeLoadedKeys',
        'onTreeLoad',

        // Expanded
        'treeDefaultExpandAll',
        'treeExpandedKeys',
        'treeDefaultExpandedKeys',
        'onTreeExpand',

        // Options
        'virtual',
        'listHeight',
        'listItemHeight',
        'onDropdownVisibleChange',

        // Tree
        'treeLine',
        'treeIcon',
        'showTreeIcon',
        'switcherIcon',
        'treeMotion',
      ]);
      return (
        <BaseSelect
          v-slots={slots}
          ref={selectRef}
          {...attrs}
          {...restProps}
          // >>> MISC
          id={mergedId}
          prefixCls={props.prefixCls}
          mode={mergedMultiple.value ? 'multiple' : undefined}
          // >>> Display Value
          displayValues={cachedDisplayValues.value}
          onDisplayValuesChange={onDisplayValuesChange}
          // >>> Search
          searchValue={mergedSearchValue.value}
          onSearch={onInternalSearch}
          // >>> Options
          OptionList={OptionList}
          emptyOptions={!mergedTreeData.value.length}
          onDropdownVisibleChange={onInternalDropdownVisibleChange}
          tagRender={props.tagRender || slots.tagRender}
          dropdownMatchSelectWidth={props.dropdownMatchSelectWidth ?? true}
        />
      );
    };
  },
});
