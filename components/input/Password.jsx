import classNames from '../_util/classNames';
import { getComponent, getOptionProps } from '../_util/props-util';
import Input from './Input';
import EyeOutlined from '@ant-design/icons-vue/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons-vue/EyeInvisibleOutlined';
import inputProps from './inputProps';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';

const ActionMap = {
  click: 'onClick',
  hover: 'onMouseover',
};

export default {
  name: 'AInputPassword',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: {
    ...inputProps,
    prefixCls: PropTypes.string.def('ant-input-password'),
    inputPrefixCls: PropTypes.string.def('ant-input'),
    action: PropTypes.string.def('click'),
    visibilityToggle: PropTypes.bool.def(true),
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    saveInput(node) {
      this.input = node;
    },
    focus() {
      this.input.focus();
    },
    blur() {
      this.input.blur();
    },
    onVisibleChange() {
      if (this.disabled) {
        return;
      }
      this.setState({
        visible: !this.visible,
      });
    },
    getIcon() {
      const { prefixCls, action } = this.$props;
      const iconTrigger = ActionMap[action] || '';
      const iconProps = {
        [iconTrigger]: this.onVisibleChange,
        onMousedown: e => {
          // Prevent focused state lost
          // https://github.com/ant-design/ant-design/issues/15173
          e.preventDefault();
        },
        onMouseup: e => {
          // Prevent focused state lost
          // https://github.com/ant-design/ant-design/pull/23633/files
          e.preventDefault();
        },
        class: `${prefixCls}-icon`,
        key: 'passwordIcon',
      };
      return this.visible ? (
        <EyeOutlined {...iconProps} />
      ) : (
        <EyeInvisibleOutlined {...iconProps} />
      );
    },
  },
  render() {
    const {
      prefixCls,
      inputPrefixCls,
      size,
      suffix,
      action,
      visibilityToggle,
      ...restProps
    } = getOptionProps(this);
    const { class: className } = this.$attrs;
    const suffixIcon = visibilityToggle && this.getIcon();
    const inputClassName = classNames(prefixCls, className, {
      [`${prefixCls}-${size}`]: !!size,
    });
    const inputProps = {
      ...restProps,
      prefixCls: inputPrefixCls,
      size,
      suffix: suffixIcon,
      prefix: getComponent(this, 'prefix'),
      addonAfter: getComponent(this, 'addonAfter'),
      addonBefore: getComponent(this, 'addonBefore'),
      ...this.$attrs,
      type: this.visible ? 'text' : 'password',
      class: inputClassName,
      ref: 'input',
    };
    return <Input {...inputProps} ref={this.saveInput} />;
  },
};
