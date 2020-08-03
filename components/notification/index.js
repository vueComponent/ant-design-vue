import Notification from '../vc-notification';
import CheckCircleOutlined from '@ant-design/icons-vue/CheckCircleOutlined';
import InfoCircleOutlined from '@ant-design/icons-vue/InfoCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons-vue/CloseCircleOutlined';
import ExclamationCircleOutlined from '@ant-design/icons-vue/ExclamationCircleOutlined';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';

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
        left: '0px',
        top,
        bottom: 'auto',
      };
      break;
    case 'topRight':
      style = {
        right: '0px',
        top,
        bottom: 'auto',
      };
      break;
    case 'bottomLeft':
      style = {
        left: '0px',
        top: 'auto',
        bottom,
      };
      break;
    default:
      style = {
        right: '0px',
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
      closeIcon: () => {
        const icon = typeof closeIcon === 'function' ? closeIcon() : closeIcon;
        const closeIconToRender = (
          <span class={`${prefixCls}-close-x`}>
            {icon || <CloseOutlined class={`${prefixCls}-close-icon`} />}
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
  success: CheckCircleOutlined,
  info: InfoCircleOutlined,
  error: CloseCircleOutlined,
  warning: ExclamationCircleOutlined,
};

function notice(args) {
  const { icon, type, description, message, btn } = args;
  const outerPrefixCls = args.prefixCls || 'ant-notification';
  const prefixCls = `${outerPrefixCls}-notice`;
  const duration = args.duration === undefined ? defaultDuration : args.duration;

  let iconNode = null;
  if (icon) {
    iconNode = () => (
      <span class={`${prefixCls}-icon`}>{typeof icon === 'function' ? icon() : icon}</span>
    );
  } else if (type) {
    const Icon = typeToIcon[type];
    iconNode = () => <Icon class={`${prefixCls}-icon ${prefixCls}-icon-${type}`} />;
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
        content: () => (
          <div class={iconNode ? `${prefixCls}-with-icon` : ''}>
            {iconNode && iconNode()}
            <div class={`${prefixCls}-message`}>
              {!description && iconNode ? (
                <span class={`${prefixCls}-message-single-line-auto-margin`} />
              ) : null}
              {typeof message === 'function' ? message() : message}
            </div>
            <div class={`${prefixCls}-description`}>
              {typeof description === 'function' ? description() : description}
            </div>
            {btn ? (
              <span class={`${prefixCls}-btn`}>{typeof btn === 'function' ? btn() : btn}</span>
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
