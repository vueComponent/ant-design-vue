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
import { RenderNode, Mode, RenderDOMFunc, OnActiveValue } from './interface';
import {
  GetLabeledValue,
  FilterOptions,
  FilterFunc,
  DefaultValueType,
  RawValueType,
  LabelValueType,
  Key,
  DisplayLabelValueType,
  FlattenOptionsType,
  SingleType,
  OnClear,
  INTERNAL_PROPS_MARK,
  SelectSource,
  CustomTagProps,
} from './interface/generator';
import { OptionListProps } from './OptionList';
import { toInnerValue, toOuterValues, removeLastEnabledValue, getUUID } from './utils/commonUtil';
import TransBtn from './TransBtn';
import useLock from './hooks/useLock';
import useDelayReset from './hooks/useDelayReset';
import { getSeparatedContent } from './utils/valueUtil';
import useSelectTriggerControl from './hooks/useSelectTriggerControl';
import useCacheDisplayValue from './hooks/useCacheDisplayValue';
import useCacheOptions from './hooks/useCacheOptions';
import {
  computed,
  CSSProperties,
  DefineComponent,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  VNode,
  VNodeChild,
  watch,
} from 'vue';
import createRef from '../_util/createRef';
import PropTypes from '../_util/vue-types';

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
];

export interface SelectProps<OptionsType extends object[], ValueType> {
  prefixCls?: string;
  id?: string;
  class?: string;
  style?: CSSProperties;

  // Options
  options?: OptionsType;
  children?: VNode[] | JSX.Element[];
  mode?: Mode;

  // Value
  value?: ValueType;
  defaultValue?: ValueType;
  labelInValue?: boolean;

  // Search
  inputValue?: string;
  searchValue?: string;
  optionFilterProp?: string;
  /**
   * In Select, `false` means do nothing.
   * In TreeSelect, `false` will highlight match item.
   * It's by design.
   */
  filterOption?: boolean | FilterFunc<OptionsType[number]>;
  showSearch?: boolean;
  autoClearSearchValue?: boolean;
  onSearch?: (value: string) => void;
  onClear?: OnClear;

  // Icons
  allowClear?: boolean;
  clearIcon?: VNodeChild;
  showArrow?: boolean;
  inputIcon?: RenderNode;
  removeIcon?: VNodeChild;
  menuItemSelectedIcon?: RenderNode;

  // Dropdown
  open?: boolean;
  defaultOpen?: boolean;
  listHeight?: number;
  listItemHeight?: number;
  dropdownStyle?: CSSProperties;
  dropdownClassName?: string;
  dropdownMatchSelectWidth?: boolean | number;
  virtual?: boolean;
  dropdownRender?: (menu: VNodeChild) => VNodeChild;
  dropdownAlign?: any;
  animation?: string;
  transitionName?: string;
  getPopupContainer?: RenderDOMFunc;
  direction?: string;

  // Others
  disabled?: boolean;
  loading?: boolean;
  autofocus?: boolean;
  defaultActiveFirstOption?: boolean;
  notFoundContent?: VNodeChild;
  placeholder?: VNodeChild;
  backfill?: boolean;
  getInputElement?: () => VNodeChild | JSX.Element;
  optionLabelProp?: string;
  maxTagTextLength?: number;
  maxTagCount?: number;
  maxTagPlaceholder?: VNodeChild | ((omittedValues: LabelValueType[]) => VNodeChild);
  tokenSeparators?: string[];
  tagRender?: (props: CustomTagProps) => VNodeChild;
  showAction?: ('focus' | 'click')[];
  tabindex?: number;

  // Events
  onKeyup?: EventHandlerNonNull;
  onKeydown?: EventHandlerNonNull;
  onPopupScroll?: EventHandlerNonNull;
  onDropdownVisibleChange?: (open: boolean) => void;
  onSelect?: (value: SingleType<ValueType>, option: OptionsType[number]) => void;
  onDeselect?: (value: SingleType<ValueType>, option: OptionsType[number]) => void;
  onInputKeyDown?: EventHandlerNonNull;
  onClick?: EventHandlerNonNull;
  onChange?: (value: ValueType, option: OptionsType[number] | OptionsType) => void;
  onBlur?: EventHandlerNonNull;
  onFocus?: EventHandlerNonNull;
  onMousedown?: EventHandlerNonNull;
  onMouseenter?: EventHandlerNonNull;
  onMouseleave?: EventHandlerNonNull;

