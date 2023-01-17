import type { Key } from '../_util/type';
import { Teleport, computed, defineComponent, onMounted, watch, onUnmounted } from 'vue';
import type { HTMLAttributes, CSSProperties } from 'vue';
import type { MouseEventHandler } from '../_util/EventInterface';
import classNames from '../_util/classNames';

interface DivProps extends HTMLAttributes {
  // Ideally we would allow all data-* props but this would depend on https://github.com/microsoft/TypeScript/issues/28960
  'data-testid'?: string;
}

export interface NoticeProps {
  prefixCls: string;
  duration?: number | null;
  updateMark?: string;
  /** Mark as final key since set maxCount may keep the key but user pass key is different */
  noticeKey: Key;
  closeIcon?: any;
  closable?: boolean;
  props?: DivProps;
  onClick?: MouseEventHandler;
  onClose?: (key: Key) => void;

  /** @private Only for internal usage. We don't promise that we will refactor this */
  holder?: HTMLDivElement;

  /** @private Provided by CSSMotionList */
  visible?: boolean;
}

export default defineComponent<NoticeProps>({
  name: 'Notice',
  inheritAttrs: false,
  props: [
    'prefixCls',
    'duration',
    'updateMark',
    'noticeKey',
    'closeIcon',
    'closable',
    'props',
    'onClick',
    'onClose',
    'holder',
    'visible',
  ] as any,
  setup(props, { attrs, slots }) {
    let closeTimer: any;
    let isUnMounted = false;
    const duration = computed(() => (props.duration === undefined ? 4.5 : props.duration));
    const startCloseTimer = () => {
      if (duration.value && !isUnMounted) {
        closeTimer = setTimeout(() => {
          close();
        }, duration.value * 1000);
      }
    };

    const clearCloseTimer = () => {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
    };
    const close = (e?: MouseEvent) => {
      if (e) {
        e.stopPropagation();
      }
      clearCloseTimer();
      const { onClose, noticeKey } = props;
      if (onClose) {
        onClose(noticeKey);
      }
    };
    const restartCloseTimer = () => {
      clearCloseTimer();
      startCloseTimer();
    };
    onMounted(() => {
      startCloseTimer();
    });
    onUnmounted(() => {
      isUnMounted = true;
      clearCloseTimer();
    });

    watch(
      [duration, () => props.updateMark, () => props.visible],
      ([preDuration, preUpdateMark, preVisible], [newDuration, newUpdateMark, newVisible]) => {
        if (
          preDuration !== newDuration ||
          preUpdateMark !== newUpdateMark ||
          (preVisible !== newVisible && newVisible)
        ) {
          restartCloseTimer();
        }
      },
      { flush: 'post' },
    );
    return () => {
      const { prefixCls, closable, closeIcon = slots.closeIcon?.(), onClick, holder } = props;
      const { class: className, style } = attrs;
      const componentClass = `${prefixCls}-notice`;
      const dataOrAriaAttributeProps = Object.keys(attrs).reduce(
        (acc: Record<string, string>, key: string) => {
          if (key.startsWith('data-') || key.startsWith('aria-') || key === 'role') {
            acc[key] = (attrs as any)[key];
          }
          return acc;
        },
        {},
      );
      const node = (
        <div
          class={classNames(componentClass, className, {
            [`${componentClass}-closable`]: closable,
          })}
          style={style as CSSProperties}
          onMouseenter={clearCloseTimer}
          onMouseleave={startCloseTimer}
          onClick={onClick}
          {...dataOrAriaAttributeProps}
        >
          <div class={`${componentClass}-content`}>{slots.default?.()}</div>
          {closable ? (
            <a tabindex={0} onClick={close} class={`${componentClass}-close`}>
              {closeIcon || <span class={`${componentClass}-close-x`} />}
            </a>
          ) : null}
        </div>
      );

      if (holder) {
        return <Teleport to={holder} v-slots={{ default: () => node }}></Teleport>;
      }

      return node;
    };
  },
});
