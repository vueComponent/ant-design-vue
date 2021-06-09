import { App, defineComponent, ExtractPropTypes, ImgHTMLAttributes, inject, Plugin } from 'vue';
import { defaultConfigProvider } from '../config-provider';
import ImageInternal from '../vc-image';
import { imageProps } from '../vc-image/src/Image';
import PreviewGroup from './PreviewGroup';

export type ImageProps = Partial<
  ExtractPropTypes<typeof imageProps> & Omit<ImgHTMLAttributes, 'placeholder' | 'onClick'>
>;
const Image = defineComponent<ImageProps>({
  name: 'AImage',
  inheritAttrs: false,
  props: imageProps as any,
  setup(props, ctx) {
    const { slots, attrs } = ctx;
    const configProvider = inject('configProvider', defaultConfigProvider);
    return () => {
      const { getPrefixCls } = configProvider;
      const prefixCls = getPrefixCls('image', props.prefixCls);
      return <ImageInternal {...{ ...attrs, ...props, prefixCls }} v-slots={slots}></ImageInternal>;
    };
  },
});

export { imageProps };

Image.PreviewGroup = PreviewGroup;

Image.install = function(app: App) {
  app.component(Image.name, Image);
  app.component(Image.PreviewGroup.name, Image.PreviewGroup);
  return app;
};

export default Image as typeof Image &
  Plugin & {
    readonly PreviewGroup: typeof PreviewGroup;
  };
