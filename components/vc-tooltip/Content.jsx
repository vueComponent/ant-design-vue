import PropTypes from '../_util/vue-types';

export default {
  name: 'Content',
  props: {
    prefixCls: PropTypes.string,
    overlay: PropTypes.any,
    trigger: PropTypes.any,
    overlayInnerStyle: PropTypes.any,
  },
  updated() {
    const { trigger } = this;
    if (trigger) {
      trigger.forcePopupAlign();
    }
  },
  render() {
    const { overlay, prefixCls, overlayInnerStyle } = this;
    return (
      <div class={`${prefixCls}-inner`} role="tooltip" style={overlayInnerStyle}>
        {typeof overlay === 'function' ? overlay() : overlay}
      </div>
    );
  },
};
