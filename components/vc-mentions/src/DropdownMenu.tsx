import Menu, { Item as MenuItem } from '../../menu';
import type { PropType } from 'vue';
import { onBeforeUnmount, defineComponent, inject, ref } from 'vue';
import type { OptionProps } from './Option';
import MentionsContextKey from './MentionsContext';
import Spin from '../../spin';

function noop() {}
export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'DropdownMenu',
  props: {
    prefixCls: String,
    options: {
      type: Array as PropType<OptionProps[]>,
      default: () => [],
    },
  },
  slots: ['notFoundContent', 'option'],
  setup(props, { slots }) {
    const {
      activeIndex,
      setActiveIndex,
      selectOption,
      onFocus = noop,
      loading,
    } = inject(MentionsContextKey, {
      activeIndex: ref(),
      loading: ref(false),
    });
    let timeoutId: any;
    const onMousedown = (e: MouseEvent) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        onFocus(e);
      });
    };
    onBeforeUnmount(() => {
      clearTimeout(timeoutId);
    });
    return () => {
      const { prefixCls, options } = props;
      const activeOption = options[activeIndex.value] || {};

      return (
        <Menu
          prefixCls={`${prefixCls}-menu`}
          activeKey={activeOption.value}
          onSelect={({ key }) => {
            const option = options.find(({ value }) => value === key);
            selectOption(option);
          }}
          onMousedown={onMousedown}
        >
          {!loading.value &&
            options.map((option, index) => {
              const { value, disabled, label = option.value } = option;
              return (
                <MenuItem
                  key={value}
                  disabled={disabled}
                  onMouseenter={() => {
                    setActiveIndex(index);
                  }}
                >
                  {slots.option?.(option) ??
                    (typeof label === 'function' ? label({ value, disabled }) : label)}
                </MenuItem>
              );
            })}
          {!loading.value && options.length === 0 ? (
            <MenuItem key="notFoundContent" disabled>
              {slots.notFoundContent?.()}
            </MenuItem>
          ) : null}
          {loading.value && (
            <MenuItem key="loading" disabled>
              <Spin size="small" />
            </MenuItem>
          )}
        </Menu>
      );
    };
  },
});
