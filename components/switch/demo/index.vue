<script>
import Basic from './basic';
import Disabled from './disabled';
import Text from './text';
import Size from './size';
import Loading from './loading';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# Switch 开关

    开关选择器。

    ## 何时使用

    - 需要表示开关状态/两种状态之间的切换时；
    - 和 \`checkbox\`的区别是，切换 \`switch\` 会直接触发状态改变，而 \`checkbox\` 一般用于状态标记，需要和提交操作配合。

    ## 代码演示`,
  us: `# Switch

    Switching Selector.

    ## When To Use

    - If you need to represent the switching between two states or on-off state.
    - The difference between \`Switch\` and \`Checkbox\` is that \`Switch\` will trigger a state change directly when you toggle it, while \`Checkbox\` is generally used for state marking, which should work in conjunction with submit operation.
    ## Examples `,
};
export default {
  category: 'Components',
  subtitle: '开关',
  type: 'Data Entry',
  title: 'Switch',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <br />
        <Disabled />
        <br />
        <Text />
        <br />
        <Size />
        <br />
        <Loading />
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
