import PropTypes from '../../_util/vue-types';
import KeyCode from '../../_util/KeyCode';
import { getSlot } from '../../_util/props-util';

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
        tabindex={0}
        ref={setRef}
        style={sentinelStyle}
        onKeydown={this.onKeyDown}
        role="presentation"
      >
        {getSlot(this)}
      </div>
    );
  },
};
