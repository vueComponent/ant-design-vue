import Notification from '../vc-notification';
import Icon from '../icon';

let defaultDuration = 3;
let defaultTop;
let messageInstance;
let key = 1;
let prefixCls = 'ant-message';
let transitionName = 'move-up';
let getContainer = () => document.body;
let maxCount;

function getMessageInstance(callback) {
  if (messageInstance) {
    callback(messageInstance);
    return;
  }
  Notification.newInstance(
    {
      prefixCls,
      transitionName,
      style: { top: defaultTop }, // 覆盖原来的样式
      getContainer,
      maxCount,
    },
    instance => {
      if (messageInstance) {
        callback(messageInstance);
        return;
      }
      messageInstance = instance;
      callback(instance);
    },
  );
}

// type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';

function notice(args) {
  const duration = args.duration !== undefined ? args.duration : defaultDuration;
  const iconType = {
    info: 'info-circle',
    success: 'check-circle',
    error: 'close-circle',
    warning: 'exclamation-circle',
    loading: 'loading',
  }[args.type];

  const target = key++;
  const closePromise = new Promise(resolve => {
    const callback = () => {
      if (typeof args.onClose === 'function') {
        args.onClose();
      }
      return resolve(true);
    };
    getMessageInstance(instance => {
      instance.notice({
        key: target,
        duration,
        style: {},
        content: h => (
          <div
            class={`${prefixCls}-custom-content${args.type ? ` ${prefixCls}-${args.type}` : ''}`}
          >
            {args.icon ? (
              typeof args.icon === 'function' ? (
                args.icon(h)
              ) : (
                args.icon
              )
            ) : iconType ? (
              <Icon type={iconType} theme={iconType === 'loading' ? 'outlined' : 'filled'} />
            ) : (
              ''
            )}
            <span>{typeof args.content === 'function' ? args.content(h) : args.content}</span>
          </div>
        ),
        onClose: callback,
      });
    });
  });
  const result = () => {
    if (messageInstance) {
      messageInstance.removeNotice(target);
    }
  };
  result.then = (filled, rejected) => closePromise.then(filled, rejected);
  result.promise = closePromise;
  return result;
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

const api = {
  open: notice,
  config(options) {
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
  api[type] = (content, duration, onClose) => {
    if (typeof duration === 'function') {
      onClose = duration;
      duration = undefined;
    }
    return api.open({ content, duration: duration, type, onClose });
  };
});

api.warn = api.warning;

export default api;
