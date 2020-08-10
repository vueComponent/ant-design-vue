import { inject, Text } from 'vue';
import Wave from '../_util/wave';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import buttonTypes from './buttonTypes';
import { getSlot, getComponent } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';
// eslint-disable-next-line no-console
const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);
const props = buttonTypes();
export default {
  name: 'AButton',
  inheritAttrs: false,
  __ANT_BUTTON: true,
  props,
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  data() {
    this.children = [];
    this.iconCom = undefined;
    return {
      sizeMap: {
        large: 'lg',
        small: 'sm',
      },
      sLoading: !!this.loading,
      hasTwoCNChar: false,
    };
  },
  watch: {
    loading(val, preVal) {
      if (preVal && typeof preVal !== 'boolean') {
        clearTimeout(this.delayTimeout);
      }
      if (val && typeof val !== 'boolean' && val.delay) {
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
  beforeUnmount() {
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout);
    }
  },
  methods: {
    getClasses() {
      const {
        prefixCls: customizePrefixCls,
        type,
        shape,
        size,
        hasTwoCNChar,
        sLoading,
        ghost,
        block,
        $attrs,
      } = this;
      const getPrefixCls = this.configProvider.getPrefixCls;
      const prefixCls = getPrefixCls('btn', customizePrefixCls);
      const autoInsertSpace = this.configProvider.autoInsertSpaceInButton !== false;

      // large => lg
      // small => sm
      let sizeCls = '';
      switch (size) {
        case 'large':
          sizeCls = 'lg';
          break;
        case 'small':
          sizeCls = 'sm';
          break;
        default:
          break;
      }
      const iconType = sLoading ? 'loading' : this.iconCom;
      return {
        [$attrs.class]: $attrs.class,
        [`${prefixCls}`]: true,
        [`${prefixCls}-${type}`]: type,
        [`${prefixCls}-${shape}`]: shape,
        [`${prefixCls}-${sizeCls}`]: sizeCls,
        [`${prefixCls}-icon-only`]: this.children.length === 0 && iconType,
        [`${prefixCls}-loading`]: sLoading,
        [`${prefixCls}-background-ghost`]: ghost || type === 'ghost',
        [`${prefixCls}-two-chinese-chars`]: hasTwoCNChar && autoInsertSpace,
        [`${prefixCls}-block`]: block,
      };
    },
    fixTwoCNChar() {
      // Fix for HOC usage like <FormatMessage />
      const node = this.$refs.buttonNode;
      if (!node) {
        return;
      }
      const buttonText = node.textContent;
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
      if (child.type === Text) {
        let text = child.children.trim();
        if (isTwoCNChar(text)) {
          text = text.split('').join(SPACE);
        }
        return <span>{text}</span>;
      }
      return child;
    },
    isNeedInserted() {
      const { iconCom, type } = this;
      return this.children.length === 1 && !iconCom && type !== 'link';
    },
  },
  render() {
    this.iconCom = getComponent(this, 'icon');
    const { type, htmlType, iconCom, disabled, handleClick, sLoading, $attrs } = this;
    const children = getSlot(this);
    this.children = children;
    const classes = this.getClasses();

    const buttonProps = {
      ...$attrs,
      disabled,
      class: classes,
      onClick: handleClick,
    };
    const iconNode = sLoading ? <LoadingOutlined /> : iconCom;

    const autoInsertSpace = this.configProvider.autoInsertSpaceInButton !== false;
    const kids = children.map(child =>
      this.insertSpace(child, this.isNeedInserted() && autoInsertSpace),
    );

    if ($attrs.href !== undefined) {
      return (
        <a {...buttonProps} ref="buttonNode">
          {iconNode}
          {kids}
        </a>
      );
    }

    const buttonNode = (
      <button {...buttonProps} ref="buttonNode" type={htmlType || 'button'}>
        {iconNode}
        {kids}
      </button>
    );

    if (type === 'link') {
      return buttonNode;
    }

    return <Wave ref="wave">{buttonNode}</Wave>;
  },
};
