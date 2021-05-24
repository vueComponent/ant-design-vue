import {
  defineComponent,
  inject,
  onBeforeMount,
  ref,
  ExtractPropTypes,
  computed,
  onMounted,
  nextTick,
} from 'vue';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import PropTypes from '../_util/vue-types';
import KeyCode from '../_util/KeyCode';
import Wave from '../_util/wave';
import { defaultConfigProvider } from '../config-provider';
import warning from '../_util/warning';
import { tuple, withInstall } from '../_util/type';
import { getPropsSlot } from '../_util/props-util';
import Omit from 'omit.js';

export const SwitchSizes = tuple('small', 'default', 'large');

const switchProps = {
  prefixCls: PropTypes.string,
  size: PropTypes.oneOf(SwitchSizes),
  disabled: PropTypes.looseBool,
  checkedChildren: PropTypes.any,
  unCheckedChildren: PropTypes.any,
  tabindex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultChecked: PropTypes.looseBool,
  autofocus: PropTypes.looseBool,
  loading: PropTypes.looseBool,
  checked: PropTypes.looseBool,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onKeydown: PropTypes.func,
  onMouseup: PropTypes.func,
  'onUpdate:checked': PropTypes.func,
};

export type SwitchProps = Partial<ExtractPropTypes<typeof switchProps>>;

const Switch = defineComponent({
  name: 'ASwitch',
  __ANT_SWITCH: true,
  inheritAttrs: false,
  props: switchProps,
  emits: ['update:checked', 'mouseup', 'change', 'click', 'keydown'],
  setup(props: SwitchProps, { attrs, slots, expose, emit }) {
    onBeforeMount(() => {
      warning(
        !('defaultChecked' in attrs),
        'Switch',
        `'defaultChecked' is deprecated, please use 'v-model:checked'`,
      );
      warning(
        !('value' in attrs),
        'Switch',
        '`value` is not validate prop, do you mean `checked`?',
      );
    });

    const configProvider = inject('configProvider', defaultConfigProvider);
    const { getPrefixCls } = configProvider;
    const refSwitchNode = ref();
    const focus = () => {
      refSwitchNode.value?.focus();
    };
    const blur = () => {
      refSwitchNode.value?.blur();
    };

    expose({ focus, blur });

    const prefixCls = computed(() => {
      return getPrefixCls('switch', props.prefixCls);
    });
    const checked = computed(() => {
      return 'checked' in props ? !!props.checked : !!props.defaultChecked;
    });

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
      emit('update:checked', check);
      emit('change', check, e);
    };

    const handleClick = (e: MouseEvent) => {
      focus();
      const newChecked = !checked.value;
      setChecked(newChecked, e);
      emit('click', newChecked, e);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === KeyCode.LEFT) {
        setChecked(false, e);
      } else if (e.keyCode === KeyCode.RIGHT) {
        setChecked(true, e);
      }
      emit('keydown', e);
    };

    const handleMouseUp = (e: MouseEvent) => {
      refSwitchNode.value?.blur();
      emit('mouseup', e);
    };
    return () => (
      <Wave insertExtraNode>
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
          disabled={props.disabled || props.loading}
          class={{
            [attrs.class as string]: attrs.class,
            [prefixCls.value]: true,
            [`${prefixCls.value}-small`]: props.size === 'small',
            [`${prefixCls.value}-loading`]: props.loading,
            [`${prefixCls.value}-checked`]: checked.value,
            [`${prefixCls.value}-disabled`]: props.disabled,
          }}
          ref={refSwitchNode}
        >
          {props.loading ? <LoadingOutlined class={`${prefixCls.value}-loading-icon`} /> : null}
          <span class={`${prefixCls.value}-inner`}>
            {checked.value
              ? getPropsSlot(slots, props, 'checkedChildren')
              : getPropsSlot(slots, props, 'unCheckedChildren')}
          </span>
        </button>
      </Wave>
    );
  },
});

export default withInstall(Switch);
