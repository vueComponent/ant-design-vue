import type { VNode } from 'vue';
import { shallowRef, computed, defineComponent } from 'vue';
import { useNotification as useVcNotification } from '../vc-notification';
import type { NotificationAPI } from '../vc-notification';
import type {
  NotificationInstance,
  ArgsProps,
  NotificationPlacement,
  NotificationConfig,
} from './interface';

import useStyle from './style';
import { getCloseIcon, PureContent } from './PurePanel';
import { getMotion, getPlacementStyle } from './util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
import type { Key } from '../_util/type';

const DEFAULT_OFFSET = 24;
const DEFAULT_DURATION = 4.5;

// ==============================================================================
// ==                                  Holder                                  ==
// ==============================================================================
type HolderProps = NotificationConfig & {
  onAllRemoved?: VoidFunction;
  getPopupContainer?: () => HTMLElement;
};

interface HolderRef extends NotificationAPI {
  prefixCls: string;
  hashId: string;
}

const Holder = defineComponent({
  name: 'Holder',
  inheritAttrs: false,
  props: ['prefixCls', 'class', 'type', 'icon', 'content', 'onAllRemoved'],
  setup(props: HolderProps, { expose }) {
    const { getPrefixCls, getPopupContainer } = useConfigInject('notification', props);
    const prefixCls = computed(() => props.prefixCls || getPrefixCls('notification'));
    // =============================== Style ===============================
    const getStyles = (placement: NotificationPlacement) =>
      getPlacementStyle(placement, props.top ?? DEFAULT_OFFSET, props.bottom ?? DEFAULT_OFFSET);

    // Style
    const [, hashId] = useStyle(prefixCls);

    const getClassName = () => classNames(hashId.value, { [`${prefixCls.value}-rtl`]: props.rtl });

    // ============================== Motion ===============================
    const getNotificationMotion = () => getMotion(prefixCls.value);

    // ============================== Origin ===============================
    const [api, holder] = useVcNotification({
      prefixCls: prefixCls.value,
      getStyles,
      getClassName,
      motion: getNotificationMotion,
      closable: true,
      closeIcon: getCloseIcon(prefixCls.value),
      duration: DEFAULT_DURATION,
      getContainer: () =>
        props.getPopupContainer?.() || getPopupContainer.value?.() || document.body,
      maxCount: props.maxCount,
      hashId: hashId.value,
      onAllRemoved: props.onAllRemoved,
    });

    // ================================ Ref ================================
    expose({
      ...api,
      prefixCls: prefixCls.value,
      hashId,
    });
    return holder;
  },
});

// ==============================================================================
// ==                                   Hook                                   ==
// ==============================================================================
export function useInternalNotification(
  notificationConfig?: HolderProps,
): readonly [NotificationInstance, () => VNode] {
  const holderRef = shallowRef<HolderRef>(null);
  const holderKey = Symbol('notificationHolderKey');
  // ================================ API ================================
  // Wrap with notification content

  // >>> Open
  const open = (config: ArgsProps) => {
    if (!holderRef.value) {
      return;
    }
    const { open: originOpen, prefixCls, hashId } = holderRef.value;
    const noticePrefixCls = `${prefixCls}-notice`;

    const { message, description, icon, type, btn, class: className, ...restConfig } = config;
    return originOpen({
      placement: 'topRight',
      ...restConfig,
      content: () => (
        <PureContent
          prefixCls={noticePrefixCls}
          icon={typeof icon === 'function' ? icon() : icon}
          type={type}
          message={typeof message === 'function' ? message() : message}
          description={typeof description === 'function' ? description() : description}
          btn={typeof btn === 'function' ? btn() : btn}
        />
      ),
      // @ts-ignore
      class: classNames(type && `${noticePrefixCls}-${type}`, hashId, className),
    });
  };

  // >>> destroy
  const destroy = (key?: Key) => {
    if (key !== undefined) {
      holderRef.value?.close(key);
    } else {
      holderRef.value?.destroy();
    }
  };

  const wrapAPI = {
    open,
    destroy,
  } as NotificationInstance;

  const keys = ['success', 'info', 'warning', 'error'] as const;
  keys.forEach(type => {
    wrapAPI[type] = config =>
      open({
        ...config,
        type,
      });
  });

  // ============================== Return ===============================
  return [
    wrapAPI,
    () => <Holder key={holderKey} {...notificationConfig} ref={holderRef} />,
  ] as const;
}

export default function useNotification(notificationConfig?: NotificationConfig) {
  return useInternalNotification(notificationConfig);
}
