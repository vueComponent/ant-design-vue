
import classNames from 'classnames';
import Icon from '../icon';
import Dialog from './Modal';
import ActionButton from './ActionButton';
import { getConfirmLocale } from './locale';

export default {
  functional: true,
  render: function render(h, context) {
    var props = context.props;
    var onCancel = props.onCancel,
        onOk = props.onOk,
        close = props.close,
        zIndex = props.zIndex,
        afterClose = props.afterClose,
        visible = props.visible,
        keyboard = props.keyboard;

    var iconType = props.iconType || 'question-circle';
    var okType = props.okType || 'primary';
    var prefixCls = props.prefixCls || 'ant-confirm';
    // 默认为 true，保持向下兼容
    var okCancel = 'okCancel' in props ? props.okCancel : true;
    var width = props.width || 416;
    var style = props.style || {};
    // 默认为 false，保持旧版默认行为
    var maskClosable = props.maskClosable === undefined ? false : props.maskClosable;
    var runtimeLocale = getConfirmLocale();
    var okText = props.okText || (okCancel ? runtimeLocale.okText : runtimeLocale.justOkText);
    var cancelText = props.cancelText || runtimeLocale.cancelText;

    var classString = classNames(prefixCls, prefixCls + '-' + props.type, props['class']);

    var cancelButton = okCancel && h(
      ActionButton,
      {
        attrs: { actionFn: onCancel, closeModal: close }
      },
      [cancelText]
    );

    return h(
      Dialog,
      {
        'class': classString,
        on: {
          'cancel': function cancel(e) {
            return close({ triggerCancel: true }, e);
          }
        },
        attrs: {
          visible: visible,
          title: '',
          transitionName: 'zoom',
          footer: '',
          maskTransitionName: 'fade',
          maskClosable: maskClosable,

          width: width,
          zIndex: zIndex,
          afterClose: afterClose,
          keyboard: keyboard
        },
        style: style },
      [h(
        'div',
        { 'class': prefixCls + '-body-wrapper' },
        [h(
          'div',
          { 'class': prefixCls + '-body' },
          [h(Icon, {
            attrs: { type: iconType }
          }), h(
            'span',
            { 'class': prefixCls + '-title' },
            [props.title]
          ), h(
            'div',
            { 'class': prefixCls + '-content' },
            [props.content]
          )]
        ), h(
          'div',
          { 'class': prefixCls + '-btns' },
          [cancelButton, h(
            ActionButton,
            {
              attrs: { type: okType, actionFn: onOk, closeModal: close, autoFocus: true }
            },
            [okText]
          )]
        )]
      )]
    );
  }
};