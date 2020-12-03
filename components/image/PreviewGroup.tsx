import PreviewGroup from '../vc-image/src/PreviewGroup';

import { initDefaultProps } from '../_util/props-util';
import { defineComponent, inject } from 'vue';
import { defaultConfigProvider } from '../config-provider';

const InternalPreviewGroup = defineComponent({
  name: 'AImagePreviewGroup',
  props: initDefaultProps({ previewPrefixCls: { type: String } }, {}),
  emits: ['click'],
  setup(props, { attrs, emit, slots }) {
    const configProvider = inject('configProvider', defaultConfigProvider);
    const { getPrefixCls } = configProvider;
    const prefixCls = getPrefixCls('image-preview', props.previewPrefixCls);
    return () => (
      <PreviewGroup
        previewPrefixCls={prefixCls}
        {...{ ...attrs, ...props, ...emit }}
        v-slots={slots}
      ></PreviewGroup>
    );
  },
});
export default InternalPreviewGroup;
