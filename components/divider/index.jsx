import PropTypes from '../_util/vue-types';
import { ConfigConsumerProps } from '../config-provider';
import Base from '../base';

const Divider = {
  name: 'ADivider',
  props: {
    prefixCls: PropTypes.string,
    type: PropTypes.oneOf(['horizontal', 'vertical', '']).def('horizontal'),
    dashed: PropTypes.bool,
    orientation: PropTypes.oneOf(['left', 'right']),
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  render() {
    const { prefixCls: customizePrefixCls, type, $slots, dashed, orientation = '' } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('divider', customizePrefixCls);
    const orientationPrefix = orientation.length > 0 ? '-' + orientation : orientation;

    const classString = {
      [prefixCls]: true,
      [`${prefixCls}-${type}`]: true,
      [`${prefixCls}-with-text${orientationPrefix}`]: $slots.default,
      [`${prefixCls}-dashed`]: !!dashed,
    };

    return (
      <div class={classString}>
        {$slots.default && <span class={`${prefixCls}-inner-text`}>{$slots.default}</span>}
      </div>
    );
  },
};

/* istanbul ignore next */
Divider.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Divider.name, Divider);
};

export default Divider;
