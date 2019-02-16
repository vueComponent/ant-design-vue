import classNames from 'classnames';
import Icon from '../icon';
import Dialog from './Modal';
import ActionButton from './ActionButton';
import { getConfirmLocale } from './locale';

export default {
  functional: true,
  render(h, context) {
    const { props } = context;
    const {
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
    } = props;
    const iconType = props.iconType || 'question-circle';
    const okType = props.okType || 'primary';
    const prefixCls = props.prefixCls || 'ant-modal';
    const contentPrefixCls = `${prefixCls}-confirm`;
    // 默认为 true，保持向下兼容
    const okCancel = 'okCancel' in props ? props.okCancel : true;
    const width = props.width || 416;
    const style = props.style || {};
    // 默认为 false，保持旧版默认行为
    const maskClosable = props.maskClosable === undefined ? false : props.maskClosable;
    const runtimeLocale = getConfirmLocale();
    const okText = props.okText || (okCancel ? runtimeLocale.okText : runtimeLocale.justOkText);
    const cancelText = props.cancelText || runtimeLocale.cancelText;
    const autoFocusButton = props.autoFocusButton === null ? false : props.autoFocusButton || 'ok';

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
        autoFocus={autoFocusButton === 'cancel'}
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
        transitionName="zoom"
        footer=""
        maskTransitionName="fade"
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
            <Icon type={iconType} />
            <span class={`${contentPrefixCls}-title`}>{props.title}</span>
            <div class={`${contentPrefixCls}-content`}>{props.content}</div>
          </div>
          <div class={`${contentPrefixCls}-btns`}>
            {cancelButton}
            <ActionButton
              type={okType}
              actionFn={onOk}
              closeModal={close}
              autoFocus={autoFocusButton === 'ok'}
              buttonProps={okButtonProps}
            >
              {okText}
            </ActionButton>
          </div>
        </div>
      </Dialog>
    );
  },
};
