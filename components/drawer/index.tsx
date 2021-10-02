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

const PlacementTypes = tuple('top', 'right', 'bottom', 'left');
export type placementType = typeof PlacementTypes[number];

const SizeTypes = tuple('default', 'large');
export type sizeType = typeof SizeTypes[number];

export interface PushState {
  distance: string | number;
}

const defaultPushState: PushState = { distance: 180 };

const drawerProps = () => ({
  autofocus: PropTypes.looseBool,
  closable: PropTypes.looseBool,
  closeIcon: PropTypes.VNodeChild,
  destroyOnClose: PropTypes.looseBool,
  forceRender: PropTypes.looseBool,
  getContainer: PropTypes.any,
  maskClosable: PropTypes.looseBool,
  mask: PropTypes.looseBool,
  maskStyle: PropTypes.object,
  /** @deprecated Use `style` instead */
  wrapStyle: PropTypes.style,
  style: PropTypes.style,
  class: PropTypes.any,
  /** @deprecated Use `class` instead */
  wrapClassName: PropTypes.string,
  size: {
    type: String as PropType<sizeType>,
  },
  drawerStyle: PropTypes.object,
  headerStyle: PropTypes.object,
  bodyStyle: PropTypes.object,
  contentWrapperStyle: PropTypes.object,
  title: PropTypes.VNodeChild,
  visible: PropTypes.looseBool.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  zIndex: PropTypes.number,
  prefixCls: PropTypes.string,
  push: PropTypes.oneOfType([PropTypes.looseBool, { type: Object as PropType<PushState> }]),
  placement: PropTypes.oneOf(PlacementTypes),
  keyboard: PropTypes.looseBool,
  extra: PropTypes.VNodeChild,
  footer: PropTypes.VNodeChild,
  footerStyle: PropTypes.object,
  level: PropTypes.any,
  levelMove: PropTypes.any,
  handle: PropTypes.VNodeChild,
  /** @deprecated Use `@afterVisibleChange` instead */
  afterVisibleChange: PropTypes.func,
});

export type DrawerProps = Partial<ExtractPropTypes<typeof drawerProps>>;

const Drawer = defineComponent({
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
  emits: ['update:visible', 'close', 'afterVisibleChange'],
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
      const { visible, mask, placement, size, width, height } = props;
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
      const $closeIcon = props.closeIcon ? slots.closeIcon?.() : props.closeIcon;
      return (
        closable && (
          <button key="closer" onClick={close} aria-label="Close" class={`${prefixCls}-close`}>
            {$closeIcon === undefined ? <CloseOutlined></CloseOutlined> : null}
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
