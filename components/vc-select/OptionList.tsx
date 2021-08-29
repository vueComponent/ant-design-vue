import TransBtn from './TransBtn';
import PropTypes from '../_util/vue-types';
import KeyCode from '../_util/KeyCode';
import classNames from '../_util/classNames';
import pickAttrs from '../_util/pickAttrs';
import { isValidElement } from '../_util/props-util';
import createRef from '../_util/createRef';
import type { PropType } from 'vue';
import { computed, defineComponent, nextTick, reactive, watch } from 'vue';
import List from '../vc-virtual-list/List';
import type {
  OptionsType as SelectOptionsType,
  OptionData,
  RenderNode,
  OnActiveValue,
} from './interface';
import type { RawValueType, FlattenOptionsType } from './interface/generator';
import useMemo from '../_util/hooks/useMemo';

export interface RefOptionListProps {
  onKeydown: (e?: KeyboardEvent) => void;
  onKeyup: (e?: KeyboardEvent) => void;
  scrollTo?: (index: number) => void;
}

import type { EventHandler } from '../_util/EventInterface';
export interface OptionListProps<OptionType extends object> {
  prefixCls: string;
  id: string;
  options: OptionType[];
  flattenOptions: FlattenOptionsType<OptionType>;
  height: number;
  itemHeight: number;
  values: Set<RawValueType>;
  multiple: boolean;
  open: boolean;
  defaultActiveFirstOption?: boolean;
  notFoundContent?: any;
  menuItemSelectedIcon?: RenderNode;
  childrenAsData: boolean;
  searchValue: string;
  virtual: boolean;

  onSelect: (value: RawValueType, option: { selected: boolean }) => void;
  onToggleOpen: (open?: boolean) => void;
  /** Tell Select that some value is now active to make accessibility work */
  onActiveValue: OnActiveValue;
  onScroll: EventHandler;

  /** Tell Select that mouse enter the popup to force re-render */
  onMouseenter?: EventHandler;
}

const OptionListProps = {
  prefixCls: PropTypes.string,
  id: PropTypes.string,
  options: PropTypes.array,
  flattenOptions: PropTypes.array,
  height: PropTypes.number,
  itemHeight: PropTypes.number,
  values: PropTypes.any,
  multiple: PropTypes.looseBool,
  open: PropTypes.looseBool,
  defaultActiveFirstOption: PropTypes.looseBool,
  notFoundContent: PropTypes.any,
  menuItemSelectedIcon: PropTypes.any,
  childrenAsData: PropTypes.looseBool,
  searchValue: PropTypes.string,
  virtual: PropTypes.looseBool,

  onSelect: PropTypes.func,
  onToggleOpen: { type: Function as PropType<(open?: boolean) => void> },
  /** Tell Select that some value is now active to make accessibility work */
  onActiveValue: PropTypes.func,
  onScroll: PropTypes.func,

  /** Tell Select that mouse enter the popup to force re-render */
  onMouseenter: PropTypes.func,
};

/**
 * Using virtual list of option display.
 * Will fallback to dom if use customize render.
 */
