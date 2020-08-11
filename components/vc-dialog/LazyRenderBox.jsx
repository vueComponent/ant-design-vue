import PropTypes from '../_util/vue-types';
import { getListeners } from '../_util/props-util';

const ILazyRenderBoxPropTypes = {
  visible: PropTypes.bool,
  hiddenClassName: PropTypes.string,
  forceRender: PropTypes.bool,
};

export default {
  props: ILazyRenderBoxPropTypes,
  render() {
    console.log(111111, getListeners(this));
    return <div {...{ on: getListeners(this) }}>{this.$slots.default}</div>;
  },
};
