import classNames from '../_util/classNames';
import { getComponent, getOptionProps } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import Input from './Input';
import EyeOutlined from '@ant-design/icons-vue/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons-vue/EyeInvisibleOutlined';
import inputProps from './inputProps';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import { defineComponent, inject } from 'vue';
import { defaultConfigProvider } from '../config-provider';

const ActionMap = {
  click: 'onClick',
  hover: 'onMouseover',
};

export default defineComponent({
  name: 'AInputPassword',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: {
    ...inputProps,
    prefixCls: PropTypes.string,
    inputPrefixCls: PropTypes.string,
    action: PropTypes.string.def('click'),
    visibilityToggle: PropTypes.looseBool.def(true),
    iconRender: PropTypes.func.def((visible: boolean) =>
      visible ? <EyeOutlined /> : <EyeInvisibleOutlined />,
    ),
  },
  setup() {
    return {
      input: null,
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    saveInput(node: any) {
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
    getIcon(prefixCls) {
      const { action } = this.$props;
      const iconTrigger = ActionMap[action] || '';
      const iconRender = this.$slots.iconRender || this.$props.iconRender;
      const icon = iconRender(this.visible);
      const iconProps = {
        [iconTrigger]: this.onVisibleChange,
        onMousedown: (e: Event) => {
          // Prevent focused state lost
          // https://github.com/ant-design/ant-design/issues/15173
          e.preventDefault();
        },
        onMouseup: (e: Event) => {
          // Prevent focused state lost
          // https://github.com/ant-design/ant-design/pull/23633/files
          e.preventDefault();
        },
        class: `${prefixCls}-icon`,
        key: 'passwordIcon',
      };
      return cloneElement(icon, iconProps);
    },
  },
  render() {
    const {
      prefixCls: customizePrefixCls,
      inputPrefixCls: customizeInputPrefixCls,
      size,
      suffix,
      action,
      visibilityToggle,
      iconRender,
      ...restProps
    } = getOptionProps(this);
    const { class: className } = this.$attrs;

    const getPrefixCls = this.configProvider.getPrefixCls;
    const inputPrefixCls = getPrefixCls('input', customizeInputPrefixCls);
    const prefixCls = getPrefixCls('input-password', customizePrefixCls);

    const suffixIcon = visibilityToggle && this.getIcon(prefixCls);
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
});
