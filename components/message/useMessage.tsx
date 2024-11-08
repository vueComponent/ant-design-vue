import { shallowRef, computed, defineComponent } from 'vue';
import { useNotification as useVcNotification } from '../vc-notification';
import type { NotificationAPI } from '../vc-notification';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import useStyle from './style';
import type {
  MessageInstance,
  ArgsProps,
  MessageType,
  ConfigOptions,
  NoticeType,
  TypeOpen,
} from './interface';

import { PureContent } from './PurePanel';
import { getMotion } from '../vc-trigger/utils/motionUtil';
import type { Key } from '../_util/type';
import { wrapPromiseFn } from '../_util/util';
import type { VNode } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';

const DEFAULT_OFFSET = 8;
const DEFAULT_DURATION = 3;

// ==============================================================================
// ==                                  Holder                                  ==
// ==============================================================================
type HolderProps = ConfigOptions & {
  onAllRemoved?: VoidFunction;
};

interface HolderRef extends NotificationAPI {
  prefixCls: string;
  hashId: string;
}

const Holder = defineComponent({
  name: 'Holder',
  inheritAttrs: false,
  props: [
    'top',
    'prefixCls',
    'getContainer',
    'maxCount',
    'duration',
    'rtl',
    'transitionName',
    'onAllRemoved',
    'animation',
    'staticGetContainer',
  ],
  setup(props, { expose }) {
    const { getPrefixCls, getPopupContainer } = useConfigInject('message', props);

    const prefixCls = computed(() => getPrefixCls('message', props.prefixCls));

    const [, hashId] = useStyle(prefixCls);

    // =============================== Style ===============================
    const getStyles = () => {
      const top = props.top ?? DEFAULT_OFFSET;
      return {
        left: '50%',
        transform: 'translateX(-50%)',
        top: typeof top === 'number' ? `${top}px` : top,
      };
    };
    const getClassName = () => classNames(hashId.value, props.rtl ? `${prefixCls.value}-rtl` : '');

    // ============================== Motion ===============================
    const getNotificationMotion = () =>
      getMotion({
        prefixCls: prefixCls.value,
        animation: props.animation ?? `move-up`,
        transitionName: props.transitionName,
      });

    // ============================ Close Icon =============================
    const mergedCloseIcon = (
      <span class={`${prefixCls.value}-close-x`}>
        <CloseOutlined class={`${prefixCls.value}-close-icon`} />
      </span>
    );
    // ============================== Origin ===============================
    const [api, holder] = useVcNotification({
      //@ts-ignore
      getStyles,
      prefixCls: prefixCls.value,
      getClassName,
      motion: getNotificationMotion,
      closable: false,
      closeIcon: mergedCloseIcon,
      duration: props.duration ?? DEFAULT_DURATION,
      getContainer: props.staticGetContainer ?? getPopupContainer.value,
      maxCount: props.maxCount,
      onAllRemoved: props.onAllRemoved,
    });

    // ================================ Ref ================================
    expose({
      ...api,
      prefixCls,
      hashId,
    });
    return holder;
  },
});

// ==============================================================================
// ==                                   Hook                                   ==
// ==============================================================================
let keyIndex = 0;

export function useInternalMessage(
  messageConfig?: HolderProps,
): readonly [MessageInstance, () => VNode] {
  const holderRef = shallowRef<HolderRef>(null);
  const holderKey = Symbol('messageHolderKey');
  // ================================ API ================================

  // Wrap with notification content
  // >>> close
  const close = (key: Key) => {
    holderRef.value?.close(key);
  };

  // >>> Open
  const open = (config: ArgsProps): MessageType => {
    if (!holderRef.value) {
      const fakeResult: any = () => {};
      fakeResult.then = () => {};
      return fakeResult;
    }

    const { open: originOpen, prefixCls, hashId } = holderRef.value;
    const noticePrefixCls = `${prefixCls}-notice`;
    const { content, icon, type, key, class: className, onClose, ...restConfig } = config;

    let mergedKey: Key = key!;
    if (mergedKey === undefined || mergedKey === null) {
      keyIndex += 1;
      mergedKey = `antd-message-${keyIndex}`;
    }

    return wrapPromiseFn(resolve => {
      originOpen({
        ...restConfig,
        key: mergedKey,
        content: () => (
          <PureContent
            prefixCls={prefixCls}
            type={type}
            icon={typeof icon === 'function' ? icon() : icon}
          >
            {typeof content === 'function' ? content() : content}
          </PureContent>
        ),
        placement: 'top',
        // @ts-ignore
        class: classNames(type && `${noticePrefixCls}-${type}`, hashId, className),
        onClose: () => {
          onClose?.();
          resolve();
        },
      });

      // Return close function
      return () => {
        close(mergedKey);
      };
    });
  };

  // >>> destroy
  const destroy = (key?: Key) => {
    if (key !== undefined) {
      close(key);
    } else {
      holderRef.value?.destroy();
    }
  };

  const wrapAPI = {
    open,
    destroy,
  } as MessageInstance;

  const keys: NoticeType[] = ['info', 'success', 'warning', 'error', 'loading'];
  keys.forEach(type => {
    const typeOpen: TypeOpen = (jointContent, duration, onClose) => {
      let config: ArgsProps;
      if (jointContent && typeof jointContent === 'object' && 'content' in jointContent) {
        config = jointContent;
      } else {
        config = {
          content: jointContent as VNode,
        };
      }

      // Params
      let mergedDuration: number | undefined;
      let mergedOnClose: VoidFunction | undefined;
      if (typeof duration === 'function') {
        mergedOnClose = duration;
      } else {
        mergedDuration = duration;
        mergedOnClose = onClose;
      }

      const mergedConfig = {
        onClose: mergedOnClose,
        duration: mergedDuration,
        ...config,
        type,
      };

      return open(mergedConfig);
    };

    wrapAPI[type] = typeOpen;
  });

  // ============================== Return ===============================
  return [wrapAPI, () => <Holder key={holderKey} {...messageConfig} ref={holderRef} />] as const;
}

export default function useMessage(messageConfig?: ConfigOptions) {
  return useInternalMessage(messageConfig);
}
