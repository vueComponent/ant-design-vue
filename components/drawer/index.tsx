import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import {
  inject,
  nextTick,
  defineComponent,
  ref,
  onMounted,
  provide,
  onBeforeMount,
  onUpdated,
  onUnmounted,
} from 'vue';
import { getPropsSlot } from '../_util/props-util';
import classnames from '../_util/classNames';
import VcDrawer from '../vc-drawer';
import PropTypes from '../_util/vue-types';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import { defaultConfigProvider } from '../config-provider';
import { tuple, withInstall } from '../_util/type';
import omit from '../_util/omit';

const PlacementTypes = tuple('top', 'right', 'bottom', 'left');
export type placementType = typeof PlacementTypes[number];

const SizeTypes = tuple('default', 'large');
export type sizeType = typeof SizeTypes[number];

export interface PushState {
  distance: string | number;
}

const defaultPushState: PushState = { distance: 180 };

const drawerProps = {
  autoFocus: PropTypes.looseBool,
  closable: PropTypes.looseBool.def(true),
  closeIcon: PropTypes.VNodeChild.def(<CloseOutlined />),
  destroyOnClose: PropTypes.looseBool,
  forceRender: PropTypes.looseBool,
  getContainer: PropTypes.any,
  maskClosable: PropTypes.looseBool.def(true),
  mask: PropTypes.looseBool.def(true),
  maskStyle: PropTypes.object,
  style: PropTypes.object,
  size: {
    type: String as PropType<sizeType>,
  },
  drawerStyle: PropTypes.object,
  headerStyle: PropTypes.object,
  bodyStyle: PropTypes.object,
  contentWrapperStyle: PropTypes.object,
  title: PropTypes.VNodeChild,
  visible: PropTypes.looseBool,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  zIndex: PropTypes.number,
  prefixCls: PropTypes.string,
  push: PropTypes.oneOfType([PropTypes.looseBool, { type: Object as PropType<PushState> }]).def(
    defaultPushState,
  ),
  placement: PropTypes.oneOf(PlacementTypes).def('right'),
  keyboard: PropTypes.looseBool.def(true),
  extra: PropTypes.VNodeChild,
  footer: PropTypes.VNodeChild,
  footerStyle: PropTypes.object,
  level: PropTypes.any.def(null),
  levelMove: PropTypes.any,
};

export type DrawerProps = Partial<ExtractPropTypes<typeof drawerProps>>;

const Drawer = defineComponent({
  name: 'ADrawer',
  inheritAttrs: false,
  props: drawerProps,
  emits: ['update:visible', 'close', 'afterVisibleChange'],
  setup(props, { emit, slots, attrs }) {
    const sPush = ref(false);
    const preVisible = ref(props.visible);
    const destroyClose = ref(false);
    const vcDrawer = ref(null);
    const configProvider = inject('configProvider', defaultConfigProvider);
    const parentDrawerOpts = inject('parentDrawerOpts', null);

    onBeforeMount(() => {
      provide('parentDrawerOpts', {
        setPush,
        setPull,
      });
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

    onUpdated(() => {
      const { visible } = props;
      nextTick(() => {
        if (preVisible.value !== visible && parentDrawerOpts) {
          if (visible) {
            parentDrawerOpts.setPush();
          } else {
            parentDrawerOpts.setPull();
          }
        }
        preVisible.value = visible;
      });
    });

    const domFocus = () => {
      vcDrawer.value?.domFocus?.();
    };

    const close = (e: Event) => {
      emit('update:visible', false);
      emit('close', e);
    };

    const afterVisibleChange = (visible: boolean) => {
      emit('afterVisibleChange', visible);
    };

    const setPush = () => {
      sPush.value = true;
    };

    const setPull = () => {
      sPush.value = false;
      nextTick(() => {
        domFocus();
      });
    };

    const onDestroyTransitionEnd = () => {
      const isDestroyOnClose = getDestroyOnClose();
      if (!isDestroyOnClose) {
        return;
      }
      if (!props.visible) {
        destroyClose.value = true;
      }
    };

    const getDestroyOnClose = () => {
      return props.destroyOnClose && !props.visible;
    };

    const getPushTransform = (placement?: placementType) => {
      const { push } = props;
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
    };

    const getRcDrawerStyle = () => {
      const { zIndex, placement, style, mask } = props;
      const offsetStyle = mask ? {} : getOffsetStyle();
      return {
        zIndex,
        transform: sPush.value ? getPushTransform(placement) : undefined,
        ...offsetStyle,
        ...style,
      };
    };

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
      const $closeIcon = getPropsSlot(slots, props, 'closeIcon');
      return (
        closable && (
          <button key="closer" onClick={close} aria-label="Close" class={`${prefixCls}-close`}>
            {$closeIcon}
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

      const isDestroyOnClose = getDestroyOnClose();
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

    const getOffsetStyle = () => {
      // https://github.com/ant-design/ant-design/issues/24287
      const { visible, mask, placement, size, width, height } = props;
      if (!visible && !mask) {
        return {};
      }
      const offsetStyle: CSSProperties = {};
      if (placement === 'left' || placement === 'right') {
        const defaultWidth = size === 'large' ? 736 : 378;
        offsetStyle.width = typeof width === 'undefined' ? defaultWidth : width;
      } else {
        const defaultHeight = size === 'large' ? 736 : 378;
        offsetStyle.height = typeof height === 'undefined' ? defaultHeight : height;
      }
      return offsetStyle;
    };

    return () => {
      const {
        prefixCls: customizePrefixCls,
        width,
        height,
        visible,
        placement,
        mask,
        className,
        ...rest
      } = props;
      const offsetStyle = mask ? getOffsetStyle() : {};
      const haveMask = mask ? '' : 'no-mask';
      const getPrefixCls = configProvider.getPrefixCls;
      const prefixCls = getPrefixCls('drawer', customizePrefixCls);
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
        ]),
        ...offsetStyle,
        onClose: close,
        afterVisibleChange,
        handler: false,
        prefixCls,
        open: visible,
        showMask: mask,
        placement,
        wrapperClassName: classnames({
          [className as string]: className,
          [haveMask]: !!haveMask,
        }),
        style: getRcDrawerStyle(),
        ref: vcDrawer,
      };
      return <VcDrawer {...vcDrawerProps}>{renderBody(prefixCls)}</VcDrawer>;
    };
  },
});

export default withInstall(Drawer);
