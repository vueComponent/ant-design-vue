import type { GenerateConfig } from '../vc-select/generate';
import generateSelector from '../vc-select/generate';
import TreeNode from './TreeNode';
import type {
  DefaultValueType,
  DataNode,
  LabelValueType,
  RawValueType,
  ChangeEventExtra,
  SelectSource,
  FlattenDataNode,
} from './interface';
import {
  flattenOptions,
  filterOptions,
  isValueDisabled,
  findValueOption,
  addValue,
  removeValue,
  getRawValueLabeled,
  toArray,
  fillFieldNames,
} from './utils/valueUtil';
import warningProps from './utils/warningPropsUtil';
import { SelectContext } from './Context';
import useTreeData from './hooks/useTreeData';
import useKeyValueMap from './hooks/useKeyValueMap';
import useKeyValueMapping from './hooks/useKeyValueMapping';
import { formatStrategyKeys, SHOW_ALL, SHOW_PARENT, SHOW_CHILD } from './utils/strategyUtil';
import { fillAdditionalInfo } from './utils/legacyUtil';
import useSelectValues from './hooks/useSelectValues';
import type { TreeSelectProps } from './props';
import { treeSelectProps } from './props';
import { getLabeledValue } from '../vc-select/utils/valueUtil';
import omit from '../_util/omit';
import { computed, defineComponent, ref, shallowRef, toRef, watch, watchEffect } from 'vue';
import { convertDataToEntities } from '../vc-tree/utils/treeUtil';
import { conductCheck } from '../vc-tree/utils/conductUtil';
import { warning } from '../vc-util/warning';
import { INTERNAL_PROPS_MARK } from '../vc-select/interface/generator';

const OMIT_PROPS: (keyof TreeSelectProps)[] = [
  'expandedKeys' as any,
  'treeData',
  'treeCheckable',
  'showCheckedStrategy',
  'searchPlaceholder',
  'treeLine',
  'treeIcon',
  'showTreeIcon',
  'switcherIcon',
  'treeNodeFilterProp',
  'filterTreeNode',
  'dropdownPopupAlign',
  'treeDefaultExpandAll',
  'treeCheckStrictly',
  'treeExpandedKeys',
  'treeLoadedKeys',
  'treeMotion',
  'onTreeExpand',
  'onTreeLoad',
  'labelRender',
  'loadData',
  'treeDataSimpleMode',
  'treeNodeLabelProp',
  'treeDefaultExpandedKeys',
  'bordered',
];

