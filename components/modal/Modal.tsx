import type { ExtractPropTypes, CSSProperties, PropType } from 'vue';
import { defineComponent, inject, computed } from 'vue';
import classNames from '../_util/classNames';
import Dialog from '../vc-dialog';
import PropTypes from '../_util/vue-types';
import addEventListener from '../vc-util/Dom/addEventListener';
import { getConfirmLocale } from './locale';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import Button from '../button';
import type { ButtonProps as ButtonPropsType, LegacyButtonType } from '../button/buttonTypes';
import buttonTypes, { convertLegacyProps } from '../button/buttonTypes';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { getComponent, getSlot } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import { defaultConfigProvider } from '../config-provider';
import type { VueNode } from '../_util/type';

let mousePosition: { x: number; y: number } | null = null;
// ref: https://github.com/ant-design/ant-design/issues/15795
const getClickPosition = (e: MouseEvent) => {
  mousePosition = {
    x: e.pageX,
    y: e.pageY,
  };
  // 100ms 内发生过点击事件，则从点击位置动画展示
  // 否则直接 zoom 展示
  // 这样可以兼容非点击方式展开
  setTimeout(() => (mousePosition = null), 100);
};

// 只有点击事件支持从鼠标位置动画展开
if (typeof window !== 'undefined' && window.document && window.document.documentElement) {
  addEventListener(document.documentElement, 'click', getClickPosition, true);
}

function noop() {}

const modalProps = {
  prefixCls: PropTypes.string,
  /** 对话框是否可见*/
  visible: PropTypes.looseBool,
  /** 确定按钮 loading*/
  confirmLoading: PropTypes.looseBool,
  /** 标题*/
  title: PropTypes.any,
  /** 是否显示右上角的关闭按钮*/
  closable: PropTypes.looseBool,
  closeIcon: PropTypes.any,
  /** 点击确定回调*/
  onOk: {
    type: Function as PropType<(e: MouseEvent) => void>,
  },
  /** 点击模态框右上角叉、取消按钮、Props.maskClosable 值为 true 时的遮罩层或键盘按下 Esc 时的回调*/
  onCancel: {
    type: Function as PropType<(e: MouseEvent) => void>,
  },
  afterClose: PropTypes.func.def(noop),
  /** 垂直居中 */
  centered: PropTypes.looseBool,
  /** 宽度*/
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** 底部内容*/
  footer: PropTypes.any,
  /** 确认按钮文字*/
  okText: PropTypes.any,
  /** 确认按钮类型*/
  okType: {
    type: String as PropType<LegacyButtonType>,
  },
  /** 取消按钮文字*/
  cancelText: PropTypes.any,
  icon: PropTypes.any,
  /** 点击蒙层是否允许关闭*/
  maskClosable: PropTypes.looseBool,
  /** 强制渲染 Modal*/
  forceRender: PropTypes.looseBool,
  okButtonProps: PropTypes.shape(buttonTypes).loose,
  cancelButtonProps: PropTypes.shape(buttonTypes).loose,
  destroyOnClose: PropTypes.looseBool,
  wrapClassName: PropTypes.string,
  maskTransitionName: PropTypes.string,
  transitionName: PropTypes.string,
  getContainer: PropTypes.any,
  zIndex: PropTypes.number,
  bodyStyle: PropTypes.style,
  maskStyle: PropTypes.style,
  mask: PropTypes.looseBool,
  keyboard: PropTypes.looseBool,
  wrapProps: PropTypes.object,
  focusTriggerAfterClose: PropTypes.looseBool,
};

export type ModalProps = ExtractPropTypes<typeof modalProps>;

