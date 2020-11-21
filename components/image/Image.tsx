import cn from '../_util/classNames';
import { getOffset } from '../vc-util/Dom/css';
export type GetContainer = string | HTMLElement | (() => HTMLElement);
import Preview, { MouseEventHandler } from './Preview';
import {
  VNode,
  ImgHTMLAttributes,
  CSSProperties,
  ref,
  watch,
  defineComponent,
  inject,
  computed,
} from 'vue';
import PropTypes from '../_util/vue-types';
import { initDefaultProps } from '../_util/props-util';
import { defaultConfigProvider } from '../config-provider';
import BaseMixin from '../_util/BaseMixin';

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
  placeholder?: VNode | boolean;
  fallback?: string;
  preview?: boolean | ImagePreviewType;
  /**
   * @deprecated since version 3.2.1
   */
  onPreviewClose?: (value: boolean, prevValue: boolean) => void;
  onClick?: (e: MouseEvent) => void;
}
export const ImageProps = {
  src: PropTypes.string,
  wrapperClassName: PropTypes.string,
  wrapperStyle: PropTypes.style,
  prefixCls: PropTypes.string,
  previewPrefixCls: PropTypes.string,
  placeholder: PropTypes.oneOf([PropTypes.looseBool, PropTypes.VNodeChild]),
  fallback: PropTypes.string,
  preview: PropTypes.looseBool.def(true),
  /**
   * @deprecated since version 3.2.1
   */
  onPreviewClose: PropTypes.func,
  onClick: PropTypes.func,
};
type ImageStatus = 'normal' | 'error' | 'loading';
//
const ImageInternal = defineComponent({
  name: 'AImage',
  mixins: [BaseMixin],
  props: initDefaultProps(ImageProps, {}),
  setup(props, { attrs, slots }) {
    const {
      onPreviewClose: onInitialPreviewClose,
      fallback,
      preview,
      onClick,
      wrapperClassName,
      wrapperStyle,
      ...otherProps
    } = props;

    const configProvider = inject('configProvider', defaultConfigProvider);

    const { getPrefixCls } = configProvider;
    const prefixCls = getPrefixCls('image', props.prefixCls);
    const previewPrefixCls = `${prefixCls}-preview`;

    const {
      width,
      height,
      style,
      crossorigin,
      // Img
      decoding,
      // loading,
      alt,
      // referrerPolicy,

      sizes,
      srcset,
      usemap,
    } = attrs as ImgHTMLAttributes;
    const isCustomPlaceholder =
      (props.placeholder && props.placeholder !== true) || slots.placeholder;
    const {
      visible = undefined,
      onVisibleChange = onInitialPreviewClose,
      getContainer = undefined,
    } = typeof preview === 'object' ? preview : {};
    const isControlled = visible !== undefined;

    const isShowPreview = ref(visible);
    watch(
      () => visible,
      (val, old) => {
        onVisibleChange(val, old);
      },
    );
    const status = ref<ImageStatus>(isCustomPlaceholder ? 'loading' : 'normal');

    const mousePosition = ref<null | { x: number; y: number }>(null);
    const isError = computed(() => status.value === 'error');

    const onLoad = () => {
      status.value = 'normal';
    };

    const onError = () => {
      status.value = 'error';
    };

    const onPreview: MouseEventHandler = e => {
      if (!isControlled) {
        const { left, top } = getOffset(e.target);

        mousePosition.value = {
          x: left,
          y: top,
        };
      }
      isShowPreview.value = true;
      if (onClick) onClick(e);
    };

    const onPreviewClose = () => {
      isShowPreview.value = false;
      if (!isControlled) {
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

    watch(
      () => props.src,
      (val, old) => {
        if (isCustomPlaceholder && val != old) status.value = 'loading';
      },
    );
    // React.useEffect(() => {
    //     if (isCustomPlaceholder) {
    //         setStatus('loading');
    //     }
    // }, [src]);

    const wrappperClass = cn(prefixCls, wrapperClassName, {
      [`${prefixCls}-error`]: isError.value,
    });

    //const mergedSrc = computed(() => isError.value && fallback ? fallback : props.src);
    const imgCommonProps = {
      crossorigin,
      decoding,
      //  loading,
      // referrerPolicy,
      alt,
      sizes,
      srcset,
      usemap,
      className: cn(
        `${prefixCls}-img`,
        {
          [`${prefixCls}-img-placeholder`]: props.placeholder === true,
        },
        props.class,
      ),
      style: {
        height,
        ...(style as CSSProperties),
      },
    };
    return () => (
      <div
        class={wrappperClass}
        onClick={preview && !isError.value ? onPreview : onClick}
        style={{
          width: width,
          height: height,
          ...wrapperStyle,
        }}
        {...otherProps}
      >
        {isError.value && fallback ? (
          <img {...imgCommonProps} src={fallback} />
        ) : (
          <img {...imgCommonProps} onLoad={onLoad} onError={onError} src={props.src} ref={img} />
        )}

        {status.value === 'loading' && (
          //此处缺少一种 placeholder ===true的逻辑
          <div aria-hidden="true" class={`${prefixCls}-placeholder`}>
            {slots.placeholder
              ? slots.placeholder()
              : props.placeholder !== true && props.placeholder()}
          </div>
        )}

        {preview && !isError.value && (
          <Preview
            aria-hidden={!isShowPreview.value}
            visible={isShowPreview.value}
            prefixCls={previewPrefixCls}
            onClose={onPreviewClose}
            mousePosition={mousePosition.value}
            src={props.src}
            alt={alt}
            getContainer={getContainer}
          />
        )}
      </div>
    );
  },
});

export default ImageInternal;
