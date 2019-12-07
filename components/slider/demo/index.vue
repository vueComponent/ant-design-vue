<script>
import Basic from './basic.md';
import InputNumber from './input-number.md';
import IconSlider from './icon-slider.md';
import TipFormatter from './tip-formatter.md';
import Event from './event.md';
import Mark from './mark.md';
import Vertical from './vertical.md';
import ShowTooltip from './show-tooltip.md';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# Slider 滑动输入条
  滑动型输入器，展示当前值和可选范围。
  ## 何时使用
  当用户需要在数值区间/自定义区间内进行选择时，可为连续或离散值。
            ## 代码演示`,
  us: `# Slider
  A Slider component for displaying current value and intervals in range.
  # When To Use
  To input a value in a range.
  ## Examples
  `,
};
export default {
  category: 'Components',
  subtitle: '滑动输入条',
  type: 'Data Entry',
  title: 'Slider',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <InputNumber />
        <IconSlider />
        <TipFormatter />
        <Event />
        <Mark />
        <Vertical />
        <ShowTooltip />
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
