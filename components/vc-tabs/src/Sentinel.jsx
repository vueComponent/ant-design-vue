import PropTypes from '../../_util/vue-types';
import KeyCode from '../../_util/KeyCode';

const sentinelStyle = { width: 0, height: 0, overflow: 'hidden', position: 'absolute' };
export default {
  name: 'Sentinel',
  props: {
    setRef: PropTypes.func,
    prevElement: PropTypes.any,
    nextElement: PropTypes.any,
  },
  methods: {
    onKeyDown({ target, which, shiftKey }) {
      const { nextElement, prevElement } = this.$props;
      if (which !== KeyCode.TAB || document.activeElement !== target) return;

      // Tab next
      if (!shiftKey && nextElement) {
        nextElement.focus();
      }

      // Tab prev
      if (shiftKey && prevElement) {
        prevElement.focus();
      }
    },
  },
  render() {
    const { setRef } = this.$props;

    return (
      <div
        tabIndex={0}
        {...{
          directives: [
            {
              name: 'ant-ref',
              value: setRef,
            },
          ],
        }}
        style={sentinelStyle}
        onKeydown={this.onKeyDown}
        role="presentation"
      >
        {this.$slots.default}
      </div>
    );
  },
};
