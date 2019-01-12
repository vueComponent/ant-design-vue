import PropTypes from '../_util/vue-types';
import LazyRenderBox from './LazyRenderBox';

export default {
  props: {
    hiddenClassName: PropTypes.string.def(''),
    prefixCls: PropTypes.string,
    visible: PropTypes.bool,
  },
  render() {
    const { prefixCls, visible, hiddenClassName } = this.$props;
    const { $listeners } = this;
    const divProps = {
      on: $listeners,
    };

    return (
      <div {...divProps} class={!visible ? hiddenClassName : ''}>
        <LazyRenderBox class={`${prefixCls}-content`} visible={visible}>
          {this.$slots.default}
        </LazyRenderBox>
      </div>
    );
  },
};
