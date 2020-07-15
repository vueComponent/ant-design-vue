import PropTypes from '../../_util/vue-types';
import { getSlot } from '../../_util/props-util';

export default {
  name: 'PanelContent',
  props: {
    prefixCls: PropTypes.string,
    isActive: PropTypes.bool,
    destroyInactivePanel: PropTypes.bool,
    forceRender: PropTypes.bool,
    role: PropTypes.any,
  },
  data() {
    return {
      _isActive: undefined,
    };
  },
  render() {
    this._isActive = this.forceRender || this._isActive || this.isActive;
    if (!this._isActive) {
      return null;
    }
    const { prefixCls, isActive, destroyInactivePanel, forceRender, role } = this.$props;
    const contentCls = {
      [`${prefixCls}-content`]: true,
      [`${prefixCls}-content-active`]: isActive,
    };
    const child =
      !forceRender && !isActive && destroyInactivePanel ? null : (
        <div class={`${prefixCls}-content-box`}>{getSlot(this)}</div>
      );
    return (
      <div class={contentCls} role={role}>
        {child}
      </div>
    );
  },
};
