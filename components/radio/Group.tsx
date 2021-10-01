import { provide, nextTick, defineComponent, ref, watch } from 'vue';
import type { PropType, ExtractPropTypes } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import Radio from './Radio';
import useConfigInject from '../_util/hooks/useConfigInject';
import { tuple } from '../_util/type';
import type { RadioChangeEvent } from './interface';
import { useInjectFormItemContext } from '../form/FormItemContext';

const RadioGroupSizeTypes = tuple('large', 'default', 'small');

export type RadioGroupSize = typeof RadioGroupSizeTypes[number];

const RadioGroupOptionTypes = tuple('default', 'button');

export type RadioGroupOption = typeof RadioGroupOptionTypes[number];

export type RadioGroupChildOption = {
  label: any;
  value: any;
  disabled?: boolean;
};

const radioGroupProps = {
  prefixCls: PropTypes.string,
  value: PropTypes.any,
  size: PropTypes.oneOf(RadioGroupSizeTypes).def('default'),
  options: {
    type: Array as PropType<Array<String | RadioGroupChildOption>>,
  },
  disabled: PropTypes.looseBool,
  name: PropTypes.string,
  buttonStyle: PropTypes.string.def('outline'),
  id: PropTypes.string,
  optionType: PropTypes.oneOf(RadioGroupOptionTypes).def('default'),
};

export type RadioGroupProps = Partial<ExtractPropTypes<typeof radioGroupProps>>;

export default defineComponent({
  name: 'ARadioGroup',
  props: radioGroupProps,
  emits: ['update:value', 'change'],
  setup(props, { slots, emit }) {
    const formItemContext = useInjectFormItemContext();
    const { prefixCls, direction, size } = useConfigInject('radio', props);
    const stateValue = ref(props.value);
    const updatingValue = ref<boolean>(false);
    watch(
      () => props.value,
      val => {
        stateValue.value = val;
        updatingValue.value = false;
      },
    );

    const onRadioChange = (ev: RadioChangeEvent) => {
      const lastValue = stateValue.value;
      const { value } = ev.target;

      if (!('value' in props)) {
        stateValue.value = value;
      }
      // nextTick for https://github.com/vueComponent/ant-design-vue/issues/1280
      if (!updatingValue.value && value !== lastValue) {
        updatingValue.value = true;
        emit('update:value', value);
        emit('change', ev);
        formItemContext.onFieldChange();
      }
      nextTick(() => {
        updatingValue.value = false;
      });
    };

    provide('radioGroupContext', {
      onRadioChange,
      stateValue,
      props,
    });

    return () => {
      const { options, optionType, buttonStyle, id = formItemContext.id.value } = props;

      const groupPrefixCls = `${prefixCls.value}-group`;

      const classString = classNames(groupPrefixCls, `${groupPrefixCls}-${buttonStyle}`, {
        [`${groupPrefixCls}-${size.value}`]: size.value,
        [`${groupPrefixCls}-rtl`]: direction.value === 'rtl',
      });

      let children = null;
      if (options && options.length > 0) {
        const optionsPrefixCls =
          optionType === 'button' ? `${prefixCls.value}-button` : prefixCls.value;
        children = options.map(option => {
          if (typeof option === 'string') {
            return (
              <Radio
                key={option}
                prefixCls={optionsPrefixCls}
                disabled={props.disabled}
                value={option}
                checked={stateValue.value === option}
              >
                {option}
              </Radio>
            );
          }
          const { value, disabled, label } = option as RadioGroupChildOption;
          return (
            <Radio
              key={`radio-group-value-options-${value}`}
              prefixCls={optionsPrefixCls}
              disabled={disabled || props.disabled}
              value={value}
              checked={stateValue.value === value}
            >
              {label}
            </Radio>
          );
        });
      } else {
        children = slots.default?.();
      }
      return (
        <div class={classString} id={id}>
          {children}
        </div>
      );
    };
  },
});
