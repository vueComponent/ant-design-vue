import PropTypes from '../../_util/vue-types';
import Touchable from '../../vc-m-feedback';

const InputHandler = {
  props: {
    prefixCls: PropTypes.string,
    disabled: PropTypes.bool,
  },
  render() {
    const { prefixCls, disabled } = this.$props;
    const touchableProps = {
      props: {
        disabled,
        activeClassName: `${prefixCls}-handler-active`,
      },
      on: this.$listeners,
    };
    return (
      <Touchable {...touchableProps}>
        <span>{this.$slots.default}</span>
      </Touchable>
    );
  },
};

export default InputHandler;
