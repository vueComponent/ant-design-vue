import type { ImgHTMLAttributes, CSSProperties } from 'vue';
import { ref, watch, defineComponent, computed, onMounted } from 'vue';
import isNumber from 'lodash-es/isNumber';
import cn from '../../_util/classNames';
import PropTypes from '../../_util/vue-types';
import { getOffset } from '../../vc-util/Dom/css';

import type { MouseEventHandler } from './Preview';
import Preview from './Preview';

import PreviewGroup, { context } from './PreviewGroup';

export type GetContainer = string | HTMLElement | (() => HTMLElement);
export interface ImagePreviewType {
  visible?: boolean;
  onVisibleChange?: (value: boolean, prevValue: boolean) => void;
  getContainer?: GetContainer | false;
}

export interface ImagePropsType extends Omit<ImgHTMLAttributes, 'placeholder' | 'onClick'> {
  // Original
  src?: string;
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
  prefixCls?: string;
  previewPrefixCls?: string;
  placeholder?: boolean;
  fallback?: string;
  preview?: boolean | ImagePreviewType;
}
export const imageProps = {
  src: PropTypes.string,
  wrapperClassName: PropTypes.string,
  wrapperStyle: PropTypes.style,
  prefixCls: PropTypes.string,
  previewPrefixCls: PropTypes.string,
  placeholder: PropTypes.VNodeChild,
  fallback: PropTypes.string,
  preview: PropTypes.oneOfType([
    PropTypes.looseBool,
    PropTypes.shape({
      visible: PropTypes.bool,
      onVisibleChange: PropTypes.func,
      getContainer: PropTypes.oneOfType([PropTypes.func, PropTypes.looseBool, PropTypes.string]),
    }).loose,
  ]).def(true),
};
type ImageStatus = 'normal' | 'error' | 'loading';

