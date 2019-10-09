import classNames from 'classnames';
import Input from './Input';
import Icon from '../icon';
import inputProps from './inputProps';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';

const ActionMap = {
  click: 'click',
  hover: 'mouseover',
};

export default {
  name: 'AInputPassword',
  model: {
    prop: 'value',
    event: 'change.value',
  },
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
  mixins: [BaseMixin],
  methods: {
    onChange() {
      this.setState({
        visible: !this.visible,
      });
    },
    getIcon() {
      const { prefixCls, action } = this.$props;
      const iconTrigger = ActionMap[action] || '';
      const iconProps = {
        props: {
          type: this.visible ? 'eye' : 'eye-invisible',
        },
        on: {
          [iconTrigger]: this.onChange,
          mousedown: e => {
            // Prevent focused state lost
            // https://github.com/ant-design/ant-design/issues/15173
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
    const { prefixCls, inputPrefixCls, size, suffix, visibilityToggle, ...restProps } = this.$props;
    const suffixIcon = visibilityToggle && this.getIcon();
    const inputClassName = classNames(prefixCls, {
      [`${prefixCls}-${size}`]: !!size,
    });
    return (
      <Input
        {...restProps}
        type={this.visible ? 'text' : 'password'}
        size={size}
        class={inputClassName}
        prefixCls={inputPrefixCls}
        suffix={suffixIcon}
      />
    );
  },
};
