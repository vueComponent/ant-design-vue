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
import { isNumber } from 'lodash-es';

import BaseMixin from '../../_util/BaseMixin';
import cn from '../../_util/classNames';
import PropTypes from '../../_util/vue-types';
import { initDefaultProps } from '../../_util/props-util';
import { getOffset } from '../../vc-util/Dom/css';

import { defaultConfigProvider } from '../../config-provider';
import Preview, { MouseEventHandler } from './Preview';

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
  placeholder?: VNode | boolean;
  fallback?: string;
  preview?: boolean | ImagePreviewType;
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
};
type ImageStatus = 'normal' | 'error' | 'loading';

const ImageInternal = defineComponent({
  name: 'Image',
  mixins: [BaseMixin],
  props: initDefaultProps(ImageProps, {}),
  emits: ['click'],
  setup(props: ImagePropsType, { attrs, slots, emit }) {
    const configProvider = inject('configProvider', defaultConfigProvider);
    const { getPrefixCls } = configProvider;
    const prefixCls = getPrefixCls('image', props.prefixCls);
    const previewPrefixCls = `${prefixCls}-preview`;
    const {
      width,
      height,
      style,
      crossorigin,
      decoding,
      alt,
      sizes,
      srcset,
      usemap,
    } = attrs as ImgHTMLAttributes;

    const isCustomPlaceholder =
      (props.placeholder && props.placeholder !== true) || slots.placeholder;
    const { visible = undefined, getContainer = undefined } =
      typeof props.preview === 'object' ? props.preview : {};
    const isControlled = visible !== undefined;
    const isShowPreview = ref(visible);
    const status = ref<ImageStatus>(isCustomPlaceholder ? 'loading' : 'normal');
    const mousePosition = ref<null | { x: number; y: number }>(null);
    const isError = computed(() => status.value === 'error');
    const groupContext = context.inject();
    const {
      isPreviewGroup,
      previewUrls,
      setPreviewUrls,
      setCurrent,
      setShowPreview: setGroupShowPreview,
      setMousePosition: setGroupMousePosition,
    } = groupContext;
    const groupIndexRef = ref(0);
    previewUrls.push(props.src);
    const onLoad = () => {
      status.value = 'normal';
    };
    const onError = () => {
      status.value = 'error';
      if (isPreviewGroup) {
        previewUrls.splice(groupIndexRef.value);
        setPreviewUrls(previewUrls);
      }
    };

    const onPreview: MouseEventHandler = e => {
      if (!isControlled) {
        const { left, top } = getOffset(e.target);
        if (isPreviewGroup) {
          setCurrent(props.src);
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
      if (isPreviewGroup) {
        setGroupShowPreview(true);
      } else {
        isShowPreview.value = true;
      }
      emit('click', e);
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

        return () => setPreviewUrls(previewUrls.filter(url => url !== props.src));
      },
    );

    watch(
      () => previewUrls,
      () => {
        if (isPreviewGroup && previewUrls.indexOf(props.src) < 0) {
          groupIndexRef.value = previewUrls.length;
          previewUrls.push(props.src);
          setPreviewUrls(previewUrls);
        }
      },
    );
    const wrappperClass = cn(prefixCls, props.wrapperClassName, {
      [`${prefixCls}-error`]: isError.value,
    });

    const imgCommonProps = {
      crossorigin,
      decoding,
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
    const onPreviewClose = () => {
      isShowPreview.value = false;
      if (!isControlled) {
        mousePosition.value = null;
      }
    };
    const toSizePx = (l: number | string) => {
      if (isNumber(l)) return l + 'px';
      return l;
    };
    return () => (
      <div
        class={wrappperClass}
        onClick={
          props.preview && !isError.value
            ? onPreview
            : e => {
                emit('click', e);
              }
        }
        style={{
          width: toSizePx(width),
          height: toSizePx(height),
          ...props.wrapperStyle,
        }}
      >
        {isError.value && props.fallback ? (
          <img {...imgCommonProps} src={props.fallback} />
        ) : (
          <img {...imgCommonProps} onLoad={onLoad} onError={onError} src={props.src} ref={img} />
        )}

        {status.value === 'loading' && (
          //此处缺少一种 placeholder ===true的逻辑,原 ant.design 中也缺少，此处待添加
          <div aria-hidden="true" class={`${prefixCls}-placeholder`}>
            {slots.placeholder
              ? slots.placeholder()
              : props.placeholder !== true && props.placeholder}
          </div>
        )}

        {!isPreviewGroup && props.preview && !isError.value && (
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
ImageInternal.PreviewGroup = PreviewGroup;

export default ImageInternal as typeof ImageInternal & {
  readonly PreviewGroup: typeof PreviewGroup;
};
