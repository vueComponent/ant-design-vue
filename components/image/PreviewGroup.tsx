import PreviewGroup from '../vc-image/src/PreviewGroup';
import { computed, defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import useConfigInject from '../_util/hooks/useConfigInject';

const InternalPreviewGroup = defineComponent({
  name: 'AImagePreviewGroup',
  inheritAttrs: false,
  props: { previewPrefixCls: PropTypes.string },
  setup(props, { attrs, slots }) {
    const { getPrefixCls } = useConfigInject('image', props);
    const prefixCls = computed(() => getPrefixCls('image-preview', props.previewPrefixCls));
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
