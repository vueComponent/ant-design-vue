<script>
import Basic from './basic';
import Colors from './colors';
import Size from './size';
import Alpha from './alpha';
import Hue from './hue';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# ColorPicker 颜色选择器 (测试版)

      用于颜色选择，支持多种颜色格式，支持颜色预设。

      ## 代码演示
      `,
  us: `# ColorPicker (Beta)

      For color selection, support for multiple color formats and color presets.

      ## Examples
      `,
};

export default {
  category: 'Components',
  subtitle: '取色器',
  type: 'DataEntry',
  title: 'ColorPicker',
  cols: 1,
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <demo-sort cols={2}>
          <Basic />
          <Alpha />
          <Hue />
          <Colors />
          <Size />
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
