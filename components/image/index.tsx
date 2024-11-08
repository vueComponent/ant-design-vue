import type { App, ExtractPropTypes, ImgHTMLAttributes, Plugin } from 'vue';
import { defineComponent, computed } from 'vue';
import ImageInternal from '../vc-image';
import { imageProps } from '../vc-image/src/Image';
import defaultLocale from '../locale/en_US';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import PreviewGroup, { icons } from './PreviewGroup';
import EyeOutlined from '@ant-design/icons-vue/EyeOutlined';
import { getTransitionName } from '../_util/transition';
import useStyle from './style';
import classNames from '../_util/classNames';
export type ImageProps = Partial<
  ExtractPropTypes<ReturnType<typeof imageProps>> &
    Omit<ImgHTMLAttributes, 'placeholder' | 'onClick'>
>;
const Image = defineComponent({
  name: 'AImage',
  inheritAttrs: false,
  props: imageProps(),
  setup(props, { slots, attrs }) {
    const { prefixCls, rootPrefixCls, configProvider } = useConfigInject('image', props);
    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const mergedPreview = computed(() => {
      const { preview } = props;

      if (preview === false) {
        return preview;
      }
      const _preview = typeof preview === 'object' ? preview : {};

      return {
        icons,
        ..._preview,
        transitionName: getTransitionName(rootPrefixCls.value, 'zoom', _preview.transitionName),
        maskTransitionName: getTransitionName(
          rootPrefixCls.value,
          'fade',
          _preview.maskTransitionName,
        ),
      };
    });

    return () => {
      const imageLocale = configProvider.locale?.value?.Image || defaultLocale.Image;
      const defaultPreviewMask = () => (
        <div class={`${prefixCls.value}-mask-info`}>
          <EyeOutlined />
          {imageLocale?.preview}
        </div>
      );
      const { previewMask = slots.previewMask || defaultPreviewMask } = props;
      return wrapSSR(
        <ImageInternal
          {...{ ...attrs, ...props, prefixCls: prefixCls.value }}
          preview={mergedPreview.value}
          rootClassName={classNames(props.rootClassName, hashId.value)}
          v-slots={{
            ...slots,
            previewMask: typeof previewMask === 'function' ? previewMask : null,
          }}
        ></ImageInternal>,
      );
    };
  },
});

export { imageProps };

Image.PreviewGroup = PreviewGroup;

Image.install = function (app: App) {
  app.component(Image.name, Image);
  app.component(Image.PreviewGroup.name, Image.PreviewGroup);
  return app;
};

export { PreviewGroup as ImagePreviewGroup };

export default Image as typeof Image &
  Plugin & {
    readonly PreviewGroup: typeof PreviewGroup;
  };
