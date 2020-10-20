import PropTypes from '../../../_util/vue-types';
import BasePopup from '../Base/BasePopup';
import SearchInput from '../SearchInput';
import { createRef } from '../util';

const SinglePopup = {
  name: 'SinglePopup',
  inheritAttrs: false,
  props: {
    ...BasePopup.props,
    ...SearchInput.props,
    searchValue: PropTypes.string,
    showSearch: PropTypes.looseBool,
    dropdownPrefixCls: PropTypes.string,
    disabled: PropTypes.looseBool,
    searchPlaceholder: PropTypes.string,
  },
  created() {
    this.inputRef = createRef();
    this.searchRef = createRef();
    this.popupRef = createRef();
  },
  methods: {
    onPlaceholderClick() {
      this.inputRef.current.focus();
    },
    getTree() {
      return this.popupRef.current && this.popupRef.current.getTree();
    },
    _renderPlaceholder() {
      const { searchPlaceholder, searchValue, prefixCls } = this.$props;

      if (!searchPlaceholder) {
        return null;
      }

      return (
        <span
          style={{
            display: searchValue ? 'none' : 'block',
          }}
          onClick={this.onPlaceholderClick}
          class={`${prefixCls}-selection-placeholder`}
        >
          {searchPlaceholder}
        </span>
      );
    },

    _renderSearch() {
      const { showSearch, dropdownPrefixCls } = this.$props;

      if (!showSearch) {
        return null;
      }

      return (
        <span class={`${dropdownPrefixCls}-search`} ref={this.searchRef}>
          <SearchInput
            {...{ ...this.$props, ...this.$attrs, renderPlaceholder: this._renderPlaceholder }}
            ref={this.inputRef}
          />
        </span>
      );
    },
  },
  render() {
    return (
      <BasePopup
        {...{
          ...this.$props,
          ...this.$attrs,
          renderSearch: this._renderSearch,
        }}
        ref={this.popupRef}
        __propsSymbol__={[]}
      />
    );
  },
};

export default SinglePopup;
