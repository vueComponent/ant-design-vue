import Wave from '../_util/wave';
import Icon from '../icon';
const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);
import buttonTypes from './buttonTypes';
import { filterEmpty } from '../_util/props-util';
const props = buttonTypes();
export default {
  name: 'AButton',
  inheritAttrs: false,
  __ANT_BUTTON: true,
  props,
  data() {
    return {
      sizeMap: {
        large: 'lg',
        small: 'sm',
      },
      // clicked: false,
      sLoading: !!this.loading,
      hasTwoCNChar: false,
    };
  },
  computed: {
    classes() {
      const {
        prefixCls,
        type,
        shape,
        size,
        hasTwoCNChar,
        sLoading,
        ghost,
        block,
        sizeMap,
        icon,
        $slots,
      } = this;
      const sizeCls = sizeMap[size] || '';
      const children = filterEmpty($slots.default);
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-${type}`]: type,
        [`${prefixCls}-${shape}`]: shape,
        [`${prefixCls}-${sizeCls}`]: sizeCls,
        [`${prefixCls}-icon-only`]: !children && children !== 0 && icon,
        [`${prefixCls}-loading`]: sLoading,
        [`${prefixCls}-background-ghost`]: ghost || type === 'ghost',
        [`${prefixCls}-two-chinese-chars`]: hasTwoCNChar,
        [`${prefixCls}-block`]: block,
      };
    },
  },
  watch: {
    loading(val) {
      clearTimeout(this.delayTimeout);
      if (typeof val !== 'boolean' && val && val.delay) {
        this.delayTimeout = setTimeout(() => {
          this.sLoading = !!val;
        }, val.delay);
      } else {
        this.sLoading = !!val;
      }
    },
  },
  mounted() {
    this.fixTwoCNChar();
  },
  updated() {
    this.fixTwoCNChar();
  },
  beforeDestroy() {
    // if (this.timeout) {
    //   clearTimeout(this.timeout)
    // }
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout);
    }
  },
  methods: {
    fixTwoCNChar() {
      // Fix for HOC usage like <FormatMessage />
      const node = this.$refs.buttonNode;
      if (!node) {
        return;
      }
      const buttonText = node.textContent || node.innerText;
      if (this.isNeedInserted() && isTwoCNChar(buttonText)) {
        if (!this.hasTwoCNChar) {
          this.hasTwoCNChar = true;
        }
      } else if (this.hasTwoCNChar) {
        this.hasTwoCNChar = false;
      }
    },
    handleClick(event) {
      const { sLoading } = this.$data;
      if (sLoading) {
        return;
      }
      this.$emit('click', event);
    },
    insertSpace(child, needInserted) {
      const SPACE = needInserted ? ' ' : '';
      if (typeof child.text === 'string') {
        let text = child.text.trim();
        if (isTwoCNChar(text)) {
          text = text.split('').join(SPACE);
        }
        return <span>{text}</span>;
      }
      return child;
    },
    isNeedInserted() {
      const { icon, $slots } = this;
      return $slots.default && $slots.default.length === 1 && !icon;
    },
  },
  render() {
    const {
      htmlType,
      classes,
      icon,
      disabled,
      handleClick,
      sLoading,
      $slots,
      $attrs,
      $listeners,
    } = this;
    const buttonProps = {
      attrs: {
        ...$attrs,
        disabled,
      },
      class: classes,
      on: {
        ...$listeners,
        click: handleClick,
      },
    };
    const iconType = sLoading ? 'loading' : icon;
    const iconNode = iconType ? <Icon type={iconType} /> : null;
    const children = filterEmpty($slots.default);
    const kids = children.map(child => this.insertSpace(child, this.isNeedInserted()));

    if ($attrs.href !== undefined) {
      return (
        <a {...buttonProps} ref="buttonNode">
          {iconNode}
          {kids}
        </a>
      );
    } else {
      return (
        <Wave>
          <button {...buttonProps} ref="buttonNode" type={htmlType || 'button'}>
            {iconNode}
            {kids}
          </button>
        </Wave>
      );
    }
  },
};
