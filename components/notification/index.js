import Notification from '../vc-notification';
import Icon from '../icon';

// export type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

// export type IconType = 'success' | 'info' | 'error' | 'warning';

const notificationInstance = {};
let defaultDuration = 4.5;
let defaultTop = '24px';
let defaultBottom = '24px';
let defaultPlacement = 'topRight';
let defaultGetContainer = () => document.body;

// export interface ConfigProps {
//   top?: number;
//   bottom?: number;
//   duration?: number;
//   placement?: NotificationPlacement;
//   getContainer?: () => HTMLElement;
// }
function setNotificationConfig(options) {
  const { duration, placement, bottom, top, getContainer } = options;
  if (duration !== undefined) {
    defaultDuration = duration;
  }
  if (placement !== undefined) {
    defaultPlacement = placement;
  }
  if (bottom !== undefined) {
    defaultBottom = typeof bottom === 'number' ? `${bottom}px` : bottom;
  }
  if (top !== undefined) {
    defaultTop = typeof top === 'number' ? `${top}px` : top;
  }
  if (getContainer !== undefined) {
    defaultGetContainer = getContainer;
  }
}

function getPlacementStyle(placement) {
  let style;
  switch (placement) {
    case 'topLeft':
      style = {
        left: 0,
        top: defaultTop,
        bottom: 'auto',
      };
      break;
    case 'topRight':
      style = {
        right: 0,
        top: defaultTop,
        bottom: 'auto',
      };
      break;
    case 'bottomLeft':
      style = {
        left: 0,
        top: 'auto',
        bottom: defaultBottom,
      };
      break;
    default:
      style = {
        right: 0,
        top: 'auto',
        bottom: defaultBottom,
      };
      break;
  }
  return style;
}

function getNotificationInstance(prefixCls, placement, callback) {
  const cacheKey = `${prefixCls}-${placement}`;
  if (notificationInstance[cacheKey]) {
    callback(notificationInstance[cacheKey]);
    return;
  }
  Notification.newInstance(
    {
      prefixCls,
      class: `${prefixCls}-${placement}`,
      style: getPlacementStyle(placement),
      getContainer: defaultGetContainer,
      closeIcon: h => <Icon class={`${prefixCls}-close-icon`} type={'close'} />, // eslint-disable-line
    },
    notification => {
      notificationInstance[cacheKey] = notification;
      callback(notification);
    },
  );
}

const typeToIcon = {
  success: 'check-circle-o',
  info: 'info-circle-o',
  error: 'close-circle-o',
  warning: 'exclamation-circle-o',
};

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
function notice(args) {
  const { icon, type, description, placement, message, btn } = args;
  const outerPrefixCls = args.prefixCls || 'ant-notification';
  const prefixCls = `${outerPrefixCls}-notice`;
  const duration = args.duration === undefined ? defaultDuration : args.duration;

  let iconNode = null;
  if (icon) {
    iconNode = h => (
      <span class={`${prefixCls}-icon`}>{typeof icon === 'function' ? icon(h) : icon}</span>
    );
  } else if (type) {
    const iconType = typeToIcon[type];
    iconNode = h => <Icon class={`${prefixCls}-icon ${prefixCls}-icon-${type}`} type={iconType} />; // eslint-disable-line
  }

  getNotificationInstance(outerPrefixCls, placement || defaultPlacement, notification => {
    notification.notice({
      content: h => (
        <div class={iconNode ? `${prefixCls}-with-icon` : ''}>
          {iconNode && iconNode(h)}
          <div class={`${prefixCls}-message`}>
            {!description && iconNode ? (
              <span class={`${prefixCls}-message-single-line-auto-margin`} />
            ) : null}
            {typeof message === 'function' ? message(h) : message}
          </div>
          <div class={`${prefixCls}-description`}>
            {typeof description === 'function' ? description(h) : description}
          </div>
          {btn ? (
            <span class={`${prefixCls}-btn`}>{typeof btn === 'function' ? btn(h) : btn}</span>
          ) : null}
        </div>
      ),
      duration,
      closable: true,
      onClose: args.onClose,
      onClick: args.onClick,
      key: args.key,
      style: args.style || {},
      class: args.class,
    });
  });
}

const api = {
  open: notice,
  close(key) {
    Object.keys(notificationInstance).forEach(cacheKey =>
      notificationInstance[cacheKey].removeNotice(key),
    );
  },
  config: setNotificationConfig,
  destroy() {
    Object.keys(notificationInstance).forEach(cacheKey => {
      notificationInstance[cacheKey].destroy();
      delete notificationInstance[cacheKey];
    });
  },
};

['success', 'info', 'warning', 'error'].forEach(type => {
  api[type] = args =>
    api.open({
      ...args,
      type,
    });
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
export default api;
