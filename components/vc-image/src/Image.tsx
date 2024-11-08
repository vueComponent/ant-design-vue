import type { CSSProperties, PropType } from 'vue';
import { ref, watch, defineComponent, computed, onMounted, onUnmounted } from 'vue';
import isNumber from 'lodash-es/isNumber';
import cn from '../../_util/classNames';
import PropTypes from '../../_util/vue-types';
import { getOffset } from '../../vc-util/Dom/css';
import useMergedState from '../../_util/hooks/useMergedState';
import Preview from './Preview';

import type { MouseEventHandler } from '../../_util/EventInterface';
import PreviewGroup, { context } from './PreviewGroup';
import type { IDialogChildProps } from '../../vc-dialog/IDialogPropTypes';
export type GetContainer = string | HTMLElement | (() => HTMLElement);
import type { PreviewProps } from './Preview';

export type ImagePreviewType = Omit<
  IDialogChildProps,
  'mask' | 'visible' | 'closable' | 'prefixCls' | 'onClose' | 'afterClose' | 'wrapClassName'
> & {
  src?: string;
  visible?: boolean;
  onVisibleChange?: (value: boolean, prevValue: boolean) => void;
  getContainer?: GetContainer | false;
  maskClassName?: string;
  icons?: PreviewProps['icons'];
};

export const imageProps = () => ({
  src: String,
  wrapperClassName: String,
  wrapperStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  rootClassName: String,
  prefixCls: String,
  previewPrefixCls: String,
  width: [Number, String],
  height: [Number, String],
  previewMask: {
    type: [Boolean, Function] as PropType<false | (() => any)>,
    default: undefined,
  },
  placeholder: PropTypes.any,
  fallback: String,
  preview: {
    type: [Boolean, Object] as PropType<boolean | ImagePreviewType>,
    default: true as boolean | ImagePreviewType,
  },
  onClick: {
    type: Function as PropType<MouseEventHandler>,
  },
  onError: {
    type: Function as PropType<HTMLImageElement['onerror']>,
  },
});
export type ImageProps = Partial<ReturnType<typeof imageProps>>;
export type ImageStatus = 'normal' | 'error' | 'loading';

export const mergeDefaultValue = <T extends object>(obj: T, defaultValues: object): T => {
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
  compatConfig: { MODE: 3 },
  name: 'VcImage',
  inheritAttrs: false,
  props: imageProps(),
  emits: ['click', 'error'],
  setup(props, { attrs, slots, emit }) {
    const prefixCls = computed(() => props.prefixCls);
    const previewPrefixCls = computed(() => `${prefixCls.value}-preview`);
    const preview = computed<ImagePreviewType>(() => {
      const defaultValues = {
        visible: undefined,
        onVisibleChange: () => {},
        getContainer: undefined,
      };
      return typeof props.preview === 'object'
        ? mergeDefaultValue(props.preview, defaultValues)
        : defaultValues;
    });
    const src = computed(() => preview.value.src ?? props.src);
    const isCustomPlaceholder = computed(
      () => (props.placeholder && props.placeholder !== true) || slots.placeholder,
    );
    const previewVisible = computed(() => preview.value.visible);
    const getPreviewContainer = computed(() => preview.value.getContainer);
    const isControlled = computed(() => previewVisible.value !== undefined);

    const onPreviewVisibleChange = (val, preval) => {
      preview.value.onVisibleChange?.(val, preval);
    };
    const [isShowPreview, setShowPreview] = useMergedState(!!previewVisible.value, {
      value: previewVisible,
      onChange: onPreviewVisibleChange,
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
    const onError = (e: Event) => {
      status.value = 'error';
      emit('error', e);
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
        setShowPreview(true);
      }
      emit('click', e);
    };

    const onPreviewClose = () => {
      setShowPreview(false);
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
        [src, canPreview],
        () => {
          unRegister();
          if (!isPreviewGroup.value) {
            return () => {};
          }

          unRegister = registerImage(currentId.value, src.value, canPreview.value);

          if (!canPreview.value) {
            unRegister();
          }
        },
        { flush: 'post', immediate: true },
      );
    });
    onUnmounted(() => {
      unRegister();
    });
    const toSizePx = (l: number | string) => {
      if (isNumber(l)) return l + 'px';
      return l;
    };
    return () => {
      const {
        prefixCls,
        wrapperClassName,
        fallback,
        src: imgSrc,
        placeholder,
        wrapperStyle,
        rootClassName,
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
      } = { ...props, ...attrs } as any;
      const { icons, maskClassName, ...dialogProps } = preview.value;

      const wrappperClass = cn(prefixCls, wrapperClassName, rootClassName, {
        [`${prefixCls}-error`]: isError.value,
      });
      const mergedSrc = isError.value && fallback ? fallback : src.value;
      const imgCommonProps = {
        crossorigin,
        decoding,
        alt,
        sizes,
        srcset,
        usemap,
        width,
        height,
        class: cn(
          `${prefixCls}-img`,
          {
            [`${prefixCls}-img-placeholder`]: placeholder === true,
          },
          cls,
        ),
        style: {
          height: toSizePx(height),
          ...(style as CSSProperties),
        },
      };

      return (
        <>
          <div
            class={wrappperClass}
            onClick={
              canPreview.value
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
                : { onLoad, onError, src: imgSrc })}
              ref={img}
            />

            {status.value === 'loading' && (
              <div aria-hidden="true" class={`${prefixCls}-placeholder`}>
                {placeholder || (slots.placeholder && slots.placeholder())}
              </div>
            )}
            {/* Preview Click Mask */}
            {slots.previewMask && canPreview.value && (
              <div class={[`${prefixCls}-mask`, maskClassName]}>{slots.previewMask()}</div>
            )}
          </div>
          {!isPreviewGroup.value && canPreview.value && (
            <Preview
              {...dialogProps}
              aria-hidden={!isShowPreview.value}
              visible={isShowPreview.value}
              prefixCls={previewPrefixCls.value}
              onClose={onPreviewClose}
              mousePosition={mousePosition.value}
              src={mergedSrc}
              alt={alt}
              getContainer={getPreviewContainer.value}
              icons={icons}
              rootClassName={rootClassName}
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
