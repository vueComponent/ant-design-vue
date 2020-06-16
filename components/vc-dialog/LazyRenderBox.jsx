import PropTypes from '../_util/vue-types';
import { getSlot } from '../_util/props-util';

const ILazyRenderBoxPropTypes = {
  visible: PropTypes.bool,
  hiddenClassName: PropTypes.string,
  forceRender: PropTypes.bool,
};

export default {
  props: ILazyRenderBoxPropTypes,
  render() {
    return <div>{getSlot(this)}</div>;
  },
};
