import PreviewGroup from '../vc-image/src/PreviewGroup';
import { computed, defineComponent } from 'vue';
import useConfigInject from '../_util/hooks/useConfigInject';

const InternalPreviewGroup = defineComponent({
  name: 'AImagePreviewGroup',
  inheritAttrs: false,
  props: { previewPrefixCls: String },
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
