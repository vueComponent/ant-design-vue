import PreviewGroup from '../vc-image/src/PreviewGroup';
import { computed, defineComponent, inject } from 'vue';
import { defaultConfigProvider } from '../config-provider';
import PropTypes from '../_util/vue-types';

const InternalPreviewGroup = defineComponent({
  name: 'AImagePreviewGroup',
  inheritAttrs: false,
  props: { previewPrefixCls: PropTypes.string },
  setup(props, { attrs, slots }) {
    const configProvider = inject('configProvider', defaultConfigProvider);
    const prefixCls = computed(() =>
      configProvider.getPrefixCls('image-preview', props.previewPrefixCls),
    );
    return () => {
      return (
        <PreviewGroup
          {...{ ...attrs, ...props }}
          previewPrefixCls={prefixCls.value}
          v-slots={slots}
        ></PreviewGroup>
      );
    };
  },
});
export default InternalPreviewGroup;
