import PropTypes from '../_util/vue-types';
import { getSlot } from '../_util/props-util';

const ILazyRenderBoxPropTypes = {
  visible: PropTypes.looseBool,
  hiddenClassName: PropTypes.string,
  forceRender: PropTypes.looseBool,
};

export default {
  props: ILazyRenderBoxPropTypes,
  render() {
    return <div>{getSlot(this)}</div>;
  },
};
