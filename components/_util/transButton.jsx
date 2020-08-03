/**
 * Wrap of sub component which need use as Button capacity (like Icon component).
 * This helps accessibility reader to tread as a interactive button to operation.
 */
import KeyCode from './KeyCode';
import PropTypes from './vue-types';

const inlineStyle = {
  border: 0,
  background: 'transparent',
  padding: 0,
  lineHeight: 'inherit',
  display: 'inline-block',
};

const TransButton = {
  name: 'TransButton',
  inheritAttrs: false,
  props: {
    noStyle: PropTypes.bool,
    onClick: PropTypes.func,
  },

  methods: {
    onKeyDown(event) {
      const { keyCode } = event;
      if (keyCode === KeyCode.ENTER) {
        event.preventDefault();
      }
    },

    onKeyUp(event) {
      const { keyCode } = event;
      if (keyCode === KeyCode.ENTER) {
        this.$emit('click', event);
      }
    },

    setRef(btn) {
      this.$refs.div = btn;
    },

    focus() {
      if (this.$refs.div) {
        this.$refs.div.focus();
      }
    },

    blur() {
      if (this.$refs.div) {
        this.$refs.div.blur();
      }
    },
  },

  render() {
    const { noStyle, onClick } = this.$props;

    return (
      <div
        role="button"
        tabindex={0}
        ref="div"
        {...this.$attrs}
        onClick={onClick}
        onKeydown={this.onKeyDown}
        onKeyup={this.onKeyUp}
        style={{ ...(!noStyle ? inlineStyle : null) }}
      >
        {this.$slots.default && this.$slots.default()}
      </div>
    );
  },
};

export default TransButton;
