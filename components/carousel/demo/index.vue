<script>
import Basic from './basic';
import Fade from './fade';
import Autoplay from './autoplay';
import Vertical from './vertical';
import CustomPaging from './customPaging';
import CustomArrows from './customArrows';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

import '../style';

const md = {
  cn: `# Carousel 走马灯
        旋转木马，一组轮播的区域。
       ## 何时使用

      - 当有一组平级的内容。
      - 当内容空间不足时，可以用走马灯的形式进行收纳，进行轮播展现。
      - 常用于一组图片或卡片轮播。
       ## 代码演示
        `,
  us: `# Carousel
          A carousel component. Scales with its container.
       ## When To Use

      - When there is a group of content on the same level.
      - When there is insufficient content space, it can be used to save space in the form of a revolving door.
      - Commonly used for a group of pictures/cards.
       ## Examples
        `,
};
export default {
  category: 'Components',
  type: 'Data Display',
  zhType: '数据展示',
  title: 'Carousel',
  subtitle: '走马灯',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <Vertical />
        <Fade />
        <Autoplay />
        <CustomPaging />
        <CustomArrows />
        <api>
          <CN slot="cn" />
          <US />
        </api>
      </div>
    );
  },
};
</script>
