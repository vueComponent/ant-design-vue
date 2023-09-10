/**
 * To match accessibility requirement, we always provide an input in the component.
 * Other element will not set `tabindex` to avoid `onBlur` sequence problem.
 * For focused select, we set `aria-live="polite"` to update the accessibility content.
 *
 * ref:
 * - keyboard: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role#Keyboard_interactions
 *
 * New api:
 * - listHeight
 * - listItemHeight
 * - component
 *
 * Remove deprecated api:
 * - multiple
 * - tags
 * - combobox
 * - firstActiveValue
 * - dropdownMenuStyle
 * - openClassName (Not list in api)
 *
 * Update:
 * - `backfill` only support `combobox` mode
 * - `combobox` mode not support `labelInValue` since it's meaningless
 * - `getInputElement` only support `combobox` mode
 * - `onChange` return OptionData instead of ReactNode
 * - `filterOption` `onChange` `onSelect` accept OptionData instead of ReactNode
 * - `combobox` mode trigger `onChange` will get `undefined` if no `value` match in Option
 * - `combobox` mode not support `optionLabelProp`
 */

import BaseSelect, { baseSelectPropsWithoutPrivate, isMultiple } from './BaseSelect';
import type { DisplayValueType, BaseSelectRef, BaseSelectProps } from './BaseSelect';
import OptionList from './OptionList';
import useOptions from './hooks/useOptions';
import type { SelectContextProps } from './SelectContext';
import { useProvideSelectProps } from './SelectContext';
import useId from './hooks/useId';
import { fillFieldNames, flattenOptions, injectPropsWithOption } from './utils/valueUtil';
import warningProps from './utils/warningPropsUtil';
import { toArray } from './utils/commonUtil';
import useFilterOptions from './hooks/useFilterOptions';
import useCache from './hooks/useCache';
import type { Key, VueNode } from '../_util/type';
import { computed, defineComponent, ref, shallowRef, toRef, watchEffect } from 'vue';
import type { ExtractPropTypes, PropType } from 'vue';
import PropTypes from '../_util/vue-types';
import { initDefaultProps } from '../_util/props-util';
import useMergedState from '../_util/hooks/useMergedState';
import useState from '../_util/hooks/useState';
import { toReactive } from '../_util/toReactive';
import omit from '../_util/omit';

const OMIT_DOM_PROPS = ['inputValue'];

type ArrayElementType<T> = T extends (infer E)[] ? E : T;
export type OnActiveValue = (
  active: RawValueType,
  index: number,
  info?: { source?: 'keyboard' | 'mouse' },
) => void;

export type OnInternalSelect = (value: RawValueType, info: { selected: boolean }) => void;

export type RawValueType = string | number;
export interface LabelInValueType {
  label: any;
  originLabel?: any;
  value: RawValueType;
  /** @deprecated `key` is useless since it should always same as `value` */
  key?: Key;
}

export type DraftValueType =
  | RawValueType
  | LabelInValueType
  | DisplayValueType
  | (RawValueType | LabelInValueType | DisplayValueType)[];

export type FilterFunc<OptionType> = (inputValue: string, option?: OptionType) => boolean;

export interface FieldNames {
  value?: string;
  label?: string;
  options?: string;
}

export interface BaseOptionType {
  disabled?: boolean;
  [name: string]: any;
}

export interface DefaultOptionType extends BaseOptionType {
  label?: any;
  value?: string | number | null;
  children?: Omit<DefaultOptionType, 'children'>[];
}

export type SelectHandler<ValueType = any, OptionType extends BaseOptionType = DefaultOptionType> =
  | ((value: RawValueType | LabelInValueType, option: OptionType) => void)
  | ((value: ValueType, option: OptionType) => void);

export function selectProps<
  ValueType = any,
  OptionType extends BaseOptionType = DefaultOptionType,
