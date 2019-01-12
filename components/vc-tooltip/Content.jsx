import PropTypes from '../_util/vue-types';

export default {
  props: {
    prefixCls: PropTypes.string,
    overlay: PropTypes.any,
    trigger: PropTypes.any,
  },
  updated() {
    const { trigger } = this;
    if (trigger) {
      trigger.forcePopupAlign();
    }
  },
  render() {
    const { overlay, prefixCls } = this;
    return (
      <div class={`${prefixCls}-inner`} role="tooltip">
        {typeof overlay === 'function' ? overlay() : overlay}
      </div>
    );
  },
};
