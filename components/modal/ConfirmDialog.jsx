import classNames from '../_util/classNames';
import Dialog from './Modal';
import ActionButton from './ActionButton';
import { getConfirmLocale } from './locale';

const ConfirmDialog = (_, { attrs }) => {
  const {
    icon,
    onCancel,
    onOk,
    close,
    zIndex,
    afterClose,
    visible,
    keyboard,
    centered,
    getContainer,
    maskStyle,
    okButtonProps,
    cancelButtonProps,
    closable = false,
  } = attrs;
  const okType = attrs.okType || 'primary';
  const prefixCls = attrs.prefixCls || 'ant-modal';
  const contentPrefixCls = `${prefixCls}-confirm`;
  // 默认为 true，保持向下兼容
  const okCancel = 'okCancel' in attrs ? attrs.okCancel : true;
  const width = attrs.width || 416;
  const style = attrs.style || {};
  const mask = attrs.mask === undefined ? true : attrs.mask;
  // 默认为 false，保持旧版默认行为
  const maskClosable = attrs.maskClosable === undefined ? false : attrs.maskClosable;
  const runtimeLocale = getConfirmLocale();
  const okText = attrs.okText || (okCancel ? runtimeLocale.okText : runtimeLocale.justOkText);
  const cancelText = attrs.cancelText || runtimeLocale.cancelText;
  const autoFocusButton = attrs.autoFocusButton === null ? false : attrs.autoFocusButton || 'ok';
  const transitionName = attrs.transitionName || 'zoom';
  const maskTransitionName = attrs.maskTransitionName || 'fade';

  const classString = classNames(
    contentPrefixCls,
    `${contentPrefixCls}-${attrs.type}`,
    `${prefixCls}-${attrs.type}`,
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
      closable={closable}
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
    >
      <div class={`${contentPrefixCls}-body-wrapper`}>
        <div class={`${contentPrefixCls}-body`}>
          {typeof icon === 'function' ? icon() : icon}
          {attrs.title === undefined ? null : (
            <span class={`${contentPrefixCls}-title`}>{attrs.title}</span>
          )}
          <div class={`${contentPrefixCls}-content`}>
            {typeof attrs.content === 'function' ? attrs.content() : attrs.content}
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