>() {
  return {
    ...baseSelectPropsWithoutPrivate(),
    prefixCls: String,
    id: String,

    backfill: { type: Boolean, default: undefined },

    // >>> Field Names
    fieldNames: Object as PropType<FieldNames>,

    // >>> Search
    /** @deprecated Use `searchValue` instead */
    inputValue: String,
    searchValue: String,
    onSearch: Function as PropType<(value: string) => void>,
    autoClearSearchValue: { type: Boolean, default: undefined },

    // >>> Select
    onSelect: Function as PropType<SelectHandler<ArrayElementType<ValueType>, OptionType>>,
    onDeselect: Function as PropType<SelectHandler<ArrayElementType<ValueType>, OptionType>>,

    // >>> Options
    /**
     * In Select, `false` means do nothing.
     * In TreeSelect, `false` will highlight match item.
     * It's by design.
     */
    filterOption: {
      type: [Boolean, Function] as PropType<boolean | FilterFunc<OptionType>>,
      default: undefined,
    },
    filterSort: Function as PropType<(optionA: OptionType, optionB: OptionType) => number>,
    optionFilterProp: String,
    optionLabelProp: String,
    options: Array as PropType<OptionType[]>,
    defaultActiveFirstOption: { type: Boolean, default: undefined },
    virtual: { type: Boolean, default: undefined },
    listHeight: Number,
    listItemHeight: Number,

    // >>> Icon
    menuItemSelectedIcon: PropTypes.any,

    mode: String as PropType<'combobox' | 'multiple' | 'tags'>,
    labelInValue: { type: Boolean, default: undefined },
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    onChange: Function as PropType<(value: ValueType, option: OptionType | OptionType[]) => void>,
    children: Array as PropType<VueNode[]>,
  };
}

export type SelectProps = Partial<ExtractPropTypes<ReturnType<typeof selectProps>>>;