  // Motion
  choiceTransitionName?: string;

  // Internal props
  /**
   * Only used in current version for internal event process.
   * Do not use in production environment.
   */
  internalProps?: {
    mark?: string;
    onClear?: OnClear;
    skipTriggerChange?: boolean;
    skipTriggerSelect?: boolean;
    onRawSelect?: (value: RawValueType, option: OptionsType[number], source: SelectSource) => void;
    onRawDeselect?: (
      value: RawValueType,
      option: OptionsType[number],
      source: SelectSource,
    ) => void;
  };
}

export interface GenerateConfig<OptionsType extends object[]> {
  prefixCls: string;
  components: {
    optionList: DefineComponent<Omit<OptionListProps, 'options'> & { options: OptionsType }>;
  };
  /** Convert jsx tree into `OptionsType` */
  convertChildrenToData: (children: VNodeChild | JSX.Element) => OptionsType;
  /** Flatten nest options into raw option list */
  flattenOptions: (options: OptionsType, props: any) => FlattenOptionsType<OptionsType>;
  /** Convert single raw value into { label, value } format. Will be called by each value */
  getLabeledValue: GetLabeledValue<FlattenOptionsType<OptionsType>>;
  filterOptions: FilterOptions<OptionsType>;
  findValueOption: // Need still support legacy ts api
  | ((values: RawValueType[], options: FlattenOptionsType<OptionsType>) => OptionsType)
    // New API add prevValueOptions support
    | ((
        values: RawValueType[],
        options: FlattenOptionsType<OptionsType>,
        info?: { prevValueOptions?: OptionsType[] },
      ) => OptionsType);
  /** Check if a value is disabled */
  isValueDisabled: (value: RawValueType, options: FlattenOptionsType<OptionsType>) => boolean;
  warningProps?: (props: any) => void;
  fillOptionsWithMissingValue?: (
    options: OptionsType,
    value: DefaultValueType,
    optionLabelProp: string,
    labelInValue: boolean,
  ) => OptionsType;
  omitDOMProps?: (props: object) => object;
}
type ValueType = DefaultValueType;
/**
 * This function is in internal usage.
 * Do not use it in your prod env since we may refactor this.
 */
export default function generateSelector<
  OptionsType extends {
    value?: RawValueType;
    label?: VNodeChild;
    key?: Key;
    disabled?: boolean;
  }[]
