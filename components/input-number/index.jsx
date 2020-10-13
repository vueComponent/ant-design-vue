import { inject } from 'vue';
import PropTypes from '../_util/vue-types';
import { initDefaultProps, getOptionProps } from '../_util/props-util';
import classNames from '../_util/classNames';
import UpOutlined from '@ant-design/icons-vue/UpOutlined';
import DownOutlined from '@ant-design/icons-vue/DownOutlined';
import VcInputNumber from '../vc-input-number/src';
import { defaultConfigProvider } from '../config-provider';

export const InputNumberProps = {
  prefixCls: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  step: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  tabindex: PropTypes.number,
  disabled: PropTypes.looseBool,
  size: PropTypes.oneOf(['large', 'small', 'default']),
  formatter: PropTypes.func,
  parser: PropTypes.func,
  decimalSeparator: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  precision: PropTypes.number,
  autofocus: PropTypes.looseBool,
};

const InputNumber = {
  name: 'AInputNumber',
  inheritAttrs: false,
  props: initDefaultProps(InputNumberProps, {
    step: 1,
  }),
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (process.env.NODE_ENV === 'test') {
        if (this.autofocus && !this.disabled) {
          this.focus();
        }
      }
    });
  },
  methods: {
    saveInputNumber(inputNumberRef) {
      this.inputNumberRef = inputNumberRef;
    },
    focus() {
      this.inputNumberRef.focus();
    },
    blur() {
      this.inputNumberRef.blur();
    },
  },

  render() {
    const { prefixCls: customizePrefixCls, size, class: className, ...others } = {
      ...getOptionProps(this),
      ...this.$attrs,
    };
    const getPrefixCls = this.configProvider.getPrefixCls;
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
    return <VcInputNumber {...vcInputNumberprops} ref={this.saveInputNumber} />;
  },
};

/* istanbul ignore next */
InputNumber.install = function(app) {
  app.component(InputNumber.name, InputNumber);
  return app;
};

export default InputNumber;
