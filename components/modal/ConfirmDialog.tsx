import classNames from '../_util/classNames';
import type { ModalFuncProps } from './Modal';
import Dialog from './Modal';
import ActionButton from './ActionButton';
import { getConfirmLocale } from './locale';
import { defineComponent, computed } from 'vue';

interface ConfirmDialogProps extends ModalFuncProps {
  afterClose?: () => void;
  close?: (...args: any[]) => void;
  autoFocusButton?: null | 'ok' | 'cancel';
}

function renderSomeContent(_name, someContent) {
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
  ] as any,
  setup(props, { attrs }) {
    const runtimeLocale = computed(() => getConfirmLocale());
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
        maskTransitionName = 'fade',
        transitionName = 'zoom',
        type,
        title,
        content,
        // closable = false,
      } = props;
      const okType = props.okType || 'primary';
      const prefixCls = props.prefixCls || 'ant-modal';
      const contentPrefixCls = `${prefixCls}-confirm`;
      const style = attrs.style || {};
      const okText =
        renderSomeContent('okText', props.okText) ||
        (okCancel ? runtimeLocale.value.okText : runtimeLocale.value.justOkText);
      const cancelText =
        renderSomeContent('cancelText', props.cancelText) || runtimeLocale.value.cancelText;
      const autoFocusButton =
        props.autoFocusButton === null ? false : props.autoFocusButton || 'ok';

      const classString = classNames(
        contentPrefixCls,
        `${contentPrefixCls}-${type}`,
        `${prefixCls}-${type}`,
        attrs.class,
      );

      const cancelButton = okCancel && (
        <ActionButton
          actionFn={onCancel}
          closeModal={close}
          autofocus={autoFocusButton === 'cancel'}
          buttonProps={cancelButtonProps}
        >
          {cancelText}
        </ActionButton>
      );

      return (
        <Dialog
          prefixCls={prefixCls}
          class={classString}
          wrapClassName={classNames({ [`${contentPrefixCls}-centered`]: !!centered })}
          onCancel={e => close({ triggerCancel: true }, e)}
          visible={visible}
          title=""
          transitionName={transitionName}
          footer=""
          maskTransitionName={maskTransitionName}
          mask={mask}
          maskClosable={maskClosable}
          maskStyle={maskStyle}
          style={style}
          width={width}
          zIndex={zIndex}
          afterClose={afterClose}
          keyboard={keyboard}
          centered={centered}
          getContainer={getContainer}
          closable={closable}
        >
          <div class={`${contentPrefixCls}-body-wrapper`}>
            <div class={`${contentPrefixCls}-body`}>
              {renderSomeContent('icon', icon)}
              {title === undefined ? null : (
                <span class={`${contentPrefixCls}-title`}>{renderSomeContent('title', title)}</span>
              )}
              <div class={`${contentPrefixCls}-content`}>
                {renderSomeContent('content', content)}
              </div>
            </div>
            <div class={`${contentPrefixCls}-btns`}>
              {cancelButton}
              <ActionButton
                type={okType}
                actionFn={onOk}
                closeModal={close}
                autofocus={autoFocusButton === 'ok'}
                buttonProps={okButtonProps}
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
