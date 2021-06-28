import classNames from 'classnames';
import { getComponentFromProp, getOptionProps, getListeners } from '../_util/props-util';
import Input from './Input';
import Icon from '../icon';
import inputProps from './inputProps';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

const ActionMap = {
  click: 'click',
  hover: 'mouseover',
};

export default {
  name: 'AInputPassword',
  mixins: [BaseMixin],
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change.value',
  },
  props: {
    ...inputProps,
    prefixCls: PropTypes.string,
    inputPrefixCls: PropTypes.string,
    action: PropTypes.string.def('click'),
    visibilityToggle: PropTypes.bool.def(true),
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    },
    blur() {
      this.$refs.input.blur();
    },
    onVisibleChange() {
      if (this.disabled) {
        return;
      }
      this.setState({
        visible: !this.visible,
      });
    },
    getIcon(prefixCls) {
      const { action } = this.$props;
      const iconTrigger = ActionMap[action] || '';
      const iconProps = {
        props: {
          type: this.visible ? 'eye' : 'eye-invisible',
        },
        on: {
          [iconTrigger]: this.onVisibleChange,
          mousedown: e => {
            // Prevent focused state lost
            // https://github.com/ant-design/ant-design/issues/15173
            e.preventDefault();
          },
          mouseup: e => {
            // Prevent focused state lost
            // https://github.com/ant-design/ant-design/pull/23633/files
            e.preventDefault();
          },
        },
        class: `${prefixCls}-icon`,
        key: 'passwordIcon',
      };
      return <Icon {...iconProps} />;
    },
  },
  render() {
    const {
      prefixCls: customizePrefixCls,
      inputPrefixCls: customizeInputPrefixCls,
      size,
      suffix,
      visibilityToggle,
      ...restProps
    } = getOptionProps(this);

    const getPrefixCls = this.configProvider.getPrefixCls;
    const inputPrefixCls = getPrefixCls('input', customizeInputPrefixCls);
    const prefixCls = getPrefixCls('input-password', customizePrefixCls);

    const suffixIcon = visibilityToggle && this.getIcon(prefixCls);
    const inputClassName = classNames(prefixCls, {
      [`${prefixCls}-${size}`]: !!size,
    });
    const inputProps = {
      props: {
        ...restProps,
        prefixCls: inputPrefixCls,
        size,
        suffix: suffixIcon,
        prefix: getComponentFromProp(this, 'prefix'),
        addonAfter: getComponentFromProp(this, 'addonAfter'),
        addonBefore: getComponentFromProp(this, 'addonBefore'),
      },
      attrs: {
        ...this.$attrs,
        type: this.visible ? 'text' : 'password',
      },
      class: inputClassName,
      ref: 'input',
      on: getListeners(this),
    };
    return <Input {...inputProps} />;
  },
};
