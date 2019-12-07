<script>
import Basic from './basic';
import Editor from './editor';
import List from './list';
import Nested from './nested';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# Comment评论
对网站内容的反馈、评价和讨论。

## 何时使用

评论组件可用于对事物的讨论，例如页面、博客文章、问题等等。`,
  us: `# Comment
A comment displays user feedback and discussion to website content.

## When To Use

Comments can be used to enable discussions on an entity such as a page, blog post, issue or other.`,
};
export default {
  category: 'Components',
  type: 'Data Display',
  zhType: '数据展示',
  title: 'Comment',
  subtitle: '评论',
  cols: 1,
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <br />
        <List />
        <br />
        <Nested />
        <br />
        <Editor />
        <br />
        <api>
          <template slot="cn">
            <CN />
          </template>
          <US />
        </api>
      </div>
    );
  },
};
</script>
