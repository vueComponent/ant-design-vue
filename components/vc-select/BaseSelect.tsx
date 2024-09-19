import { getSeparatedContent } from './utils/valueUtil';
import type { RefTriggerProps } from './SelectTrigger';
import SelectTrigger from './SelectTrigger';
import type { RefSelectorProps } from './Selector';
import Selector from './Selector';
import useSelectTriggerControl from './hooks/useSelectTriggerControl';
import useDelayReset from './hooks/useDelayReset';
import TransBtn from './TransBtn';
import useLock from './hooks/useLock';
import type { BaseSelectContextProps } from './hooks/useBaseProps';
import { useProvideBaseSelectProps } from './hooks/useBaseProps';
import type { Key, VueNode } from '../_util/type';
import type {
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
} from '../_util/EventInterface';
import type { ScrollConfig, ScrollTo } from '../vc-virtual-list/List';
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  provide,
  shallowRef,
  toRefs,
  watch,
  watchEffect,
  ref,
} from 'vue';
import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import PropTypes from '../_util/vue-types';
import { initDefaultProps, isValidElement } from '../_util/props-util';
import isMobile from '../vc-util/isMobile';
import KeyCode from '../_util/KeyCode';
import { toReactive } from '../_util/toReactive';
import classNames from '../_util/classNames';
import createRef from '../_util/createRef';
import type { BaseOptionType } from './Select';
import useInjectLegacySelectContext from '../vc-tree-select/LegacyContext';
import { cloneElement } from '../_util/vnode';
import type { AlignType } from '../vc-trigger/interface';

const DEFAULT_OMIT_PROPS = [
  'value',
  'onChange',
  'removeIcon',
  'placeholder',
  'autofocus',
  'maxTagCount',
  'maxTagTextLength',
  'maxTagPlaceholder',
  'choiceTransitionName',
  'onInputKeyDown',
  'onPopupScroll',
  'tabindex',
  'OptionList',
  'notFoundContent',
] as const;

export type RenderNode = VueNode | ((props: any) => VueNode);

export type RenderDOMFunc = (props: any) => HTMLElement;

export type Mode = 'multiple' | 'tags' | 'combobox';

export type Placement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';

export type RawValueType = string | number;

export interface RefOptionListProps {
  onKeydown: KeyboardEventHandler;
  onKeyup: KeyboardEventHandler;
  scrollTo?: (index: number | ScrollConfig) => void;
}

export type CustomTagProps = {
  label: any;
  value: any;
  disabled: boolean;
  onClose: (event?: MouseEvent) => void;
  closable: boolean;
  option: BaseOptionType;
};

export interface DisplayValueType {
  key?: Key;
  value?: RawValueType;
  label?: any;
  disabled?: boolean;
  option?: BaseOptionType;
}

export type BaseSelectRef = {
  focus: () => void;
  blur: () => void;
  scrollTo: ScrollTo;
};

const baseSelectPrivateProps = () => {
  return {
    prefixCls: String,
    id: String,
    omitDomProps: Array as PropType<string[]>,

    // >>> Value
    displayValues: Array as PropType<DisplayValueType[]>,
    onDisplayValuesChange: Function as PropType<
      (
        values: DisplayValueType[],
        info: {
          type: 'add' | 'remove' | 'clear';
          values: DisplayValueType[];
        },
      ) => void
    >,

    // >>> Active
    /** Current dropdown list active item string value */
    activeValue: String,
    /** Link search input with target element */
    activeDescendantId: String,
    onActiveValueChange: Function as PropType<(value: string | null) => void>,

    // >>> Search
    searchValue: String,
    /** Trigger onSearch, return false to prevent trigger open event */
    onSearch: Function as PropType<
      (
        searchValue: string,
        info: {
          source:
            | 'typing' //User typing
            | 'effect' // Code logic trigger
            | 'submit' // tag mode only
            | 'blur'; // Not trigger event
        },
      ) => void
    >,
    /** Trigger when search text match the `tokenSeparators`. Will provide split content */
    onSearchSplit: Function as PropType<(words: string[]) => void>,
    maxLength: Number,

    OptionList: PropTypes.any,

    /** Tell if provided `options` is empty */
    emptyOptions: Boolean,
  };
};

