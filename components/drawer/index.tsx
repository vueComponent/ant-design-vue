import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import {
  inject,
  nextTick,
  defineComponent,
  shallowRef,
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
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { objectType, withInstall } from '../_util/type';
import type { CustomSlotsType } from '../_util/type';
import omit from '../_util/omit';
import devWarning from '../vc-util/devWarning';
import type { KeyboardEventHandler, MouseEventHandler } from '../_util/EventInterface';
import useStyle from './style';
import { NoCompactStyle } from '../space/Compact';

import isNumeric from '../_util/isNumeric';
import { getTransitionName, getTransitionProps } from '../_util/transition';

type ILevelMove = number | [number, number];

const PlacementTypes = ['top', 'right', 'bottom', 'left'] as const;
export type placementType = (typeof PlacementTypes)[number];

const SizeTypes = ['default', 'large'] as const;
export type sizeType = (typeof SizeTypes)[number];

export interface PushState {
  distance: string | number;
}

const defaultPushState: PushState = { distance: 180 };
type getContainerFunc = () => HTMLElement;
export const drawerProps = () => ({
  autofocus: { type: Boolean, default: undefined },
  closable: { type: Boolean, default: undefined },
  closeIcon: PropTypes.any,
  destroyOnClose: { type: Boolean, default: undefined },
  forceRender: { type: Boolean, default: undefined },
  getContainer: {
    type: [String, Function, Boolean, Object] as PropType<
      string | HTMLElement | getContainerFunc | false
    >,
    default: undefined as string | HTMLElement | getContainerFunc | false,
  },
  maskClosable: { type: Boolean, default: undefined },
  mask: { type: Boolean, default: undefined },
  maskStyle: objectType<CSSProperties>(),
  rootClassName: String,
  rootStyle: objectType<CSSProperties>(),
  size: {
    type: String as PropType<sizeType>,
  },
  drawerStyle: objectType<CSSProperties>(),
  headerStyle: objectType<CSSProperties>(),
  bodyStyle: objectType<CSSProperties>(),
  contentWrapperStyle: {
    type: Object as PropType<CSSProperties>,
    default: undefined as CSSProperties,
  },
  title: PropTypes.any,
  /** @deprecated Please use `open` instead */
  visible: { type: Boolean, default: undefined },
  open: { type: Boolean, default: undefined },
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  zIndex: Number,
  prefixCls: String,
  push: PropTypes.oneOfType([PropTypes.looseBool, { type: Object as PropType<PushState> }]),
  placement: PropTypes.oneOf(PlacementTypes),
  keyboard: { type: Boolean, default: undefined },
  extra: PropTypes.any,
  footer: PropTypes.any,
  footerStyle: objectType<CSSProperties>(),
  level: PropTypes.any,
  levelMove: {
    type: [Number, Array, Function] as PropType<
      ILevelMove | ((e: { target: HTMLElement; open: boolean }) => ILevelMove)
    >,
  },
  handle: PropTypes.any,
  /** @deprecated Use `@afterVisibleChange` instead */
  afterVisibleChange: Function as PropType<(visible: boolean) => void>,
  /** @deprecated Please use `@afterOpenChange` instead */
  onAfterVisibleChange: Function as PropType<(visible: boolean) => void>,
  onAfterOpenChange: Function as PropType<(open: boolean) => void>,
  /** @deprecated Please use `onUpdate:open` instead */
  'onUpdate:visible': Function as PropType<(visible: boolean) => void>,
  'onUpdate:open': Function as PropType<(open: boolean) => void>,
  onClose: Function as PropType<MouseEventHandler | KeyboardEventHandler>,
});

export type DrawerProps = Partial<ExtractPropTypes<ReturnType<typeof drawerProps>>>;

const Drawer = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ADrawer',
  inheritAttrs: false,
  props: initDefaultProps(drawerProps(), {
    closable: true,
    placement: 'right',
    maskClosable: true,
    mask: true,
    level: null,
    keyboard: true,
    push: defaultPushState,
  }),
  slots: Object as CustomSlotsType<{
    closeIcon: any;
    title: any;
    extra: any;
    footer: any;
    handle: any;
    default: any;
  }>,
  // emits: ['update:visible', 'close', 'afterVisibleChange'],
  setup(props, { emit, slots, attrs }) {
    const sPush = shallowRef(false);
    const destroyClose = shallowRef(false);
    const vcDrawer = shallowRef(null);
    const load = shallowRef(false);
    const visible = shallowRef(false);
    const mergedOpen = computed(() => props.open ?? props.visible);
    watch(
      mergedOpen,
      () => {
        if (mergedOpen.value) {
          load.value = true;
        } else {
          visible.value = false;
        }
      },
      { immediate: true },
    );
    watch(
      [mergedOpen, load],
      () => {
        if (mergedOpen.value && load.value) {
          visible.value = true;
        }
      },
      { immediate: true },
    );
    const parentDrawerOpts = inject('parentDrawerOpts', null);
    const { prefixCls, getPopupContainer, direction } = useConfigInject('drawer', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const getContainer = computed(() =>
      // 有可能为 false，所以不能直接判断
      props.getContainer === undefined && getPopupContainer?.value
        ? () => getPopupContainer.value(document.body)
        : props.getContainer,
    );

    devWarning(
      !props.afterVisibleChange,
      'Drawer',
      '`afterVisibleChange` prop is deprecated, please use `@afterVisibleChange` event instead',
    );
    // ========================== Warning ===========================
    if (process.env.NODE_ENV !== 'production') {
      [
        ['visible', 'open'],
        ['onUpdate:visible', 'onUpdate:open'],
        ['onAfterVisibleChange', 'onAfterOpenChange'],
      ].forEach(([deprecatedName, newName]) => {
        devWarning(
          !props[deprecatedName],
          'Drawer',
          `\`${deprecatedName}\` is deprecated, please use \`${newName}\` instead.`,
        );
      });
    }

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
      if (mergedOpen.value && parentDrawerOpts) {
        parentDrawerOpts.setPush();
      }
    });

    onUnmounted(() => {
      if (parentDrawerOpts) {
        parentDrawerOpts.setPull();
      }
    });

    watch(
      visible,
      () => {
        if (parentDrawerOpts) {
          if (visible.value) {
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
      emit('update:open', false);
      emit('close', e);
    };

    const afterVisibleChange = (open: boolean) => {
      if (!open) {
        if (destroyClose.value === false) {
          // set true only once
          destroyClose.value = true;
        }
        if (props.destroyOnClose) {
          load.value = false;
        }
      }
      props.afterVisibleChange?.(open);
      emit('afterVisibleChange', open);
      emit('afterOpenChange', open);
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
    // ============================ Size ============================
    const mergedWidth = computed(() => props.width ?? (props.size === 'large' ? 736 : 378));
    const mergedHeight = computed(() => props.height ?? (props.size === 'large' ? 736 : 378));
    const offsetStyle = computed(() => {
      // https://github.com/ant-design/ant-design/issues/24287
      const { mask, placement } = props;
      if (!visible.value && !mask) {
        return {};
      }
      const val: CSSProperties = {};
      if (placement === 'left' || placement === 'right') {
        val.width = isNumeric(mergedWidth.value) ? `${mergedWidth.value}px` : mergedWidth.value;
      } else {
        val.height = isNumeric(mergedHeight.value) ? `${mergedHeight.value}px` : mergedHeight.value;
      }
      return val;
    });

    const wrapperStyle = computed(() => {
      const { zIndex, contentWrapperStyle } = props;
      const val = offsetStyle.value;
      return [
        { zIndex, transform: sPush.value ? pushTransform.value : undefined },
        { ...contentWrapperStyle },
        val,
      ];
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
      if (destroyClose.value && !props.forceRender && !load.value) {
        return null;
      }

      const { bodyStyle, drawerStyle } = props;

      return (
        <div class={`${prefixCls}-wrapper-body`} style={drawerStyle}>
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
    const drawerClassName = computed(() =>
      classnames(
        {
          'no-mask': !props.mask,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        props.rootClassName,
        hashId.value,
      ),
    );
    // =========================== Motion ===========================
    const maskMotion = computed(() => {
      return getTransitionProps(getTransitionName(prefixCls.value, 'mask-motion'));
    });
    const panelMotion = (motionPlacement: string) => {
      return getTransitionProps(
        getTransitionName(prefixCls.value, `panel-motion-${motionPlacement}`),
      );
    };

    return () => {
      const { width, height, placement, mask, forceRender, ...rest } = props;

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
          'onAfterVisibleChange',
          'onClose',
          'onUpdate:visible',
          'onUpdate:open',
          'visible',
        ]),
        forceRender,
        onClose: close,
        afterVisibleChange,
        handler: false,
        prefixCls: prefixCls.value,
        open: visible.value,
        showMask: mask,
        placement,
        ref: vcDrawer,
      };
      return wrapSSR(
        <NoCompactStyle>
          <VcDrawer
            {...vcDrawerProps}
            maskMotion={maskMotion.value}
            motion={panelMotion}
            width={mergedWidth.value}
            height={mergedHeight.value}
            getContainer={getContainer.value}
            rootClassName={drawerClassName.value}
            rootStyle={props.rootStyle}
            contentWrapperStyle={wrapperStyle.value}
            v-slots={{
              handler: props.handle ? () => props.handle : slots.handle,
              default: () => renderBody(prefixCls.value),
            }}
          ></VcDrawer>
        </NoCompactStyle>,
      );
    };
  },
});

export default withInstall(Drawer);