const mergeDefaultValue = <T extends object>(obj: T, defaultValues: object): T => {
  const res = { ...obj };
  Object.keys(defaultValues).forEach(key => {
    if (obj[key] === undefined) {
      res[key] = defaultValues[key];
    }
  });
  return res;
};
let uuid = 0;
const ImageInternal = defineComponent({
  name: 'Image',
  inheritAttrs: false,
  props: imageProps,
  emits: ['click'],
  setup(props, { attrs, slots, emit }) {
    const prefixCls = computed(() => props.prefixCls);
    const previewPrefixCls = computed(() => `${prefixCls.value}-preview`);
    const preview = computed(() => {
      const defaultValues = {
        visible: undefined,
        onVisibleChange: () => {},
        getContainer: undefined,
      };
      return typeof props.preview === 'object'
        ? mergeDefaultValue(props.preview, defaultValues)
        : defaultValues;
    });
    const isCustomPlaceholder = computed(
      () => (props.placeholder && props.placeholder !== true) || slots.placeholder,
    );
    const previewVisible = computed(() => preview.value.visible);
    const onPreviewVisibleChange = computed(() => preview.value.onVisibleChange);
    const getPreviewContainer = computed(() => preview.value.getContainer);

    const isControlled = computed(() => previewVisible.value !== undefined);
    const isShowPreview = ref(!!previewVisible.value);
    watch(previewVisible, () => {
      isShowPreview.value = !!previewVisible.value;
    });
    watch(isShowPreview, (val, preVal) => {
      onPreviewVisibleChange.value(val, preVal);
    });
    const status = ref<ImageStatus>(isCustomPlaceholder.value ? 'loading' : 'normal');
    watch(
      () => props.src,
      () => {
        status.value = isCustomPlaceholder.value ? 'loading' : 'normal';
      },
    );
    const mousePosition = ref<null | { x: number; y: number }>(null);
    const isError = computed(() => status.value === 'error');
    const groupContext = context.inject();
    const {
      isPreviewGroup,
      setCurrent,
      setShowPreview: setGroupShowPreview,
      setMousePosition: setGroupMousePosition,
      registerImage,
    } = groupContext;
    const currentId = ref(uuid++);
    const canPreview = computed(() => props.preview && !isError.value);
    const onLoad = () => {
      status.value = 'normal';
    };
    const onError = () => {
      status.value = 'error';
    };

    const onPreview: MouseEventHandler = e => {
      if (!isControlled.value) {
        const { left, top } = getOffset(e.target);
        if (isPreviewGroup.value) {
          setCurrent(currentId.value);
          setGroupMousePosition({
            x: left,
            y: top,
          });
        } else {
          mousePosition.value = {
            x: left,
            y: top,
          };
        }
      }
      if (isPreviewGroup.value) {
        setGroupShowPreview(true);
      } else {
        isShowPreview.value = true;
      }
      emit('click', e);
    };

    const onPreviewClose = () => {
      isShowPreview.value = false;
      if (!isControlled.value) {
        mousePosition.value = null;
      }
    };

    const img = ref<HTMLImageElement>(null);
    watch(
      () => img,
      () => {
        if (status.value !== 'loading') return;
        if (img.value.complete && (img.value.naturalWidth || img.value.naturalHeight)) {
          onLoad();
        }
      },
    );
    let unRegister = () => {};
    onMounted(() => {
      watch(
        [() => props.src, canPreview],
        () => {
          unRegister();
          if (!isPreviewGroup.value) {
            return () => {};
          }

          unRegister = registerImage(currentId.value, props.src);

          if (!canPreview.value) {
            unRegister();
          }
        },
        { flush: 'post', immediate: true },
      );
    });
    const toSizePx = (l: number | string) => {
      if (isNumber(l)) return l + 'px';
      return l;
    };
    return () => {
      const { prefixCls, wrapperClassName, fallback, src, preview, placeholder, wrapperStyle } =
        props;
      const {
        width,
        height,
        crossorigin,
        decoding,
        alt,
        sizes,
        srcset,
        usemap,
        class: cls,
        style,
      } = attrs as ImgHTMLAttributes;
      const wrappperClass = cn(prefixCls, wrapperClassName, {
        [`${prefixCls}-error`]: isError.value,
      });
      const mergedSrc = isError.value && fallback ? fallback : src;
      const previewMask = slots.previewMask && slots.previewMask();
      const imgCommonProps = {
        crossorigin,
        decoding,
        alt,
        sizes,
        srcset,
        usemap,
        class: cn(
          `${prefixCls}-img`,
          {
            [`${prefixCls}-img-placeholder`]: placeholder === true,
          },
          cls,
        ),
        style: {
          height,
          ...(style as CSSProperties),
        },
      };
      return (
        <>
          <div
            class={wrappperClass}
            onClick={
              preview && !isError.value
                ? onPreview
                : e => {
                    emit('click', e);
                  }
            }
            style={{
              width: toSizePx(width),
              height: toSizePx(height),
              ...wrapperStyle,
            }}
          >
            <img
              {...imgCommonProps}
              {...(isError.value && fallback
                ? {
                    src: fallback,
                  }
                : { onLoad, onError, src })}
              ref={img}
            />

            {status.value === 'loading' && (
              <div aria-hidden="true" class={`${prefixCls}-placeholder`}>
                {placeholder || (slots.placeholder && slots.placeholder())}
              </div>
            )}
            {/* Preview Click Mask */}
            {previewMask && canPreview.value && (
              <div class={`${prefixCls}-mask`}>{previewMask}</div>
            )}
          </div>
          {!isPreviewGroup.value && canPreview.value && (
            <Preview
              aria-hidden={!isShowPreview.value}
              visible={isShowPreview.value}
              prefixCls={previewPrefixCls.value}
              onClose={onPreviewClose}
              mousePosition={mousePosition.value}
              src={mergedSrc}
              alt={alt}
              getContainer={getPreviewContainer.value}
            />
          )}
        </>
      );
    };
  },
});
ImageInternal.PreviewGroup = PreviewGroup;

export default ImageInternal as typeof ImageInternal & {
  readonly PreviewGroup: typeof PreviewGroup;
};
