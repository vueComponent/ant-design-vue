import type { CSSProperties } from 'vue';
import Notification from '../vc-notification';
import CheckCircleOutlined from '@ant-design/icons-vue/CheckCircleOutlined';
import InfoCircleOutlined from '@ant-design/icons-vue/InfoCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons-vue/CloseCircleOutlined';
import ExclamationCircleOutlined from '@ant-design/icons-vue/ExclamationCircleOutlined';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import type { VueNode } from '../_util/type';
import { renderHelper } from '../_util/util';
import { globalConfig } from '../config-provider';

export type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export type IconType = 'success' | 'info' | 'error' | 'warning';

export interface ConfigProps {
  top?: string | number;
  bottom?: string | number;
  duration?: number;
  prefixCls?: string;
  placement?: NotificationPlacement;
  getContainer?: () => HTMLElement;
  closeIcon?: VueNode | (() => VueNode);
}

const notificationInstance: { [key: string]: any } = {};
let defaultDuration = 4.5;
let defaultTop = '24px';
let defaultBottom = '24px';
let defaultPrefixCls = '';
let defaultPlacement: NotificationPlacement = 'topRight';
let defaultGetContainer = () => document.body;
let defaultCloseIcon = null;

function setNotificationConfig(options: ConfigProps) {
  const { duration, placement, bottom, top, getContainer, closeIcon, prefixCls } = options;
  if (prefixCls !== undefined) {
    defaultPrefixCls = prefixCls;
  }
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

function getPlacementStyle(
  placement: NotificationPlacement,
  top: string = defaultTop,
  bottom: string = defaultBottom,
) {
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
    prefixCls: customizePrefixCls,
    placement = defaultPlacement,
    getContainer = defaultGetContainer,
    top,
    bottom,
    closeIcon = defaultCloseIcon,
    appContext,
  }: NotificationArgsProps,
  callback: (n: any) => void,
) {
  const { getPrefixCls } = globalConfig();
  const prefixCls = getPrefixCls('notification', customizePrefixCls || defaultPrefixCls);
  const cacheKey = `${prefixCls}-${placement}`;
  if (notificationInstance[cacheKey]) {
    callback(notificationInstance[cacheKey]);
    return;
  }
  Notification.newInstance(
    {
      name: 'notification',
      prefixCls: customizePrefixCls || defaultPrefixCls,
      class: `${prefixCls}-${placement}`,
      style: getPlacementStyle(placement, top, bottom),
      appContext,
      getContainer,
      closeIcon: ({ prefixCls }) => {
        const closeIconToRender = (
          <span class={`${prefixCls}-close-x`}>
            {renderHelper(closeIcon, {}, <CloseOutlined class={`${prefixCls}-close-icon`} />)}
          </span>
        );
        return closeIconToRender;
      },
    },
    (notification: any) => {
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

export interface NotificationArgsProps {
  message: VueNode | (() => VueNode);
  description?: VueNode | (() => VueNode);
  btn?: VueNode | (() => VueNode);
  key?: string;
  onClose?: () => void;
  duration?: number | null;
  icon?: VueNode | (() => VueNode);
  placement?: NotificationPlacement;
  style?: CSSProperties;
  prefixCls?: string;
  class?: string;
  readonly type?: IconType;
  onClick?: () => void;
  top?: string;
  bottom?: string;
  getContainer?: () => HTMLElement;
  closeIcon?: VueNode | (() => VueNode);
  appContext?: any;
}

function notice(args: NotificationArgsProps) {
  const { icon, type, description, message, btn } = args;
  const duration = args.duration === undefined ? defaultDuration : args.duration;
  getNotificationInstance(args, notification => {
    notification.notice({
      content: ({ prefixCls: outerPrefixCls }) => {
        const prefixCls = `${outerPrefixCls}-notice`;
        let iconNode = null;
        if (icon) {
          iconNode = () => <span class={`${prefixCls}-icon`}>{renderHelper(icon)}</span>;
        } else if (type) {
          const Icon = typeToIcon[type];
          iconNode = () => <Icon class={`${prefixCls}-icon ${prefixCls}-icon-${type}`} />;
        }
        return (
          <div class={iconNode ? `${prefixCls}-with-icon` : ''}>
            {iconNode && iconNode()}
            <div class={`${prefixCls}-message`}>
              {!description && iconNode ? (
                <span class={`${prefixCls}-message-single-line-auto-margin`} />
              ) : null}
              {renderHelper(message)}
            </div>
            <div class={`${prefixCls}-description`}>{renderHelper(description)}</div>
            {btn ? <span class={`${prefixCls}-btn`}>{renderHelper(btn)}</span> : null}
          </div>
        );
      },
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

const apiBase = {
  open: notice,
  close(key: string) {
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

type NotificationApi = typeof apiBase &
  Record<IconType | 'warn', (args: Omit<NotificationArgsProps, 'type'>) => void>;
const api = apiBase as any as NotificationApi;
const iconTypes: IconType[] = ['success', 'info', 'warning', 'error'];
iconTypes.forEach(type => {
  api[type] = args =>
    api.open({
      ...args,
      type,
    });
});

api.warn = api.warning;
export default api;