>(config: GenerateConfig<OptionsType>): DefineComponent {
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
  } = config;
  const Select = defineComponent<SelectProps<OptionsType, ValueType>>({
    name: 'Select',
    setup(props: SelectProps<OptionsType, ValueType>) {
      const useInternalProps = computed(() => props.internalProps.mark === INTERNAL_PROPS_MARK);

      const containerRef = ref(null);
      const triggerRef = ref(null);
      const selectorRef = ref(null);
      const listRef = ref(null);
      const tokenWithEnter = computed(() =>
        (props.tokenSeparators || []).some(tokenSeparator =>
          ['\n', '\r\n'].includes(tokenSeparator),
        ),
      );

      /** Used for component focused management */
      const [mockFocused, setMockFocused, cancelSetMockFocused] = useDelayReset();

      const mergedId = computed(() => props.id || `rc_select_${getUUID()}`);

      // optionLabelProp
      let mergedOptionLabelProp = computed(() => {
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

      // ============================== Ref ===============================
      const selectorDomRef = createRef();

      const mergedValue = ref(undefined);
      watch(
        computed(() => [props.value, props.defaultValue]),
        () => {
          mergedValue.value = props.value !== undefined ? props.value : props.defaultValue;
        },
        { immediate: true },
      );
      // ============================= Value ==============================

      /** Unique raw values */
      const mergedRawValue = computed(() =>
        toInnerValue(mergedValue.value, {
          labelInValue: mergedLabelInValue.value,
          combobox: props.mode === 'combobox',
        }),
      );
      /** We cache a set of raw values to speed up check */
      const rawValues = computed(() => new Set(mergedRawValue.value));

      // ============================= Option =============================
      // Set by option list active, it will merge into search input when mode is `combobox`
      const activeValue = ref(null);
      const setActiveValue = (val: string) => {
        activeValue.value = val;
      };
      const innerSearchValue = ref('');
      const setInnerSearchValue = (val: string) => {
        innerSearchValue.value = val;
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

      const mergedOptions = computed(
        (): OptionsType => {
          let newOptions = props.options;
          if (newOptions === undefined) {
            newOptions = convertChildrenToData(props.children);
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

          return newOptions || ([] as OptionsType);
        },
      );

      const mergedFlattenOptions = computed(() => flattenOptions(mergedOptions.value, props));

      const getValueOption = useCacheOptions(mergedRawValue.value, mergedFlattenOptions);

      // Display options for OptionList
      const displayOptions = computed<OptionsType>(() => {
        if (!mergedSearchValue.value || !mergedShowSearch) {
          return [...mergedOptions.value] as OptionsType;
        }
        const { optionFilterProp = 'value', mode, filterOption } = props;
        const filteredOptions: OptionsType = filterOptions(
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
          });
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
            prevValue: mergedValue.value,
            labelInValue: mergedLabelInValue.value,
            optionLabelProp: mergedOptionLabelProp.value,
          });

          return {
            ...displayValue,
            disabled: isValueDisabled(val, valueOptions),
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

        if (!props.internalProps.skipTriggerSelect) {
          // Skip trigger `onSelect` or `onDeselect` if configured
          const selectValue = (mergedLabelInValue.value
            ? getLabeledValue(newValue, {
                options: newValueOption,
                prevValue: mergedValue.value,
                labelInValue: mergedLabelInValue.value,
                optionLabelProp: mergedOptionLabelProp.value,
              })
            : newValue) as SingleType<ValueType>;

          if (isSelect && props.onSelect) {
            props.onSelect(selectValue, outOption);
          } else if (!isSelect && props.onDeselect) {
            props.onDeselect(selectValue, outOption);
          }
        }

        // Trigger internal event
        if (useInternalProps.value) {
          if (isSelect && props.internalProps.onRawSelect) {
            props.internalProps.onRawSelect(newValue, outOption, source);
          } else if (!isSelect && props.internalProps.onRawDeselect) {
            props.internalProps.onRawDeselect(newValue, outOption, source);
          }
        }
      };

      // We need cache options here in case user update the option list
      const prevValueOptions = ref([]);
      const setPrevValueOptions = (val: any[]) => {
        prevValueOptions.value = val;
      };
      const triggerChange = (newRawValues: RawValueType[]) => {
        if (useInternalProps.value && props.internalProps.skipTriggerChange) {
          return;
        }
        const newRawValuesOptions = getValueOption(newRawValues);
        const outValues = toOuterValues<FlattenOptionsType<OptionsType>>(Array.from(newRawValues), {
          labelInValue: mergedLabelInValue.value,
          options: newRawValuesOptions,
          getLabeledValue,
          prevValue: mergedValue.value,
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
        mergedValue.value = outValue;
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

      const innerOpen = ref(undefined);
      let mergedOpen = ref(undefined);
      const setInnerOpen = (val: boolean) => {
        innerOpen.value = val;
        mergedOpen.value = innerOpen.value;
      };
      watch(
        computed(() => [props.defaultOpen, props.open]),
        () => {
          setInnerOpen(props.open !== undefined ? props.open : props.defaultOpen);
        },
        { immediate: true },
      );

      // Not trigger `open` in `combobox` when `notFoundContent` is empty
      const emptyListContent = computed(
        () => !props.notFoundContent && !displayOptions.value.length,
      );
      watch(
        computed(
          () =>
            props.disabled ||
            (emptyListContent.value && innerOpen.value && props.mode === 'combobox'),
        ),
        val => {
          if (val) {
            mergedOpen.value = false;
          } else {
            mergedOpen.value = innerOpen.value;
          }
        },
        { immediate: true },
      );

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

      useSelectTriggerControl(
        [containerRef.value, triggerRef.value && triggerRef.value.getPopupElement()],
        triggerOpen,
        onToggleOpen,
      );

      // ============================= Search =============================
      const triggerSearch = (searchText: string, fromTyping: boolean, isCompositing: boolean) => {
        let ret = true;
        let newSearchText = searchText;
        setActiveValue(null);

        // Check if match the `tokenSeparators`
        const patchLabels: string[] = isCompositing
          ? null
          : getSeparatedContent(searchText, props.tokenSeparators);
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

        if (props.onSearch && mergedSearchValue.value !== newSearchText) {
          props.onSearch(newSearchText);
        }

        return ret;
      };

      // Only triggered when menu is closed & mode is tags
      // If menu is open, OptionList will take charge
      // If mode isn't tags, press enter is not meaningful when you can't see any option
      const onSearchSubmit = (searchText: string) => {
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
        computed(() => props.disabled),
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

        // We only manage open state here, close logic should handle by list component
        if (!mergedOpen.value && which === KeyCode.ENTER) {
          onToggleOpen(true);
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
      const onInternalKeyUp = (event: Event) => {
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
          if (props.showAction.includes('focus')) {
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

        if (mergedSearchValue.value) {
          // `tags` mode should move `searchValue` into values
          if (props.mode === 'tags') {
            triggerSearch('', false, false);
            triggerChange(Array.from(new Set([...mergedRawValue.value, mergedSearchValue.value])));
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
        activeTimeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
        activeTimeoutIds.splice(0, activeTimeoutIds.length);
      });
      onBeforeUnmount(() => {
        activeTimeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
        activeTimeoutIds.splice(0, activeTimeoutIds.length);
      });

      const onInternalMouseDown = (event: MouseEvent) => {
        const { target } = event;
        const popupElement: HTMLDivElement = triggerRef.value && triggerRef.value.getPopupElement();

        // We should give focus back to selector if clicked item is not focusable
        if (popupElement && popupElement.contains(target as HTMLElement)) {
          const timeoutId = setTimeout(() => {
            const index = activeTimeoutIds.indexOf(timeoutId);
            if (index !== -1) {
              activeTimeoutIds.splice(index, 1);
            }

            cancelSetMockFocused();

            if (!popupElement.contains(document.activeElement)) {
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
      const containerWidth = ref(null);
      onMounted(() => {
        watch(
          triggerOpen,
          () => {
            if (triggerOpen.value) {
              const newWidth = Math.ceil(containerRef.value.offsetWidth);
              if (containerWidth !== newWidth) {
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
      return {
        focus,
        blur,
        tokenWithEnter,
        mockFocused,
        mergedId,
        containerWidth,
        onActiveValue,
        accessibilityIndex,
        mergedDefaultActiveFirstOption,
        onInternalMouseDown,
        onContainerFocus,
        onContainerBlur,
        onInternalKeyDown,
        isMultiple,
        mergedOpen,
        displayOptions,
        displayFlattenOptions,
        rawValues,
        onInternalOptionSelect,
        onToggleOpen,
        mergedSearchValue,
        useInternalProps,
        triggerChange,
        triggerSearch,
        mergedRawValue,
        mergedShowSearch,
        onInternalKeyUp,
        triggerOpen,
        mergedOptions,
        onInternalSelectionSelect,
        selectorDomRef,
        displayValues,
        activeValue,
        onSearchSubmit,
        containerRef,
        listRef,
      };
    },
    methods: {
      // We need force update here since popup dom is render async
      onPopupMouseEnter() {
        this.$forceUpdate();
      },
    },
    render() {
      const {
        tokenWithEnter,
        mockFocused,
        mergedId,
        containerWidth,
        onActiveValue,
        accessibilityIndex,
        mergedDefaultActiveFirstOption,
        onInternalMouseDown,
        onInternalKeyDown,
        isMultiple,
        mergedOpen,
        displayOptions,
        displayFlattenOptions,
        rawValues,
        onInternalOptionSelect,
        onToggleOpen,
        mergedSearchValue,
        onPopupMouseEnter,
        useInternalProps,
        triggerChange,
        triggerSearch,
        mergedRawValue,
        mergedShowSearch,
        onInternalKeyUp,
        triggerOpen,
        mergedOptions,
        onInternalSelectionSelect,
        selectorDomRef,
        displayValues,
        activeValue,
        onSearchSubmit,
      } = this;
      const {
        prefixCls = defaultPrefixCls,
        class: className,
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
        optionFilterProp = 'value',
        autoClearSearchValue = true,
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
        showAction = [],
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
      } = this.$props as SelectProps<OptionsType, ValueType>;

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
          ref="listRef"
          prefixCls={prefixCls}
          id={mergedId}
          open={mergedOpen}
          childrenAsData={!options}
          options={displayOptions}
          flattenOptions={displayFlattenOptions}
          multiple={isMultiple}
          values={rawValues}
          height={listHeight}
          itemHeight={listItemHeight}
          onSelect={onInternalOptionSelect}
          onToggleOpen={onToggleOpen}
          onActiveValue={onActiveValue}
          defaultActiveFirstOption={mergedDefaultActiveFirstOption}
          notFoundContent={notFoundContent}
          onScroll={onPopupScroll}
          searchValue={mergedSearchValue}
          menuItemSelectedIcon={menuItemSelectedIcon}
          virtual={virtual !== false && dropdownMatchSelectWidth !== false}
          onMouseenter={onPopupMouseEnter}
        />
      );

      // ============================= Clear ==============================
      let clearNode: VNode | JSX.Element;
      const onClearMouseDown = () => {
        // Trigger internal `onClear` event
        if (useInternalProps && internalProps.onClear) {
          internalProps.onClear();
        }

        if (onClear) {
          onClear();
        }

        triggerChange([]);
        triggerSearch('', false, false);
      };

      if (!disabled && allowClear && (mergedRawValue.length || mergedSearchValue)) {
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
        showArrow !== undefined ? showArrow : loading || (!isMultiple && mode !== 'combobox');
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
              searchValue: mergedSearchValue,
              open: mergedOpen,
              focused: mockFocused,
              showSearch: mergedShowSearch,
            }}
          />
        );
      }

      // ============================ Warning =============================
      if (process.env.NODE_ENV !== 'production' && warningProps) {
        warningProps(this.$props);
      }

      // ============================= Render =============================
      const mergedClassName = classNames(prefixCls, className, {
        [`${prefixCls}-focused`]: mockFocused,
        [`${prefixCls}-multiple`]: isMultiple,
        [`${prefixCls}-single`]: !isMultiple,
        [`${prefixCls}-allow-clear`]: allowClear,
        [`${prefixCls}-show-arrow`]: mergedShowArrow,
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-loading`]: loading,
        [`${prefixCls}-open`]: mergedOpen,
        [`${prefixCls}-customize-input`]: customizeInputElement,
        [`${prefixCls}-show-search`]: mergedShowSearch,
      });

      return (
        <div
          class={mergedClassName}
          {...domProps}
          ref="containerRef"
          onMousedown={onInternalMouseDown}
          onKeydown={onInternalKeyDown}
          onKeyup={onInternalKeyUp}
          // onFocus={onContainerFocus} // trigger by input
          // onBlur={onContainerBlur} // trigger by input
        >
          {mockFocused && !mergedOpen && (
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
              {`${mergedRawValue.join(', ')}`}
            </span>
          )}
          <SelectTrigger
            ref="triggerRef"
            disabled={disabled}
            prefixCls={prefixCls}
            visible={triggerOpen}
            popupElement={popupNode}
            containerWidth={containerWidth}
            animation={animation}
            transitionName={transitionName}
            dropdownStyle={dropdownStyle}
            dropdownClassName={dropdownClassName}
            direction={direction}
            dropdownMatchSelectWidth={dropdownMatchSelectWidth}
            dropdownRender={dropdownRender}
            dropdownAlign={dropdownAlign}
            getPopupContainer={getPopupContainer}
            empty={!mergedOptions.length}
            getTriggerDOMNode={() => selectorDomRef.current as any}
          >
            <Selector
              {...this.$props}
              domRef={selectorDomRef}
              prefixCls={prefixCls}
              inputElement={customizeInputElement}
              ref="selectorRef"
              id={mergedId}
              showSearch={mergedShowSearch}
              mode={mode}
              accessibilityIndex={accessibilityIndex}
              multiple={isMultiple}
              tagRender={tagRender}
              values={displayValues}
              open={mergedOpen}
              onToggleOpen={onToggleOpen}
              searchValue={mergedSearchValue}
              activeValue={activeValue}
              onSearch={triggerSearch}
              onSearchSubmit={onSearchSubmit}
              onSelect={onInternalSelectionSelect}
              tokenWithEnter={tokenWithEnter}
            />
          </SelectTrigger>

          {arrowNode}
          {clearNode}
        </div>
      );
    },
  });
  Select.inheritAttrs = false;
  Select.props = {
    prefixCls: PropTypes.string,
    id: PropTypes.string,
    class: PropTypes.string,
    style: PropTypes.any,

    // Options
    options: PropTypes.array,
    children: PropTypes.array.def([]),
    mode: PropTypes.string,

    // Value
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    labelInValue: { type: Boolean, default: undefined },

    // Search
    inputValue: PropTypes.string,
    searchValue: PropTypes.string,
    optionFilterProp: PropTypes.string.def('value'),
    /**
     * In Select, `false` means do nothing.
     * In TreeSelect, `false` will highlight match item.
     * It's by design.
     */
    filterOption: PropTypes.any,
    showSearch: { type: Boolean, default: undefined },
    autoClearSearchValue: { type: Boolean, default: undefined },
    onSearch: PropTypes.func,
    onClear: PropTypes.func,

    // Icons
    allowClear: { type: Boolean, default: undefined },
    clearIcon: PropTypes.any,
    showArrow: {
      type: Boolean,
      default: undefined,
    },
    inputIcon: PropTypes.any,
    removeIcon: PropTypes.any,
    menuItemSelectedIcon: PropTypes.func,

    // Dropdown
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: undefined },
    listHeight: PropTypes.number.def(200),
    listItemHeight: PropTypes.number.def(20),
    dropdownStyle: PropTypes.object,
    dropdownClassName: PropTypes.string,
    dropdownMatchSelectWidth: PropTypes.oneOfType([Boolean, Number]).def(true),
    virtual: { type: Boolean, default: undefined },
    dropdownRender: PropTypes.func,
    dropdownAlign: PropTypes.any,
    animation: PropTypes.string,
    transitionName: PropTypes.string,
    getPopupContainer: PropTypes.func,
    direction: PropTypes.string,

    // Others
    disabled: { type: Boolean, default: undefined },
    loading: { type: Boolean, default: undefined },
    autofocus: { type: Boolean, default: undefined },
    defaultActiveFirstOption: { type: Boolean, default: undefined },
    notFoundContent: PropTypes.any.def('Not Found'),
    placeholder: PropTypes.any,
    backfill: { type: Boolean, default: undefined },
    getInputElement: PropTypes.func,
    optionLabelProp: PropTypes.string,
    maxTagTextLength: PropTypes.number,
    maxTagCount: PropTypes.number,
    maxTagPlaceholder: PropTypes.any,
    tokenSeparators: PropTypes.array,
    tagRender: PropTypes.func,
    showAction: PropTypes.array.def([]),
    tabindex: PropTypes.number,

    // Events
    onKeyup: PropTypes.func,
    onKeydown: PropTypes.func,
    onPopupScroll: PropTypes.func,
    onDropdownVisibleChange: PropTypes.func,
    onSelect: PropTypes.func,
    onDeselect: PropTypes.func,
    onInputKeyDown: PropTypes.func,
    onClick: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onMousedown: PropTypes.func,
    onMouseenter: PropTypes.func,
    onMouseleave: PropTypes.func,

    // Motion
    choiceTransitionName: PropTypes.string,

    // Internal props
    /**
     * Only used in current version for internal event process.
     * Do not use in production environment.
     */
    internalProps: PropTypes.object.def({}),
  };
  return Select;
}
