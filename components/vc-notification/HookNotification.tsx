import type { CSSProperties } from 'vue';
import { watch, computed, defineComponent, ref, TransitionGroup } from 'vue';
import type { NoticeProps } from './Notice';
import Notice from './Notice';
import type { CSSMotionProps } from '../_util/transition';
import { getTransitionGroupProps } from '../_util/transition';
import type { Key, VueNode } from '../_util/type';
import classNames from '../_util/classNames';
import Portal from '../_util/Portal';

let seed = 0;
const now = Date.now();

export function getUuid() {
  const id = seed;
  seed += 1;
  return `rcNotification_${now}_${id}`;
}

export type Placement = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';

export interface OpenConfig extends NoticeProps {
  key: Key;
  placement?: Placement;
  content?: VueNode;
  duration?: number | null;
}

export type Placements = Partial<Record<Placement, OpenConfig[]>>;

export interface NoticeContent extends Omit<NoticeProps, 'prefixCls' | 'noticeKey' | 'onClose'> {
  prefixCls?: string;
  key?: Key;
  updateMark?: string;
  content?: any;
  onClose?: () => void;
  style?: CSSProperties;
  class?: String;
  placement?: Placement;
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
  add: (noticeProps: NoticeContent) => void;
  component: Notification;
}

export interface HookNotificationProps {
  prefixCls?: string;
  transitionName?: string;
  animation?: string | CSSMotionProps | ((placement?: Placement) => CSSMotionProps);
  maxCount?: number;
  closeIcon?: any;
  hashId?: string;
  // Hook Notification
  remove: (key: Key) => void;
  notices: NotificationState;
  getStyles?: (placement?: Placement) => CSSProperties;
  getClassName?: (placement?: Placement) => string;
  onAllRemoved?: VoidFunction;
  getContainer?: () => HTMLElement;
}

type NotificationState = {
  notice: NoticeContent & {
    userPassKey?: Key;
  };
  holderCallback?: HolderReadyCallback;
}[];

const Notification = defineComponent<HookNotificationProps>({
  name: 'HookNotification',
  inheritAttrs: false,
  props: [
    'prefixCls',
    'transitionName',
    'animation',
    'maxCount',
    'closeIcon',
    'hashId',
    'remove',
    'notices',
    'getStyles',
    'getClassName',
    'onAllRemoved',
    'getContainer',
  ] as any,
  setup(props, { attrs, slots }) {
    const hookRefs = new Map<Key, HTMLDivElement>();
    const notices = computed(() => props.notices);
    const transitionProps = computed(() => {
      let name = props.transitionName;
      if (!name && props.animation) {
        switch (typeof props.animation) {
          case 'string':
            name = props.animation;
            break;
          case 'function':
            name = props.animation().name;
            break;
          case 'object':
            name = props.animation.name;
            break;
          default:
            name = `${props.prefixCls}-fade`;
            break;
        }
      }
      return getTransitionGroupProps(name);
    });

    const remove = (key: Key) => props.remove(key);
    const placements = ref({} as Record<Placement, NotificationState>);
    watch(notices, () => {
      const nextPlacements = {} as any;
      // init placements with animation
      Object.keys(placements.value).forEach(placement => {
        nextPlacements[placement] = [];
      });
      props.notices.forEach(config => {
        const { placement = 'topRight' } = config.notice;
        if (placement) {
          nextPlacements[placement] = nextPlacements[placement] || [];
          nextPlacements[placement].push(config);
        }
      });
      placements.value = nextPlacements;
    });

    const placementList = computed(() => Object.keys(placements.value) as Placement[]);

    return () => {
      const { prefixCls, closeIcon = slots.closeIcon?.({ prefixCls }) } = props;
      const noticeNodes = placementList.value.map(placement => {
        const noticesForPlacement = placements.value[placement];
        const classes = props.getClassName?.(placement);
        const styles = props.getStyles?.(placement);
        const noticeNodesForPlacement = noticesForPlacement.map(
          ({ notice, holderCallback }, index) => {
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
          },
        );
        const className = {
          [prefixCls]: 1,
          [`${prefixCls}-${placement}`]: 1,
          [attrs.class as string]: !!attrs.class,
          [props.hashId]: true,
          [classes]: !!classes,
        };
        function onAfterLeave() {
          if (noticesForPlacement.length > 0) {
            return;
          }
          Reflect.deleteProperty(placements.value, placement);
          props.onAllRemoved?.();
        }
        return (
          <div
            key={placement}
            class={className}
            style={
              (attrs.style as CSSProperties) ||
              styles || {
                top: '65px',
                left: '50%',
              }
            }
          >
            <TransitionGroup tag="div" {...transitionProps.value} onAfterLeave={onAfterLeave}>
              {noticeNodesForPlacement}
            </TransitionGroup>
          </div>
        );
      });
      return <Portal getContainer={props.getContainer}>{noticeNodes}</Portal>;
    };
  },
});

export default Notification;
