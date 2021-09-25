import type { CSSProperties } from 'vue';
import Notification from '../vc-notification';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled';
import InfoCircleFilled from '@ant-design/icons-vue/InfoCircleFilled';
import type { VueNode } from '../_util/type';

let defaultDuration = 3;
let defaultTop: string;
let messageInstance: any;
let key = 1;
let localPrefixCls = '';
let transitionName = 'move-up';
let getContainer = () => document.body;
let maxCount: number;

function getMessageInstance(args: MessageArgsProps, callback: (i: any) => void) {
  if (messageInstance) {
    callback(messageInstance);
    return;
  }
  Notification.newInstance(
    {
      appContext: args.appContext,
      prefixCls: args.prefixCls || localPrefixCls,
      rootPrefixCls: args.rootPrefixCls,
      transitionName,
      style: { top: defaultTop }, // 覆盖原来的样式
      getContainer,
      maxCount,
      name: 'message',
    },
    (instance: any) => {
      if (messageInstance) {
        callback(messageInstance);
        return;
      }
      messageInstance = instance;
      callback(instance);
    },
  );
}

type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';

export interface ThenableArgument {
  (val: any): void;
}

const iconMap = {
  info: InfoCircleFilled,
  success: CheckCircleFilled,
  error: CloseCircleFilled,
  warning: ExclamationCircleFilled,
  loading: LoadingOutlined,
};

export interface MessageType {
  (): void;
  then: (fill: ThenableArgument, reject: ThenableArgument) => Promise<void>;
  promise: Promise<void>;
}

export interface MessageArgsProps {
  content: string | (() => VueNode) | VueNode;
  duration: number | null;
  type: NoticeType;
  prefixCls?: string;
  rootPrefixCls?: string;
  onClose?: () => void;
  icon?: (() => VueNode) | VueNode;
  key?: string | number;
  style?: CSSProperties;
  class?: string;
  appContext?: any;
}

function notice(args: MessageArgsProps): MessageType {
  const duration = args.duration !== undefined ? args.duration : defaultDuration;

  const target = args.key || key++;
  const closePromise = new Promise(resolve => {
    const callback = () => {
      if (typeof args.onClose === 'function') {
        args.onClose();
      }
      return resolve(true);
    };
    getMessageInstance(args, instance => {
      instance.notice({
        key: target,
        duration,
        style: args.style || {},
        class: args.class,
        content: ({ prefixCls }) => {
          const Icon = iconMap[args.type];
          const iconNode = Icon ? <Icon /> : '';
          return (
            <div
              class={`${prefixCls}-custom-content${args.type ? ` ${prefixCls}-${args.type}` : ''}`}
            >
              {typeof args.icon === 'function' ? args.icon : args.icon || iconNode}
              <span>{typeof args.content === 'function' ? args.content() : args.content}</span>
            </div>
          );
        },
        onClose: callback,
      });
    });
  });
  const result: any = () => {
    if (messageInstance) {
      messageInstance.removeNotice(target);
    }
  };
  result.then = (filled: ThenableArgument, rejected: ThenableArgument) =>
    closePromise.then(filled, rejected);
  result.promise = closePromise;
  return result;
}

type ConfigDuration = number | (() => void);
type JointContent = VueNode | MessageArgsProps;
export type ConfigOnClose = () => void;

function isArgsProps(content: JointContent): content is MessageArgsProps {
  return (
    Object.prototype.toString.call(content) === '[object Object]' &&
    !!(content as MessageArgsProps).content
  );
}

export interface ConfigOptions {
  top?: string;
  duration?: number;
  prefixCls?: string;
  getContainer?: () => HTMLElement;
  transitionName?: string;
  maxCount?: number;
}

const api: any = {
  open: notice,
  config(options: ConfigOptions) {
    if (options.top !== undefined) {
      defaultTop = options.top;
      messageInstance = null; // delete messageInstance for new defaultTop
    }
    if (options.duration !== undefined) {
      defaultDuration = options.duration;
    }
    if (options.prefixCls !== undefined) {
      localPrefixCls = options.prefixCls;
    }
    if (options.getContainer !== undefined) {
      getContainer = options.getContainer;
    }
    if (options.transitionName !== undefined) {
      transitionName = options.transitionName;
      messageInstance = null; // delete messageInstance for new transitionName
    }
    if (options.maxCount !== undefined) {
      maxCount = options.maxCount;
      messageInstance = null;
    }
  },
  destroy() {
    if (messageInstance) {
      messageInstance.destroy();
      messageInstance = null;
    }
  },
};

['success', 'info', 'warning', 'error', 'loading'].forEach(type => {
  api[type] = (content: JointContent, duration: ConfigDuration, onClose?: ConfigOnClose) => {
    if (isArgsProps(content)) {
      return api.open({ ...content, type });
    }
    if (typeof duration === 'function') {
      onClose = duration;
      duration = undefined;
    }
    return api.open({ content, duration, type, onClose });
  };
});

api.warn = api.warning;

export interface MessageApi {
  info(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  success(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  error(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  warn(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  warning(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  loading(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  open(args: MessageArgsProps): MessageType;
  config(options: ConfigOptions): void;
  destroy(): void;
}

export default api as MessageApi;
