import PreviewGroup from '../vc-image/src/PreviewGroup';
import { computed, defineComponent } from 'vue';
import useConfigInject from '../_util/hooks/useConfigInject';

import RotateLeftOutlined from '@ant-design/icons-vue/RotateLeftOutlined';
import RotateRightOutlined from '@ant-design/icons-vue/RotateRightOutlined';
import ZoomInOutlined from '@ant-design/icons-vue/ZoomInOutlined';
import ZoomOutOutlined from '@ant-design/icons-vue/ZoomOutOutlined';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import LeftOutlined from '@ant-design/icons-vue/LeftOutlined';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';

export const icons = {
  rotateLeft: <RotateLeftOutlined />,
  rotateRight: <RotateRightOutlined />,
  zoomIn: <ZoomInOutlined />,
  zoomOut: <ZoomOutOutlined />,
  close: <CloseOutlined />,
  left: <LeftOutlined />,
  right: <RightOutlined />,
};

const InternalPreviewGroup = defineComponent({
  compatConfig: { MODE: 3 },
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
          icons={icons}
          previewPrefixCls={prefixCls.value}
          v-slots={slots}
        ></PreviewGroup>
      );
    };
  },
});
export default InternalPreviewGroup;
