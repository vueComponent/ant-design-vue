import type { App, Plugin } from 'vue';
import { defineComponent, inject } from 'vue';
import { defaultConfigProvider } from '../config-provider';
import ImageInternal from '../vc-image';
import type { ImagePropsType } from '../vc-image/src/Image';
import { ImageProps } from '../vc-image/src/Image';

import PreviewGroup from './PreviewGroup';
const Image = defineComponent({
  name: 'AImage',
  inheritAttrs: false,
  props: ImageProps,
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

export type { ImagePropsType };

export { ImageProps };

Image.PreviewGroup = PreviewGroup;

Image.install = function (app: App) {
  app.component(Image.name, Image);
  app.component(Image.PreviewGroup.name, Image.PreviewGroup);
  return app;
};

export default Image as typeof Image &
  Plugin & {
    readonly PreviewGroup: typeof PreviewGroup;
  };
