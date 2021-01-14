import PropTypes from '../_util/vue-types';
import Icon from '../icon';
import getTransitionProps from '../_util/getTransitionProps';
import omit from 'omit.js';
import Wave from '../_util/wave';
import { hasProp, getListeners, getOptionProps } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import warning from '../_util/warning';

const PresetColorTypes = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime',
];
const PresetColorRegex = new RegExp(`^(${PresetColorTypes.join('|')})(-inverse)?$`);

export default {
  name: 'ATag',
  mixins: [BaseMixin],
  model: {
    prop: 'visible',
    event: 'close.visible',
  },
  props: {
    prefixCls: PropTypes.string,
    color: PropTypes.string,
    closable: PropTypes.bool.def(false),
    visible: PropTypes.bool,
    afterClose: PropTypes.func,
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    let _visible = true;
    const props = getOptionProps(this);
    if ('visible' in props) {
      _visible = this.visible;
    }
    warning(
      !('afterClose' in props),
      'Tag',
      "'afterClose' will be deprecated, please use 'close' event, we will remove this in the next version.",
    );
    return {
      _visible,
    };
  },
  watch: {
    visible(val) {
      this.setState({
        _visible: val,
      });
    },
  },
  methods: {
    setVisible(visible, e) {
      this.$emit('close', e);
      this.$emit('close.visible', false);
      const afterClose = this.afterClose;
      if (afterClose) {
        // next version remove.
        afterClose();
      }
      if (e.defaultPrevented) {
        return;
      }
      if (!hasProp(this, 'visible')) {
        this.setState({ _visible: visible });
      }
    },

    handleIconClick(e) {
      e.stopPropagation();
      this.setVisible(false, e);
    },

    isPresetColor() {
      const { color } = this.$props;
      if (!color) {
        return false;
      }
      return PresetColorRegex.test(color);
    },
    getTagStyle() {
      const { color } = this.$props;
      const isPresetColor = this.isPresetColor();
      return {
        backgroundColor: color && !isPresetColor ? color : undefined,
      };
    },

    getTagClassName(prefixCls) {
      const { color } = this.$props;
      const isPresetColor = this.isPresetColor();
      return {
        [prefixCls]: true,
        [`${prefixCls}-${color}`]: isPresetColor,
        [`${prefixCls}-has-color`]: color && !isPresetColor,
      };
    },

    renderCloseIcon() {
      const { closable } = this.$props;
      return closable ? <Icon type="close" onClick={this.handleIconClick} /> : null;
    },
  },

  render() {
    const { prefixCls: customizePrefixCls } = this.$props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('tag', customizePrefixCls);
    const { _visible: visible } = this.$data;
    const tag = (
      <span
        v-show={visible}
        {...{ on: omit(getListeners(this), ['close']) }}
        class={this.getTagClassName(prefixCls)}
        style={this.getTagStyle()}
      >
        {this.$slots.default}
        {this.renderCloseIcon()}
      </span>
    );
    const transitionProps = getTransitionProps(`${prefixCls}-zoom`, {
      appear: false,
    });
    return (
      <Wave>
        <transition {...transitionProps}>{tag}</transition>
      </Wave>
    );
  },
};
