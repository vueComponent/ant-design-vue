import { App, defineComponent, inject, nextTick, onMounted, ref } from 'vue';
import PropTypes from '../_util/vue-types';
import { getOptionProps } from '../_util/props-util';
import classNames from '../_util/classNames';
import UpOutlined from '@ant-design/icons-vue/UpOutlined';
import DownOutlined from '@ant-design/icons-vue/DownOutlined';
import VcInputNumber from '../vc-input-number/src';
import { defaultConfigProvider } from '../config-provider';
import { tuple } from '../_util/type';

export interface InputNumberPropsTypes {
  prefixCls?: string;
  min?: number;
  max?: number;
  value?: number;
  step?: number | string;
  defaultValue?: number;
  tabindex?: number;
  onChange?: (value: number | undefined) => void;
  disabled?: boolean;
  size?: 'large' | 'small' | 'default';
  formatter?: (value: number | string | undefined) => string;
  parser?: (displayValue: string | undefined) => number | string;
  decimalSeparator?: string;
  placeholder?: string;
  name?: string;
  id?: string;
  precision?: number;
  onPressEnter?: EventHandlerNonNull;
  autofocus?: boolean;
}

const InputNumberProps = {
  prefixCls: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  step: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(1),
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  tabindex: PropTypes.number,
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
};

const InputNumber = defineComponent<InputNumberPropsTypes>({
  name: 'AInputNumber',
  inheritAttrs: false,
  props: InputNumberProps as any,
  setup(props) {
    const inputNumberRef = ref(null);
    const focus = () => {
      inputNumberRef.value.focus();
    };
    const blur = () => {
      inputNumberRef.value.blur();
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
    };
  },

  render() {
    const { prefixCls: customizePrefixCls, size, class: className, ...others } = {
      ...getOptionProps(this),
      ...this.$attrs,
    } as any;
    const getPrefixCls = (this as any).configProvider.getPrefixCls;
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

    const vcInputNumberprops = {
      prefixCls,
      upHandler: upIcon,
      downHandler: downIcon,
      ...others,
      class: inputNumberClass,
    };
    return <VcInputNumber {...vcInputNumberprops} ref="saveInputNumber" />;
  },
});

/* istanbul ignore next */
InputNumber.install = function(app: App) {
  app.component(InputNumber.name, InputNumber);
  return app;
};

export default InputNumber;
