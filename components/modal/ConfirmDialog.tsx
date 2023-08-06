import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled';
import InfoCircleFilled from '@ant-design/icons-vue/InfoCircleFilled';
import classNames from '../_util/classNames';
import type { ModalFuncProps, ModalLocale } from './Modal';
import Dialog from './Modal';
import ActionButton from '../_util/ActionButton';
import { defineComponent } from 'vue';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import { getTransitionName } from '../_util/transition';
import warning from '../_util/warning';

interface ConfirmDialogProps extends ModalFuncProps {
  afterClose?: () => void;
  close?: (...args: any[]) => void;
  autoFocusButton?: null | 'ok' | 'cancel';
  rootPrefixCls: string;
  iconPrefixCls?: string;

  /** @private Internal Usage. Do not override this */
  locale?: ModalLocale;
}

function renderSomeContent(someContent: any) {
  if (typeof someContent === 'function') {
    return someContent();
  }
  return someContent;
}

export default defineComponent<ConfirmDialogProps>({
  name: 'ConfirmDialog',
  inheritAttrs: false,
  props: [
    'icon',
    'onCancel',
    'onOk',
    'close',
    'closable',
    'zIndex',
    'afterClose',
    'visible',
    'open',
    'keyboard',
    'centered',
    'getContainer',
    'maskStyle',
    'okButtonProps',
    'cancelButtonProps',
    'okType',
    'prefixCls',
    'okCancel',
    'width',
    'mask',
    'maskClosable',
    'okText',
    'cancelText',
    'autoFocusButton',
    'transitionName',
    'maskTransitionName',
    'type',
    'title',
    'content',
    'direction',
    'rootPrefixCls',
    'bodyStyle',
    'closeIcon',
    'modalRender',
    'focusTriggerAfterClose',
    'wrapClassName',
    'confirmPrefixCls',
    'footer',
  ] as any,
  setup(props, { attrs }) {
    const [locale] = useLocaleReceiver('Modal');

    if (process.env.NODE_ENV !== 'production') {
      warning(
        props.visible === undefined,
        'Modal',
        `\`visible\` is deprecated, please use \`open\` instead.`,
      );
    }
    return () => {
      const {
        icon,
        onCancel,
        onOk,
        close,
        okText,
        closable = false,
        zIndex,
        afterClose,
        keyboard,
        centered,
        getContainer,
        maskStyle,
        okButtonProps,
        cancelButtonProps,
        okCancel,
        width = 416,
        mask = true,
        maskClosable = false,
        type,
        open,
        title,
        content,
        direction,
        closeIcon,
        modalRender,
        focusTriggerAfterClose,
        rootPrefixCls,
        bodyStyle,
        wrapClassName,
        footer,
      } = props;

      // Icon
      let mergedIcon = icon;

      // 支持传入{ icon: null }来隐藏`Modal.confirm`默认的Icon
      if (!icon && icon !== null) {
        switch (type) {
          case 'info':
            mergedIcon = <InfoCircleFilled />;
            break;

          case 'success':
            mergedIcon = <CheckCircleFilled />;
            break;

          case 'error':
            mergedIcon = <CloseCircleFilled />;
            break;

          default:
            mergedIcon = <ExclamationCircleFilled />;
        }
      }
      const okType = props.okType || 'primary';
      const prefixCls = props.prefixCls || 'ant-modal';
      const contentPrefixCls = `${prefixCls}-confirm`;
      const style = attrs.style || {};
      const mergedOkCancel = okCancel ?? type === 'confirm';
      const autoFocusButton =
        props.autoFocusButton === null ? false : props.autoFocusButton || 'ok';

      const confirmPrefixCls = `${prefixCls}-confirm`;

      const classString = classNames(
        confirmPrefixCls,
        `${confirmPrefixCls}-${props.type}`,
        { [`${confirmPrefixCls}-rtl`]: direction === 'rtl' },
        attrs.class,
      );

      const mergedLocal = locale.value;

      const cancelButton = mergedOkCancel && (
        <ActionButton
          actionFn={onCancel}
          close={close}
          autofocus={autoFocusButton === 'cancel'}
          buttonProps={cancelButtonProps}
          prefixCls={`${rootPrefixCls}-btn`}
        >
          {renderSomeContent(props.cancelText) || mergedLocal.cancelText}
        </ActionButton>
      );
      return (
        <Dialog
          prefixCls={prefixCls}
          class={classString}
          wrapClassName={classNames(
            { [`${confirmPrefixCls}-centered`]: !!centered },
            wrapClassName,
          )}
          onCancel={e => close?.({ triggerCancel: true }, e)}
          open={open}
          title=""
          footer=""
          transitionName={getTransitionName(rootPrefixCls, 'zoom', props.transitionName)}
          maskTransitionName={getTransitionName(rootPrefixCls, 'fade', props.maskTransitionName)}
          mask={mask}
          maskClosable={maskClosable}
          maskStyle={maskStyle}
          style={style}
          bodyStyle={bodyStyle}
          width={width}
          zIndex={zIndex}
          afterClose={afterClose}
          keyboard={keyboard}
          centered={centered}
          getContainer={getContainer}
          closable={closable}
          closeIcon={closeIcon}
          modalRender={modalRender}
          focusTriggerAfterClose={focusTriggerAfterClose}
        >
          <div class={`${contentPrefixCls}-body-wrapper`}>
            <div class={`${contentPrefixCls}-body`}>
              {renderSomeContent(mergedIcon)}
              {title === undefined ? null : (
                <span class={`${contentPrefixCls}-title`}>{renderSomeContent(title)}</span>
              )}
              <div class={`${contentPrefixCls}-content`}>{renderSomeContent(content)}</div>
            </div>
            {footer !== undefined ? (
              renderSomeContent(footer)
            ) : (
              <div class={`${contentPrefixCls}-btns`}>
                {cancelButton}
                <ActionButton
                  type={okType}
                  actionFn={onOk}
                  close={close}
                  autofocus={autoFocusButton === 'ok'}
                  buttonProps={okButtonProps}
                  prefixCls={`${rootPrefixCls}-btn`}
                >
                  {renderSomeContent(okText) ||
                    (mergedOkCancel ? mergedLocal.okText : mergedLocal.justOkText)}
                </ActionButton>
              </div>
            )}
          </div>
        </Dialog>
      );
    };
  },
});
