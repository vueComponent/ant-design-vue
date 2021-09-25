import type { PropType, ExtractPropTypes } from 'vue';
import { defineComponent, inject, nextTick, onMounted, ref } from 'vue';
import PropTypes from '../_util/vue-types';
import { getOptionProps } from '../_util/props-util';
import classNames from '../_util/classNames';
import UpOutlined from '@ant-design/icons-vue/UpOutlined';
import DownOutlined from '@ant-design/icons-vue/DownOutlined';
import VcInputNumber from '../vc-input-number/src';
import { defaultConfigProvider } from '../config-provider';
import { tuple, withInstall } from '../_util/type';
import type { EventHandler } from '../_util/EventInterface';
import { useInjectFormItemContext } from '../form/FormItemContext';

const inputNumberProps = {
  prefixCls: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  step: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(1),
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  tabindex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  disabled: PropTypes.looseBool,
  size: PropTypes.oneOf(tuple('large', 'small', 'default')),
  formatter: PropTypes.func,
  parser: PropTypes.func,
  decimalSeparator: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  precision: PropTypes.number,
  autofocus: PropTypes.looseBool,
  onPressEnter: {
    type: Function as PropType<EventHandler>,
  },
  onChange: Function as PropType<(num: number) => void>,
};

export type InputNumberProps = Partial<ExtractPropTypes<typeof inputNumberProps>>;

const InputNumber = defineComponent({
  name: 'AInputNumber',
  inheritAttrs: false,
  props: inputNumberProps,
  emits: ['input', 'change', 'blur', 'update:value'],
  setup(props, { emit }) {
    const formItemContext = useInjectFormItemContext();
    const inputNumberRef = ref(null);
    const focus = () => {
      inputNumberRef.value.focus();
    };
    const blur = () => {
      inputNumberRef.value.blur();
    };
    const handleChange = (val: number) => {
      emit('update:value', val);
      emit('change', val);
    };
    const handleBlur = () => {
      emit('blur');
    };
    onMounted(() => {
      nextTick(() => {
        if (process.env.NODE_ENV === 'test') {
          if (props.autofocus && !props.disabled) {
            focus();
          }
        }
      });
    });
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
      inputNumberRef,
      focus,
      blur,
      formItemContext,
      handleBlur,
      handleChange,
    };
  },

  render() {
    const {
      prefixCls: customizePrefixCls,
      size,
      class: className,
      id = this.formItemContext.id.value,
      ...others
    } = {
      ...getOptionProps(this),
      ...this.$attrs,
    } as any;
    const { getPrefixCls } = this.configProvider;
    const prefixCls = getPrefixCls('input-number', customizePrefixCls);

    const inputNumberClass = classNames(
      {
        [`${prefixCls}-lg`]: size === 'large',
        [`${prefixCls}-sm`]: size === 'small',
      },
      className,
    );
    const upIcon = <UpOutlined class={`${prefixCls}-handler-up-inner`} />;
    const downIcon = <DownOutlined class={`${prefixCls}-handler-down-inner`} />;

    const vcInputNumberProps = {
      prefixCls,
      upHandler: upIcon,
      downHandler: downIcon,
      ...others,
      class: inputNumberClass,
      onChange: this.handleChange,
      onBlur: this.handleBlur,
      id,
    };
    return <VcInputNumber {...vcInputNumberProps} ref="inputNumberRef" />;
  },
});

export default withInstall(InputNumber);
