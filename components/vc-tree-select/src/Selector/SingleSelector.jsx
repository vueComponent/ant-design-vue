import generateSelector, { selectorPropTypes } from '../Base/BaseSelector';
import { toTitle } from '../util';
import { getOptionProps } from '../../../_util/props-util';
import { createRef } from '../util';
import SearchInput from '../SearchInput';
const Selector = generateSelector('single');

const SingleSelector = {
  name: 'SingleSelector',
  inheritAttrs: false,
  props: selectorPropTypes(),
  created() {
    this.selectorRef = createRef();
    this.inputRef = createRef();
  },
  data() {
    return {
      mirrorSearchValue: this.searchValue,
    };
  },
  watch: {
    searchValue(val) {
      this.mirrorSearchValue = val;
    },
  },
  methods: {
    onPlaceholderClick() {
      this.inputRef.current.focus();
    },
    focus() {
      this.selectorRef.current.focus();
    },
    blur() {
      this.selectorRef.current.blur();
    },
    _renderPlaceholder() {
      const { prefixCls, placeholder, searchPlaceholder, selectorValueList } = this.$props;

      const currentPlaceholder = placeholder || searchPlaceholder;

      if (!currentPlaceholder) return null;

      const hidden = this.mirrorSearchValue || selectorValueList.length;

      // [Legacy] Not remove the placeholder
      return (
        <span
          style={{
            display: hidden ? 'none' : 'block',
          }}
          onClick={this.onPlaceholderClick}
          class={`${prefixCls}-selection-placeholder`}
        >
          {currentPlaceholder}
        </span>
      );
    },
    onMirrorSearchValueChange(value) {
      this.mirrorSearchValue = value;
    },
    renderSelection() {
      const { selectorValueList, prefixCls } = this.$props;
      const selectedValueNodes = [];
      if (selectorValueList.length && !this.mirrorSearchValue) {
        const { label, value } = selectorValueList[0];
        selectedValueNodes.push(
          <span key={value} title={toTitle(label)} class={`${prefixCls}-selection-item`}>
            {label || value}
          </span>,
        );
      }
      selectedValueNodes.push(
        <SearchInput
          {...this.$props}
          {...this.$attrs}
          ref={this.inputRef}
          isMultiple={false}
          onMirrorSearchValueChange={this.onMirrorSearchValueChange}
        />,
      );
      return selectedValueNodes;
    },
  },

  render() {
    const props = {
      ...getOptionProps(this),
      ...this.$attrs,
      renderSelection: this.renderSelection,
      renderPlaceholder: this._renderPlaceholder,
      ref: this.selectorRef,
    };
    return <Selector {...props} />;
  },
};

export default SingleSelector;
