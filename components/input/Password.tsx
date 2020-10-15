import classNames from '../_util/classNames';
import { getComponent, getOptionProps } from '../_util/props-util';
import Input from './Input';
import EyeOutlined from '@ant-design/icons-vue/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons-vue/EyeInvisibleOutlined';
import inputProps from './inputProps';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import { defineComponent } from 'vue';
import { tuple } from '../_util/type';

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
    prefixCls: PropTypes.string.def('ant-input-password'),
    inputPrefixCls: PropTypes.string.def('ant-input'),
    action: PropTypes.oneOf(tuple('click', 'hover')).def('click'),
    visibilityToggle: PropTypes.looseBool.def(true),
  },
  data() {
    return {
      visible: false,
      input: undefined,
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
    getIcon() {
      const { prefixCls, action } = this.$props;
      const iconTrigger = ActionMap[action] || '';
      const iconProps = {
        [iconTrigger]: this.onVisibleChange,
        onMousedown: (e: MouseEvent) => {
          // Prevent focused state lost
          // https://github.com/ant-design/ant-design/issues/15173
          e.preventDefault();
        },
        onMouseup: (e: MouseEvent) => {
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
      type: this.visible ? ('text' as const) : ('password' as const),
      class: inputClassName,
      ref: 'input',
    };
    return <Input {...inputProps} ref={this.saveInput} />;
  },
});
