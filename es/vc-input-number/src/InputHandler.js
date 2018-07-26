import PropTypes from '../../_util/vue-types';
import Touchable from '../../vc-m-feedback';

var InputHandler = {
  props: {
    prefixCls: PropTypes.string,
    disabled: PropTypes.bool
  },
  render: function render() {
    var h = arguments[0];
    var _$props = this.$props,
        prefixCls = _$props.prefixCls,
        disabled = _$props.disabled;

    var touchableProps = {
      props: {
        disabled: disabled,
        activeClassName: prefixCls + '-handler-active'
      },
      on: this.$listeners
    };
    var spanProps = {
      attrs: this.$attrs
    };
    return h(
      Touchable,
      touchableProps,
      [h(
        'span',
        spanProps,
        [this.$slots['default']]
      )]
    );
  }
};

export default InputHandler;