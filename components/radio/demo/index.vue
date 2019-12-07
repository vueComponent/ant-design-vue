<script>
import Basic from './basic';
import Disabled from './disabled';
import RadioButton from './radioButton';
import RadioGroupMore from './radioGroup-more';
import RadioGroupOptions from './radioGroup-options';
import RadioGroupWithName from './radioGroup-with-name';
import RadioGroup from './radioGroup';
import RadioButtonSolid from './radioButton-solid';

import Size from './size';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# 单选框
  单选框。

## 何时使用

- 用于在多个备选项中选中单个状态。
- 和 Select 的区别是，Radio 所有选项默认可见，方便用户在比较中选择，因此选项不宜过多。
        ## 代码演示`,
  us: `# Radio
  Radio.

## When To Use

- Used to select a single state from multiple options.
- The difference from Select is that Radio is visible to the user and can facilitate the comparison of choice, which means there shouldn't be too many of them.
  ## Examples
  `,
};
export default {
  category: 'Components',
  subtitle: '单选框',
  type: 'Data Entry',
  title: 'Radio',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <Disabled />
        <RadioButton />
        <RadioButtonSolid />
        <RadioGroupMore />
        <RadioGroupOptions />
        <RadioGroupWithName />
        <RadioGroup />
        <Size />
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
