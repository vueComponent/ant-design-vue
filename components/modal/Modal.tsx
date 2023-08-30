import type { ExtractPropTypes, CSSProperties, PropType } from 'vue';
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import Dialog from '../vc-dialog';
import PropTypes from '../_util/vue-types';
import addEventListener from '../vc-util/Dom/addEventListener';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import Button from '../button';
import type { ButtonProps as ButtonPropsType, LegacyButtonType } from '../button/buttonTypes';
import { convertLegacyProps } from '../button/buttonTypes';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import type { Direction } from '../config-provider';
import type { VueNode } from '../_util/type';
import { objectType } from '../_util/type';
import { canUseDocElement } from '../_util/styleChecker';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { getTransitionName } from '../_util/transition';
import warning from '../_util/warning';
import useStyle from './style';

type MousePosition = { x: number; y: number } | null;

let mousePosition: MousePosition;
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
if (canUseDocElement()) {
  addEventListener(document.documentElement, 'click', getClickPosition, true);
}

export const modalProps = () => ({
  prefixCls: String,
  /** @deprecated Please use `open` instead. */
  visible: { type: Boolean, default: undefined },
  open: { type: Boolean, default: undefined },
  confirmLoading: { type: Boolean, default: undefined },
  title: PropTypes.any,
  closable: { type: Boolean, default: undefined },
  closeIcon: PropTypes.any,
  onOk: Function as PropType<(e: MouseEvent) => void>,
  onCancel: Function as PropType<(e: MouseEvent) => void>,
  'onUpdate:visible': Function as PropType<(visible: boolean) => void>,
  'onUpdate:open': Function as PropType<(open: boolean) => void>,
  onChange: Function as PropType<(open: boolean) => void>,
  afterClose: Function as PropType<() => void>,
  centered: { type: Boolean, default: undefined },
  width: [String, Number],
  footer: PropTypes.any,
  okText: PropTypes.any,
  okType: String as PropType<LegacyButtonType>,
  cancelText: PropTypes.any,
  icon: PropTypes.any,
  maskClosable: { type: Boolean, default: undefined },
  forceRender: { type: Boolean, default: undefined },
  okButtonProps: objectType<ButtonPropsType>(),
  cancelButtonProps: objectType<ButtonPropsType>(),
  destroyOnClose: { type: Boolean, default: undefined },
  wrapClassName: String,
  maskTransitionName: String,
  transitionName: String,
  getContainer: {
    type: [String, Function, Boolean, Object] as PropType<
      string | HTMLElement | getContainerFunc | false
    >,
    default: undefined,
  },
  zIndex: Number,
  bodyStyle: objectType<CSSProperties>(),
  maskStyle: objectType<CSSProperties>(),
  mask: { type: Boolean, default: undefined },
  keyboard: { type: Boolean, default: undefined },
  wrapProps: Object,
  focusTriggerAfterClose: { type: Boolean, default: undefined },
  modalRender: Function as PropType<(arg: { originVNode: VueNode }) => VueNode>,
  mousePosition: objectType<MousePosition>(),
});

export type ModalProps = Partial<ExtractPropTypes<ReturnType<typeof modalProps>>>;

export interface ModalFuncProps {
  prefixCls?: string;
  class?: string;
  open?: boolean;
  title?: string | (() => VueNode) | VueNode;
  footer?: string | (() => VueNode) | VueNode;
  closable?: boolean;
  content?: string | (() => VueNode) | VueNode;
  // TODO: find out exact types
  onOk?: (...args: any[]) => any;
  onCancel?: (...args: any[]) => any;
  afterClose?: () => void;
  okButtonProps?: ButtonPropsType;
  cancelButtonProps?: ButtonPropsType;
  centered?: boolean;
  width?: string | number;
  okText?: string | (() => VueNode) | VueNode;
  okType?: LegacyButtonType;
  cancelText?: string | (() => VueNode) | VueNode;
  icon?: (() => VueNode) | VueNode;
  wrapClassName?: String;
  /* Deprecated */
  iconType?: string;
  mask?: boolean;
  maskClosable?: boolean;
  zIndex?: number;
  okCancel?: boolean;
  style?: CSSProperties | string;
  maskStyle?: CSSProperties;
  type?: 'info' | 'success' | 'error' | 'warn' | 'warning' | 'confirm';
  keyboard?: boolean;
  getContainer?: string | HTMLElement | getContainerFunc | false | null;
  autoFocusButton?: null | 'ok' | 'cancel';
  transitionName?: string;
  maskTransitionName?: string;
  direction?: Direction;
  bodyStyle?: CSSProperties;
  closeIcon?: string | (() => VueNode) | VueNode;
  modalRender?: (arg: { originVNode: VueNode }) => VueNode;
  focusTriggerAfterClose?: boolean;

