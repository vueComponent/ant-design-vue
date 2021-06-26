import type { VueNode } from '../_util/type';
import { tuple } from '../_util/type';
import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue';
import { getPropsSlot } from '../_util/props-util';
import PropTypes from '../_util/vue-types';
import useBreakpoint from '../_util/hooks/useBreakpoint';
import type { Breakpoint, ScreenSizeMap } from '../_util/responsiveObserve';
import { responsiveArray } from '../_util/responsiveObserve';
import useConfigInject from '../_util/hooks/useConfigInject';
import ResizeObserver from '../vc-resize-observer';
import { useInjectSize } from '../_util/hooks/useSize';

export type AvatarSize = 'large' | 'small' | 'default' | number | ScreenSizeMap;

export const avatarProps = {
  prefixCls: PropTypes.string,
  shape: PropTypes.oneOf(tuple('circle', 'square')).def('circle'),
  size: {
    type: [Number, String, Object] as PropType<AvatarSize>,
    default: (): AvatarSize => 'default',
  },
  src: PropTypes.string,
  /** Srcset of image avatar */
  srcset: PropTypes.string,
  icon: PropTypes.VNodeChild,
  alt: PropTypes.string,
  gap: PropTypes.number,
  draggable: PropTypes.bool,
  loadError: {
    type: Function as PropType<() => boolean>,
  },
};

export type AvatarProps = Partial<ExtractPropTypes<typeof avatarProps>>;

const Avatar = defineComponent({
  name: 'AAvatar',
  inheritAttrs: false,
  props: avatarProps,
  slots: ['icon'],
  setup(props, { slots, attrs }) {
    const isImgExist = ref(true);
    const isMounted = ref(false);
    const scale = ref(1);

    const avatarChildrenRef = ref<HTMLElement>(null);
    const avatarNodeRef = ref<HTMLElement>(null);

    const { prefixCls } = useConfigInject('avatar', props);

    const groupSize = useInjectSize();

    const screens = useBreakpoint();
    const responsiveSize = computed(() => {
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
      const { shape, size: customSize, src, alt, srcset, draggable } = props;
      const icon = getPropsSlot(slots, props, 'icon');
      const pre = prefixCls.value;
      const size = customSize === 'default' ? groupSize.value : customSize;
      const classString = {
        [`${attrs.class}`]: !!attrs.class,
        [pre]: true,
        [`${pre}-lg`]: size === 'large',
        [`${pre}-sm`]: size === 'small',
        [`${pre}-${shape}`]: shape,
        [`${pre}-image`]: src && isImgExist.value,
        [`${pre}-icon`]: icon,
      };

      const sizeStyle: CSSProperties =
        typeof size === 'number'
          ? {
              width: `${size}px`,
              height: `${size}px`,
              lineHeight: `${size}px`,
              fontSize: icon ? `${size / 2}px` : '18px',
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
          typeof size === 'number'
            ? {
                lineHeight: `${size}px`,
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
      return (
        <span
          {...attrs}
          ref={avatarNodeRef}
          class={classString}
          style={{
            ...sizeStyle,
            ...responsiveSizeStyle(!!icon),
            ...(attrs.style as CSSProperties),
          }}
        >
          {childrenToRender}
        </span>
      );
    };
  },
});

export default Avatar;
