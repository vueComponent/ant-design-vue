/**
 * To match accessibility requirement, we always provide an input in the component.
 * Other element will not set `tabindex` to avoid `onBlur` sequence problem.
 * For focused select, we set `aria-live="polite"` to update the accessibility content.
 *
 * ref:
 * - keyboard: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role#Keyboard_interactions
 */

import KeyCode from '../_util/KeyCode';
import classNames from '../_util/classNames';
import Selector from './Selector';
import SelectTrigger from './SelectTrigger';
import type { Mode, RenderDOMFunc, OnActiveValue } from './interface';
import type {
  GetLabeledValue,
  FilterOptions,
  FilterFunc,
  DefaultValueType,
  RawValueType,
  Key,
  DisplayLabelValueType,
  FlattenOptionsType,
  SingleType,
  OnClear,
  SelectSource,
  CustomTagProps,
} from './interface/generator';
import { INTERNAL_PROPS_MARK } from './interface/generator';
import type { OptionListProps } from './OptionList';
import { toInnerValue, toOuterValues, removeLastEnabledValue, getUUID } from './utils/commonUtil';
import TransBtn from './TransBtn';
import useLock from './hooks/useLock';
import useDelayReset from './hooks/useDelayReset';
import { getSeparatedContent } from './utils/valueUtil';
import useSelectTriggerControl from './hooks/useSelectTriggerControl';
import useCacheDisplayValue from './hooks/useCacheDisplayValue';
import useCacheOptions from './hooks/useCacheOptions';
import type { CSSProperties, PropType, VNode, VNodeChild } from 'vue';
import {
  getCurrentInstance,
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowRef,
  watch,
  watchEffect,
} from 'vue';
import createRef from '../_util/createRef';
import PropTypes from '../_util/vue-types';
import warning from '../_util/warning';
import isMobile from '../vc-util/isMobile';

const DEFAULT_OMIT_PROPS = [
  'children',
  'removeIcon',
  'placeholder',
  'autofocus',
  'maxTagCount',
  'maxTagTextLength',
  'maxTagPlaceholder',
  'choiceTransitionName',
  'onInputKeyDown',
  'tabindex',
];

