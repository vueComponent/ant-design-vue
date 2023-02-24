import type { PreviewGroupPreview } from '../vc-image/src/PreviewGroup';
import PreviewGroup from '../vc-image/src/PreviewGroup';
import { computed, defineComponent } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';

import RotateLeftOutlined from '@ant-design/icons-vue/RotateLeftOutlined';
import RotateRightOutlined from '@ant-design/icons-vue/RotateRightOutlined';
import ZoomInOutlined from '@ant-design/icons-vue/ZoomInOutlined';
import ZoomOutOutlined from '@ant-design/icons-vue/ZoomOutOutlined';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import LeftOutlined from '@ant-design/icons-vue/LeftOutlined';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import useStyle from './style';
import { anyType } from '../_util/type';

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
  props: { previewPrefixCls: String, preview: anyType<boolean | PreviewGroupPreview>() },
  setup(props, { attrs, slots }) {
    const { prefixCls } = useConfigInject('image', props);
    const previewPrefixCls = computed(() => `${prefixCls.value}-preview`);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const mergedPreview = computed(() => {
      const { preview } = props;
      if (preview === false) {
        return preview;
      }
      const _preview = typeof preview === 'object' ? preview : {};

      return {
        ..._preview,
        rootClassName: hashId.value,
      };
    });
    return () => {
      return wrapSSR(
        <PreviewGroup
          {...{ ...attrs, ...props }}
          preview={mergedPreview.value}
          icons={icons}
          previewPrefixCls={previewPrefixCls.value}
          v-slots={slots}
        ></PreviewGroup>,
      );
    };
  },
});
export default InternalPreviewGroup;
