<script>
import Horizontal from './horizontal';
import Vertical from './vertical';
import Orientation from './orientation';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
const md = {
  cn: `# 分割线
        区隔内容的分割线。
        ## 何时使用
        - 对不同章节的文本段落进行分割。
        - 对行内文字/链接进行分割，例如表格的操作列。

        ## 代码演示`,
  us: `# Divider
      A divider line separates different content.
      ## When To Use
      - Divide sections of article.
      - Divide inline text and links such as the operation column of table.
      ## Examples 
      `,
};
export default {
  category: 'Components',
  type: 'Other',
  zhType: '其他',
  title: 'Divider',
  subtitle: '分割线',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Vertical />
        <Horizontal />
        <Orientation />
        <api>
          <CN slot="cn" />
          <US />
        </api>
      </div>
    );
  },
};
</script>
