<script>
import Basic from './basic';
import Checkable from './checkable';
import Colorful from './colorful';
import Control from './control';
import HotTags from './hot-tags';
import Controlled from './controlled';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# 标签 Tag

    进行标记和分类的小标签。

## 何时使用

- 用于标记事物的属性和维度。
- 进行分类。

    ## 代码演示`,
  us: `# Tag

    Tag for categorizing or markup.

## When To Use

- It can be used to tag by dimension or property.

- When categorizing.
    ## Examples `,
};
export default {
  category: 'Components',
  subtitle: '标签',
  type: 'Data Display',
  title: 'Tag',
  render() {
    return (
      <div id="components-tag-demo">
        <md cn={md.cn} us={md.us} />
        <Basic />
        <Checkable />
        <Colorful />
        <Control />
        <HotTags />
        <Controlled />
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
<style>
#components-tag-demo .ant-tag {
  margin-bottom: 8px;
}
</style>