function isRawValue(value: DraftValueType): value is RawValueType {
  return !value || typeof value !== 'object';
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'VcSelect',
  inheritAttrs: false,
  props: initDefaultProps(selectProps(), {
    prefixCls: 'vc-select',
    autoClearSearchValue: true,
    listHeight: 200,
    listItemHeight: 20,
    dropdownMatchSelectWidth: true,
  }),
  setup(props, { expose, attrs, slots }) {
    const mergedId = useId(toRef(props, 'id'));
    const multiple = computed(() => isMultiple(props.mode));
    const childrenAsData = computed(() => !!(!props.options && props.children));

    const mergedFilterOption = computed(() => {
      if (props.filterOption === undefined && props.mode === 'combobox') {
        return false;
      }
      return props.filterOption;
    });

    // ========================= FieldNames =========================
    const mergedFieldNames = computed(() => fillFieldNames(props.fieldNames, childrenAsData.value));

    // =========================== Search ===========================
    const [mergedSearchValue, setSearchValue] = useMergedState('', {
      value: computed(() =>
        props.searchValue !== undefined ? props.searchValue : props.inputValue,
      ),
      postState: search => search || '',
    });

    // =========================== Option ===========================
    const parsedOptions = useOptions(
      toRef(props, 'options'),
      toRef(props, 'children'),
      mergedFieldNames,
    );
    const { valueOptions, labelOptions, options: mergedOptions } = parsedOptions;

    // ========================= Wrap Value =========================
    const convert2LabelValues = (draftValues: DraftValueType) => {
      // Convert to array
      const valueList = toArray(draftValues);

      // Convert to labelInValue type
      return valueList.map(val => {
        let rawValue: RawValueType;
        let rawLabel: any;
        let rawKey: Key;
        let rawDisabled: boolean | undefined;

        // Fill label & value
        if (isRawValue(val)) {
          rawValue = val;
        } else {
          rawKey = val.key;
          rawLabel = val.label;
          rawValue = val.value ?? rawKey;
        }

        const option = valueOptions.value.get(rawValue);
        if (option) {
          // Fill missing props
          if (rawLabel === undefined)
            rawLabel = option?.[props.optionLabelProp || mergedFieldNames.value.label];
          if (rawKey === undefined) rawKey = option?.key ?? rawValue;
          rawDisabled = option?.disabled;

          // Warning if label not same as provided
          // if (process.env.NODE_ENV !== 'production' && !isRawValue(val)) {
          //   const optionLabel = option?.[mergedFieldNames.value.label];
          //   if (optionLabel !== undefined && optionLabel !== rawLabel) {
          //     warning(false, '`label` of `value` is not same as `label` in Select options.');
          //   }
          // }
        }

        return {
          label: rawLabel,
          value: rawValue,
          key: rawKey,
          disabled: rawDisabled,
          option,
        };
      });
    };

    // =========================== Values ===========================
    const [internalValue, setInternalValue] = useMergedState(props.defaultValue, {
      value: toRef(props, 'value'),
    });

    // Merged value with LabelValueType
    const rawLabeledValues = computed(() => {
      const values = convert2LabelValues(internalValue.value);

      // combobox no need save value when it's empty
      if (props.mode === 'combobox' && !values[0]?.value) {
        return [];
      }

      return values;
    });

    // Fill label with cache to avoid option remove
    const [mergedValues, getMixedOption] = useCache(rawLabeledValues, valueOptions);

    const displayValues = computed(() => {
      // `null` need show as placeholder instead
      // https://github.com/ant-design/ant-design/issues/25057
      if (!props.mode && mergedValues.value.length === 1) {
        const firstValue = mergedValues.value[0];
        if (
          firstValue.value === null &&
          (firstValue.label === null || firstValue.label === undefined)
        ) {
          return [];
        }
      }

      return mergedValues.value.map(item => ({
        ...item,
        label: (typeof item.label === 'function' ? item.label() : item.label) ?? item.value,
      }));
    });

    /** Convert `displayValues` to raw value type set */
    const rawValues = computed(() => new Set(mergedValues.value.map(val => val.value)));

    watchEffect(
      () => {
        if (props.mode === 'combobox') {
          const strValue = mergedValues.value[0]?.value;

          if (strValue !== undefined && strValue !== null) {
            setSearchValue(String(strValue));
          }
        }
      },
      { flush: 'post' },
    );

    // ======================= Display Option =======================
    // Create a placeholder item if not exist in `options`
    const createTagOption = (val: RawValueType, label?: any) => {
      const mergedLabel = label ?? val;
      return {
        [mergedFieldNames.value.value]: val,
        [mergedFieldNames.value.label]: mergedLabel,
      } as DefaultOptionType;
    };

    // Fill tag as option if mode is `tags`
    const filledTagOptions = shallowRef();
    watchEffect(() => {
      if (props.mode !== 'tags') {
        filledTagOptions.value = mergedOptions.value;
        return;
      }

      // >>> Tag mode
      const cloneOptions = mergedOptions.value.slice();

      // Check if value exist in options (include new patch item)
      const existOptions = (val: RawValueType) => valueOptions.value.has(val);

      // Fill current value as option
      [...mergedValues.value]
        .sort((a, b) => (a.value < b.value ? -1 : 1))
        .forEach(item => {
          const val = item.value;

          if (!existOptions(val)) {
            cloneOptions.push(createTagOption(val, item.label));
          }
        });

      filledTagOptions.value = cloneOptions;
    });

    const filteredOptions = useFilterOptions(
      filledTagOptions,
      mergedFieldNames,
      mergedSearchValue,
      mergedFilterOption,
      toRef(props, 'optionFilterProp'),
    );

    // Fill options with search value if needed
    const filledSearchOptions = computed(() => {
      if (
        props.mode !== 'tags' ||
        !mergedSearchValue.value ||
        filteredOptions.value.some(
          item => item[props.optionFilterProp || 'value'] === mergedSearchValue.value,
        )
      ) {
        return filteredOptions.value;
      }

      // Fill search value as option
      return [createTagOption(mergedSearchValue.value), ...filteredOptions.value];
    });

    const orderedFilteredOptions = computed(() => {
      if (!props.filterSort) {
        return filledSearchOptions.value;
      }

      return [...filledSearchOptions.value].sort((a, b) => props.filterSort(a, b));
    });

    const displayOptions = computed(() =>
      flattenOptions(orderedFilteredOptions.value, {
        fieldNames: mergedFieldNames.value,
        childrenAsData: childrenAsData.value,
      }),
    );

    // =========================== Change ===========================
    const triggerChange = (values: DraftValueType) => {
      const labeledValues = convert2LabelValues(values);
      setInternalValue(labeledValues);

      if (
        props.onChange &&
        // Trigger event only when value changed
        (labeledValues.length !== mergedValues.value.length ||
          labeledValues.some((newVal, index) => mergedValues.value[index]?.value !== newVal?.value))
      ) {
        const returnValues = props.labelInValue
          ? labeledValues.map(v => {
              return {
                ...v,
                originLabel: v.label,
                label: typeof v.label === 'function' ? v.label() : v.label,
              };
            })
          : labeledValues.map(v => v.value);
        const returnOptions = labeledValues.map(v =>
          injectPropsWithOption(getMixedOption(v.value)),
        );

        props.onChange(
          // Value
          multiple.value ? returnValues : returnValues[0],
          // Option
          multiple.value ? returnOptions : returnOptions[0],
        );
      }
    };

    // ======================= Accessibility ========================
    const [activeValue, setActiveValue] = useState<string>(null);
    const [accessibilityIndex, setAccessibilityIndex] = useState(0);
    const mergedDefaultActiveFirstOption = computed(() =>
      props.defaultActiveFirstOption !== undefined
        ? props.defaultActiveFirstOption
        : props.mode !== 'combobox',
    );

    const onActiveValue: OnActiveValue = (active, index, { source = 'keyboard' } = {}) => {
      setAccessibilityIndex(index);

      if (props.backfill && props.mode === 'combobox' && active !== null && source === 'keyboard') {
        setActiveValue(String(active));
      }
    };

    // ========================= OptionList =========================
    const triggerSelect = (val: RawValueType, selected: boolean) => {
      const getSelectEnt = (): [RawValueType | LabelInValueType, DefaultOptionType] => {
        const option = getMixedOption(val);
        const originLabel = option?.[mergedFieldNames.value.label];
        return [
          props.labelInValue
            ? {
                label: typeof originLabel === 'function' ? originLabel() : originLabel,
                originLabel,
                value: val,
                key: option?.key ?? val,
              }
            : val,
          injectPropsWithOption(option),
        ];
      };

      if (selected && props.onSelect) {
        const [wrappedValue, option] = getSelectEnt();
        props.onSelect(wrappedValue, option);
      } else if (!selected && props.onDeselect) {
        const [wrappedValue, option] = getSelectEnt();
        props.onDeselect(wrappedValue, option);
      }
    };

    // Used for OptionList selection
    const onInternalSelect = (val, info) => {
      let cloneValues: (RawValueType | DisplayValueType)[];

      // Single mode always trigger select only with option list
      const mergedSelect = multiple.value ? info.selected : true;

      if (mergedSelect) {
        cloneValues = multiple.value ? [...mergedValues.value, val] : [val];
      } else {
        cloneValues = mergedValues.value.filter(v => v.value !== val);
      }

      triggerChange(cloneValues);
      triggerSelect(val, mergedSelect);

      // Clean search value if single or configured
      if (props.mode === 'combobox') {
        // setSearchValue(String(val));
        setActiveValue('');
      } else if (!multiple.value || props.autoClearSearchValue) {
        setSearchValue('');
        setActiveValue('');
      }
    };

    // ======================= Display Change =======================
    // BaseSelect display values change
    const onDisplayValuesChange: BaseSelectProps['onDisplayValuesChange'] = (nextValues, info) => {
      triggerChange(nextValues);

      if (info.type === 'remove' || info.type === 'clear') {
        info.values.forEach(item => {
          triggerSelect(item.value, false);
        });
      }
    };

    // =========================== Search ===========================
    const onInternalSearch: BaseSelectProps['onSearch'] = (searchText, info) => {
      setSearchValue(searchText);
      setActiveValue(null);

      // [Submit] Tag mode should flush input
      if (info.source === 'submit') {
        const formatted = (searchText || '').trim();
        // prevent empty tags from appearing when you click the Enter button
        if (formatted) {
          const newRawValues = Array.from(new Set<RawValueType>([...rawValues.value, formatted]));
          triggerChange(newRawValues);
          triggerSelect(formatted, true);
          setSearchValue('');
        }

        return;
      }

      if (info.source !== 'blur') {
        if (props.mode === 'combobox') {
          triggerChange(searchText);
        }

        props.onSearch?.(searchText);
      }
    };

    const onInternalSearchSplit: BaseSelectProps['onSearchSplit'] = words => {
      let patchValues: RawValueType[] = words;

      if (props.mode !== 'tags') {
        patchValues = words
          .map(word => {
            const opt = labelOptions.value.get(word);
            return opt?.value;
          })
          .filter(val => val !== undefined);
      }

      const newRawValues = Array.from(new Set<RawValueType>([...rawValues.value, ...patchValues]));
      triggerChange(newRawValues);
      newRawValues.forEach(newRawValue => {
        triggerSelect(newRawValue, true);
      });
    };
    const realVirtual = computed(
      () => props.virtual !== false && props.dropdownMatchSelectWidth !== false,
    );
    useProvideSelectProps(
      toReactive({
        ...parsedOptions,
        flattenOptions: displayOptions,
        onActiveValue,
        defaultActiveFirstOption: mergedDefaultActiveFirstOption,
        onSelect: onInternalSelect,
        menuItemSelectedIcon: toRef(props, 'menuItemSelectedIcon'),
        rawValues,
        fieldNames: mergedFieldNames,
        virtual: realVirtual,
        listHeight: toRef(props, 'listHeight'),
        listItemHeight: toRef(props, 'listItemHeight'),
        childrenAsData,
      } as unknown as SelectContextProps),
    );

    // ========================== Warning ===========================
    if (process.env.NODE_ENV !== 'production') {
      watchEffect(
        () => {
          warningProps(props);
        },
        { flush: 'post' },
      );
    }
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
    const pickProps = computed(() => {
      return omit(props, [
        'id',
        'mode',
        'prefixCls',
        'backfill',
        'fieldNames',

        // Search
        'inputValue',
        'searchValue',
        'onSearch',
        'autoClearSearchValue',

        // Select
        'onSelect',
        'onDeselect',
        'dropdownMatchSelectWidth',

        // Options
        'filterOption',
        'filterSort',
        'optionFilterProp',
        'optionLabelProp',
        'options',
        'children',
        'defaultActiveFirstOption',
        'menuItemSelectedIcon',
        'virtual',
        'listHeight',
        'listItemHeight',

        // Value
        'value',
        'defaultValue',
        'labelInValue',
        'onChange',
      ]);
    });
    return () => {
      return (
        <BaseSelect
          {...pickProps.value}
          {...attrs}
          // >>> MISC
          id={mergedId}
          prefixCls={props.prefixCls}
          ref={selectRef}
          omitDomProps={OMIT_DOM_PROPS}
          mode={props.mode}
          // >>> Values
          displayValues={displayValues.value}
          onDisplayValuesChange={onDisplayValuesChange}
          // >>> Search
          searchValue={mergedSearchValue.value}
          onSearch={onInternalSearch}
          onSearchSplit={onInternalSearchSplit}
          dropdownMatchSelectWidth={props.dropdownMatchSelectWidth}
          // >>> OptionList
          OptionList={OptionList}
          emptyOptions={!displayOptions.value.length}
          // >>> Accessibility
          activeValue={activeValue.value}
          activeDescendantId={`${mergedId}_list_${accessibilityIndex.value}`}
          v-slots={slots}
        />
      );
    };
  },
});
