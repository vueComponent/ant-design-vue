import { inject } from 'vue';
import PropTypes from '../_util/vue-types';
import { ConfigConsumerProps } from '../config-provider';
import { getSlot } from '../_util/props-util';

const Divider = {
  name: 'ADivider',
  props: {
    prefixCls: PropTypes.string,
    type: PropTypes.oneOf(['horizontal', 'vertical', '']).def('horizontal'),
    dashed: PropTypes.bool,
    orientation: PropTypes.oneOf(['left', 'right', 'center']),
  },
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  render() {
    const { prefixCls: customizePrefixCls, type, dashed, orientation = 'center' } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('divider', customizePrefixCls);
    const orientationPrefix = orientation.length > 0 ? '-' + orientation : orientation;
    const children = getSlot(this);
    const classString = {
      [prefixCls]: true,
      [`${prefixCls}-${type}`]: true,
      [`${prefixCls}-with-text${orientationPrefix}`]: children.length,
      [`${prefixCls}-dashed`]: !!dashed,
    };

    return (
      <div class={classString} role="separator">
        {!!children.length && <span class={`${prefixCls}-inner-text`}>{children}</span>}
      </div>
    );
  },
};

/* istanbul ignore next */
Divider.install = function(app) {
  app.component(Divider.name, Divider);
};

export default Divider;
