import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import {
  inject,
  nextTick,
  defineComponent,
  ref,
  onMounted,
  provide,
  onUnmounted,
  watch,
  computed,
} from 'vue';
import { getPropsSlot, initDefaultProps } from '../_util/props-util';
import classnames from '../_util/classNames';
import VcDrawer from '../vc-drawer';
import PropTypes from '../_util/vue-types';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import useConfigInject from '../_util/hooks/useConfigInject';
import { tuple, withInstall } from '../_util/type';
import omit from '../_util/omit';
import devWarning from '../vc-util/devWarning';
import type { KeyboardEventHandler, MouseEventHandler } from '../_util/EventInterface';

type ILevelMove = number | [number, number];

const PlacementTypes = tuple('top', 'right', 'bottom', 'left');
export type placementType = typeof PlacementTypes[number];

const SizeTypes = tuple('default', 'large');
export type sizeType = typeof SizeTypes[number];

export interface PushState {
  distance: string | number;
}

const defaultPushState: PushState = { distance: 180 };

export const drawerProps = () => ({
  autofocus: { type: Boolean, default: undefined },
  closable: { type: Boolean, default: undefined },
  closeIcon: PropTypes.any,
  destroyOnClose: { type: Boolean, default: undefined },
  forceRender: { type: Boolean, default: undefined },
  getContainer: PropTypes.any,
  maskClosable: { type: Boolean, default: undefined },
  mask: { type: Boolean, default: undefined },
  maskStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  /** @deprecated Use `style` instead */
  wrapStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  style: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  class: PropTypes.any,
  /** @deprecated Use `class` instead */
  wrapClassName: String,
  size: {
    type: String as PropType<sizeType>,
  },
  drawerStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  headerStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  bodyStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  contentWrapperStyle: {
    type: Object as PropType<CSSProperties>,
    default: undefined as CSSProperties,
  },
  title: PropTypes.any,
  visible: { type: Boolean, default: undefined },
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  zIndex: Number,
  prefixCls: String,
  push: PropTypes.oneOfType([PropTypes.looseBool, { type: Object as PropType<PushState> }]),
  placement: PropTypes.oneOf(PlacementTypes),
  keyboard: { type: Boolean, default: undefined },
  extra: PropTypes.any,
  footer: PropTypes.any,
  footerStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  level: PropTypes.any,
  levelMove: {
    type: [Number, Array, Function] as PropType<
      ILevelMove | ((e: { target: HTMLElement; open: boolean }) => ILevelMove)
    >,
  },
  handle: PropTypes.any,
  /** @deprecated Use `@afterVisibleChange` instead */
  afterVisibleChange: Function as PropType<(visible: boolean) => void>,
  onAfterVisibleChange: Function as PropType<(visible: boolean) => void>,
  'onUpdate:visible': Function as PropType<(visible: boolean) => void>,
  onClose: Function as PropType<MouseEventHandler | KeyboardEventHandler>,
});

export type DrawerProps = Partial<ExtractPropTypes<ReturnType<typeof drawerProps>>>;