export type DropdownObject = {
  menuNode?: VueNode;
  props?: Record<string, any>;
};

export type DropdownRender = (opt?: DropdownObject) => VueNode;
export const baseSelectPropsWithoutPrivate = () => {
  return {
    showSearch: { type: Boolean, default: undefined },
    tagRender: { type: Function as PropType<(props: CustomTagProps) => any> },
    optionLabelRender: { type: Function as PropType<(option: Record<string, any>) => any> },
    direction: { type: String as PropType<'ltr' | 'rtl'> },

    // MISC
    tabindex: Number,
    autofocus: Boolean,
    notFoundContent: PropTypes.any,
    placeholder: PropTypes.any,
    onClear: Function as PropType<() => void>,

    choiceTransitionName: String,

    // >>> Mode
    mode: String as PropType<Mode>,

    // >>> Status
    disabled: { type: Boolean, default: undefined },
    loading: { type: Boolean, default: undefined },

    // >>> Open
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: undefined },
    onDropdownVisibleChange: { type: Function as PropType<(open: boolean) => void> },

    // >>> Customize Input
    /** @private Internal usage. Do not use in your production. */
    getInputElement: { type: Function as PropType<() => any> },
    /** @private Internal usage. Do not use in your production. */
    getRawInputElement: { type: Function as PropType<() => any> },

    // >>> Selector
    maxTagTextLength: Number,
    maxTagCount: { type: [String, Number] as PropType<number | 'responsive'> },
    maxTagPlaceholder: PropTypes.any,

    // >>> Search
    tokenSeparators: { type: Array as PropType<string[]> },

    // >>> Icons
    allowClear: { type: Boolean, default: undefined },
    showArrow: { type: Boolean, default: undefined },
    inputIcon: PropTypes.any,
    /** Clear all icon */
    clearIcon: PropTypes.any,
    /** Selector remove icon */
    removeIcon: PropTypes.any,

    // >>> Dropdown
    animation: String,
    transitionName: String,
    dropdownStyle: { type: Object as PropType<CSSProperties> },
    dropdownClassName: String,
    dropdownMatchSelectWidth: {
      type: [Boolean, Number] as PropType<boolean | number>,
      default: undefined,
    },
    dropdownRender: { type: Function as PropType<DropdownRender> },
    dropdownAlign: Object as PropType<AlignType>,
    placement: {
      type: String as PropType<Placement>,
    },
    getPopupContainer: { type: Function as PropType<RenderDOMFunc> },

    // >>> Focus
    showAction: { type: Array as PropType<('focus' | 'click')[]> },
    onBlur: { type: Function as PropType<(e: FocusEvent) => void> },
    onFocus: { type: Function as PropType<(e: FocusEvent) => void> },

    // >>> Rest Events
    onKeyup: Function as PropType<(e: KeyboardEvent) => void>,
    onKeydown: Function as PropType<(e: KeyboardEvent) => void>,
    onMousedown: Function as PropType<(e: MouseEvent) => void>,
    onPopupScroll: Function as PropType<(e: UIEvent) => void>,
    onInputKeyDown: Function as PropType<(e: KeyboardEvent) => void>,
    onMouseenter: Function as PropType<(e: MouseEvent) => void>,
    onMouseleave: Function as PropType<(e: MouseEvent) => void>,
    onClick: Function as PropType<(e: MouseEvent) => void>,
  };
};
const baseSelectProps = () => {
  return {
    ...baseSelectPrivateProps(),
    ...baseSelectPropsWithoutPrivate(),
  };
};

export type BaseSelectPrivateProps = Partial<
  ExtractPropTypes<ReturnType<typeof baseSelectPrivateProps>>
>;

export type BaseSelectProps = Partial<ExtractPropTypes<ReturnType<typeof baseSelectProps>>>;

export type BaseSelectPropsWithoutPrivate = Omit<BaseSelectProps, keyof BaseSelectPrivateProps>;

