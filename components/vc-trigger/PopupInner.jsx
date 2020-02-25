import PropTypes from '../_util/vue-types';
import LazyRenderBox from './LazyRenderBox';
import { getListeners } from '../_util/props-util';

export default {
  props: {
    hiddenClassName: PropTypes.string.def(''),
    prefixCls: PropTypes.string,
    visible: PropTypes.bool,
  },
  render() {
    const { prefixCls, visible, hiddenClassName } = this.$props;
    const divProps = {
      on: getListeners(this),
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
