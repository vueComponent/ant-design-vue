<script>
import Basic from './basic';
import ButtonGroup from './button-group';
import Disabled from './disabled';
import Ghost from './ghost';
import Icon from './icon';
import Loading from './loading';
import Multiple from './multiple';
import Size from './size';
import Block from './block';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
const md = {
  cn: `# Button 按钮
          按钮用于开始一个即时操作。
          ## 何时使用
          标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。
          ## 组件注册
          \`\`\`js
          import { Button } from 'ant-design-vue';
          Vue.use(Button);
          \`\`\`
          ## 代码演示`,
  us: `# Button
          To trigger an operation.
          ## When To Use
          A button means an operation (or a series of operations). Clicking a button will trigger corresponding business logic.
          ## Component Registration
          \`\`\`js
          import { Button } from 'ant-design-vue';
          Vue.use(Button);
          \`\`\`
          ## Examples
          `,
};
export default {
  category: 'Components',
  type: 'General',
  zhType: '通用',
  title: 'Button',
  subtitle: '按钮',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <ButtonGroup />
        <Disabled />
        <Ghost />
        <Icon />
        <Loading />
        <Multiple />
        <Size />
        <Block />
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
[id^='components-button-demo-'] .ant-btn {
  margin-right: 8px;
  margin-bottom: 12px;
}
[id^='components-button-demo-'] .ant-btn-group > .ant-btn {
  margin-right: 0;
}
</style>
