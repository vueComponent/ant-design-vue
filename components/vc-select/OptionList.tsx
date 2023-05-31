import TransBtn from './TransBtn';

import KeyCode from '../_util/KeyCode';
import classNames from '../_util/classNames';
import pickAttrs from '../_util/pickAttrs';
import { isValidElement } from '../_util/props-util';
import createRef from '../_util/createRef';
import { computed, defineComponent, nextTick, reactive, toRaw, watch } from 'vue';
import List from '../vc-virtual-list';
import useMemo from '../_util/hooks/useMemo';
import { isPlatformMac } from './utils/platformUtil';

import type { EventHandler } from '../_util/EventInterface';
import omit from '../_util/omit';
import useBaseProps from './hooks/useBaseProps';
import type { RawValueType } from './Select';
import useSelectProps from './SelectContext';
import type { ScrollConfig } from '../vc-virtual-list/List';

export interface RefOptionListProps {
  onKeydown: (e?: KeyboardEvent) => void;
  onKeyup: (e?: KeyboardEvent) => void;
  scrollTo?: (index: number | ScrollConfig) => void;
}
function isTitleType(content: any) {
  return typeof content === 'string' || typeof content === 'number';
}

// export interface OptionListProps<OptionsType extends object[]> {
export type OptionListProps = Record<string, never>;

/**
 * Using virtual list of option display.
 * Will fallback to dom if use customize render.
 */
