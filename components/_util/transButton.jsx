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
  props: {
    noStyle: PropTypes.bool,
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
      this.div = btn;
    },

    focus() {
      if (this.div) {
        this.div.focus();
      }
    },

    blur() {
      if (this.div) {
        this.div.blur();
      }
    },
  },

  render() {
    const { noStyle } = this.$props;

    return (
      <div
        role="button"
        tabIndex={0}
        {...{
          directives: [
            {
              name: 'ant-ref',
              value: this.setRef,
            },
          ],
          on: {
            ...this.$listeners,
            keydown: this.onKeyDown,
            keyup: this.onKeyUp,
          },
        }}
        style={{ ...(!noStyle ? inlineStyle : null) }}
      >
        {this.$slots.default}
      </div>
    );
  },
};

export default TransButton;
