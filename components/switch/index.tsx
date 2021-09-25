import type { ExtractPropTypes, PropType } from 'vue';
import { defineComponent, onBeforeMount, ref, computed, onMounted, nextTick, watch } from 'vue';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import PropTypes from '../_util/vue-types';
import KeyCode from '../_util/KeyCode';
import Wave from '../_util/wave';
import warning from '../_util/warning';
import { tuple, withInstall } from '../_util/type';
import { getPropsSlot } from '../_util/props-util';
import useConfigInject from '../_util/hooks/useConfigInject';
import { useInjectFormItemContext } from '../form/FormItemContext';
import omit from '../_util/omit';

export const SwitchSizes = tuple('small', 'default');
type CheckedType = boolean | string | number;
const switchProps = {
  id: PropTypes.string,
  prefixCls: PropTypes.string,
  size: PropTypes.oneOf(SwitchSizes),
  disabled: PropTypes.looseBool,
  checkedChildren: PropTypes.VNodeChild,
  unCheckedChildren: PropTypes.VNodeChild,
  tabindex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  autofocus: PropTypes.looseBool,
  loading: PropTypes.looseBool,
  checked: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.looseBool]),
  checkedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.looseBool]).def(
    true,
  ),
  unCheckedValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.looseBool,
  ]).def(false),
  onChange: {
    type: Function as PropType<(checked: CheckedType, e: Event) => void>,
  },
  onClick: {
    type: Function as PropType<(checked: CheckedType, e: Event) => void>,
  },
  onKeydown: {
    type: Function as PropType<(e: Event) => void>,
  },
  onMouseup: {
    type: Function as PropType<(e: Event) => void>,
  },
  'onUpdate:checked': {
    type: Function as PropType<(checked: CheckedType) => void>,
  },
};

export type SwitchProps = Partial<ExtractPropTypes<typeof switchProps>>;

const Switch = defineComponent({
  name: 'ASwitch',
  __ANT_SWITCH: true,
  inheritAttrs: false,
  props: switchProps,
  slots: ['checkedChildren', 'unCheckedChildren'],
  emits: ['update:checked', 'mouseup', 'change', 'click', 'keydown', 'blur'],
  setup(props, { attrs, slots, expose, emit }) {
    const formItemContext = useInjectFormItemContext();
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
    const checked = ref<string | number | boolean>(
      props.checked !== undefined ? props.checked : (attrs.defaultChecked as boolean),
    );
    const checkedStatus = computed(() => checked.value === props.checkedValue);

    watch(
      () => props.checked,
      () => {
        checked.value = props.checked;
      },
    );

    const { prefixCls } = useConfigInject('switch', props);
    const refSwitchNode = ref();
    const focus = () => {
      refSwitchNode.value?.focus();
    };
    const blur = () => {
      refSwitchNode.value?.blur();
    };

    expose({ focus, blur });

    onMounted(() => {
      nextTick(() => {
        if (props.autofocus && !props.disabled) {
          refSwitchNode.value.focus();
        }
      });
    });

    const setChecked = (check: CheckedType, e: MouseEvent | KeyboardEvent) => {
      if (props.disabled) {
        return;
      }
      emit('update:checked', check);
      emit('change', check, e);
      formItemContext.onFieldChange();
    };

    const handleBlur = () => {
      emit('blur');
    };

    const handleClick = (e: MouseEvent) => {
      focus();
      const newChecked = checkedStatus.value ? props.unCheckedValue : props.checkedValue;
      setChecked(newChecked, e);
      emit('click', newChecked, e);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === KeyCode.LEFT) {
        setChecked(props.unCheckedValue, e);
      } else if (e.keyCode === KeyCode.RIGHT) {
        setChecked(props.checkedValue, e);
      }
      emit('keydown', e);
    };

    const handleMouseUp = (e: MouseEvent) => {
      refSwitchNode.value?.blur();
      emit('mouseup', e);
    };

    const classNames = computed(() => ({
      [`${prefixCls.value}-small`]: props.size === 'small',
      [`${prefixCls.value}-loading`]: props.loading,
      [`${prefixCls.value}-checked`]: checkedStatus.value,
      [`${prefixCls.value}-disabled`]: props.disabled,
      [prefixCls.value]: true,
    }));

    return () => (
      <Wave insertExtraNode>
        <button
          {...omit(props, [
            'prefixCls',
            'checkedChildren',
            'unCheckedChildren',
            'checked',
            'autofocus',
            'checkedValue',
            'unCheckedValue',
            'id',
          ])}
          {...attrs}
          id={props.id ?? formItemContext.id.value}
          onKeydown={handleKeyDown}
          onClick={handleClick}
          onBlur={handleBlur}
          onMouseup={handleMouseUp}
          type="button"
          role="switch"
          aria-checked={checked.value as any}
          disabled={props.disabled || props.loading}
          class={[attrs.class, classNames.value]}
          ref={refSwitchNode}
        >
          {props.loading ? <LoadingOutlined class={`${prefixCls.value}-loading-icon`} /> : null}
          <span class={`${prefixCls.value}-inner`}>
            {checkedStatus.value
              ? getPropsSlot(slots, props, 'checkedChildren')
              : getPropsSlot(slots, props, 'unCheckedChildren')}
          </span>
        </button>
      </Wave>
    );
  },
});

export default withInstall(Switch);
