// based on rc-checkbox 2.3.2
import type { HTMLAttributes } from 'vue';
import { defineComponent, ref, watch } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { initDefaultProps } from '../_util/props-util';

export const checkboxProps = {
  prefixCls: String,
  name: String,
  id: String,
  type: String,
  defaultChecked: { type: [Boolean, Number], default: undefined },
  checked: { type: [Boolean, Number], default: undefined },
  disabled: Boolean,
  tabindex: { type: [Number, String] },
  readonly: Boolean,
  autofocus: Boolean,
  value: PropTypes.any,
  required: Boolean,
};
export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Checkbox',
  inheritAttrs: false,
  props: initDefaultProps(checkboxProps, {
    prefixCls: 'rc-checkbox',
    type: 'checkbox',
    defaultChecked: false,
  }),
  emits: ['click', 'change'],
  setup(props, { attrs, emit, expose }) {
    const checked = ref(props.checked === undefined ? props.defaultChecked : props.checked);
    const inputRef = ref<HTMLInputElement>();
    watch(
      () => props.checked,
      () => {
        checked.value = props.checked;
      },
    );
    expose({
      focus() {
        inputRef.value?.focus();
      },

      blur() {
        inputRef.value?.blur();
      },
    });
    const eventShiftKey = ref();
    const handleChange = e => {
      if (props.disabled) {
        return;
      }
      if (props.checked === undefined) {
        checked.value = e.target.checked;
      }
      e.shiftKey = eventShiftKey.value;
      const eventObj = {
        target: {
          ...props,
          checked: e.target.checked,
        },
        stopPropagation() {
          e.stopPropagation();
        },
        preventDefault() {
          e.preventDefault();
        },
        nativeEvent: e,
      };

      // fix https://github.com/vueComponent/ant-design-vue/issues/3047
      // 受控模式下维持现有状态
      if (props.checked !== undefined) {
        inputRef.value.checked = !!props.checked;
      }
      emit('change', eventObj);
      eventShiftKey.value = false;
    };
    const onClick = (e: MouseEvent) => {
      emit('click', e);
      // onChange没能获取到shiftKey，使用onClick hack
      eventShiftKey.value = e.shiftKey;
    };
    return () => {
      const {
        prefixCls,
        name,
        id,
        type,
        disabled,
        readonly,
        tabindex,
        autofocus,
        value,
        required,
        ...others
      } = props;
      const {
        class: className,
        onFocus,
        onBlur,
        onKeydown,
        onKeypress,
        onKeyup,
      } = attrs as HTMLAttributes;
      const othersAndAttrs = { ...others, ...attrs };
      const globalProps = Object.keys(othersAndAttrs).reduce((prev, key) => {
        if (key.substr(0, 5) === 'aria-' || key.substr(0, 5) === 'data-' || key === 'role') {
          prev[key] = othersAndAttrs[key];
        }
        return prev;
      }, {});

      const classString = classNames(prefixCls, className, {
        [`${prefixCls}-checked`]: checked.value,
        [`${prefixCls}-disabled`]: disabled,
      });
      const inputProps = {
        name,
        id,
        type,
        readonly,
        disabled,
        tabindex,
        class: `${prefixCls}-input`,
        checked: !!checked.value,
        autofocus,
        value,
        ...globalProps,
        onChange: handleChange,
        onClick,
        onFocus,
        onBlur,
        onKeydown,
        onKeypress,
        onKeyup,
        required,
      };

      return (
        <span class={classString}>
          <input ref={inputRef} {...inputProps} />
          <span class={`${prefixCls}-inner`} />
        </span>
      );
    };
  },
});
