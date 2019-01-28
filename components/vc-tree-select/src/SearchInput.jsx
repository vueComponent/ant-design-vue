/**
 * Since search box is in different position with different mode.
 * - Single: in the popup box
 * - multiple: in the selector
 * Move the code as a SearchInput for easy management.
 */

import PropTypes from '../../_util/vue-types';
import { createRef } from './util';

const SearchInput = {
  name: 'SearchInput',
  props: {
    open: PropTypes.bool,
    searchValue: PropTypes.string,
    prefixCls: PropTypes.string,
    disabled: PropTypes.bool,
    renderPlaceholder: PropTypes.func,
    needAlign: PropTypes.bool,
    ariaId: PropTypes.string,
  },
  inject: {
    vcTreeSelect: { default: () => ({}) },
  },

  created() {
    this.inputRef = createRef();
    this.mirrorInputRef = createRef();
    this.prevProps = { ...this.$props };
  },
  mounted() {
    this.$nextTick(() => {
      const { open, needAlign } = this.$props;
      if (needAlign) {
        this.alignInputWidth();
      }

      if (open) {
        this.focus(true);
      }
    });
  },

  updated() {
    const { open, searchValue, needAlign } = this.$props;
    const { prevProps } = this;
    this.$nextTick(() => {
      if (open && prevProps.open !== open) {
        this.focus();
      }
      if (needAlign && searchValue !== prevProps.searchValue) {
        this.alignInputWidth();
      }
      this.prevProps = { ...this.$props };
    });
  },
  methods: {
    /**
     * `scrollWidth` is not correct in IE, do the workaround.
     * ref: https://github.com/react-component/tree-select/issues/65
     *  clientWidth 0 when mounted in vue. why?
     */
    alignInputWidth() {
      this.inputRef.current.style.width = `${this.mirrorInputRef.current.clientWidth ||
        this.mirrorInputRef.current.offsetWidth}px`;
    },

    /**
     * Need additional timeout for focus cause parent dom is not ready when didMount trigger
     */
    focus(isDidMount) {
      if (this.inputRef.current) {
        if (isDidMount) {
          setTimeout(() => {
            this.inputRef.current.focus();
          }, 0);
        } else {
          // set it into else, Avoid scrolling when focus
          this.inputRef.current.focus();
        }
      }
    },

    blur() {
      if (this.inputRef.current) {
        this.inputRef.current.blur();
      }
    },
  },

  render() {
    const { searchValue, prefixCls, disabled, renderPlaceholder, open, ariaId } = this.$props;
    const {
      vcTreeSelect: { onSearchInputChange, onSearchInputKeyDown },
    } = this;
    return (
      <span class={`${prefixCls}-search__field__wrap`}>
        <input
          type="text"
          {...{
            directives: [
              {
                name: 'ant-ref',
                value: this.inputRef,
              },
            ],
          }}
          onInput={onSearchInputChange}
          onKeydown={onSearchInputKeyDown}
          value={searchValue}
          disabled={disabled}
          class={`${prefixCls}-search__field`}
          aria-label="filter select"
          aria-autocomplete="list"
          aria-controls={open ? ariaId : undefined}
          aria-multiline="false"
        />
        <span
          {...{
            directives: [
              {
                name: 'ant-ref',
                value: this.mirrorInputRef,
              },
            ],
          }}
          class={`${prefixCls}-search__field__mirror`}
        >
          {searchValue}&nbsp;
        </span>
        {renderPlaceholder ? renderPlaceholder() : null}
      </span>
    );
  },
};

export default SearchInput;