export function selectBaseProps<OptionType, ValueType>() {
  return {
    prefixCls: String,
    id: String,

    // Options
    options: { type: Array as PropType<OptionType[]> },
    mode: { type: String as PropType<Mode> },

    // Value
    value: {
      type: [String, Number, Object, Array] as PropType<ValueType>,
      default: undefined as ValueType,
    },
    defaultValue: {
      type: [String, Number, Object, Array] as PropType<ValueType>,
      default: undefined as ValueType,
    },
    labelInValue: { type: Boolean, default: undefined },

    // Search
    inputValue: String,
    searchValue: String,
    optionFilterProp: String,
    /**
     * In Select, `false` means do nothing.
     * In TreeSelect, `false` will highlight match item.
     * It's by design.
     */
    filterOption: {
      type: [Boolean, Function] as PropType<boolean | FilterFunc<OptionType>>,
      default: undefined,
    },
    filterSort: {
      type: Function as PropType<(optionA: OptionType, optionB: OptionType) => number>,
    },
    showSearch: { type: Boolean, default: undefined },
    autoClearSearchValue: { type: Boolean, default: undefined },
    onSearch: { type: Function as PropType<(value: string) => void> },
    onClear: { type: Function as PropType<OnClear> },

    // Icons
    allowClear: { type: Boolean, default: undefined },
    clearIcon: PropTypes.any,
    showArrow: { type: Boolean, default: undefined },
    inputIcon: PropTypes.VNodeChild,
    removeIcon: PropTypes.VNodeChild,
    menuItemSelectedIcon: PropTypes.VNodeChild,

    // Dropdown
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: undefined },
    listHeight: Number,
    listItemHeight: Number,
    dropdownStyle: { type: Object as PropType<CSSProperties> },
    dropdownClassName: String,
    dropdownMatchSelectWidth: {
      type: [Boolean, Number] as PropType<boolean | number>,
      default: undefined,
    },
    virtual: { type: Boolean, default: undefined },
    dropdownRender: { type: Function as PropType<(menu: VNode) => any> },
    dropdownAlign: PropTypes.any,
    animation: String,
    transitionName: String,
    getPopupContainer: { type: Function as PropType<RenderDOMFunc> },
    direction: String,

    // Others
    disabled: { type: Boolean, default: undefined },
    loading: { type: Boolean, default: undefined },
    autofocus: { type: Boolean, default: undefined },
    defaultActiveFirstOption: { type: Boolean, default: undefined },
    notFoundContent: PropTypes.any,
    placeholder: PropTypes.any,
    backfill: { type: Boolean, default: undefined },
    /** @private Internal usage. Do not use in your production. */
    getInputElement: { type: Function as PropType<() => any> },
    optionLabelProp: String,
    maxTagTextLength: Number,
    maxTagCount: { type: [String, Number] as PropType<number | 'responsive'> },
    maxTagPlaceholder: PropTypes.any,
    tokenSeparators: { type: Array as PropType<string[]> },
    tagRender: { type: Function as PropType<(props: CustomTagProps) => any> },
    showAction: { type: Array as PropType<('focus' | 'click')[]> },
    tabindex: { type: [Number, String] },

    // Events
    onKeyup: { type: Function as PropType<(e: KeyboardEvent) => void> },
    onKeydown: { type: Function as PropType<(e: KeyboardEvent) => void> },
    onPopupScroll: { type: Function as PropType<(e: UIEvent) => void> },
    onDropdownVisibleChange: { type: Function as PropType<(open: boolean) => void> },
    onSelect: {
      type: Function as PropType<(value: SingleType<ValueType>, option: OptionType) => void>,
    },
    onDeselect: {
      type: Function as PropType<(value: SingleType<ValueType>, option: OptionType) => void>,
    },
    onInputKeyDown: { type: Function as PropType<(e: KeyboardEvent) => void> },
    onClick: { type: Function as PropType<(e: MouseEvent) => void> },
    onChange: {
      type: Function as PropType<(value: ValueType, option: OptionType | OptionType[]) => void>,
    },
    onBlur: { type: Function as PropType<(e: FocusEvent) => void> },
    onFocus: { type: Function as PropType<(e: FocusEvent) => void> },
    onMousedown: { type: Function as PropType<(e: MouseEvent) => void> },
    onMouseenter: { type: Function as PropType<(e: MouseEvent) => void> },
    onMouseleave: { type: Function as PropType<(e: MouseEvent) => void> },

    // Motion
    choiceTransitionName: String,

    // Internal props
    /**
     * Only used in current version for internal event process.
     * Do not use in production environment.
     */
    internalProps: {
      type: Object as PropType<{
        mark?: string;
        onClear?: OnClear;
        skipTriggerChange?: boolean;
        skipTriggerSelect?: boolean;
        onRawSelect?: (value: RawValueType, option: OptionType, source: SelectSource) => void;
        onRawDeselect?: (value: RawValueType, option: OptionType, source: SelectSource) => void;
      }>,
      default: undefined as {
        mark?: string;
        onClear?: OnClear;
        skipTriggerChange?: boolean;
        skipTriggerSelect?: boolean;
        onRawSelect?: (value: RawValueType, option: OptionType, source: SelectSource) => void;
        onRawDeselect?: (value: RawValueType, option: OptionType, source: SelectSource) => void;
      },
    },
    children: { type: Array as PropType<any[]> },
  };
}

class Helper<T1, T2> {
  SelectBaseProps = selectBaseProps<T1, T2>();
}
type FuncReturnType<T1, T2> = Helper<T1, T2>['SelectBaseProps'];

export type SelectProps<T1, T2> = FuncReturnType<T1, T2>;

export interface GenerateConfig<OptionType extends object> {
  prefixCls: string;
  components: {
    // TODO
    optionList: (
      props: Omit<OptionListProps<OptionType>, 'options'> & { options?: OptionType[] },
    ) => JSX.Element;
    // optionList: DefineComponent<
    //   Omit<OptionListProps<OptionType>, 'options'> & { options?: OptionType[] }
    // >;
  };
  /** Convert jsx tree into `OptionType[]` */
  convertChildrenToData: (children: VNodeChild | JSX.Element) => OptionType[];
  /** Flatten nest options into raw option list */
  flattenOptions: (options: OptionType[], props: any) => FlattenOptionsType<OptionType>;
  /** Convert single raw value into { label, value } format. Will be called by each value */
  getLabeledValue: GetLabeledValue<FlattenOptionsType<OptionType>>;
  filterOptions: FilterOptions<OptionType[]>;
  findValueOption: // Need still support legacy ts api
  | ((values: RawValueType[], options: FlattenOptionsType<OptionType>) => OptionType[])
    // New API add prevValueOptions support
    | ((
        values: RawValueType[],
        options: FlattenOptionsType<OptionType>,
        info?: { prevValueOptions?: OptionType[][] },
      ) => OptionType[]);
  /** Check if a value is disabled */
  isValueDisabled: (value: RawValueType, options: FlattenOptionsType<OptionType>) => boolean;
  warningProps?: (props: any) => void;
  fillOptionsWithMissingValue?: (
    options: OptionType[],
    value: DefaultValueType,
    optionLabelProp: string,
    labelInValue: boolean,
  ) => OptionType[];
  omitDOMProps?: (props: object) => object;
}

type ValueType = DefaultValueType;
/**
 * This function is in internal usage.
 * Do not use it in your prod env since we may refactor this.
 */
