/**
 * Wrap of sub component which need use as Button capacity (like Icon component).
 * This helps accessibility reader to tread as a interactive button to operation.
 */
import KeyCode from './KeyCode';

const inlineStyle = {
  border: 0,
  background: 'transparent',
  padding: 0,
  lineHeight: 'inherit',
  display: 'inline-block',
};

const TransButton = {
  props: ['noStyle', 'className'],

  data() {
    return {
      div: null,
      lastKeyCode: null,
    };
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
      const { click } = this.$listeners;
      if (keyCode === KeyCode.ENTER && click) {
        click();
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
    const { noStyle, className, ...restProps } = this.$props;
    const { click } = this.$listeners;

    return (
      <div
        class={className}
        role="button"
        tabIndex={0}
        {...{
          directives: [
            {
              name: 'ant-ref',
              value: this.setRef,
            },
          ],
          props: restProps,
          on: {
            keydown: this.onKeyDown,
            keyup: this.onKeyUp,
            click: click,
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