export interface ModalFuncProps {
  prefixCls?: string;
  class?: string;
  visible?: boolean;
  title?: string | (() => VueNode) | VueNode;
  closable?: boolean;
  content?: string | (() => VueNode) | VueNode;
  // TODO: find out exact types
  onOk?: (...args: any[]) => any;
  onCancel?: (...args: any[]) => any;
  okButtonProps?: ButtonPropsType;
  cancelButtonProps?: ButtonPropsType;
  centered?: boolean;
  width?: string | number;
  okText?: string | (() => VueNode) | VueNode;
  okType?: LegacyButtonType;
  cancelText?: string | (() => VueNode) | VueNode;
  icon?: (() => VueNode) | VueNode;
  /* Deprecated */
  iconType?: string;
  mask?: boolean;
  maskClosable?: boolean;
  zIndex?: number;
  okCancel?: boolean;
  style?: CSSProperties | string;
  maskStyle?: CSSProperties;
  type?: string;
  keyboard?: boolean;
  getContainer?: getContainerFunc | boolean | string;
  autoFocusButton?: null | 'ok' | 'cancel';
  transitionName?: string;
  maskTransitionName?: string;

  /** @deprecated please use `appContext` instead */
  parentContext?: any;
  appContext?: any;
}

type getContainerFunc = () => HTMLElement;

export type ModalFunc = (props: ModalFuncProps) => {
  destroy: () => void;
  update: (newConfig: ModalFuncProps) => void;
};

export interface ModalLocale {
  okText: string;
  cancelText: string;
  justOkText: string;
}

export const destroyFns = [];

export default defineComponent({
  name: 'AModal',
  inheritAttrs: false,
  props: initDefaultProps(modalProps, {
    width: 520,
    transitionName: 'zoom',
    maskTransitionName: 'fade',
    confirmLoading: false,
    visible: false,
    okType: 'primary',
  }),
  emits: ['update:visible', 'cancel', 'change', 'ok'],
  setup() {
    const confirmLocale = computed(() => getConfirmLocale());
    return {
      confirmLocale,
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  data() {
    return {
      sVisible: !!this.visible,
    };
  },
  watch: {
    visible(val) {
      this.sVisible = val;
    },
  },
  methods: {
    handleCancel(e: MouseEvent) {
      this.$emit('update:visible', false);
      this.$emit('cancel', e);
      this.$emit('change', false);
    },

    handleOk(e: MouseEvent) {
      this.$emit('ok', e);
    },
    renderFooter(locale: ModalLocale) {
      const { okType, confirmLoading } = this;
      const cancelBtnProps = { onClick: this.handleCancel, ...(this.cancelButtonProps || {}) };
      const okBtnProps = {
        onClick: this.handleOk,
        ...convertLegacyProps(okType),
        loading: confirmLoading,
        ...(this.okButtonProps || {}),
      };

      return (
        <div>
          <Button {...cancelBtnProps}>
            {getComponent(this, 'cancelText') || locale.cancelText}
          </Button>
          <Button {...okBtnProps}>{getComponent(this, 'okText') || locale.okText}</Button>
        </div>
      );
    },
  },

  render() {
    const {
      prefixCls: customizePrefixCls,
      sVisible: visible,
      wrapClassName,
      centered,
      getContainer,
      $attrs,
      confirmLocale,
    } = this;
    const children = getSlot(this);
    const { getPrefixCls, getPopupContainer: getContextPopupContainer } = this.configProvider;
    const prefixCls = getPrefixCls('modal', customizePrefixCls);

    const defaultFooter = (
      <LocaleReceiver
        componentName="Modal"
        defaultLocale={confirmLocale}
        children={this.renderFooter}
      />
    );
    const closeIcon = getComponent(this, 'closeIcon');
    const closeIconToRender = (
      <span class={`${prefixCls}-close-x`}>
        {closeIcon || <CloseOutlined class={`${prefixCls}-close-icon`} />}
      </span>
    );
    const footer = getComponent(this, 'footer');
    const title = getComponent(this, 'title');
    const dialogProps = {
      ...this.$props,
      ...$attrs,
      getContainer: getContainer === undefined ? getContextPopupContainer : getContainer,
      prefixCls,
      wrapClassName: classNames({ [`${prefixCls}-centered`]: !!centered }, wrapClassName),
      title,
      footer: footer === undefined ? defaultFooter : footer,
      visible,
      mousePosition,
      closeIcon: closeIconToRender,
      onClose: this.handleCancel,
    };
    return <Dialog {...dialogProps}>{children}</Dialog>;
  },
});