export default function generateSelector<
  OptionType extends {
    value?: RawValueType;
    label?: any;
    key?: Key;
    disabled?: boolean;
  },
>(config: GenerateConfig<OptionType>) {
  const {
    prefixCls: defaultPrefixCls,
    components: { optionList: OptionList },
    convertChildrenToData,
    flattenOptions,
    getLabeledValue,
    filterOptions,
    isValueDisabled,
    findValueOption,
    warningProps,
    fillOptionsWithMissingValue,
    omitDOMProps,
  } = config as any;
  const Select = defineComponent({
    name: 'Select',
    slots: ['option'],
    inheritAttrs: false,
    props: selectBaseProps<OptionType, DefaultValueType>(),
    setup(props, { expose, attrs, slots }) {
      const useInternalProps = computed(
        () => props.internalProps && props.internalProps.mark === INTERNAL_PROPS_MARK,
      );
      warning(
        props.optionFilterProp !== 'children',
        'Select',
        'optionFilterProp not support children, please use label instead',
      );
      const containerRef = ref();
      const triggerRef = ref();
      const selectorRef = ref();
      const listRef = ref();
      const tokenWithEnter = computed(() =>
        (props.tokenSeparators || []).some(tokenSeparator =>
          ['\n', '\r\n'].includes(tokenSeparator),
        ),
      );

      /** Used for component focused management */
      const [mockFocused, setMockFocused, cancelSetMockFocused] = useDelayReset();

      const mergedId = computed(() => props.id || `rc_select_${getUUID()}`);

      // optionLabelProp
      const mergedOptionLabelProp = computed(() => {
        let mergedOptionLabelProp = props.optionLabelProp;
        if (mergedOptionLabelProp === undefined) {
          mergedOptionLabelProp = props.options ? 'label' : 'children';
        }
        return mergedOptionLabelProp;
      });

      // labelInValue
      const mergedLabelInValue = computed(() =>
        props.mode === 'combobox' ? false : props.labelInValue,
      );

      const isMultiple = computed(() => props.mode === 'tags' || props.mode === 'multiple');

      const mergedShowSearch = computed(() =>
        props.showSearch !== undefined
          ? props.showSearch
          : isMultiple.value || props.mode === 'combobox',
      );

      const mobile = ref(false);
      onMounted(() => {
        mobile.value = isMobile();
      });

      // ============================== Ref ===============================
      const selectorDomRef = createRef();

      const innerSearchValue = ref('');
      const setInnerSearchValue = (val: string) => {
        innerSearchValue.value = val;
      };

      const mergedValue = ref(props.value !== undefined ? props.value : props.defaultValue);
      watch(
        () => props.value,
        () => {
          mergedValue.value = props.value;
          innerSearchValue.value = '';
        },
      );
      // ============================= Value ==============================

      /** Unique raw values */
      const mergedRawValueArr = computed(() =>
        toInnerValue(mergedValue.value, {
          labelInValue: mergedLabelInValue.value,
          combobox: props.mode === 'combobox',
        }),
      );
      const mergedRawValue = computed(() => mergedRawValueArr.value[0]);
      const mergedValueMap = computed(() => mergedRawValueArr.value[1]);
      /** We cache a set of raw values to speed up check */
      const rawValues = computed(() => new Set(mergedRawValue.value));

      // ============================= Option =============================
      // Set by option list active, it will merge into search input when mode is `combobox`
      const activeValue = ref();
      const setActiveValue = (val: string) => {
        activeValue.value = val;
      };

      const mergedSearchValue = computed(() => {
        let mergedSearchValue = innerSearchValue.value;
        if (props.mode === 'combobox' && mergedValue.value !== undefined) {
          mergedSearchValue = mergedValue.value as string;
        } else if (props.searchValue !== undefined) {
          mergedSearchValue = props.searchValue;
        } else if (props.inputValue) {
          mergedSearchValue = props.inputValue;
        }
        return mergedSearchValue;
      });

      const mergedOptions = computed((): OptionType[] => {
        let newOptions = props.options;
        if (newOptions === undefined) {
          newOptions = convertChildrenToData(props.children as VNodeChild);
        }

        /**
         * `tags` should fill un-list item.
         * This is not cool here since TreeSelect do not need this
         */
        if (props.mode === 'tags' && fillOptionsWithMissingValue) {
          newOptions = fillOptionsWithMissingValue(
            newOptions,
            mergedValue.value,
            mergedOptionLabelProp.value,
            props.labelInValue,
          );
        }

        return newOptions || ([] as OptionType[]);
      });

      const mergedFlattenOptions = computed(() => flattenOptions(mergedOptions.value, props));

      const getValueOption = useCacheOptions(mergedFlattenOptions);

      // Display options for OptionList
      const displayOptions = computed<OptionType[]>(() => {
        if (!mergedSearchValue.value || !mergedShowSearch.value) {
          return [...mergedOptions.value] as OptionType[];
        }
        const { optionFilterProp = 'value', mode, filterOption } = props;
        const filteredOptions: OptionType[] = filterOptions(
          mergedSearchValue.value,
          mergedOptions.value,
          {
            optionFilterProp,
            filterOption:
              mode === 'combobox' && filterOption === undefined ? () => true : filterOption,
          },
        );
        if (
          mode === 'tags' &&
          filteredOptions.every(opt => opt[optionFilterProp] !== mergedSearchValue.value)
        ) {
          filteredOptions.unshift({
            value: mergedSearchValue.value,
            label: mergedSearchValue.value,
            key: '__RC_SELECT_TAG_PLACEHOLDER__',
          } as OptionType);
        }
        if (props.filterSort && Array.isArray(filteredOptions)) {
          return ([...filteredOptions] as OptionType[]).sort(props.filterSort);
        }

        return filteredOptions;
      });

      const displayFlattenOptions = computed(() => flattenOptions(displayOptions.value, props));
      onMounted(() => {
        watch(
          mergedSearchValue,
          () => {
            if (listRef.value && listRef.value.scrollTo) {
              listRef.value.scrollTo(0);
            }
          },
          { flush: 'post', immediate: true },
        );
      });

      // ============================ Selector ============================
      let displayValues = computed<DisplayLabelValueType[]>(() => {
        const tmpValues = mergedRawValue.value.map((val: RawValueType) => {
          const valueOptions = getValueOption([val]);
          const displayValue = getLabeledValue(val, {
            options: valueOptions,
            prevValueMap: mergedValueMap.value,
            labelInValue: mergedLabelInValue.value,
            optionLabelProp: mergedOptionLabelProp.value,
          });
          return {
            ...displayValue,
            disabled: isValueDisabled(val, valueOptions),
            option: valueOptions[0],
          };
        });

        if (
          !props.mode &&
          tmpValues.length === 1 &&
          tmpValues[0].value === null &&
          tmpValues[0].label === null
        ) {
          return [];
        }

        return tmpValues;
      });

      // Polyfill with cache label
      displayValues = useCacheDisplayValue(displayValues);

      const triggerSelect = (newValue: RawValueType, isSelect: boolean, source: SelectSource) => {
        const newValueOption = getValueOption([newValue]);
        const outOption = findValueOption([newValue], newValueOption)[0];
        const { internalProps = {} } = props;
        if (!internalProps.skipTriggerSelect) {
          // Skip trigger `onSelect` or `onDeselect` if configured
          const selectValue = (
            mergedLabelInValue.value
              ? getLabeledValue(newValue, {
                  options: newValueOption,
                  prevValueMap: mergedValueMap.value,
                  labelInValue: mergedLabelInValue.value,
                  optionLabelProp: mergedOptionLabelProp.value,
                })
              : newValue
          ) as SingleType<ValueType>;

          if (isSelect && props.onSelect) {
            props.onSelect(selectValue, outOption);
          } else if (!isSelect && props.onDeselect) {
            props.onDeselect(selectValue, outOption);
          }
        }

        // Trigger internal event
        if (useInternalProps.value) {
          if (isSelect && internalProps.onRawSelect) {
            internalProps.onRawSelect(newValue, outOption, source);
          } else if (!isSelect && internalProps.onRawDeselect) {
            internalProps.onRawDeselect(newValue, outOption, source);
          }
        }
      };

      // We need cache options here in case user update the option list
      const prevValueOptions = shallowRef([]);
      const setPrevValueOptions = (val: any[]) => {
        prevValueOptions.value = val;
      };
      const triggerChange = (newRawValues: RawValueType[]) => {
        if (
          useInternalProps.value &&
          props.internalProps &&
          props.internalProps.skipTriggerChange
        ) {
          return;
        }
        const newRawValuesOptions = getValueOption(newRawValues);
        const outValues = toOuterValues<FlattenOptionsType<OptionType>>(Array.from(newRawValues), {
          labelInValue: mergedLabelInValue.value,
          options: newRawValuesOptions as any,
          getLabeledValue,
          prevValueMap: mergedValueMap.value,
          optionLabelProp: mergedOptionLabelProp.value,
        });

        const outValue: ValueType = (isMultiple.value ? outValues : outValues[0]) as ValueType;
        // Skip trigger if prev & current value is both empty
        if (
          props.onChange &&
          (mergedRawValue.value.length !== 0 || (outValues as []).length !== 0)
        ) {
          const outOptions = findValueOption(newRawValues, newRawValuesOptions, {
            prevValueOptions: prevValueOptions.value,
          });

          // We will cache option in case it removed by ajax
          setPrevValueOptions(
            outOptions.map((option, index) => {
              const clone = { ...option };
              Object.defineProperty(clone, '_INTERNAL_OPTION_VALUE_', {
                get: () => newRawValues[index],
              });
              return clone;
            }),
          );

          props.onChange(outValue, isMultiple.value ? outOptions : outOptions[0]);
        }

        if (props.value === undefined) {
          mergedValue.value = outValue;
        }
      };

      const onInternalSelect = (
        newValue: RawValueType,
        { selected, source }: { selected: boolean; source: 'option' | 'selection' },
      ) => {
        const { autoClearSearchValue = true } = props;
        if (props.disabled) {
          return;
        }

        let newRawValue: Set<RawValueType>;

        if (isMultiple.value) {
          newRawValue = new Set(mergedRawValue.value);
          if (selected) {
            newRawValue.add(newValue);
          } else {
            newRawValue.delete(newValue);
          }
        } else {
          newRawValue = new Set();
          newRawValue.add(newValue);
        }

        // Multiple always trigger change and single should change if value changed
        if (
          isMultiple.value ||
          (!isMultiple.value && Array.from(mergedRawValue.value)[0] !== newValue)
        ) {
          triggerChange(Array.from(newRawValue));
        }

        // Trigger `onSelect`. Single mode always trigger select
        triggerSelect(newValue, !isMultiple.value || selected, source);

        // Clean search value if single or configured
        if (props.mode === 'combobox') {
          setInnerSearchValue(String(newValue));
          setActiveValue('');
        } else if (!isMultiple.value || autoClearSearchValue) {
          setInnerSearchValue('');
          setActiveValue('');
        }
      };

      const onInternalOptionSelect = (newValue: RawValueType, info: { selected: boolean }) => {
        onInternalSelect(newValue, { ...info, source: 'option' });
      };

      const onInternalSelectionSelect = (newValue: RawValueType, info: { selected: boolean }) => {
        onInternalSelect(newValue, { ...info, source: 'selection' });
      };

      // ============================== Open ==============================
      const initOpen = props.open !== undefined ? props.open : props.defaultOpen;
      const innerOpen = ref(initOpen);
      const mergedOpen = ref(initOpen);
      const setInnerOpen = (val: boolean) => {
        innerOpen.value = props.open !== undefined ? props.open : val;
        mergedOpen.value = innerOpen.value;
      };
      watch(
        () => props.open,
        () => {
          setInnerOpen(props.open);
        },
      );

      // Not trigger `open` in `combobox` when `notFoundContent` is empty
      const emptyListContent = computed(
        () => !props.notFoundContent && !displayOptions.value.length,
      );

      watchEffect(() => {
        mergedOpen.value = innerOpen.value;
        if (
          props.disabled ||
          (emptyListContent.value && mergedOpen.value && props.mode === 'combobox')
        ) {
          mergedOpen.value = false;
        }
      });

      const triggerOpen = computed(() => (emptyListContent.value ? false : mergedOpen.value));

      const onToggleOpen = (newOpen?: boolean) => {
        const nextOpen = newOpen !== undefined ? newOpen : !mergedOpen.value;

        if (innerOpen.value !== nextOpen && !props.disabled) {
          setInnerOpen(nextOpen);
          if (props.onDropdownVisibleChange) {
            props.onDropdownVisibleChange(nextOpen);
          }
        }
      };

      useSelectTriggerControl([containerRef, triggerRef], triggerOpen, onToggleOpen);

      // ============================= Search =============================
      const triggerSearch = (searchText: string, fromTyping: boolean, isCompositing: boolean) => {
        let ret = true;
        let newSearchText = searchText;
        const preSearchValue = mergedSearchValue.value;
        setActiveValue(null);

        // Check if match the `tokenSeparators`
        const patchLabels: string[] = isCompositing
          ? null
          : getSeparatedContent(searchText, props.tokenSeparators as string[]);
        let patchRawValues: RawValueType[] = patchLabels;

        if (props.mode === 'combobox') {
          // Only typing will trigger onChange
          if (fromTyping) {
            triggerChange([newSearchText]);
          }
        } else if (patchLabels) {
          newSearchText = '';

          if (props.mode !== 'tags') {
            patchRawValues = patchLabels
              .map(label => {
                const item = mergedFlattenOptions.value.find(
                  ({ data }) => data[mergedOptionLabelProp.value] === label,
                );
                return item ? item.data.value : null;
              })
              .filter((val: RawValueType) => val !== null);
          }

          const newRawValues = Array.from(
            new Set<RawValueType>([...mergedRawValue.value, ...patchRawValues]),
          );
          triggerChange(newRawValues);
          newRawValues.forEach(newRawValue => {
            triggerSelect(newRawValue, true, 'input');
          });

          // Should close when paste finish
          onToggleOpen(false);

          // Tell Selector that break next actions
          ret = false;
        }

        setInnerSearchValue(newSearchText);

        if (props.onSearch && preSearchValue !== newSearchText) {
          props.onSearch(newSearchText);
        }

        return ret;
      };

      // Only triggered when menu is closed & mode is tags
      // If menu is open, OptionList will take charge
      // If mode isn't tags, press enter is not meaningful when you can't see any option
      const onSearchSubmit = (searchText: string) => {
        // prevent empty tags from appearing when you click the Enter button
        if (!searchText || !searchText.trim()) {
          return;
        }
        const newRawValues = Array.from(
          new Set<RawValueType>([...mergedRawValue.value, searchText]),
        );
        triggerChange(newRawValues);
        newRawValues.forEach(newRawValue => {
          triggerSelect(newRawValue, true, 'input');
        });
        setInnerSearchValue('');
      };

      // Close dropdown when disabled change

      watch(
        () => props.disabled,
        () => {
          if (innerOpen.value && !!props.disabled) {
            setInnerOpen(false);
          }
        },
        { immediate: true },
      );

      // Close will clean up single mode search text
      watch(
        mergedOpen,
        () => {
          if (!mergedOpen.value && !isMultiple.value && props.mode !== 'combobox') {
            triggerSearch('', false, false);
          }
        },
        { immediate: true },
      );
      // ============================ Keyboard ============================
      /**
       * We record input value here to check if can press to clean up by backspace
       * - null: Key is not down, this is reset by key up
       * - true: Search text is empty when first time backspace down
       * - false: Search text is not empty when first time backspace down
       */
      const [getClearLock, setClearLock] = useLock();

      // KeyDown
      const onInternalKeyDown = (event: KeyboardEvent) => {
        const clearLock = getClearLock();
        const { which } = event;

        if (which === KeyCode.ENTER) {
          // Do not submit form when type in the input
          if (props.mode !== 'combobox') {
            event.preventDefault();
          }

          // We only manage open state here, close logic should handle by list component
          if (!mergedOpen.value) {
            onToggleOpen(true);
          }
        }

        setClearLock(!!mergedSearchValue.value);

        // Remove value by `backspace`
        if (
          which === KeyCode.BACKSPACE &&
          !clearLock &&
          isMultiple.value &&
          !mergedSearchValue.value &&
          mergedRawValue.value.length
        ) {
          const removeInfo = removeLastEnabledValue(displayValues.value, mergedRawValue.value);

          if (removeInfo.removedValue !== null) {
            triggerChange(removeInfo.values);
            triggerSelect(removeInfo.removedValue, false, 'input');
          }
        }

        if (mergedOpen.value && listRef.value) {
          listRef.value.onKeydown(event);
        }

        if (props.onKeydown) {
          props.onKeydown(event);
        }
      };

      // KeyUp
      const onInternalKeyUp = (event: KeyboardEvent) => {
        if (mergedOpen.value && listRef.value) {
          listRef.value.onKeyup(event);
        }

        if (props.onKeyup) {
          props.onKeyup(event);
        }
      };

      // ========================== Focus / Blur ==========================
      /** Record real focus status */
      const focusRef = ref(false);

      const onContainerFocus = (...args: any[]) => {
        setMockFocused(true);

        if (!props.disabled) {
          if (props.onFocus && !focusRef.value) {
            props.onFocus(args[0]);
          }

          // `showAction` should handle `focus` if set
          if (props.showAction && props.showAction.includes('focus')) {
            onToggleOpen(true);
          }
        }

        focusRef.value = true;
      };

      const onContainerBlur = (...args: any[]) => {
        setMockFocused(false, () => {
          focusRef.value = false;
          onToggleOpen(false);
        });

        if (props.disabled) {
          return;
        }
        const searchVal = mergedSearchValue.value;
        if (searchVal) {
          // `tags` mode should move `searchValue` into values
          if (props.mode === 'tags') {
            triggerSearch('', false, false);
            triggerChange(Array.from(new Set([...mergedRawValue.value, searchVal])));
          } else if (props.mode === 'multiple') {
            // `multiple` mode only clean the search value but not trigger event
            setInnerSearchValue('');
          }
        }

        if (props.onBlur) {
          props.onBlur(args[0]);
        }
      };
      provide('VCSelectContainerEvent', {
        focus: onContainerFocus,
        blur: onContainerBlur,
      });
      const activeTimeoutIds: number[] = [];

      onMounted(() => {
        activeTimeoutIds.forEach(timeoutId => window.clearTimeout(timeoutId));
        activeTimeoutIds.splice(0, activeTimeoutIds.length);
      });
      onBeforeUnmount(() => {
        activeTimeoutIds.forEach(timeoutId => window.clearTimeout(timeoutId));
        activeTimeoutIds.splice(0, activeTimeoutIds.length);
      });

      const onInternalMouseDown = (event: MouseEvent) => {
        const { target } = event;
        const popupElement: HTMLDivElement = triggerRef.value && triggerRef.value.getPopupElement();
        // We should give focus back to selector if clicked item is not focusable
        if (popupElement && popupElement.contains(target as HTMLElement)) {
          const timeoutId = window.setTimeout(() => {
            const index = activeTimeoutIds.indexOf(timeoutId);
            if (index !== -1) {
              activeTimeoutIds.splice(index, 1);
            }

            cancelSetMockFocused();

            if (!mobile.value && !popupElement.contains(document.activeElement)) {
              selectorRef.value.focus();
            }
          });

          activeTimeoutIds.push(timeoutId);
        }

        if (props.onMousedown) {
          props.onMousedown(event);
        }
      };

      // ========================= Accessibility ==========================
      const accessibilityIndex = ref(0);
      const mergedDefaultActiveFirstOption = computed(() =>
        props.defaultActiveFirstOption !== undefined
          ? props.defaultActiveFirstOption
          : props.mode !== 'combobox',
      );

      const onActiveValue: OnActiveValue = (active, index, { source = 'keyboard' } = {}) => {
        accessibilityIndex.value = index;

        if (
          props.backfill &&
          props.mode === 'combobox' &&
          active !== null &&
          source === 'keyboard'
        ) {
          setActiveValue(String(active));
        }
      };

      // ============================= Popup ==============================
      const containerWidth = ref<number>(null);
      onMounted(() => {
        watch(
          triggerOpen,
          () => {
            if (triggerOpen.value) {
              const newWidth = Math.ceil(containerRef.value.offsetWidth);
              if (containerWidth.value !== newWidth) {
                containerWidth.value = newWidth;
              }
            }
          },
          { immediate: true },
        );
      });

      const focus = () => {
        selectorRef.value.focus();
      };
      const blur = () => {
        selectorRef.value.blur();
      };
      expose({
        focus,
        blur,
        scrollTo: (...args: any[]) => listRef.value?.scrollTo(...args),
      });
      const instance = getCurrentInstance();
      const onPopupMouseEnter = () => {
        // We need force update here since popup dom is render async
        instance.update();
      };
      return () => {
        const {
          prefixCls = defaultPrefixCls,
          id,

          open,
          defaultOpen,
          options,
          children,

          mode,
          value,
          defaultValue,
          labelInValue,

          // Search related
          showSearch,
          inputValue,
          searchValue,
          filterOption,
          optionFilterProp,
          autoClearSearchValue,
          onSearch,

          // Icons
          allowClear,
          clearIcon,
          showArrow,
          inputIcon,
          menuItemSelectedIcon,

          // Others
          disabled,
          loading,
          defaultActiveFirstOption,
          notFoundContent = 'Not Found',
          optionLabelProp,
          backfill,
          getInputElement,
          getPopupContainer,

          // Dropdown
          listHeight = 200,
          listItemHeight = 20,
          animation,
          transitionName,
          virtual,
          dropdownStyle,
          dropdownClassName,
          dropdownMatchSelectWidth,
          dropdownRender,
          dropdownAlign,
          showAction,
          direction,

          // Tags
          tokenSeparators,
          tagRender,

          // Events
          onPopupScroll,
          onDropdownVisibleChange,
          onFocus,
          onBlur,
          onKeyup,
          onKeydown,
          onMousedown,

          onChange,
          onSelect,
          onDeselect,
          onClear,

          internalProps = {},

          ...restProps
        } = { ...props, ...attrs }; //as SelectProps<OptionType[], ValueType>;
        // ============================= Input ==============================
        // Only works in `combobox`
        const customizeInputElement: VNodeChild | JSX.Element =
          (mode === 'combobox' && getInputElement && getInputElement()) || null;

        const domProps = omitDOMProps ? omitDOMProps(restProps) : restProps;
        DEFAULT_OMIT_PROPS.forEach(prop => {
          delete domProps[prop];
        });
        const popupNode = (
          <OptionList
            ref={listRef}
            prefixCls={prefixCls}
            id={mergedId.value}
            open={mergedOpen.value}
            childrenAsData={!options}
            options={displayOptions.value}
            flattenOptions={displayFlattenOptions.value}
            multiple={isMultiple.value}
            values={rawValues.value}
            height={listHeight}
            itemHeight={listItemHeight}
            onSelect={onInternalOptionSelect}
            onToggleOpen={onToggleOpen}
            onActiveValue={onActiveValue}
            defaultActiveFirstOption={mergedDefaultActiveFirstOption.value}
            notFoundContent={notFoundContent}
            onScroll={onPopupScroll}
            searchValue={mergedSearchValue.value}
            menuItemSelectedIcon={menuItemSelectedIcon}
            virtual={virtual !== false && dropdownMatchSelectWidth !== false}
            onMouseenter={onPopupMouseEnter}
            v-slots={slots}
          />
        );

        // ============================= Clear ==============================
        let clearNode: VNode | JSX.Element;
        const onClearMouseDown = () => {
          // Trigger internal `onClear` event
          if (useInternalProps.value && internalProps.onClear) {
            internalProps.onClear();
          }

          if (onClear) {
            onClear();
          }

          triggerChange([]);
          triggerSearch('', false, false);
        };

        if (!disabled && allowClear && (mergedRawValue.value.length || mergedSearchValue.value)) {
          clearNode = (
            <TransBtn
              class={`${prefixCls}-clear`}
              onMousedown={onClearMouseDown}
              customizeIcon={clearIcon}
            >
              ×
            </TransBtn>
          );
        }

        // ============================= Arrow ==============================
        const mergedShowArrow =
          showArrow !== undefined
            ? showArrow
            : loading || (!isMultiple.value && mode !== 'combobox');
        let arrowNode: VNode | JSX.Element;

        if (mergedShowArrow) {
          arrowNode = (
            <TransBtn
              class={classNames(`${prefixCls}-arrow`, {
                [`${prefixCls}-arrow-loading`]: loading,
              })}
              customizeIcon={inputIcon}
              customizeIconProps={{
                loading,
                searchValue: mergedSearchValue.value,
                open: mergedOpen.value,
                focused: mockFocused.value,
                showSearch: mergedShowSearch.value,
              }}
            />
          );
        }

        // ============================ Warning =============================
        if (process.env.NODE_ENV !== 'production' && warningProps) {
          warningProps(props);
        }

        // ============================= Render =============================
        const mergedClassName = classNames(prefixCls, attrs.class, {
          [`${prefixCls}-focused`]: mockFocused.value,
          [`${prefixCls}-multiple`]: isMultiple.value,
          [`${prefixCls}-single`]: !isMultiple.value,
          [`${prefixCls}-allow-clear`]: allowClear,
          [`${prefixCls}-show-arrow`]: mergedShowArrow,
          [`${prefixCls}-disabled`]: disabled,
          [`${prefixCls}-loading`]: loading,
          [`${prefixCls}-open`]: mergedOpen.value,
          [`${prefixCls}-customize-input`]: customizeInputElement,
          [`${prefixCls}-show-search`]: mergedShowSearch.value,
        });
        return (
          <div
            {...domProps}
            class={mergedClassName}
            ref={containerRef}
            onMousedown={onInternalMouseDown}
            onKeydown={onInternalKeyDown}
            onKeyup={onInternalKeyUp}
            // onFocus={onContainerFocus} // trigger by input
            // onBlur={onContainerBlur} // trigger by input
          >
            {mockFocused.value && !mergedOpen.value && (
              <span
                style={{
                  width: 0,
                  height: 0,
                  display: 'flex',
                  overflow: 'hidden',
                  opacity: 0,
                }}
                aria-live="polite"
              >
                {/* Merge into one string to make screen reader work as expect */}
                {`${mergedRawValue.value.join(', ')}`}
              </span>
            )}
            <SelectTrigger
              ref={triggerRef}
              disabled={disabled}
              prefixCls={prefixCls}
              visible={triggerOpen.value}
              popupElement={popupNode}
              containerWidth={containerWidth.value}
              animation={animation}
              transitionName={transitionName}
              dropdownStyle={dropdownStyle}
              dropdownClassName={dropdownClassName}
              direction={direction}
              dropdownMatchSelectWidth={dropdownMatchSelectWidth}
              dropdownRender={dropdownRender as any}
              dropdownAlign={dropdownAlign}
              getPopupContainer={getPopupContainer}
              empty={!mergedOptions.value.length}
              getTriggerDOMNode={() => selectorDomRef.current}
            >
              <Selector
                {...props}
                domRef={selectorDomRef}
                prefixCls={prefixCls}
                inputElement={customizeInputElement}
                ref={selectorRef}
                id={mergedId.value}
                showSearch={mergedShowSearch.value}
                mode={mode}
                accessibilityIndex={accessibilityIndex.value}
                multiple={isMultiple.value}
                tagRender={tagRender}
                values={displayValues.value}
                open={mergedOpen.value}
                onToggleOpen={onToggleOpen}
                searchValue={mergedSearchValue.value}
                activeValue={activeValue.value}
                onSearch={triggerSearch}
                onSearchSubmit={onSearchSubmit}
                onSelect={onInternalSelectionSelect}
                tokenWithEnter={tokenWithEnter.value}
              />
            </SelectTrigger>

            {arrowNode}
            {clearNode}
          </div>
        );
      };
    },
  });
  return Select;
}
