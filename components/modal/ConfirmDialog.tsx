import classNames from '../_util/classNames';
import type { ModalFuncProps } from './Modal';
import Dialog from './Modal';
import ActionButton from './ActionButton';
import { getConfirmLocale } from './locale';
import { FunctionalComponent } from 'vue';

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

const ConfirmDialog: FunctionalComponent<ConfirmDialogProps> = props => {
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
    // closable = false,
  } = props;
  const okType = props.okType || 'primary';
  const prefixCls = props.prefixCls || 'ant-modal';
  const contentPrefixCls = `${prefixCls}-confirm`;
  // 默认为 true，保持向下兼容
  const okCancel = 'okCancel' in props ? props.okCancel : true;
  const width = props.width || 416;
  const style = props.style || {};
  const mask = props.mask === undefined ? true : props.mask;
  // 默认为 false，保持旧版默认行为
  const maskClosable = props.maskClosable === undefined ? false : props.maskClosable;
  const runtimeLocale = getConfirmLocale();
  const okText =
    renderSomeContent('okText', props.okText) ||
    (okCancel ? runtimeLocale.okText : runtimeLocale.justOkText);
  const cancelText = renderSomeContent('cancelText', props.cancelText) || runtimeLocale.cancelText;
  const autoFocusButton = props.autoFocusButton === null ? false : props.autoFocusButton || 'ok';
  const transitionName = props.transitionName || 'zoom';
  const maskTransitionName = props.maskTransitionName || 'fade';

  const classString = classNames(
    contentPrefixCls,
    `${contentPrefixCls}-${props.type}`,
    `${prefixCls}-${props.type}`,
    props.class,
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
          {props.title === undefined ? null : (
            <span class={`${contentPrefixCls}-title`}>
              {renderSomeContent('title', props.title)}
            </span>
          )}
          <div class={`${contentPrefixCls}-content`}>
            {renderSomeContent('content', props.content)}
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

ConfirmDialog.inheritAttrs = false;

export default ConfirmDialog;
