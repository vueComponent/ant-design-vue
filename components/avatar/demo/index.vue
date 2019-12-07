<script>
import Basic from './basic';
import Badge from './badge';
import Type from './type';
import Dynamic from './dynamic';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# Avatar头像
          用来代表用户或事物，支持图片、图标或字符展示。
          ## 设计师专属
安装 [Kitchen Sketch 插件 �](https://kitchen.alipay.com)，一键填充高逼格头像和文本.

          ## 代码演示`,
  us: `# Avatar
          Avatars can be used to represent people or objects. It supports images, 'Icon's, or letters.
          ## Examples
          `,
};
export default {
  category: 'Components',
  subtitle: '头像',
  type: 'Data Display',
  zhType: '数据展示',
  title: 'Avatar',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <br />
        <Badge />
        <br />
        <Type />
        <br />
        <Dynamic />
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
