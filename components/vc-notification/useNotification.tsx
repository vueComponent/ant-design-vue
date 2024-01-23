import type { CSSProperties } from 'vue';
import { shallowRef, watch } from 'vue';
import HookNotification, { getUuid } from './HookNotification';
import type { NotificationInstance, OpenConfig, Placement } from './Notification';
import type { CSSMotionProps } from '../_util/transition';
import type { Key, VueNode } from '../_util/type';
import type { HolderReadyCallback, NoticeContent } from './HookNotification';

const defaultGetContainer = () => document.body;

type OptionalConfig = Partial<OpenConfig>;

export interface NotificationConfig {
  prefixCls?: string;
  /** Customize container. It will repeat call which means you should return same container element. */
  getContainer?: () => HTMLElement;
  motion?: CSSMotionProps | ((placement?: Placement) => CSSMotionProps);
  closeIcon?: VueNode;
  closable?: boolean;
  maxCount?: number;
  duration?: number;
  /** @private. Config for notification holder style. Safe to remove if refactor */
  getClassName?: (placement?: Placement) => string;
  /** @private. Config for notification holder style. Safe to remove if refactor */
  getStyles?: (placement?: Placement) => CSSProperties;
  /** @private Trigger when all the notification closed. */
  onAllRemoved?: VoidFunction;
  hashId?: string;
}

export interface NotificationAPI {
  open: (config: OptionalConfig) => void;
  close: (key: Key) => void;
  destroy: () => void;
}

interface OpenTask {
  type: 'open';
  config: OpenConfig;
}

interface CloseTask {
  type: 'close';
  key: Key;
}

interface DestroyTask {
  type: 'destroy';
}

type Task = OpenTask | CloseTask | DestroyTask;

let uniqueKey = 0;

function mergeConfig<T>(...objList: Partial<T>[]): T {
  const clone: T = {} as T;

  objList.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key];

        if (val !== undefined) {
          clone[key] = val;
        }
      });
    }
  });

  return clone;
}

export default function useNotification(rootConfig: NotificationConfig = {}) {
  const {
    getContainer = defaultGetContainer,
    motion,
    prefixCls,
    maxCount,
    getClassName,
    getStyles,
    onAllRemoved,
    ...shareConfig
  } = rootConfig;

  const notices = shallowRef([]);
  const notificationsRef = shallowRef<NotificationInstance>();
  const add = (originNotice: NoticeContent, holderCallback?: HolderReadyCallback) => {
    const key = originNotice.key || getUuid();
    const notice: NoticeContent & { key: Key; userPassKey?: Key } = {
      ...originNotice,
      key,
    };
    const noticeIndex = notices.value.map(v => v.notice.key).indexOf(key);
    const updatedNotices = notices.value.concat();
    if (noticeIndex !== -1) {
      updatedNotices.splice(noticeIndex, 1, { notice, holderCallback } as any);
    } else {
      if (maxCount && notices.value.length >= maxCount) {
        notice.key = updatedNotices[0].notice.key as Key;
        notice.updateMark = getUuid();
        notice.userPassKey = key;
        updatedNotices.shift();
      }
      updatedNotices.push({ notice, holderCallback } as any);
    }
    notices.value = updatedNotices;
  };
  const removeNotice = (removeKey: Key) => {
    notices.value = notices.value.filter(({ notice: { key, userPassKey } }) => {
      const mergedKey = userPassKey || key;
      return mergedKey !== removeKey;
    });
  };

  const destroy = () => {
    notices.value = [];
  };

  const contextHolder = () => (
    <HookNotification
      ref={notificationsRef}
      prefixCls={prefixCls}
      maxCount={maxCount}
      notices={notices.value}
      remove={removeNotice}
      getClassName={getClassName}
      getStyles={getStyles}
      animation={motion}
      hashId={rootConfig.hashId}
      onAllRemoved={onAllRemoved}
      getContainer={getContainer}
    ></HookNotification>
  );

  const taskQueue = shallowRef([] as Task[]);
  // ========================= Refs =========================
  const api = {
    open: (config: OpenConfig) => {
      const mergedConfig = mergeConfig(shareConfig, config);
      //@ts-ignore
      if (mergedConfig.key === null || mergedConfig.key === undefined) {
        //@ts-ignore
        mergedConfig.key = `vc-notification-${uniqueKey}`;
        uniqueKey += 1;
      }

      taskQueue.value = [...taskQueue.value, { type: 'open', config: mergedConfig as any }];
    },
    close: key => {
      taskQueue.value = [...taskQueue.value, { type: 'close', key }];
    },
    destroy: () => {
      taskQueue.value = [...taskQueue.value, { type: 'destroy' }];
    },
  };

  // ======================== Effect ========================
  watch(taskQueue, () => {
    // Flush task when node ready
    if (taskQueue.value.length) {
      taskQueue.value.forEach(task => {
        switch (task.type) {
          case 'open':
            // @ts-ignore
            add(task.config);
            break;

          case 'close':
            removeNotice(task.key);
            break;
          case 'destroy':
            destroy();
            break;
        }
      });
      taskQueue.value = [];
    }
  });

  // ======================== Return ========================
  return [api, contextHolder] as const;
}
