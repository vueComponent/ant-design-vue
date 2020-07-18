import generateSelector, { selectorPropTypes } from '../Base/BaseSelector';
import { toTitle } from '../util';
import { getOptionProps } from '../../../_util/props-util';
import { createRef } from '../util';
const Selector = generateSelector('single');

const SingleSelector = {
  name: 'SingleSelector',
  inheritAttrs: false,
  props: selectorPropTypes(),
  created() {
    this.selectorRef = createRef();
  },
  methods: {
    focus() {
      this.selectorRef.current.focus();
    },
    blur() {
      this.selectorRef.current.blur();
    },
    renderSelection() {
      const { selectorValueList, placeholder, prefixCls } = this.$props;

      let innerNode;

      if (selectorValueList.length) {
        const { label, value } = selectorValueList[0];
        innerNode = (
          <span key="value" title={toTitle(label)} class={`${prefixCls}-selection-selected-value`}>
            {label || value}
          </span>
        );
      } else {
        innerNode = (
          <span key="placeholder" class={`${prefixCls}-selection__placeholder`}>
            {placeholder}
          </span>
        );
      }

      return <span class={`${prefixCls}-selection__rendered`}>{innerNode}</span>;
    },
  },

  render() {
    const props = {
      ...getOptionProps(this),
      ...this.$attrs,
      renderSelection: this.renderSelection,
      ref: this.selectorRef,
    };
    return <Selector {...props} />;
  },
};

export default SingleSelector;
