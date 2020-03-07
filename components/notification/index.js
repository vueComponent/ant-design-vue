import Notification from '../vc-notification';
import Icon from '../icon';

const notificationInstance = {};
let defaultDuration = 4.5;
let defaultTop = '24px';
let defaultBottom = '24px';
let defaultPlacement = 'topRight';
let defaultGetContainer = () => document.body;
let defaultCloseIcon = null;

function setNotificationConfig(options) {
  const { duration, placement, bottom, top, getContainer, closeIcon } = options;
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
  if (closeIcon !== undefined) {
    defaultCloseIcon = closeIcon;
  }
}

function getPlacementStyle(placement, top = defaultTop, bottom = defaultBottom) {
  let style;
  switch (placement) {
    case 'topLeft':
      style = {
        left: 0,
        top,
        bottom: 'auto',
      };
      break;
    case 'topRight':
      style = {
        right: 0,
        top,
        bottom: 'auto',
      };
      break;
    case 'bottomLeft':
      style = {
        left: 0,
        top: 'auto',
        bottom,
      };
      break;
    default:
      style = {
        right: 0,
        top: 'auto',
        bottom,
      };
      break;
  }
  return style;
}

function getNotificationInstance(
  {
    prefixCls,
    placement = defaultPlacement,
    getContainer = defaultGetContainer,
    top,
    bottom,
    closeIcon = defaultCloseIcon,
  },
  callback,
) {
  const cacheKey = `${prefixCls}-${placement}`;
  if (notificationInstance[cacheKey]) {
    callback(notificationInstance[cacheKey]);
    return;
  }
  Notification.newInstance(
    {
      prefixCls,
      class: `${prefixCls}-${placement}`,
      style: getPlacementStyle(placement, top, bottom),
      getContainer,
      closeIcon: h => {
        const icon = typeof closeIcon === 'function' ? closeIcon(h) : closeIcon;
        const closeIconToRender = (
          <span class={`${prefixCls}-close-x`}>
            {icon || <Icon class={`${prefixCls}-close-icon`} type="close" />}
          </span>
        );
        return closeIconToRender;
      },
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

function notice(args) {
  const { icon, type, description, message, btn } = args;
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
  const { placement, top, bottom, getContainer, closeIcon } = args;
  getNotificationInstance(
    {
      prefixCls: outerPrefixCls,
      placement,
      top,
      bottom,
      getContainer,
      closeIcon,
    },
    notification => {
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
    },
  );
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
export default api;
