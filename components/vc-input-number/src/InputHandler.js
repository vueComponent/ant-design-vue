import PropTypes from '../../_util/vue-types';
import Touchable from '../../vc-m-feedback';
import { getSlot } from '../../_util/props-util';

const InputHandler = {
  name: 'InputHandler',
  inheritAttrs: false,
  props: {
    prefixCls: PropTypes.string,
    disabled: PropTypes.looseBool,
  },
  render() {
    const { prefixCls, disabled } = this.$props;
    const touchableProps = {
      disabled,
      activeClassName: `${prefixCls}-handler-active`,
    };
    return (
      <Touchable {...touchableProps}>
        <span {...this.$attrs}>{getSlot(this)}</span>
      </Touchable>
    );
  },
};

export default InputHandler;
