import type { ExtractPropTypes } from 'vue';
import { defineComponent, inject, ref } from 'vue';
import PropTypes from '../_util/vue-types';
import VcCheckbox from '../vc-checkbox/Checkbox';
import classNames from '../_util/classNames';
import useConfigInject from '../_util/hooks/useConfigInject';
import type { RadioChangeEvent, RadioGroupContext } from './interface';
import { useInjectFormItemContext } from '../form/FormItemContext';

export const radioProps = {
  prefixCls: String,
  checked: { type: Boolean, default: undefined },
  disabled: { type: Boolean, default: undefined },
  isGroup: { type: Boolean, default: undefined },
  value: PropTypes.any,
  name: String,
  id: String,
  autofocus: { type: Boolean, default: undefined },
  onChange: Function,
  onFocus: Function,
  onBlur: Function,
  onClick: Function,
};

export type RadioProps = Partial<ExtractPropTypes<typeof radioProps>>;

export default defineComponent({
  name: 'ARadio',
  props: radioProps,
  emits: ['update:checked', 'update:value', 'change', 'blur', 'focus'],
  setup(props, { emit, expose, slots }) {
    const formItemContext = useInjectFormItemContext();
    const vcCheckbox = ref<HTMLElement>();
    const radioGroupContext = inject<RadioGroupContext>('radioGroupContext', undefined);
    const { prefixCls, direction } = useConfigInject('radio', props);

    const focus = () => {
      vcCheckbox.value.focus();
    };

    const blur = () => {
      vcCheckbox.value.blur();
    };

    expose({ focus, blur });

    const handleChange = (event: RadioChangeEvent) => {
      const targetChecked = event.target.checked;
      emit('update:checked', targetChecked);
      emit('update:value', targetChecked);
      emit('change', event);
      formItemContext.onFieldChange();
    };

    const onChange = (e: RadioChangeEvent) => {
      emit('change', e);
      if (radioGroupContext && radioGroupContext.onRadioChange) {
        radioGroupContext.onRadioChange(e);
      }
    };

    return () => {
      const radioGroup = radioGroupContext;
      const { prefixCls: customizePrefixCls, id = formItemContext.id.value, ...restProps } = props;

      const rProps: RadioProps = {
        prefixCls: prefixCls.value,
        id,
        ...restProps,
      };

      if (radioGroup) {
        rProps.name = radioGroup.props.name;
        rProps.onChange = onChange;
        rProps.checked = props.value === radioGroup.stateValue.value;
        rProps.disabled = props.disabled || radioGroup.props.disabled;
      } else {
        rProps.onChange = handleChange;
      }
      const wrapperClassString = classNames({
        [`${prefixCls.value}-wrapper`]: true,
        [`${prefixCls.value}-wrapper-checked`]: rProps.checked,
        [`${prefixCls.value}-wrapper-disabled`]: rProps.disabled,
        [`${prefixCls.value}-wrapper-rtl`]: direction.value === 'rtl',
      });

      return (
        <label class={wrapperClassString}>
          <VcCheckbox {...rProps} type="radio" ref={vcCheckbox} />
          {slots.default && <span>{slots.default()}</span>}
        </label>
      );
    };
  },
});
