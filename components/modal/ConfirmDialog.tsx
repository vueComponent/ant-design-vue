import classNames from '../_util/classNames';
import type { ModalFuncProps } from './Modal';
import Dialog from './Modal';
import ActionButton from '../_util/ActionButton';
import { defineComponent } from 'vue';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import { getTransitionName } from '../_util/transition';

interface ConfirmDialogProps extends ModalFuncProps {
  afterClose?: () => void;
  close?: (...args: any[]) => void;
  autoFocusButton?: null | 'ok' | 'cancel';
  rootPrefixCls: string;
  iconPrefixCls?: string;
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
  ] as any,
  setup(props, { attrs }) {
    const [locale] = useLocaleReceiver('Modal');
    return () => {
      const {
        icon,
        onCancel,
        onOk,
        close,
        closable = false,
        zIndex,
        afterClose,
        visible,
        keyboard,
        centered,
        getContainer,
        maskStyle,
        okButtonProps,
        cancelButtonProps,
        okCancel = true,
        width = 416,
        mask = true,
        maskClosable = false,
        type,
        title,
        content,
        direction,
        closeIcon,
        modalRender,
        focusTriggerAfterClose,
        rootPrefixCls,
        bodyStyle,
        wrapClassName,
      } = props;
      const okType = props.okType || 'primary';
      const prefixCls = props.prefixCls || 'ant-modal';
      const contentPrefixCls = `${prefixCls}-confirm`;
      const style = attrs.style || {};
      const okText =
        renderSomeContent(props.okText) ||
        (okCancel ? locale.value.okText : locale.value.justOkText);
      const cancelText = renderSomeContent(props.cancelText) || locale.value.cancelText;
      const autoFocusButton =
        props.autoFocusButton === null ? false : props.autoFocusButton || 'ok';

      const classString = classNames(
        contentPrefixCls,
        `${contentPrefixCls}-${type}`,
        `${prefixCls}-${type}`,
        { [`${contentPrefixCls}-rtl`]: direction === 'rtl' },
        attrs.class,
      );

      const cancelButton = okCancel && (
        <ActionButton
          actionFn={onCancel}
          close={close}
          autofocus={autoFocusButton === 'cancel'}
          buttonProps={cancelButtonProps}
          prefixCls={`${rootPrefixCls}-btn`}
        >
          {cancelText}
        </ActionButton>
      );

      return (
        <Dialog
          prefixCls={prefixCls}
          class={classString}
          wrapClassName={classNames(
            { [`${contentPrefixCls}-centered`]: !!centered },
            wrapClassName,
          )}
          onCancel={e => close({ triggerCancel: true }, e)}
          visible={visible}
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
              {renderSomeContent(icon)}
              {title === undefined ? null : (
                <span class={`${contentPrefixCls}-title`}>{renderSomeContent(title)}</span>
              )}
              <div class={`${contentPrefixCls}-content`}>{renderSomeContent(content)}</div>
            </div>
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
                {okText}
              </ActionButton>
            </div>
          </div>
        </Dialog>
      );
    };
  },
});
