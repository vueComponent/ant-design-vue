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

      if (selectorValueList.length) {
        const { label, value } = selectorValueList[0];
        return (
          <span key="value" title={toTitle(label)} class={`${prefixCls}-selection-item`}>
            {label || value}
          </span>
        );
      } else {
        return (
          <span key="placeholder" class={`${prefixCls}-selection-placeholder`}>
            {placeholder}
          </span>
        );
      }
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
