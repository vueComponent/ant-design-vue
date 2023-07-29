import type { ExtractPropTypes, PropType } from 'vue';
import { defineComponent, onBeforeMount, ref, computed, onMounted, nextTick, watch } from 'vue';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import PropTypes from '../_util/vue-types';
import KeyCode from '../_util/KeyCode';
import Wave from '../_util/wave';
import warning from '../_util/warning';
import type { CustomSlotsType } from '../_util/type';
import { tuple, withInstall } from '../_util/type';
import { getPropsSlot } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useInjectFormItemContext } from '../form/FormItemContext';
import omit from '../_util/omit';
import type { FocusEventHandler } from '../_util/EventInterface';
import useStyle from './style';
import { useInjectDisabled } from '../config-provider/DisabledContext';
export const SwitchSizes = tuple('small', 'default');
type CheckedType = boolean | string | number;
export const switchProps = () => ({
  id: String,
  prefixCls: String,
  size: PropTypes.oneOf(SwitchSizes),
  disabled: { type: Boolean, default: undefined },
  checkedChildren: PropTypes.any,
  unCheckedChildren: PropTypes.any,
  tabindex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  autofocus: { type: Boolean, default: undefined },
  loading: { type: Boolean, default: undefined },
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
  onBlur: Function as PropType<FocusEventHandler>,
  onFocus: Function as PropType<FocusEventHandler>,
});

export type SwitchProps = Partial<ExtractPropTypes<ReturnType<typeof switchProps>>>;

const Switch = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASwitch',
  __ANT_SWITCH: true,
  inheritAttrs: false,
  props: switchProps(),
  slots: Object as CustomSlotsType<{
    checkedChildren: any;
    unCheckedChildren: any;
    default: any;
  }>,
  // emits: ['update:checked', 'mouseup', 'change', 'click', 'keydown', 'blur'],
  setup(props, { attrs, slots, expose, emit }) {
    const formItemContext = useInjectFormItemContext();
    const disabledContext = useInjectDisabled();
    const mergedDisabled = computed(() => props.disabled ?? disabledContext.value);

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

    const { prefixCls, direction, size } = useConfigInject('switch', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
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
        if (props.autofocus && !mergedDisabled.value) {
          refSwitchNode.value.focus();
        }
      });
    });

    const setChecked = (check: CheckedType, e: MouseEvent | KeyboardEvent) => {
      if (mergedDisabled.value) {
        return;
      }
      emit('update:checked', check);
      emit('change', check, e);
      formItemContext.onFieldChange();
    };

    const handleBlur = (e: FocusEvent) => {
      emit('blur', e);
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
      [`${prefixCls.value}-small`]: size.value === 'small',
      [`${prefixCls.value}-loading`]: props.loading,
      [`${prefixCls.value}-checked`]: checkedStatus.value,
      [`${prefixCls.value}-disabled`]: mergedDisabled.value,
      [prefixCls.value]: true,
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      [hashId.value]: true,
    }));

    return () =>
      wrapSSR(
        <Wave>
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
              'onChange',
              'onUpdate:checked',
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
            disabled={mergedDisabled.value || props.loading}
            class={[attrs.class, classNames.value]}
            ref={refSwitchNode}
          >
            <div class={`${prefixCls.value}-handle`}>
              {props.loading ? <LoadingOutlined class={`${prefixCls.value}-loading-icon`} /> : null}
            </div>
            <span class={`${prefixCls.value}-inner`}>
              <span class={`${prefixCls.value}-inner-checked`}>
                {getPropsSlot(slots, props, 'checkedChildren')}
              </span>
              <span class={`${prefixCls.value}-inner-unchecked`}>
                {getPropsSlot(slots, props, 'unCheckedChildren')}
              </span>
            </span>
          </button>
        </Wave>,
      );
  },
});

export default withInstall(Switch);
