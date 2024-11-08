import { getTransitionGroupProps } from '../_util/transition';
import type { Key, VueNode } from '../_util/type';
import type { CSSProperties } from 'vue';
import {
  toRaw,
  shallowRef,
  createVNode,
  computed,
  defineComponent,
  ref,
  TransitionGroup,
  onMounted,
  render as vueRender,
} from 'vue';
import type { NoticeProps } from './Notice';
import Notice from './Notice';
import ConfigProvider, { globalConfigForApi } from '../config-provider';
import classNames from '../_util/classNames';

let seed = 0;
const now = Date.now();

function getUuid() {
  const id = seed;
  seed += 1;
  return `rcNotification_${now}_${id}`;
}

export interface NoticeContent extends Omit<NoticeProps, 'prefixCls' | 'noticeKey' | 'onClose'> {
  prefixCls?: string;
  key?: Key;
  updateMark?: string;
  content?: string | ((arg: { prefixCls: string }) => VueNode) | VueNode;
  onClose?: () => void;
  style?: CSSProperties;
  class?: String;
}
export type Placement = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';

export interface OpenConfig extends NoticeProps {
  key: Key;
  placement?: Placement;
  content?: string | (() => VueNode) | VueNode;
  duration?: number | null;
}

export type NoticeFunc = (noticeProps: NoticeContent) => void;
export type HolderReadyCallback = (
  div: HTMLDivElement,
  noticeProps: NoticeProps & { key: Key },
) => void;

export interface NotificationInstance {
  notice: NoticeFunc;
  removeNotice: (key: Key) => void;
  destroy: () => void;
  component: Notification;
}

export interface NotificationProps {
  prefixCls?: string;
  transitionName?: string;
  animation?: string | object;
  maxCount?: number;
  closeIcon?: any;
  hashId?: string;
}

type NotificationState = {
  notice: NoticeContent & {
    userPassKey?: Key;
  };
  holderCallback?: HolderReadyCallback;
}[];

const Notification = defineComponent({
  name: 'Notification',
  inheritAttrs: false,
  props: ['prefixCls', 'transitionName', 'animation', 'maxCount', 'closeIcon', 'hashId'],
  setup(props, { attrs, expose, slots }) {
    const hookRefs = new Map<Key, HTMLDivElement>();
    const notices = ref<NotificationState>([]);
    const transitionProps = computed(() => {
      const { prefixCls, animation = 'fade' } = props;
      let name = props.transitionName;
      if (!name && animation) {
        name = `${prefixCls}-${animation}`;
      }
      return getTransitionGroupProps(name);
    });

    const add = (originNotice: NoticeContent, holderCallback?: HolderReadyCallback) => {
      const key = originNotice.key || getUuid();
      const notice: NoticeContent & { key: Key; userPassKey?: Key } = {
        ...originNotice,
        key,
      };
      const { maxCount } = props;
      const noticeIndex = notices.value.map(v => v.notice.key).indexOf(key);
      const updatedNotices = notices.value.concat();
      if (noticeIndex !== -1) {
        updatedNotices.splice(noticeIndex, 1, { notice, holderCallback } as any);
      } else {
        if (maxCount && notices.value.length >= maxCount) {
          // XXX, use key of first item to update new added (let React to move exsiting
          // instead of remove and mount). Same key was used before for both a) external
          // manual control and b) internal react 'key' prop , which is not that good.
          // eslint-disable-next-line no-param-reassign

          // zombieJ: Not know why use `updateKey`. This makes Notice infinite loop in jest.
          // Change to `updateMark` for compare instead.
          // https://github.com/react-component/notification/commit/32299e6be396f94040bfa82517eea940db947ece
          notice.key = updatedNotices[0].notice.key as Key;
          notice.updateMark = getUuid();

          // zombieJ: That's why. User may close by key directly.
          // We need record this but not re-render to avoid upper issue
          // https://github.com/react-component/notification/issues/129
          notice.userPassKey = key;

          updatedNotices.shift();
        }
        updatedNotices.push({ notice, holderCallback } as any);
      }
      notices.value = updatedNotices;
    };

    const remove = (removeKey: Key) => {
      notices.value = toRaw(notices.value as any).filter(({ notice: { key, userPassKey } }) => {
        const mergedKey = userPassKey || key;
        return mergedKey !== removeKey;
      });
    };
    expose({
      add,
      remove,
      notices,
    });
    return () => {
      const { prefixCls, closeIcon = slots.closeIcon?.({ prefixCls }) } = props;
      const noticeNodes = notices.value.map(({ notice, holderCallback }, index) => {
        const updateMark = index === notices.value.length - 1 ? notice.updateMark : undefined;
        const { key, userPassKey } = notice;

        const { content } = notice;
        const noticeProps = {
          prefixCls,
          closeIcon: typeof closeIcon === 'function' ? closeIcon({ prefixCls }) : closeIcon,
          ...(notice as any),
          ...notice.props,
          key,
          noticeKey: userPassKey || key,
          updateMark,
          onClose: (noticeKey: Key) => {
            remove(noticeKey);
            notice.onClose?.();
          },
          onClick: notice.onClick,
        };
        if (holderCallback) {
          return (
            <div
              key={key}
              class={`${prefixCls}-hook-holder`}
              ref={(div: HTMLDivElement) => {
                if (typeof key === 'undefined') {
                  return;
                }

                if (div) {
                  hookRefs.set(key, div);
                  holderCallback(div, noticeProps);
                } else {
                  hookRefs.delete(key);
                }
              }}
            />
          );
        }
        return (
          <Notice {...noticeProps} class={classNames(noticeProps.class, props.hashId)}>
            {typeof content === 'function' ? content({ prefixCls }) : content}
          </Notice>
        );
      });
      const className = {
        [prefixCls]: 1,
        [attrs.class as string]: !!attrs.class,
        [props.hashId]: true,
      };
      return (
        <div
          class={className}
          style={
            (attrs.style as CSSProperties) || {
              top: '65px',
              left: '50%',
            }
          }
        >
          <TransitionGroup tag="div" {...transitionProps.value}>
            {noticeNodes}
          </TransitionGroup>
        </div>
      );
    };
  },
});

