import PreviewGroup from '../vc-image/src/PreviewGroup';
import { defineComponent, inject } from 'vue';
import { defaultConfigProvider } from '../config-provider';
import PropTypes from '../_util/vue-types';

const InternalPreviewGroup = defineComponent({
  name: 'AImagePreviewGroup',
  inheritAttrs: false,
  props: { previewPrefixCls: PropTypes.string },
  setup(props, { attrs, slots }) {
    const configProvider = inject('configProvider', defaultConfigProvider);
    return () => {
      const { getPrefixCls } = configProvider;
      const prefixCls = getPrefixCls('image-preview', props.previewPrefixCls);
      return (
        <PreviewGroup
          previewPrefixCls={prefixCls}
          {...{ ...attrs, ...props }}
          v-slots={slots}
        ></PreviewGroup>
      );
    };
  },
});
export default InternalPreviewGroup;
