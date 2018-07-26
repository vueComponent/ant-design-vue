'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vcNotification = require('../vc-notification');

var _vcNotification2 = _interopRequireDefault(_vcNotification);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var defaultDuration = 3;
var defaultTop = null;
var messageInstance = null;
var key = 1;
var prefixCls = 'ant-message';
var transitionName = 'move-up';
var getContainer = function getContainer() {
  return document.body;
};

function getMessageInstance(callback) {
  if (messageInstance) {
    callback(messageInstance);
    return;
  }
  _vcNotification2['default'].newInstance({
    prefixCls: prefixCls,
    transitionName: transitionName,
    style: { top: defaultTop }, // 覆盖原来的样式
    getContainer: getContainer
  }, function (instance) {
    if (messageInstance) {
      callback(messageInstance);
      return;
    }
    messageInstance = instance;
    callback(instance);
  });
}

// type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';

function notice(_content, duration, type, onClose) {
  var iconType = {
    info: 'info-circle',
    success: 'check-circle',
    error: 'cross-circle',
    warning: 'exclamation-circle',
    loading: 'loading'
  }[type];

  if (typeof duration === 'function') {
    onClose = duration;
    duration = defaultDuration;
  }

  var target = key++;
  getMessageInstance(function (instance) {
    instance.notice({
      key: target,
      duration: duration,
      style: {},
      content: function content(h) {
        return h(
          'div',
          { 'class': prefixCls + '-custom-content ' + prefixCls + '-' + type },
          [h(_icon2['default'], {
            attrs: { type: iconType }
          }), h('span', [typeof _content === 'function' ? _content(h) : _content])]
        );
      },
      onClose: onClose
    });
  });
  return function () {
    if (messageInstance) {
      messageInstance.removeNotice(target);
    }
  };
}

// type ConfigContent = React.ReactNode | string;
// type ConfigDuration = number | (() => void);
// export type ConfigOnClose = () => void;

// export interface ConfigOptions {
//   top?: number;
//   duration?: number;
//   prefixCls?: string;
//   getContainer?: () => HTMLElement;
//   transitionName?: string;
// }

exports['default'] = {
  info: function info(content, duration, onClose) {
    return notice(content, duration, 'info', onClose);
  },
  success: function success(content, duration, onClose) {
    return notice(content, duration, 'success', onClose);
  },
  error: function error(content, duration, onClose) {
    return notice(content, duration, 'error', onClose);
  },

  // Departed usage, please use warning()
  warn: function warn(content, duration, onClose) {
    return notice(content, duration, 'warning', onClose);
  },
  warning: function warning(content, duration, onClose) {
    return notice(content, duration, 'warning', onClose);
  },
  loading: function loading(content, duration, onClose) {
    return notice(content, duration, 'loading', onClose);
  },
  config: function config(options) {
    if (options.top !== undefined) {
      defaultTop = options.top;
      messageInstance = null; // delete messageInstance for new defaultTop
    }
    if (options.duration !== undefined) {
      defaultDuration = options.duration;
    }
    if (options.prefixCls !== undefined) {
      prefixCls = options.prefixCls;
    }
    if (options.getContainer !== undefined) {
      getContainer = options.getContainer;
    }
    if (options.transitionName !== undefined) {
      transitionName = options.transitionName;
      messageInstance = null; // delete messageInstance for new transitionName
    }
  },
  destroy: function destroy() {
    if (messageInstance) {
      messageInstance.destroy();
      messageInstance = null;
    }
  }
};
module.exports = exports['default'];