Notification.newInstance = function newNotificationInstance(properties, callback) {
  const {
    name = 'notification',
    getContainer,
    appContext,
    prefixCls: customizePrefixCls,
    rootPrefixCls: customRootPrefixCls,
    transitionName: customTransitionName,
    hasTransitionName,
    useStyle,
    ...props
  } = properties || {};
  const div = document.createElement('div');
  if (getContainer) {
    const root = getContainer();
    root.appendChild(div);
  } else {
    document.body.appendChild(div);
  }
  const Wrapper = defineComponent({
    compatConfig: { MODE: 3 },
    name: 'NotificationWrapper',
    setup(_props, { attrs }) {
      const notiRef = shallowRef();
      const prefixCls = computed(() => globalConfigForApi.getPrefixCls(name, customizePrefixCls));
      const [, hashId] = useStyle(prefixCls);
      onMounted(() => {
        callback({
          notice(noticeProps: NoticeContent) {
            notiRef.value?.add(noticeProps);
          },
          removeNotice(key: Key) {
            notiRef.value?.remove(key);
          },
          destroy() {
            vueRender(null, div);
            if (div.parentNode) {
              div.parentNode.removeChild(div);
            }
          },
          component: notiRef,
        });
      });
      return () => {
        const global = globalConfigForApi;
        const rootPrefixCls = global.getRootPrefixCls(customRootPrefixCls, prefixCls.value);
        const transitionName = hasTransitionName
          ? customTransitionName
          : `${prefixCls.value}-${customTransitionName}`;
        return (
          <ConfigProvider {...global} prefixCls={rootPrefixCls}>
            <Notification
              ref={notiRef}
              {...attrs}
              prefixCls={prefixCls.value}
              transitionName={transitionName}
              hashId={hashId.value}
            />
          </ConfigProvider>
        );
      };
    },
  });

  const vm = createVNode(Wrapper, props);
  vm.appContext = appContext || vm.appContext;
  vueRender(vm, div);
};

export default Notification;
