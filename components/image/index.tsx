import { withInstall } from '../_util/type';
import ImageInternal from '../vc-image';
import { ImageProps, ImagePropsType } from '../vc-image/src/Image';

import { initDefaultProps } from '../_util/props-util';
import { defineComponent } from 'vue';

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
export default withInstall(Image);
