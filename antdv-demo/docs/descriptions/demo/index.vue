<script>
import Basic from './basic.md';
import Border from './border.md';
import Responsive from './responsive.md';
import Size from './size.md';
import VerticalBorder from './vertical-border.md';
import Vertical from './vertical.md';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# Descriptions 描述列表 (版本: 1.5.0+)
        成组展示多个只读字段。
       ## 何时使用
        常见于详情页的信息展示。
       ## 代码演示
        `,
  us: `# Descriptions (Version: 1.5.0+)
        Display multiple read-only fields in groups.
       ## When To Use
        Commonly displayed on the details page.
       ## Examples
        `,
};
export default {
  category: 'Components',
  type: 'Data Display',
  zhType: '数据展示',
  title: 'Descriptions',
  subtitle: '描述列表',
  cols: 1,
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <demo-sort cols={1}>
          <Basic />
          <Border />
          <Size />
          <Responsive />
          <Vertical />
          <VerticalBorder />
        </demo-sort>
        <api>
          <CN slot="cn" />
          <US />
        </api>
      </div>
    );
  },
};
</script>