export function isMultiple(mode: Mode) {
  return mode === 'tags' || mode === 'multiple';
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'BaseSelect',
  inheritAttrs: false,
  props: initDefaultProps(baseSelectProps(), { showAction: [], notFoundContent: 'Not Found' }),
  setup(props, { attrs, expose, slots }) {
    const multiple = computed(() => isMultiple(props.mode));

    const mergedShowSearch = computed(() =>
      props.showSearch !== undefined
        ? props.showSearch
        : multiple.value || props.mode === 'combobox',
    );
    const mobile = shallowRef(false);
    onMounted(() => {
      mobile.value = isMobile();
    });
    const legacyTreeSelectContext = useInjectLegacySelectContext();
    // ============================== Refs ==============================
    const containerRef = shallowRef<HTMLDivElement>(null);
    const selectorDomRef = createRef();
    const triggerRef = shallowRef<RefTriggerProps>(null);
    const selectorRef = shallowRef<RefSelectorProps>(null);
    const listRef = shallowRef<RefOptionListProps>(null);
    const blurRef = ref<boolean>(false);

    /** Used for component focused management */
    const [mockFocused, setMockFocused, cancelSetMockFocused] = useDelayReset();

    const focus = () => {
      selectorRef.value?.focus();
    };
    const blur = () => {
      selectorRef.value?.blur();
    };
    expose({
      focus,
      blur,
      scrollTo: arg => listRef.value?.scrollTo(arg),
    });

    const mergedSearchValue = computed(() => {
      if (props.mode !== 'combobox') {
        return props.searchValue;
      }

      const val = props.displayValues[0]?.value;

      return typeof val === 'string' || typeof val === 'number' ? String(val) : '';
    });

    // ============================== Open ==============================
    const initOpen = props.open !== undefined ? props.open : props.defaultOpen;
    const innerOpen = shallowRef(initOpen);
    const mergedOpen = shallowRef(initOpen);
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
    const emptyListContent = computed(() => !props.notFoundContent && props.emptyOptions);

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

      if (mergedOpen.value !== nextOpen && !props.disabled) {
        setInnerOpen(nextOpen);
        props.onDropdownVisibleChange && props.onDropdownVisibleChange(nextOpen);

        if (!nextOpen && popupFocused.value) {
          popupFocused.value = false;
          setMockFocused(false, () => {
            focusRef.value = false;
            blurRef.value = false;
          });
        }
      }
    };

    const tokenWithEnter = computed(() =>
      (props.tokenSeparators || []).some(tokenSeparator => ['\n', '\r\n'].includes(tokenSeparator)),
    );

    const onInternalSearch = (searchText: string, fromTyping: boolean, isCompositing: boolean) => {
      let ret = true;
      let newSearchText = searchText;
      props.onActiveValueChange?.(null);

      // Check if match the `tokenSeparators`
      const patchLabels: string[] = isCompositing
        ? null
        : getSeparatedContent(searchText, props.tokenSeparators);

      // Ignore combobox since it's not split-able
      if (props.mode !== 'combobox' && patchLabels) {
        newSearchText = '';

        props.onSearchSplit?.(patchLabels);

        // Should close when paste finish
        onToggleOpen(false);

        // Tell Selector that break next actions
        ret = false;
      }

      if (props.onSearch && mergedSearchValue.value !== newSearchText) {
        props.onSearch(newSearchText, {
          source: fromTyping ? 'typing' : 'effect',
        });
      }

      return ret;
    };

    // Only triggered when menu is closed & mode is tags
    // If menu is open, OptionList will take charge
    // If mode isn't tags, press enter is not meaningful when you can't see any option
    const onInternalSearchSubmit = (searchText: string) => {
      // prevent empty tags from appearing when you click the Enter button
      if (!searchText || !searchText.trim()) {
        return;
      }
      props.onSearch?.(searchText, { source: 'submit' });
    };

    // Close will clean up single mode search text
    watch(
      mergedOpen,
      () => {
        if (!mergedOpen.value && !multiple.value && props.mode !== 'combobox') {
          onInternalSearch('', false, false);
        }
      },
      { immediate: true, flush: 'post' },
    );

    // ============================ Disabled ============================
    // Close dropdown & remove focus state when disabled change
    watch(
      () => props.disabled,
      () => {
        if (innerOpen.value && !!props.disabled) {
          setInnerOpen(false);
        }
        if (props.disabled && !blurRef.value) {
          setMockFocused(false);
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
    const onInternalKeyDown: KeyboardEventHandler = (event, ...rest) => {
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
        multiple.value &&
        !mergedSearchValue.value &&
        props.displayValues.length
      ) {
        const cloneDisplayValues = [...props.displayValues];
        let removedDisplayValue = null;

        for (let i = cloneDisplayValues.length - 1; i >= 0; i -= 1) {
          const current = cloneDisplayValues[i];

          if (!current.disabled) {
            cloneDisplayValues.splice(i, 1);
            removedDisplayValue = current;
            break;
          }
        }

        if (removedDisplayValue) {
          props.onDisplayValuesChange(cloneDisplayValues, {
            type: 'remove',
            values: [removedDisplayValue],
          });
        }
      }

      if (mergedOpen.value && listRef.value) {
        listRef.value.onKeydown(event, ...rest);
      }

      props.onKeydown?.(event, ...rest);
    };

    // KeyUp
    const onInternalKeyUp: KeyboardEventHandler = (event: KeyboardEvent, ...rest) => {
      if (mergedOpen.value && listRef.value) {
        listRef.value.onKeyup(event, ...rest);
      }

      if (props.onKeyup) {
        props.onKeyup(event, ...rest);
      }
    };

    // ============================ Selector ============================
    const onSelectorRemove = (val: DisplayValueType) => {
      const newValues = props.displayValues.filter(i => i !== val);

      props.onDisplayValuesChange(newValues, {
        type: 'remove',
        values: [val],
      });
    };

    // ========================== Focus / Blur ==========================
    /** Record real focus status */
    const focusRef = shallowRef(false);
    const onContainerFocus: FocusEventHandler = (...args) => {
      setMockFocused(true);

      if (!props.disabled) {
        if (props.onFocus && !focusRef.value) {
          props.onFocus(...args);
        }

        // `showAction` should handle `focus` if set
        if (props.showAction && props.showAction.includes('focus')) {
          onToggleOpen(true);
        }
      }

      focusRef.value = true;
    };
    const popupFocused = ref(false);
    const onContainerBlur: FocusEventHandler = (...args) => {
      if (popupFocused.value) {
        return;
      }
      blurRef.value = true;
      setMockFocused(false, () => {
        focusRef.value = false;
        blurRef.value = false;
        onToggleOpen(false);
      });

      if (props.disabled) {
        return;
      }
      const searchVal = mergedSearchValue.value;
      if (searchVal) {
        // `tags` mode should move `searchValue` into values
        if (props.mode === 'tags') {
          props.onSearch(searchVal, { source: 'submit' });
        } else if (props.mode === 'multiple') {
          // `multiple` mode only clean the search value but not trigger event
          props.onSearch('', {
            source: 'blur',
          });
        }
      }

      if (props.onBlur) {
        props.onBlur(...args);
      }
    };
    const onPopupFocusin = () => {
      popupFocused.value = true;
    };
    const onPopupFocusout = () => {
      popupFocused.value = false;
    };
    provide('VCSelectContainerEvent', {
      focus: onContainerFocus,
      blur: onContainerBlur,
    });

    // Give focus back of Select
    const activeTimeoutIds: any[] = [];

    onMounted(() => {
      activeTimeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
      activeTimeoutIds.splice(0, activeTimeoutIds.length);
    });
    onBeforeUnmount(() => {
      activeTimeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
      activeTimeoutIds.splice(0, activeTimeoutIds.length);
    });

    const onInternalMouseDown: MouseEventHandler = (event, ...restArgs) => {
      const { target } = event;
      const popupElement: HTMLDivElement = triggerRef.value?.getPopupElement();

      // We should give focus back to selector if clicked item is not focusable
      if (popupElement && popupElement.contains(target as HTMLElement)) {
        const timeoutId: any = setTimeout(() => {
          const index = activeTimeoutIds.indexOf(timeoutId);
          if (index !== -1) {
            activeTimeoutIds.splice(index, 1);
          }

          cancelSetMockFocused();

          if (!mobile.value && !popupElement.contains(document.activeElement)) {
            selectorRef.value?.focus();
          }
        });

        activeTimeoutIds.push(timeoutId);
      }

      props.onMousedown?.(event, ...restArgs);
    };

    // ============================= Dropdown ==============================
    const containerWidth = shallowRef<number>(null);
    // const instance = getCurrentInstance();
    const onPopupMouseEnter = () => {
      // We need force update here since popup dom is render async
      // instance.update();
    };
    onMounted(() => {
      watch(
        triggerOpen,
        () => {
          if (triggerOpen.value) {
            const newWidth = Math.ceil(containerRef.value?.offsetWidth);
            if (containerWidth.value !== newWidth && !Number.isNaN(newWidth)) {
              containerWidth.value = newWidth;
            }
          }
        },
        { immediate: true, flush: 'post' },
      );
    });

    // Close when click on non-select element
    useSelectTriggerControl([containerRef, triggerRef], triggerOpen, onToggleOpen);
    useProvideBaseSelectProps(
      toReactive({
        ...toRefs(props),
        open: mergedOpen,
        triggerOpen,
        showSearch: mergedShowSearch,
        multiple,
        toggleOpen: onToggleOpen,
      } as unknown as BaseSelectContextProps),
    );
    return () => {
      const {
        prefixCls,
        id,

        open,
        defaultOpen,

        mode,

        // Search related
        showSearch,
        searchValue,
        onSearch,

        // Icons
        allowClear,
        clearIcon,
        showArrow,
        inputIcon,

        // Others
        disabled,
        loading,
        getInputElement,
        getPopupContainer,
        placement,

        // Dropdown
        animation,
        transitionName,
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
        optionLabelRender,

        // Events
        onPopupScroll,
        onDropdownVisibleChange,
        onFocus,
        onBlur,
        onKeyup,
        onKeydown,
        onMousedown,

        onClear,
        omitDomProps,
        getRawInputElement,
        displayValues,
        onDisplayValuesChange,
        emptyOptions,
        activeDescendantId,
        activeValue,
        OptionList,

        ...restProps
      } = { ...props, ...attrs } as BaseSelectProps;
      // ============================= Input ==============================
      // Only works in `combobox`
      const customizeInputElement: any =
        (mode === 'combobox' && getInputElement && getInputElement()) || null;

      // Used for customize replacement for `vc-cascader`
      const customizeRawInputElement: any =
        typeof getRawInputElement === 'function' && getRawInputElement();
      const domProps = {
        ...restProps,
      } as Omit<keyof typeof restProps, (typeof DEFAULT_OMIT_PROPS)[number]>;

      // Used for raw custom input trigger
      let onTriggerVisibleChange: null | ((newOpen: boolean) => void);
      if (customizeRawInputElement) {
        onTriggerVisibleChange = (newOpen: boolean) => {
          onToggleOpen(newOpen);
        };
      }

      DEFAULT_OMIT_PROPS.forEach(propName => {
        delete domProps[propName];
      });

      omitDomProps?.forEach(propName => {
        delete domProps[propName];
      });

      // ============================= Arrow ==============================
      const mergedShowArrow =
        showArrow !== undefined ? showArrow : loading || (!multiple.value && mode !== 'combobox');
      let arrowNode: VueNode;

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

      // ============================= Clear ==============================
      let clearNode: VueNode;
      const onClearMouseDown: MouseEventHandler = () => {
        onClear?.();

        onDisplayValuesChange([], {
          type: 'clear',
          values: displayValues,
        });
        onInternalSearch('', false, false);
      };

      if (!disabled && allowClear && (displayValues.length || mergedSearchValue.value)) {
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

      // =========================== OptionList ===========================
      const optionList = (
        <OptionList
          ref={listRef}
          v-slots={{ ...legacyTreeSelectContext.customSlots, option: slots.option }}
        />
      );

      // ============================= Select =============================
      const mergedClassName = classNames(prefixCls, attrs.class, {
        [`${prefixCls}-focused`]: mockFocused.value,
        [`${prefixCls}-multiple`]: multiple.value,
        [`${prefixCls}-single`]: !multiple.value,
        [`${prefixCls}-allow-clear`]: allowClear,
        [`${prefixCls}-show-arrow`]: mergedShowArrow,
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-loading`]: loading,
        [`${prefixCls}-open`]: mergedOpen.value,
        [`${prefixCls}-customize-input`]: customizeInputElement,
        [`${prefixCls}-show-search`]: mergedShowSearch.value,
      });

      // >>> Selector
      const selectorNode = (
        <SelectTrigger
          ref={triggerRef}
          disabled={disabled}
          prefixCls={prefixCls}
          visible={triggerOpen.value}
          popupElement={optionList}
          containerWidth={containerWidth.value}
          animation={animation}
          transitionName={transitionName}
          dropdownStyle={dropdownStyle}
          dropdownClassName={dropdownClassName}
          direction={direction}
          dropdownMatchSelectWidth={dropdownMatchSelectWidth}
          dropdownRender={dropdownRender}
          dropdownAlign={dropdownAlign}
          placement={placement}
          getPopupContainer={getPopupContainer}
          empty={emptyOptions}
          getTriggerDOMNode={() => selectorDomRef.current}
          onPopupVisibleChange={onTriggerVisibleChange}
          onPopupMouseEnter={onPopupMouseEnter}
          onPopupFocusin={onPopupFocusin}
          onPopupFocusout={onPopupFocusout}
          v-slots={{
            default: () => {
              return customizeRawInputElement ? (
                isValidElement(customizeRawInputElement) &&
                  cloneElement(
                    customizeRawInputElement,
                    {
                      ref: selectorDomRef,
                    },
                    false,
                    true,
                  )
              ) : (
                <Selector
                  {...props}
                  domRef={selectorDomRef}
                  prefixCls={prefixCls}
                  inputElement={customizeInputElement}
                  ref={selectorRef}
                  id={id}
                  showSearch={mergedShowSearch.value}
                  mode={mode}
                  activeDescendantId={activeDescendantId}
                  tagRender={tagRender}
                  optionLabelRender={optionLabelRender}
                  values={displayValues}
                  open={mergedOpen.value}
                  onToggleOpen={onToggleOpen}
                  activeValue={activeValue}
                  searchValue={mergedSearchValue.value}
                  onSearch={onInternalSearch}
                  onSearchSubmit={onInternalSearchSubmit}
                  onRemove={onSelectorRemove}
                  tokenWithEnter={tokenWithEnter.value}
                />
              );
            },
          }}
        ></SelectTrigger>
      );
      // >>> Render
      let renderNode: VueNode;

      // Render raw
      if (customizeRawInputElement) {
        renderNode = selectorNode;
      } else {
        renderNode = (
          <div
            {...domProps}
            class={mergedClassName}
            ref={containerRef}
            onMousedown={onInternalMouseDown}
            onKeydown={onInternalKeyDown}
            onKeyup={onInternalKeyUp}
            // onFocus={onContainerFocus}
            // onBlur={onContainerBlur}
          >
            {mockFocused.value && !mergedOpen.value && (
              <span
                style={{
                  width: 0,
                  height: 0,
                  position: 'absolute',
                  overflow: 'hidden',
                  opacity: 0,
                }}
                aria-live="polite"
              >
                {/* Merge into one string to make screen reader work as expect */}
                {`${displayValues
                  .map(({ label, value }) =>
                    ['number', 'string'].includes(typeof label) ? label : value,
                  )
                  .join(', ')}`}
              </span>
            )}
            {selectorNode}

            {arrowNode}
            {clearNode}
          </div>
        );
      }
      return renderNode;
    };
  },
});
