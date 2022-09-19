import type { ExtractPropTypes, PropType } from 'vue';
import { defineComponent } from 'vue';

type widthUnit = number | string;
export const skeletonParagraphProps = () => ({
  prefixCls: String,
  width: { type: [Number, String, Array] as PropType<widthUnit[] | widthUnit> },
  rows: Number,
});

export type SkeletonParagraphProps = Partial<
  ExtractPropTypes<ReturnType<typeof skeletonParagraphProps>>
>;

const SkeletonParagraph = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'SkeletonParagraph',
  props: skeletonParagraphProps(),
  setup(props) {
    const getWidth = (index: number) => {
      const { width, rows = 2 } = props;
      if (Array.isArray(width)) {
        return width[index];
      }
      // last paragraph
      if (rows - 1 === index) {
        return width;
      }
      return undefined;
    };
    return () => {
      const { prefixCls, rows } = props;
      const rowList = [...Array(rows)].map((_, index) => {
        const width = getWidth(index);
        return (
          <li key={index} style={{ width: typeof width === 'number' ? `${width}px` : width }} />
        );
      });
      return <ul class={prefixCls}>{rowList}</ul>;
    };
  },
});

export default SkeletonParagraph;
