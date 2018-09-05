
import classNames from 'classnames'
import Icon from '../icon'
import Dialog from './Modal'
import ActionButton from './ActionButton'
import { getConfirmLocale } from './locale'

export default {
  functional: true,
  render (h, context) {
    const { props } = context
    const { onCancel, onOk, close, zIndex, afterClose, visible, keyboard, centered } = props
    const iconType = props.iconType || 'question-circle'
    const okType = props.okType || 'primary'
    const prefixCls = props.prefixCls || 'ant-confirm'
    // 默认为 true，保持向下兼容
    const okCancel = ('okCancel' in props) ? props.okCancel : true
    const width = props.width || 416
    const style = props.style || {}
    // 默认为 false，保持旧版默认行为
    const maskClosable = props.maskClosable === undefined ? false : props.maskClosable
    const runtimeLocale = getConfirmLocale()
    const okText = props.okText ||
    (okCancel ? runtimeLocale.okText : runtimeLocale.justOkText)
    const cancelText = props.cancelText || runtimeLocale.cancelText

    const classString = classNames(
      prefixCls,
      `${prefixCls}-${props.type}`,
    )

    const cancelButton = okCancel && (
      <ActionButton actionFn={onCancel} closeModal={close}>
        {cancelText}
      </ActionButton>
    )

    return (
      <Dialog
        class={classString}
        wrapClassName={classNames({ [`${prefixCls}-centered`]: !!centered })}
        onCancel={(e) => close({ triggerCancel: true }, e)}
        visible={visible}
        title=''
        transitionName='zoom'
        footer=''
        maskTransitionName='fade'
        maskClosable={maskClosable}
        style={style}
        width={width}
        zIndex={zIndex}
        afterClose={afterClose}
        keyboard={keyboard}
      >
        <div class={`${prefixCls}-body-wrapper`}>
          <div class={`${prefixCls}-body`}>
            <Icon type={iconType} />
            <span class={`${prefixCls}-title`}>{props.title}</span>
            <div class={`${prefixCls}-content`}>{props.content}</div>
          </div>
          <div class={`${prefixCls}-btns`}>
            {cancelButton}
            <ActionButton type={okType} actionFn={onOk} closeModal={close} autoFocus>
              {okText}
            </ActionButton>
          </div>
        </div>
      </Dialog>)
  },
}

