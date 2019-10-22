<script>
import IconDisplay from '@/site/theme/template/IconDisplay';
import Basic from './basic.md';
import Custom from './custom.md';
import Iconfont from './iconfont.md';
import Twotone from './two-tone.md';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
const md = {
  cn: `# 图标 Icon
        语义化的矢量图形。
## 设计师专属
安装 [Kitchen Sketch 插件 �](https://kitchen.alipay.com)，就可以一键拖拽使用 Ant Design 和 Iconfont 的海量图标，还可以关联自有项目。
## 图标列表
> 点击图标即可复制代码。
新版图标可能略有缺失，我们还在持续补充中。
      `,
  us: `# Icon
        Semantic vector graphics.
## List of icons
> Click the icon and copy the code.
We are still adding two-tone icons right now.
      `,
};
export default {
  category: 'Components',
  type: 'General',
  zhType: '通用',
  title: 'Icon',
  subtitle: '图标',
  render() {
    return (
      <div>
        <md class="api-container" cn={md.cn} us={md.us} />
        <IconDisplay class="markdown" />
        <Basic />
        <Custom />
        <Iconfont />
        <Twotone />
        <api>
          <CN slot="cn" />
          <US />
        </api>
      </div>
    );
  },
};
</script>