const OptionList = defineComponent<OptionListProps<SelectOptionsType[number]>, { state?: any }>({
  name: 'OptionList',
  inheritAttrs: false,
  slots: ['option'],
  setup(props) {
    const itemPrefixCls = computed(() => `${props.prefixCls}-item`);

    const memoFlattenOptions = useMemo(
      () => props.flattenOptions,
      [() => props.open, () => props.flattenOptions],
      next => next[0],
    );

    // =========================== List ===========================
    const listRef = createRef();

    const onListMouseDown: EventHandler = event => {
      event.preventDefault();
    };

    const scrollIntoView = (index: number) => {
      if (listRef.current) {
        listRef.current.scrollTo({ index });
      }
    };

    // ========================== Active ==========================
    const getEnabledActiveIndex = (index: number, offset = 1) => {
      const len = memoFlattenOptions.value.length;

      for (let i = 0; i < len; i += 1) {
        const current = (index + i * offset + len) % len;

        const { group, data } = memoFlattenOptions.value[current];
        if (!group && !(data as OptionData).disabled) {
          return current;
        }
      }

      return -1;
    };
    const state = reactive({
      activeIndex: getEnabledActiveIndex(0),
    });

    const setActive = (index: number, fromKeyboard = false) => {
      state.activeIndex = index;
      const info = { source: fromKeyboard ? ('keyboard' as const) : ('mouse' as const) };

      // Trigger active event
      const flattenItem = memoFlattenOptions.value[index];
      if (!flattenItem) {
        props.onActiveValue(null, -1, info);
        return;
      }

      props.onActiveValue(flattenItem.data.value, index, info);
    };

    // Auto active first item when list length or searchValue changed

    watch(
      [() => memoFlattenOptions.value.length, () => props.searchValue],
      () => {
        setActive(props.defaultActiveFirstOption !== false ? getEnabledActiveIndex(0) : -1);
      },
      { immediate: true },
    );
    // Auto scroll to item position in single mode

    watch(
      () => props.open,
      () => {
        if (!props.multiple && props.open && props.values.size === 1) {
          const value = Array.from(props.values)[0];
          const index = memoFlattenOptions.value.findIndex(({ data }) => data.value === value);
          setActive(index);
          nextTick(() => {
            scrollIntoView(index);
          });
        }
        // Force trigger scrollbar visible when open
        if (props.open) {
          nextTick(() => {
            listRef.current?.scrollTo(undefined);
          });
        }
      },
      { immediate: true, flush: 'post' },
    );

    // ========================== Values ==========================
    const onSelectValue = (value?: RawValueType) => {
      if (value !== undefined) {
        props.onSelect(value, { selected: !props.values.has(value) });
      }

      // Single mode should always close by select
      if (!props.multiple) {
        props.onToggleOpen(false);
      }
    };

    function renderItem(index: number) {
      const item = memoFlattenOptions.value[index];
      if (!item) return null;

      const itemData = (item.data || {}) as OptionData;
      const { value, label, children } = itemData;
      const attrs = pickAttrs(itemData, true);
      const mergedLabel = props.childrenAsData ? children : label;
      return item ? (
        <div
          aria-label={typeof mergedLabel === 'string' ? mergedLabel : undefined}
          {...attrs}
          key={index}
          role="option"
          id={`${props.id}_list_${index}`}
          aria-selected={props.values.has(value)}
        >
          {value}
        </div>
      ) : null;
    }
    return {
      memoFlattenOptions,
      renderItem,
      listRef,
      state,
      onListMouseDown,
      itemPrefixCls,
      setActive,
      onSelectValue,
      onKeydown: (event: KeyboardEvent) => {
        const { which } = event;
        switch (which) {
          // >>> Arrow keys
          case KeyCode.UP:
          case KeyCode.DOWN: {
            let offset = 0;
            if (which === KeyCode.UP) {
              offset = -1;
            } else if (which === KeyCode.DOWN) {
              offset = 1;
            }

            if (offset !== 0) {
              const nextActiveIndex = getEnabledActiveIndex(state.activeIndex + offset, offset);
              scrollIntoView(nextActiveIndex);
              setActive(nextActiveIndex, true);
            }

            break;
          }

          // >>> Select
          case KeyCode.ENTER: {
            // value
            const item = memoFlattenOptions.value[state.activeIndex];
            if (item && !item.data.disabled) {
              onSelectValue(item.data.value);
            } else {
              onSelectValue(undefined);
            }

            if (props.open) {
              event.preventDefault();
            }

            break;
          }

          // >>> Close
          case KeyCode.ESC: {
            props.onToggleOpen(false);
            if (props.open) {
              event.stopPropagation();
            }
          }
        }
      },
      onKeyup: () => {},

      scrollTo: (index: number) => {
        scrollIntoView(index);
      },
    };
  },
  render() {
    const {
      renderItem,
      listRef,
      onListMouseDown,
      itemPrefixCls,
      setActive,
      onSelectValue,
      memoFlattenOptions,
      $slots,
    } = this as any;
    const {
      id,
      childrenAsData,
      values,
      height,
      itemHeight,
      menuItemSelectedIcon,
      notFoundContent,
      virtual,
      onScroll,
      onMouseenter,
    } = this.$props;
    const renderOption = $slots.option;
    const { activeIndex } = this.state;
    // ========================== Render ==========================
    if (memoFlattenOptions.length === 0) {
      return (
        <div
          role="listbox"
          id={`${id}_list`}
          class={`${itemPrefixCls}-empty`}
          onMousedown={onListMouseDown}
        >
          {notFoundContent}
        </div>
      );
    }
    return (
      <>
        <div role="listbox" id={`${id}_list`} style={{ height: 0, width: 0, overflow: 'hidden' }}>
          {renderItem(activeIndex - 1)}
          {renderItem(activeIndex)}
          {renderItem(activeIndex + 1)}
        </div>
        <List
          itemKey="key"
          ref={listRef}
          data={memoFlattenOptions}
          height={height}
          itemHeight={itemHeight}
          fullHeight={false}
          onMousedown={onListMouseDown}
          onScroll={onScroll}
          virtual={virtual}
          onMouseenter={onMouseenter}
          children={({ group, groupOption, data }, itemIndex) => {
            const { label, key } = data;
            // Group
            if (group) {
              return (
                <div class={classNames(itemPrefixCls, `${itemPrefixCls}-group`)}>
                  {renderOption ? renderOption(data) : label !== undefined ? label : key}
                </div>
              );
            }

            const {
              disabled,
              value,
              title,
              children,
              style,
              class: cls,
              className,
              ...otherProps
            } = data;

            // Option
            const selected = values.has(value);

            const optionPrefixCls = `${itemPrefixCls}-option`;
            const optionClassName = classNames(itemPrefixCls, optionPrefixCls, cls, className, {
              [`${optionPrefixCls}-grouped`]: groupOption,
              [`${optionPrefixCls}-active`]: activeIndex === itemIndex && !disabled,
              [`${optionPrefixCls}-disabled`]: disabled,
              [`${optionPrefixCls}-selected`]: selected,
            });

            const mergedLabel = childrenAsData ? children : label;

            const iconVisible =
              !menuItemSelectedIcon || typeof menuItemSelectedIcon === 'function' || selected;

            const content = mergedLabel || value;
            // https://github.com/ant-design/ant-design/issues/26717
            let optionTitle =
              typeof content === 'string' || typeof content === 'number'
                ? content.toString()
                : undefined;
            if (title !== undefined) {
              optionTitle = title;
            }

            return (
              <div
                {...otherProps}
                aria-selected={selected}
                class={optionClassName}
                title={optionTitle}
                onMousemove={e => {
                  if (otherProps.onMousemove) {
                    otherProps.onMousemove(e);
                  }
                  if (activeIndex === itemIndex || disabled) {
                    return;
                  }
                  setActive(itemIndex);
                }}
                onClick={e => {
                  if (!disabled) {
                    onSelectValue(value);
                  }
                  if (otherProps.onClick) {
                    otherProps.onClick(e);
                  }
                }}
                style={style}
              >
                <div class={`${optionPrefixCls}-content`}>
                  {renderOption ? renderOption(data) : content}
                </div>
                {isValidElement(menuItemSelectedIcon) || selected}
                {iconVisible && (
                  <TransBtn
                    class={`${itemPrefixCls}-option-state`}
                    customizeIcon={menuItemSelectedIcon}
                    customizeIconProps={{ isSelected: selected }}
                  >
                    {selected ? '✓' : null}
                  </TransBtn>
                )}
              </div>
            );
          }}
        ></List>
      </>
    );
  },
});

OptionList.props = OptionListProps;

export default OptionList;
