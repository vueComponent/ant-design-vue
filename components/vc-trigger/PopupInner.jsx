import PropTypes from '../_util/vue-types';
import LazyRenderBox from './LazyRenderBox';

export default {
  props: {
    hiddenClassName: PropTypes.string.def(''),
    prefixCls: PropTypes.string,
    visible: PropTypes.looseBool,
  },
  render() {
    const { prefixCls, visible, hiddenClassName } = this.$props;

    return (
      <div class={!visible ? hiddenClassName : ''}>
        <LazyRenderBox class={`${prefixCls}-content`} visible={visible}>
          {this.$slots.default?.()}
        </LazyRenderBox>
      </div>
    );
  },
};
