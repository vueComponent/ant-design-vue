'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vcNotification = require('../vc-notification');

var _vcNotification2 = _interopRequireDefault(_vcNotification);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// export type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

// export type IconType = 'success' | 'info' | 'error' | 'warning';

var notificationInstance = {};
var defaultDuration = 4.5;
var defaultTop = '24px';
var defaultBottom = '24px';
var defaultPlacement = 'topRight';
var defaultGetContainer = function defaultGetContainer() {
  return document.body;
};

// export interface ConfigProps {
//   top?: number;
//   bottom?: number;
//   duration?: number;
//   placement?: NotificationPlacement;
//   getContainer?: () => HTMLElement;
// }
function setNotificationConfig(options) {
  var duration = options.duration,
      placement = options.placement,
      bottom = options.bottom,
      top = options.top,
      getContainer = options.getContainer;

  if (duration !== undefined) {
    defaultDuration = duration;
  }
  if (placement !== undefined) {
    defaultPlacement = placement;
  }
  if (bottom !== undefined) {
    defaultBottom = typeof bottom === 'number' ? bottom + 'px' : bottom;
  }
  if (top !== undefined) {
    defaultTop = typeof top === 'number' ? top + 'px' : top;
  }
  if (getContainer !== undefined) {
    defaultGetContainer = getContainer;
  }
}

function getPlacementStyle(placement) {
  var style = void 0;
  switch (placement) {
    case 'topLeft':
      style = {
        left: 0,
        top: defaultTop,
        bottom: 'auto'
      };
      break;
    case 'topRight':
      style = {
        right: 0,
        top: defaultTop,
        bottom: 'auto'
      };
      break;
    case 'bottomLeft':
      style = {
        left: 0,
        top: 'auto',
        bottom: defaultBottom
      };
      break;
    default:
      style = {
        right: 0,
        top: 'auto',
        bottom: defaultBottom
      };
      break;
  }
  return style;
}

function getNotificationInstance(prefixCls, placement, callback) {
  var cacheKey = prefixCls + '-' + placement;
  if (notificationInstance[cacheKey]) {
    callback(notificationInstance[cacheKey]);
    return;
  }
  _vcNotification2['default'].newInstance({
    prefixCls: prefixCls,
    'class': prefixCls + '-' + placement,
    style: getPlacementStyle(placement),
    getContainer: defaultGetContainer
  }, function (notification) {
    notificationInstance[cacheKey] = notification;
    callback(notification);
  });
}

var typeToIcon = {
  success: 'check-circle-o',
  info: 'info-circle-o',
  error: 'cross-circle-o',
  warning: 'exclamation-circle-o'

  // export interface ArgsProps {
  //   message: React.ReactNode;
  //   description: React.ReactNode;
  //   btn?: React.ReactNode;
  //   key?: string;
  //   onClose?: () => void;
  //   duration?: number | null;
  //   icon?: React.ReactNode;
  //   placement?: NotificationPlacement;
  //   style?: React.CSSProperties;
  //   prefixCls?: string;
  //   className?: string;
  //   readonly type?: IconType;
  // }
};function notice(args) {
  var icon = args.icon,
      type = args.type,
      description = args.description,
      placement = args.placement,
      message = args.message,
      btn = args.btn;

  var outerPrefixCls = args.prefixCls || 'ant-notification';
  var prefixCls = outerPrefixCls + '-notice';
  var duration = args.duration === undefined ? defaultDuration : args.duration;

  var iconNode = null;
  if (icon) {
    iconNode = function iconNode(h) {
      return h(
        'span',
        { 'class': prefixCls + '-icon' },
        [typeof icon === 'function' ? icon(h) : icon]
      );
    };
  } else if (type) {
    var iconType = typeToIcon[type];
    iconNode = function iconNode(h) {
      return h(_icon2['default'], {
        'class': prefixCls + '-icon ' + prefixCls + '-icon-' + type,
        attrs: { type: iconType
        }
      });
    };
  }

  getNotificationInstance(outerPrefixCls, placement || defaultPlacement, function (notification) {
    notification.notice({
      content: function content(h) {
        return h(
          'div',
          { 'class': iconNode ? prefixCls + '-with-icon' : '' },
          [iconNode && iconNode(h), h(
            'div',
            { 'class': prefixCls + '-message' },
            [!description && iconNode ? h('span', { 'class': prefixCls + '-message-single-line-auto-margin' }) : null, typeof message === 'function' ? message(h) : message]
          ), h(
            'div',
            { 'class': prefixCls + '-description' },
            [typeof description === 'function' ? description(h) : description]
          ), btn ? h(
            'span',
            { 'class': prefixCls + '-btn' },
            [typeof btn === 'function' ? btn(h) : btn]
          ) : null]
        );
      },
      duration: duration,
      closable: true,
      onClose: args.onClose,
      key: args.key,
      style: args.style || {},
      'class': args['class']
    });
  });
}

var api = {
  open: notice,
  close: function close(key) {
    Object.keys(notificationInstance).forEach(function (cacheKey) {
      return notificationInstance[cacheKey].removeNotice(key);
    });
  },

  config: setNotificationConfig,
  destroy: function destroy() {
    Object.keys(notificationInstance).forEach(function (cacheKey) {
      notificationInstance[cacheKey].destroy();
      delete notificationInstance[cacheKey];
    });
  }
};

['success', 'info', 'warning', 'error'].forEach(function (type) {
  api[type] = function (args) {
    return api.open((0, _extends3['default'])({}, args, {
      type: type
    }));
  };
});

api.warn = api.warning;

// export interface NotificationApi {
//   success(args: ArgsProps): void;
//   error(args: ArgsProps): void;
//   info(args: ArgsProps): void;
//   warn(args: ArgsProps): void;
//   warning(args: ArgsProps): void;
//   open(args: ArgsProps): void;
//   close(key: string): void;
//   config(options: ConfigProps): void;
//   destroy(): void;
// }
exports['default'] = api;
module.exports = exports['default'];