const OptionList = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'OptionList',
  inheritAttrs: false,
  setup(_, { expose, slots }) {
    const baseProps = useBaseProps();
    const props = useSelectProps();
    const itemPrefixCls = computed(() => `${baseProps.prefixCls}-item`);

    const memoFlattenOptions = useMemo(
      () => props.flattenOptions,
      [() => baseProps.open, () => props.flattenOptions],
      next => next[0],
    );

    // =========================== List ===========================
    const listRef = createRef();

    const onListMouseDown: EventHandler = event => {
      event.preventDefault();
    };

    const scrollIntoView = (args: number | ScrollConfig) => {
      if (listRef.current) {
        listRef.current.scrollTo(typeof args === 'number' ? { index: args } : args);
      }
    };

    // ========================== Active ==========================
    const getEnabledActiveIndex = (index: number, offset = 1) => {
      const len = memoFlattenOptions.value.length;

      for (let i = 0; i < len; i += 1) {
        const current = (index + i * offset + len) % len;

        const { group, data } = memoFlattenOptions.value[current];
        if (!group && !data.disabled) {
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

      props.onActiveValue(flattenItem.value, index, info);
    };

    // Auto active first item when list length or searchValue changed

    watch(
      [() => memoFlattenOptions.value.length, () => baseProps.searchValue],
      () => {
        setActive(props.defaultActiveFirstOption !== false ? getEnabledActiveIndex(0) : -1);
      },
      { immediate: true },
    );

    // https://github.com/ant-design/ant-design/issues/34975
    const isSelected = (value: RawValueType) =>
      props.rawValues.has(value) && baseProps.mode !== 'combobox';

    // Auto scroll to item position in single mode
    watch(
      [() => baseProps.open, () => baseProps.searchValue],
      () => {
        if (!baseProps.multiple && baseProps.open && props.rawValues.size === 1) {
          const value = Array.from(props.rawValues)[0];
          const index = toRaw(memoFlattenOptions.value).findIndex(
            ({ data }) => data[props.fieldNames.value] === value,
          );
          if (index !== -1) {
            setActive(index);
            nextTick(() => {
              scrollIntoView(index);
            });
          }
        }
        // Force trigger scrollbar visible when open
        if (baseProps.open) {
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
        props.onSelect(value, { selected: !props.rawValues.has(value) });
      }

      // Single mode should always close by select
      if (!baseProps.multiple) {
        baseProps.toggleOpen(false);
      }
    };
    const getLabel = (item: Record<string, any>) =>
      typeof item.label === 'function' ? item.label() : item.label;
    function renderItem(index: number) {
      const item = memoFlattenOptions.value[index];
      if (!item) return null;

      const itemData = item.data || {};
      const { value } = itemData;
      const { group } = item;
      const attrs = pickAttrs(itemData, true);
      const mergedLabel = getLabel(item);
      return item ? (
        <div
          aria-label={typeof mergedLabel === 'string' && !group ? mergedLabel : null}
          {...attrs}
          key={index}
          role={group ? 'presentation' : 'option'}
          id={`${baseProps.id}_list_${index}`}
          aria-selected={isSelected(value)}
        >
          {value}
        </div>
      ) : null;
    }
    const onKeydown = (event: KeyboardEvent) => {
      const { which, ctrlKey } = event;
      switch (which) {
        // >>> Arrow keys & ctrl + n/p on Mac
        case KeyCode.N:
        case KeyCode.P:
        case KeyCode.UP:
        case KeyCode.DOWN: {
          let offset = 0;
          if (which === KeyCode.UP) {
            offset = -1;
          } else if (which === KeyCode.DOWN) {
            offset = 1;
          } else if (isPlatformMac() && ctrlKey) {
            if (which === KeyCode.N) {
              offset = 1;
            } else if (which === KeyCode.P) {
              offset = -1;
            }
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
            onSelectValue(item.value);
          } else {
            onSelectValue(undefined);
          }

          if (baseProps.open) {
            event.preventDefault();
          }

          break;
        }

        // >>> Close
        case KeyCode.ESC: {
          baseProps.toggleOpen(false);
          if (baseProps.open) {
            event.stopPropagation();
          }
        }
      }
    };
    const onKeyup = () => {};

    const scrollTo = (index: number) => {
      scrollIntoView(index);
    };
    expose({
      onKeydown,
      onKeyup,
      scrollTo,
    });
    return () => {
      // const {
      //   renderItem,
      //   listRef,
      //   onListMouseDown,
      //   itemPrefixCls,
      //   setActive,
      //   onSelectValue,
      //   memoFlattenOptions,
      //   $slots,
      // } = this as any;
      const { id, notFoundContent, onPopupScroll } = baseProps;
      const { menuItemSelectedIcon, fieldNames, virtual, listHeight, listItemHeight } = props;

      const renderOption = slots.option;
      const { activeIndex } = state;
      const omitFieldNameList = Object.keys(fieldNames).map(key => fieldNames[key]);
      // ========================== Render ==========================
      if (memoFlattenOptions.value.length === 0) {
        return (
          <div
            role="listbox"
            id={`${id}_list`}
            class={`${itemPrefixCls.value}-empty`}
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
            data={memoFlattenOptions.value}
            height={listHeight}
            itemHeight={listItemHeight}
            fullHeight={false}
            onMousedown={onListMouseDown}
            onScroll={onPopupScroll}
            virtual={virtual}
            v-slots={{
              default: (item, itemIndex) => {
                const { group, groupOption, data, value } = item;
                const { key } = data;
                const label = typeof item.label === 'function' ? item.label() : item.label;
                // Group
                if (group) {
                  const groupTitle = data.title ?? (isTitleType(label) && label);
                  return (
                    <div
                      class={classNames(itemPrefixCls.value, `${itemPrefixCls.value}-group`)}
                      title={groupTitle}
                    >
                      {renderOption ? renderOption(data) : label !== undefined ? label : key}
                    </div>
                  );
                }

                const {
                  disabled,
                  title,
                  children,
                  style,
                  class: cls,
                  className,
                  ...otherProps
                } = data;
                const passedProps = omit(otherProps, omitFieldNameList);
                // Option
                const selected = isSelected(value);

                const optionPrefixCls = `${itemPrefixCls.value}-option`;
                const optionClassName = classNames(
                  itemPrefixCls.value,
                  optionPrefixCls,
                  cls,
                  className,
                  {
                    [`${optionPrefixCls}-grouped`]: groupOption,
                    [`${optionPrefixCls}-active`]: activeIndex === itemIndex && !disabled,
                    [`${optionPrefixCls}-disabled`]: disabled,
                    [`${optionPrefixCls}-selected`]: selected,
                  },
                );

                const mergedLabel = getLabel(item);

                const iconVisible =
                  !menuItemSelectedIcon || typeof menuItemSelectedIcon === 'function' || selected;

                // https://github.com/ant-design/ant-design/issues/34145
                const content =
                  typeof mergedLabel === 'number' ? mergedLabel : mergedLabel || value;
                // https://github.com/ant-design/ant-design/issues/26717
                let optionTitle = isTitleType(content) ? content.toString() : undefined;
                if (title !== undefined) {
                  optionTitle = title;
                }

                return (
                  <div
                    {...passedProps}
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
                        class={`${itemPrefixCls.value}-option-state`}
                        customizeIcon={menuItemSelectedIcon}
                        customizeIconProps={{ isSelected: selected }}
                      >
                        {selected ? '✓' : null}
                      </TransBtn>
                    )}
                  </div>
                );
              },
            }}
          ></List>
        </>
      );
    };
  },
});

export default OptionList;