export default function generate(config: {
  prefixCls: string;
  optionList: GenerateConfig<DataNode>['components']['optionList'];
}) {
  const { prefixCls, optionList } = config;

  const RefSelect = generateSelector<DataNode>({
    prefixCls,
    components: {
      optionList,
    },
    // Not use generate since we will handle ourself
    convertChildrenToData: () => null,
    flattenOptions,
    // Handle `optionLabelProp` in TreeSelect component
    getLabeledValue: getLabeledValue as any,
    filterOptions,
    isValueDisabled,
    findValueOption,
    omitDOMProps: (props: TreeSelectProps<any>) => omit(props, OMIT_PROPS),
  });

  return defineComponent({
    name: 'TreeSelect',
    props: treeSelectProps(),
    slots: [
      'title',
      'placeholder',
      'maxTagPlaceholder',
      'treeIcon',
      'switcherIcon',
      'notFoundContent',
      'treeCheckable',
    ],
    TreeNode,
    SHOW_ALL,
    SHOW_PARENT,
    SHOW_CHILD,
    setup(props, { expose, slots, attrs }) {
      const mergedCheckable = computed(() => props.treeCheckable || props.treeCheckStrictly);
      const mergedMultiple = computed(() => props.multiple || mergedCheckable.value);
      const treeConduction = computed(() => props.treeCheckable && !props.treeCheckStrictly);
      const mergedLabelInValue = computed(() => props.treeCheckStrictly || props.labelInValue);

      // ======================= Tree Data =======================
      // FieldNames
      const mergedFieldNames = computed(() => fillFieldNames(props.fieldNames, true));
      // Legacy both support `label` or `title` if not set.
      // We have to fallback to function to handle this
      const getTreeNodeTitle = (node: DataNode) => {
        if (!props.treeData) {
          return node.title;
        }

        if (mergedFieldNames.value?.label) {
          return node[mergedFieldNames.value.label];
        }

        return node.label || node.title;
      };

      const getTreeNodeLabelProp = (entity: FlattenDataNode) => {
        const { labelRender, treeNodeLabelProp } = props;
        const { node } = entity.data;

        if (labelRender) {
          return labelRender(entity);
        }

        if (treeNodeLabelProp) {
          return node[treeNodeLabelProp];
        }

        return getTreeNodeTitle(node);
      };

      const mergedTreeData = useTreeData(toRef(props, 'treeData'), toRef(props, 'children'), {
        getLabelProp: getTreeNodeTitle,
        simpleMode: toRef(props, 'treeDataSimpleMode'),
        fieldNames: mergedFieldNames,
      });

      const flattedOptions = computed(() => flattenOptions(mergedTreeData.value));
      const [cacheKeyMap, cacheValueMap] = useKeyValueMap(flattedOptions);
      const [getEntityByKey, getEntityByValue] = useKeyValueMapping(cacheKeyMap, cacheValueMap);

      // Only generate keyEntities for check conduction when is `treeCheckable`
      const conductKeyEntities = computed(() => {
        if (treeConduction.value) {
          return convertDataToEntities(mergedTreeData.value).keyEntities;
        }
        return null;
      });

      // ========================== Ref ==========================
      const selectRef = ref();

      expose({
        scrollTo: (...args: any[]) => selectRef.value.scrollTo?.(...args),
        focus: () => selectRef.value.focus?.(),
        blur: () => selectRef.value?.blur(),

        /** @private Internal usage. It's save to remove if `rc-cascader` not use it any longer */
        getEntityByValue,
      });

      const valueRef = ref<DefaultValueType>(props.defaultValue);

      watch(
        () => props.value,
        () => {
          if (props.value !== undefined) {
            valueRef.value = props.value;
          }
        },
        { immediate: true },
      );

      /** Get `missingRawValues` which not exist in the tree yet */
      const splitRawValues = (newRawValues: RawValueType[]) => {
        const missingRawValues = [];
        const existRawValues = [];

        // Keep missing value in the cache
        newRawValues.forEach(val => {
          if (getEntityByValue(val)) {
            existRawValues.push(val);
          } else {
            missingRawValues.push(val);
          }
        });

        return { missingRawValues, existRawValues };
      };

      const rawValues = shallowRef<RawValueType[]>([]);
      const rawHalfCheckedKeys = shallowRef<RawValueType[]>([]);

      watchEffect(() => {
        const valueHalfCheckedKeys: RawValueType[] = [];
        const newRawValues: RawValueType[] = [];

        toArray(valueRef.value).forEach(item => {
          if (item && typeof item === 'object' && 'value' in item) {
            if (item.halfChecked && props.treeCheckStrictly) {
              const entity = getEntityByValue(item.value);
              valueHalfCheckedKeys.push(entity ? entity.key : item.value);
            } else {
              newRawValues.push(item.value);
            }
          } else {
            newRawValues.push(item as RawValueType);
          }
        });

        // We need do conduction of values
        if (treeConduction.value) {
          const { missingRawValues, existRawValues } = splitRawValues(newRawValues);
          const keyList = existRawValues.map(val => getEntityByValue(val).key);

          const { checkedKeys, halfCheckedKeys } = conductCheck(
            keyList,
            true,
            conductKeyEntities.value,
          );
          rawValues.value = [
            ...missingRawValues,
            ...checkedKeys.map(key => getEntityByKey(key).data.value),
          ];
          rawHalfCheckedKeys.value = halfCheckedKeys;
        } else {
          [rawValues.value, rawHalfCheckedKeys.value] = [newRawValues, valueHalfCheckedKeys];
        }
      });

      const selectValues = useSelectValues(rawValues, {
        treeConduction,
        value: valueRef,
        showCheckedStrategy: toRef(props, 'showCheckedStrategy'),
        conductKeyEntities,
        getEntityByValue,
        getEntityByKey,
        getLabelProp: getTreeNodeLabelProp,
      });

      const triggerChange = (
        newRawValues: RawValueType[],
        extra: { triggerValue: RawValueType; selected: boolean },
        source: SelectSource,
      ) => {
        const { onChange, showCheckedStrategy, treeCheckStrictly } = props;
        const preValue = valueRef.value;
        valueRef.value = mergedMultiple.value ? newRawValues : newRawValues[0];
        if (onChange) {
          let eventValues: RawValueType[] = newRawValues;
          if (treeConduction.value && showCheckedStrategy !== 'SHOW_ALL') {
            const keyList = newRawValues.map(val => {
              const entity = getEntityByValue(val);
              return entity ? entity.key : val;
            });
            const formattedKeyList = formatStrategyKeys(
              keyList,
              showCheckedStrategy,
              conductKeyEntities.value,
            );

            eventValues = formattedKeyList.map(key => {
              const entity = getEntityByKey(key);
              return entity ? entity.data.value : key;
            });
          }

          const { triggerValue, selected } = extra || {
            triggerValue: undefined,
            selected: undefined,
          };

          let returnValues = mergedLabelInValue.value
            ? getRawValueLabeled(eventValues, preValue, getEntityByValue, getTreeNodeLabelProp)
            : eventValues;

          // We need fill half check back
          if (treeCheckStrictly) {
            const halfValues = rawHalfCheckedKeys.value
              .map(key => {
                const entity = getEntityByKey(key);
                return entity ? entity.data.value : key;
              })
              .filter(val => !eventValues.includes(val));

            returnValues = [
              ...(returnValues as LabelValueType[]),
              ...getRawValueLabeled(halfValues, preValue, getEntityByValue, getTreeNodeLabelProp),
            ];
          }

          const additionalInfo = {
            // [Legacy] Always return as array contains label & value
            preValue: selectValues.value,
            triggerValue,
          } as ChangeEventExtra;

          // [Legacy] Fill legacy data if user query.
          // This is expansive that we only fill when user query
          // https://github.com/react-component/tree-select/blob/fe33eb7c27830c9ac70cd1fdb1ebbe7bc679c16a/src/Select.jsx
          let showPosition = true;
          if (treeCheckStrictly || (source === 'selection' && !selected)) {
            showPosition = false;
          }

          fillAdditionalInfo(
            additionalInfo,
            triggerValue,
            newRawValues,
            mergedTreeData.value,
            showPosition,
          );

          if (mergedCheckable.value) {
            additionalInfo.checked = selected;
          } else {
            additionalInfo.selected = selected;
          }

          onChange(
            mergedMultiple.value ? returnValues : returnValues[0],
            mergedLabelInValue.value
              ? null
              : eventValues.map(val => {
                  const entity = getEntityByValue(val);
                  return entity ? entity.data.title : null;
                }),
            additionalInfo,
          );
        }
      };

      const onInternalSelect = (
        selectValue: RawValueType,
        option: DataNode,
        source: SelectSource,
      ) => {
        const eventValue = mergedLabelInValue.value ? selectValue : selectValue;

        if (!mergedMultiple.value) {
          // Single mode always set value
          triggerChange([selectValue], { selected: true, triggerValue: selectValue }, source);
        } else {
          let newRawValues = addValue(rawValues.value, selectValue);

          // Add keys if tree conduction
          if (treeConduction.value) {
            // Should keep missing values
            const { missingRawValues, existRawValues } = splitRawValues(newRawValues);
            const keyList = existRawValues.map(val => getEntityByValue(val).key);
            const { checkedKeys } = conductCheck(keyList, true, conductKeyEntities.value);
            newRawValues = [
              ...missingRawValues,
              ...checkedKeys.map(key => getEntityByKey(key).data.value),
            ];
          }

          triggerChange(newRawValues, { selected: true, triggerValue: selectValue }, source);
        }

        props.onSelect?.(eventValue, option);
      };

      const onInternalDeselect = (
        selectValue: RawValueType,
        option: DataNode,
        source: SelectSource,
      ) => {
        const eventValue = selectValue;

        let newRawValues = removeValue(rawValues.value, selectValue);

        // Remove keys if tree conduction
        if (treeConduction.value) {
          const { missingRawValues, existRawValues } = splitRawValues(newRawValues);
          const keyList = existRawValues.map(val => getEntityByValue(val).key);
          const { checkedKeys } = conductCheck(
            keyList,
            { checked: false, halfCheckedKeys: rawHalfCheckedKeys.value },
            conductKeyEntities.value,
          );
          newRawValues = [
            ...missingRawValues,
            ...checkedKeys.map(key => getEntityByKey(key).data.value),
          ];
        }

        triggerChange(newRawValues, { selected: false, triggerValue: selectValue }, source);

        props.onDeselect?.(eventValue, option);
      };

      const onInternalClear = () => {
        triggerChange([], null, 'clear');
      };

      // ========================= Open ==========================
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

      // ======================== Warning ========================
      if (process.env.NODE_ENV !== 'production') {
        warningProps(props);
      }

      return () => {
        const {
          treeNodeFilterProp,
          dropdownPopupAlign,
          filterTreeNode,
          treeDefaultExpandAll,
          treeExpandedKeys,
          treeDefaultExpandedKeys,
          onTreeExpand,
          treeIcon,
          treeMotion,
          showTreeIcon,
          switcherIcon,
          treeLine,
          loadData,
          treeLoadedKeys,
          onTreeLoad,
        } = props;
        // ======================== Render =========================
        // We pass some props into select props style
        const selectProps = {
          optionLabelProp: null,
          optionFilterProp: treeNodeFilterProp,
          dropdownAlign: dropdownPopupAlign,
          internalProps: {
            mark: INTERNAL_PROPS_MARK,
            onClear: onInternalClear,
            skipTriggerChange: true,
            skipTriggerSelect: true,
            onRawSelect: onInternalSelect,
            onRawDeselect: onInternalDeselect,
          },
          filterOption: filterTreeNode,
        };

        if (props.filterTreeNode === undefined) {
          delete selectProps.filterOption;
        }
        const selectContext = {
          checkable: mergedCheckable.value,
          loadData,
          treeLoadedKeys,
          onTreeLoad,
          checkedKeys: rawValues.value,
          halfCheckedKeys: rawHalfCheckedKeys.value,
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
          getEntityByKey,
          getEntityByValue,
          customCheckable: slots.treeCheckable,
          slots,
        };
        return (
          <SelectContext value={selectContext}>
            <RefSelect
              {...attrs}
              ref={selectRef}
              mode={mergedMultiple.value ? 'multiple' : null}
              {...props}
              {...selectProps}
              value={selectValues.value}
              // We will handle this ourself since we need calculate conduction
              labelInValue
              options={mergedTreeData.value}
              onChange={null}
              onSelect={null}
              onDeselect={null}
              onDropdownVisibleChange={onInternalDropdownVisibleChange}
              v-slots={slots}
            />
          </SelectContext>
        );
      };
    },
  });
}
