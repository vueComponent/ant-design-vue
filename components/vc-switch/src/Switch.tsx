import { switchPropTypes } from './PropTypes';
import Omit from 'omit.js';
import { defineComponent, nextTick, onMounted, ref } from 'vue';
import KeyCode from '../../_util/KeyCode';
import { getPropsSlot } from '../../_util/props-util';

export default defineComponent({
  name: 'VcSwitch',
  inheritAttrs: false,
  props: {
    ...switchPropTypes,
    prefixCls: switchPropTypes.prefixCls.def('rc-switch'),
  },
  emits: ['update:checked', 'mouseup', 'change', 'click'],
  setup(props, { attrs, slots, emit, expose }) {
    const checked = ref('checked' in props ? !!props.checked : !!props.defaultChecked);

    const refSwitchNode = ref();

    onMounted(() => {
      nextTick(() => {
        if (props.autofocus && !props.disabled) {
          refSwitchNode.value.focus();
        }
      });
    });

    const setChecked = (check: boolean, e: MouseEvent | KeyboardEvent) => {
      if (props.disabled) {
        return;
      }
      checked.value = !checked.value;
      emit('update:checked', checked);
      emit('change', check, e);
    };

    const handleClick = (e: MouseEvent) => {
      setChecked(checked.value, e);
      emit('click', checked.value, e);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === KeyCode.LEFT) {
        setChecked(false, e);
      } else if (e.keyCode === KeyCode.RIGHT) {
        setChecked(true, e);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      refSwitchNode.value?.blur();
      emit('mouseup', e);
    };

    const focus = () => {
      refSwitchNode.value?.focus();
    };
    const blur = () => {
      refSwitchNode.value?.blur();
    };

    expose({ focus, blur });

    return () => (
      <button
        {...Omit(props, [
          'prefixCls',
          'checkedChildren',
          'unCheckedChildren',
          'checked',
          'autofocus',
          'defaultChecked',
        ])}
        {...attrs}
        onKeydown={handleKeyDown}
        onClick={handleClick}
        onMouseup={handleMouseUp}
        type="button"
        role="switch"
        aria-checked={checked.value}
        disabled={props.disabled}
        class={{
          [attrs.class as string]: attrs.class,
          [props.prefixCls]: true,
          [`${props.prefixCls}-checked`]: checked.value,
          [`${props.prefixCls}-disabled`]: props.disabled,
        }}
        ref={refSwitchNode}
      >
        {props.loadingIcon}
        <span class={`${props.prefixCls}-inner`}>
          {checked.value
            ? getPropsSlot(slots, props, 'checkedChildren')
            : getPropsSlot(slots, props, 'unCheckedChildren')}
        </span>
      </button>
    );
  },
});
