import PropTypes from '../_util/vue-types';
import { initDefaultProps } from '../_util/props-util';

const widthUnit = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);

const skeletonParagraphProps = {
  prefixCls: PropTypes.string,
  width: PropTypes.oneOfType([widthUnit, PropTypes.arrayOf(widthUnit)]),
  rows: PropTypes.number,
};

export const SkeletonParagraphProps = PropTypes.shape(skeletonParagraphProps);

const Paragraph = {
  props: skeletonParagraphProps,
  methods: {
    getWidth(index) {
      const { width, rows = 2 } = this;
      if (Array.isArray(width)) {
        return width[index];
      }
      // last paragraph
      if (rows - 1 === index) {
        return width;
      }
      return undefined;
    },
  },
  render() {
    const { prefixCls, rows } = this.$props;
    const rowList = [...Array(rows)].map((_, index) => {
      const width = this.getWidth(index);
      return <li key={index} style={{ width: typeof width === 'number' ? `${width}px` : width }} />;
    });
    return <ul class={prefixCls}>{rowList}</ul>;
  },
};

export default Paragraph;