const Drawer = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ADrawer',
  inheritAttrs: false,
  props: initDefaultProps(drawerProps(), {
    closable: true,
    placement: 'right' as placementType,
    maskClosable: true,
    mask: true,
    level: null,
    keyboard: true,
    push: defaultPushState,
  }),
  slots: ['closeIcon', 'title', 'extra', 'footer', 'handle'],
  // emits: ['update:visible', 'close', 'afterVisibleChange'],
  setup(props, { emit, slots, attrs }) {
    const sPush = ref(false);
    const destroyClose = ref(false);
    const vcDrawer = ref(null);
    const parentDrawerOpts = inject('parentDrawerOpts', null);
    const { prefixCls } = useConfigInject('drawer', props);
    devWarning(
      !props.afterVisibleChange,
      'Drawer',
      '`afterVisibleChange` prop is deprecated, please use `@afterVisibleChange` event instead',
    );
    devWarning(
      props.wrapStyle === undefined,
      'Drawer',
      '`wrapStyle` prop is deprecated, please use `style` instead',
    );
    devWarning(
      props.wrapClassName === undefined,
      'Drawer',
      '`wrapClassName` prop is deprecated, please use `class` instead',
    );
    const setPush = () => {
      sPush.value = true;
    };

    const setPull = () => {
      sPush.value = false;
      nextTick(() => {
        domFocus();
      });
    };
    provide('parentDrawerOpts', {
      setPush,
      setPull,
    });

    onMounted(() => {
      const { visible } = props;
      if (visible && parentDrawerOpts) {
        parentDrawerOpts.setPush();
      }
    });

    onUnmounted(() => {
      if (parentDrawerOpts) {
        parentDrawerOpts.setPull();
      }
    });

    watch(
      () => props.visible,
      visible => {
        if (parentDrawerOpts) {
          if (visible) {
            parentDrawerOpts.setPush();
          } else {
            parentDrawerOpts.setPull();
          }
        }
      },
      { flush: 'post' },
    );

    const domFocus = () => {
      vcDrawer.value?.domFocus?.();
    };

    const close = (e: Event) => {
      emit('update:visible', false);
      emit('close', e);
    };

    const afterVisibleChange = (visible: boolean) => {
      props.afterVisibleChange?.(visible);
      emit('afterVisibleChange', visible);
    };
    const destroyOnClose = computed(() => props.destroyOnClose && !props.visible);
    const onDestroyTransitionEnd = () => {
      const isDestroyOnClose = destroyOnClose.value;
      if (!isDestroyOnClose) {
        return;
      }
      if (!props.visible) {
        destroyClose.value = true;
      }
    };

    const pushTransform = computed(() => {
      const { push, placement } = props;
      let distance: number | string;
      if (typeof push === 'boolean') {
        distance = push ? defaultPushState.distance : 0;
      } else {
        distance = push!.distance;
      }

      distance = parseFloat(String(distance || 0));

      if (placement === 'left' || placement === 'right') {
        return `translateX(${placement === 'left' ? distance : -distance}px)`;
      }
      if (placement === 'top' || placement === 'bottom') {
        return `translateY(${placement === 'top' ? distance : -distance}px)`;
      }
      return null;
    });

    const offsetStyle = computed(() => {
      // https://github.com/ant-design/ant-design/issues/24287
      const { visible, mask, placement, size = 'default', width, height } = props;
      if (!visible && !mask) {
        return {};
      }
      const val: CSSProperties = {};
      if (placement === 'left' || placement === 'right') {
        const defaultWidth = size === 'large' ? 736 : 378;
        val.width = typeof width === 'undefined' ? defaultWidth : width;
        val.width = typeof val.width === 'string' ? val.width : `${val.width}px`;
      } else {
        const defaultHeight = size === 'large' ? 736 : 378;
        val.height = typeof height === 'undefined' ? defaultHeight : height;
        val.height = typeof val.height === 'string' ? val.height : `${val.height}px`;
      }
      return val;
    });

    const drawerStyle = computed(() => {
      const { zIndex, wrapStyle, mask, style } = props;
      const val = mask ? {} : offsetStyle.value;
      return {
        zIndex,
        transform: sPush.value ? pushTransform.value : undefined,
        ...val,
        ...wrapStyle,
        ...style,
      };
    });

    const renderHeader = (prefixCls: string) => {
      const { closable, headerStyle } = props;
      const extra = getPropsSlot(slots, props, 'extra');
      const title = getPropsSlot(slots, props, 'title');
      if (!title && !closable) {
        return null;
      }

      return (
        <div
          class={classnames(`${prefixCls}-header`, {
            [`${prefixCls}-header-close-only`]: closable && !title && !extra,
          })}
          style={headerStyle}
        >
          <div class={`${prefixCls}-header-title`}>
            {renderCloseIcon(prefixCls)}
            {title && <div class={`${prefixCls}-title`}>{title}</div>}
          </div>
          {extra && <div class={`${prefixCls}-extra`}>{extra}</div>}
        </div>
      );
    };

    const renderCloseIcon = (prefixCls: string) => {
      const { closable } = props;
      const $closeIcon = slots.closeIcon ? slots.closeIcon?.() : props.closeIcon;
      return (
        closable && (
          <button key="closer" onClick={close} aria-label="Close" class={`${prefixCls}-close`}>
            {$closeIcon === undefined ? <CloseOutlined></CloseOutlined> : $closeIcon}
          </button>
        )
      );
    };

    const renderBody = (prefixCls: string) => {
      if (destroyClose.value && !props.visible) {
        return null;
      }
      destroyClose.value = false;

      const { bodyStyle, drawerStyle } = props;

      const containerStyle: CSSProperties = {};

      const isDestroyOnClose = destroyOnClose.value;
      if (isDestroyOnClose) {
        // Increase the opacity transition, delete children after closing.
        containerStyle.opacity = 0;
        containerStyle.transition = 'opacity .3s';
      }

      return (
        <div
          class={`${prefixCls}-wrapper-body`}
          style={{ ...containerStyle, ...drawerStyle }}
          onTransitionend={onDestroyTransitionEnd}
        >
          {renderHeader(prefixCls)}
          <div key="body" class={`${prefixCls}-body`} style={bodyStyle}>
            {slots.default?.()}
          </div>
          {renderFooter(prefixCls)}
        </div>
      );
    };

    const renderFooter = (prefixCls: string) => {
      const footer = getPropsSlot(slots, props, 'footer');
      if (!footer) {
        return null;
      }

      const footerClassName = `${prefixCls}-footer`;
      return (
        <div class={footerClassName} style={props.footerStyle}>
          {footer}
        </div>
      );
    };

    return () => {
      const {
        width,
        height,
        visible,
        placement,
        mask,
        wrapClassName,
        class: className,
        ...rest
      } = props;

      const val = mask ? offsetStyle.value : {};
      const haveMask = mask ? '' : 'no-mask';
      const vcDrawerProps: any = {
        ...attrs,
        ...omit(rest, [
          'size',
          'closeIcon',
          'closable',
          'destroyOnClose',
          'drawerStyle',
          'headerStyle',
          'bodyStyle',
          'title',
          'push',
          'wrapStyle',
          'onAfterVisibleChange',
          'onClose',
          'onUpdate:visible',
        ]),
        ...val,
        onClose: close,
        afterVisibleChange,
        handler: false,
        prefixCls: prefixCls.value,
        open: visible,
        showMask: mask,
        placement,
        class: classnames({
          [className]: className,
          [wrapClassName]: !!wrapClassName,
          [haveMask]: !!haveMask,
        }),
        style: drawerStyle.value,
        ref: vcDrawer,
      };
      return (
        <VcDrawer
          {...vcDrawerProps}
          v-slots={{
            handler: props.handle ? () => props.handle : slots.handle,
            default: () => renderBody(prefixCls.value),
          }}
        ></VcDrawer>
      );
    };
  },
});

export default withInstall(Drawer);
