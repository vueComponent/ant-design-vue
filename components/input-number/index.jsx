import PropTypes from '../_util/vue-types';
import { initDefaultProps, getOptionProps } from '../_util/props-util';
import classNames from 'classnames';
import Icon from '../icon';
import VcInputNumber from '../vc-input-number/src';
import { ConfigConsumerProps } from '../config-provider';
import Base from '../base';

export const InputNumberProps = {
  prefixCls: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  step: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  defaultValue: PropTypes.number,
  tabIndex: PropTypes.number,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['large', 'small', 'default']),
  formatter: PropTypes.func,
  parser: PropTypes.func,
  decimalSeparator: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  precision: PropTypes.number,
  autoFocus: PropTypes.bool,
};

const InputNumber = {
  name: 'AInputNumber',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: initDefaultProps(InputNumberProps, {
    step: 1,
  }),
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  methods: {
    focus() {
      this.$refs.inputNumberRef.focus();
    },
    blur() {
      this.$refs.inputNumberRef.blur();
    },
  },

  render() {
    const { prefixCls: customizePrefixCls, size, ...others } = getOptionProps(this);
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('input-number', customizePrefixCls);

    const inputNumberClass = classNames({
      [`${prefixCls}-lg`]: size === 'large',
      [`${prefixCls}-sm`]: size === 'small',
    });
    const upIcon = <Icon type="up" class={`${prefixCls}-handler-up-inner`} />;
    const downIcon = <Icon type="down" class={`${prefixCls}-handler-down-inner`} />;

    const vcInputNumberprops = {
      props: {
        prefixCls,
        upHandler: upIcon,
        downHandler: downIcon,
        ...others,
      },
      class: inputNumberClass,
      ref: 'inputNumberRef',
      on: this.$listeners,
    };
    return <VcInputNumber {...vcInputNumberprops} />;
  },
};

/* istanbul ignore next */
InputNumber.install = function(Vue) {
  Vue.use(Base);
  Vue.component(InputNumber.name, InputNumber);
};

export default InputNumber;
