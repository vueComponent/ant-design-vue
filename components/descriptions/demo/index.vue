<script>
import Basic from './basic.md';
import Border from './border.md';
import Responsive from './responsive.md';
import Size from './size.md';
import VerticalBorder from './vertical-border.md';
import Vertical from './vertical.md';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

import '../style';

const md = {
  cn: `# Descriptions 描述列表
        成组展示多个只读字段。
       ## 何时使用
        常见于详情页的信息展示。
       ## 代码演示
        `,
  us: `# Descriptions
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
        <Basic />
        <Border />
        <Size />
        <Responsive />
        <Vertical />
        <VerticalBorder />
        <api>
          <CN slot="cn" />
          <US />
        </api>
      </div>
    );
  },
};
</script>
