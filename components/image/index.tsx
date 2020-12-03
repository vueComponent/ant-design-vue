import { App, defineComponent, Plugin } from 'vue';
import ImageInternal from '../vc-image';
import { ImageProps, ImagePropsType } from '../vc-image/src/Image';

import { initDefaultProps } from '../_util/props-util';

import PreviewGroup from './PreviewGroup';
const Image = defineComponent({
  name: 'AImage',
  props: initDefaultProps(ImageProps, {}),
  emits: ['click'],
  render() {
    return (
      <ImageInternal
        {...{ ...this.$attrs, ...this.$props, ...this.$emit }}
        v-slots={this.$slots}
      ></ImageInternal>
    );
  },
});

export { ImageProps, ImagePropsType };

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
