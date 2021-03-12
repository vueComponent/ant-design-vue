<script>
import Basic from './basic.md';
import Async from './async.md';
import Form from './form.md';
import Prefix from './prefix.md';
import Readonly from './readonly.md';
import Placement from './placement.md';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# Mentions提及 (版本：1.5.0+)
          提及组件。
## 何时使用
- 用于在输入中提及某人或某事，常用于发布、聊天或评论功能。

          ## 代码演示`,
  us: `# Mentions (Version: 1.5.0+)
      Mention component.
## When To Use
- When need to mention someone or something.
## Examples `,
};
export default {
  category: 'Components',
  subtitle: '提及',
  type: 'Data Entry',
  title: 'Mentions',

  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <demo-sort>
          <Basic />
          <Async />
          <Form />
          <Prefix />
          <Readonly />
          <Placement />
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
