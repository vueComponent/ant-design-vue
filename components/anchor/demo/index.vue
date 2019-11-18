<script>
import Basic from './basic';
import Static from './static';
import OnClick from './onClick';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
const md = {
  cn: `# Anchor 锚点
          用于跳转到页面指定位置。

## 何时使用

需要展现当前页面上可供跳转的锚点链接，以及快速在锚点之间跳转。
          ## 代码演示`,
  us: `# Anchor

Hyperlinks to scroll on one page.

## When To Use

For displaying anchor hyperlinks on page and jumping between them.
## Examples
`,
};
export default {
  category: 'Components',
  subtitle: '锚点',
  cols: 2,
  type: 'Other',
  zhType: '其他',
  title: 'Anchor',
  render() {
    return (
      <div id="components-anchor-demo">
        <md cn={md.cn} us={md.us} />
        <Basic />
        <Static />
        <OnClick />
        <api>
          <CN slot="cn" />
          <US />
        </api>
      </div>
    );
  },
};
</script>
<style>
#components-anchor-demo .ant-affix {
  z-index: 11;
}
</style>
