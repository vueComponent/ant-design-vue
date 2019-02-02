import PropTypes from '../../_util/vue-types';
import { getComponentFromProp } from '../../_util/props-util';
import Sentinel from './Sentinel';

export default {
  name: 'TabPane',
  props: {
    active: PropTypes.bool,
    destroyInactiveTabPane: PropTypes.bool,
    forceRender: PropTypes.bool,
    placeholder: PropTypes.any,
    rootPrefixCls: PropTypes.string,
    tab: PropTypes.any,
    closable: PropTypes.bool,
    disabled: PropTypes.bool,
  },
  inject: {
    sentinelContext: { default: () => ({}) },
  },
  render() {
    const { destroyInactiveTabPane, active, forceRender, rootPrefixCls } = this.$props;
    const children = this.$slots.default;
    const placeholder = getComponentFromProp(this, 'placeholder');
    this._isActived = this._isActived || active;
    const prefixCls = `${rootPrefixCls}-tabpane`;
    const cls = {
      [prefixCls]: 1,
      [`${prefixCls}-inactive`]: !active,
      [`${prefixCls}-active`]: active,
    };
    const isRender = destroyInactiveTabPane ? active : this._isActived;
    const shouldRender = isRender || forceRender;
    const {
      sentinelStart,
      sentinelEnd,
      setPanelSentinelStart,
      setPanelSentinelEnd,
    } = this.sentinelContext;
    let panelSentinelStart;
    let panelSentinelEnd;
    if (active && shouldRender) {
      panelSentinelStart = <Sentinel setRef={setPanelSentinelStart} prevElement={sentinelStart} />;
      panelSentinelEnd = <Sentinel setRef={setPanelSentinelEnd} nextElement={sentinelEnd} />;
    }
    return (
      <div class={cls} role="tabpanel" aria-hidden={active ? 'false' : 'true'}>
        {panelSentinelStart}
        {shouldRender ? children : placeholder}
        {panelSentinelEnd}
      </div>
    );
  },
};