  /** @deprecated please use `appContext` instead */
  parentContext?: any;
  appContext?: any;

  /** @deprecated please use `open` instead */
  visible?: boolean;
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

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AModal',
  inheritAttrs: false,
  props: initDefaultProps(modalProps(), {
    width: 520,
    confirmLoading: false,
    okType: 'primary',
  }),
  setup(props, { emit, slots, attrs }) {
    const [locale] = useLocaleReceiver('Modal');
    const { prefixCls, rootPrefixCls, direction, getPopupContainer } = useConfigInject(
      'modal',
      props,
    );
    const [wrapSSR, hashId] = useStyle(prefixCls);

    warning(
      props.visible === undefined,
      'Modal',
      `\`visible\` will be removed in next major version, please use \`open\` instead.`,
    );
    const handleCancel = (e: MouseEvent) => {
      emit('update:visible', false);
      emit('update:open', false);
      emit('cancel', e);
      emit('change', false);
    };

    const handleOk = (e: MouseEvent) => {
      emit('ok', e);
    };

    const renderFooter = () => {
      const {
        okText = slots.okText?.(),
        okType,
        cancelText = slots.cancelText?.(),
        confirmLoading,
      } = props;
      return (
        <>
          <Button onClick={handleCancel} {...props.cancelButtonProps}>
            {cancelText || locale.value.cancelText}
          </Button>
          <Button
            {...convertLegacyProps(okType)}
            loading={confirmLoading}
            onClick={handleOk}
            {...props.okButtonProps}
          >
            {okText || locale.value.okText}
          </Button>
        </>
      );
    };
    return () => {
      const {
        prefixCls: customizePrefixCls,
        visible,
        open,
        wrapClassName,
        centered,
        getContainer,
        closeIcon = slots.closeIcon?.(),
        focusTriggerAfterClose = true,
        ...restProps
      } = props;

      const wrapClassNameExtended = classNames(wrapClassName, {
        [`${prefixCls.value}-centered`]: !!centered,
        [`${prefixCls.value}-wrap-rtl`]: direction.value === 'rtl',
      });
      return wrapSSR(
        <Dialog
          {...restProps}
          {...attrs}
          rootClassName={hashId.value}
          class={classNames(hashId.value, attrs.class)}
          getContainer={getContainer || getPopupContainer?.value}
          prefixCls={prefixCls.value}
          wrapClassName={wrapClassNameExtended}
          visible={open ?? visible}
          onClose={handleCancel}
          focusTriggerAfterClose={focusTriggerAfterClose}
          transitionName={getTransitionName(rootPrefixCls.value, 'zoom', props.transitionName)}
          maskTransitionName={getTransitionName(
            rootPrefixCls.value,
            'fade',
            props.maskTransitionName,
          )}
          mousePosition={restProps.mousePosition ?? mousePosition}
          v-slots={{
            ...slots,
            footer: slots.footer || renderFooter,
            closeIcon: () => {
              return (
                <span class={`${prefixCls.value}-close-x`}>
                  {closeIcon || <CloseOutlined class={`${prefixCls.value}-close-icon`} />}
                </span>
              );
            },
          }}
        ></Dialog>,
      );
    };
  },
});
