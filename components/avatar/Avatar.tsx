import type { CustomSlotsType, VueNode } from '../_util/type';

import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { computed, defineComponent, nextTick, onMounted, shallowRef, watch } from 'vue';
import { getPropsSlot } from '../_util/props-util';
import PropTypes from '../_util/vue-types';
import useBreakpoint from '../_util/hooks/useBreakpoint';
import type { Breakpoint, ScreenSizeMap } from '../_util/responsiveObserve';
import { responsiveArray } from '../_util/responsiveObserve';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import ResizeObserver from '../vc-resize-observer';
import eagerComputed from '../_util/eagerComputed';
import useStyle from './style';
import { useAvatarInjectContext } from './AvatarContext';

export type AvatarSize = 'large' | 'small' | 'default' | number | ScreenSizeMap;

export const avatarProps = () => ({
  prefixCls: String,
  shape: { type: String as PropType<'circle' | 'square'>, default: 'circle' },
  size: {
    type: [Number, String, Object] as PropType<AvatarSize>,
    default: (): AvatarSize => 'default',
  },
  src: String,
  /** Srcset of image avatar */
  srcset: String,
  icon: PropTypes.any,
  alt: String,
  gap: Number,
  draggable: { type: Boolean, default: undefined },
  crossOrigin: String as PropType<'' | 'anonymous' | 'use-credentials'>,
  loadError: {
    type: Function as PropType<() => boolean>,
  },
});

export type AvatarProps = Partial<ExtractPropTypes<ReturnType<typeof avatarProps>>>;

const Avatar = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AAvatar',
  inheritAttrs: false,
  props: avatarProps(),
  slots: Object as CustomSlotsType<{
    icon: any;
    default: any;
  }>,
  setup(props, { slots, attrs }) {
    const isImgExist = shallowRef(true);
    const isMounted = shallowRef(false);
    const scale = shallowRef(1);

    const avatarChildrenRef = shallowRef<HTMLElement>(null);
    const avatarNodeRef = shallowRef<HTMLElement>(null);

    const { prefixCls } = useConfigInject('avatar', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const avatarCtx = useAvatarInjectContext();
    const size = computed(() => {
      return props.size === 'default' ? avatarCtx.size : props.size;
    });
    const screens = useBreakpoint();
    const responsiveSize = eagerComputed(() => {
      if (typeof props.size !== 'object') {
        return undefined;
      }
      const currentBreakpoint: Breakpoint = responsiveArray.find(screen => screens.value[screen])!;
      const currentSize = props.size[currentBreakpoint];

      return currentSize;
    });

    const responsiveSizeStyle = (hasIcon: boolean) => {
      if (responsiveSize.value) {
        return {
          width: `${responsiveSize.value}px`,
          height: `${responsiveSize.value}px`,
          lineHeight: `${responsiveSize.value}px`,
          fontSize: `${hasIcon ? responsiveSize.value / 2 : 18}px`,
        };
      }
      return {};
    };

    const setScaleParam = () => {
      if (!avatarChildrenRef.value || !avatarNodeRef.value) {
        return;
      }
      const childrenWidth = avatarChildrenRef.value.offsetWidth; // offsetWidth avoid affecting be transform scale
      const nodeWidth = avatarNodeRef.value.offsetWidth;
      // denominator is 0 is no meaning
      if (childrenWidth !== 0 && nodeWidth !== 0) {
        const { gap = 4 } = props;
        if (gap * 2 < nodeWidth) {
          scale.value =
            nodeWidth - gap * 2 < childrenWidth ? (nodeWidth - gap * 2) / childrenWidth : 1;
        }
      }
    };

    const handleImgLoadError = () => {
      const { loadError } = props;
      const errorFlag = loadError?.();
      if (errorFlag !== false) {
        isImgExist.value = false;
      }
    };

    watch(
      () => props.src,
      () => {
        nextTick(() => {
          isImgExist.value = true;
          scale.value = 1;
        });
      },
    );

    watch(
      () => props.gap,
      () => {
        nextTick(() => {
          setScaleParam();
        });
      },
    );

    onMounted(() => {
      nextTick(() => {
        setScaleParam();
        isMounted.value = true;
      });
    });

    return () => {
      const { shape, src, alt, srcset, draggable, crossOrigin } = props;
      const mergeShape = avatarCtx.shape ?? shape;
      const icon = getPropsSlot(slots, props, 'icon');
      const pre = prefixCls.value;
      const classString = {
        [`${attrs.class}`]: !!attrs.class,
        [pre]: true,
        [`${pre}-lg`]: size.value === 'large',
        [`${pre}-sm`]: size.value === 'small',
        [`${pre}-${mergeShape}`]: true,
        [`${pre}-image`]: src && isImgExist.value,
        [`${pre}-icon`]: icon,
        [hashId.value]: true,
      };

      const sizeStyle: CSSProperties =
        typeof size.value === 'number'
          ? {
              width: `${size.value}px`,
              height: `${size.value}px`,
              lineHeight: `${size.value}px`,
              fontSize: icon ? `${size.value / 2}px` : '18px',
            }
          : {};

      const children: VueNode = slots.default?.();
      let childrenToRender;
      if (src && isImgExist.value) {
        childrenToRender = (
          <img
            draggable={draggable}
            src={src}
            srcset={srcset}
            onError={handleImgLoadError}
            alt={alt}
            crossorigin={crossOrigin}
          />
        );
      } else if (icon) {
        childrenToRender = icon;
      } else if (isMounted.value || scale.value !== 1) {
        const transformString = `scale(${scale.value}) translateX(-50%)`;
        const childrenStyle: CSSProperties = {
          msTransform: transformString,
          WebkitTransform: transformString,
          transform: transformString,
        };
        const sizeChildrenStyle =
          typeof size.value === 'number'
            ? {
                lineHeight: `${size.value}px`,
              }
            : {};
        childrenToRender = (
          <ResizeObserver onResize={setScaleParam}>
            <span
              class={`${pre}-string`}
              ref={avatarChildrenRef}
              style={{ ...sizeChildrenStyle, ...childrenStyle }}
            >
              {children}
            </span>
          </ResizeObserver>
        );
      } else {
        childrenToRender = (
          <span class={`${pre}-string`} ref={avatarChildrenRef} style={{ opacity: 0 }}>
            {children}
          </span>
        );
      }
      return wrapSSR(
        <span
          {...attrs}
          ref={avatarNodeRef}
          class={classString}
          style={[sizeStyle, responsiveSizeStyle(!!icon), attrs.style as CSSProperties]}
        >
          {childrenToRender}
        </span>,
      );
    };
  },
});

export default Avatar;
