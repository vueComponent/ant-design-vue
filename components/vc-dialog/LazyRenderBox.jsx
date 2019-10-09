import PropTypes from '../_util/vue-types';

const ILazyRenderBoxPropTypes = {
  visible: PropTypes.bool,
  hiddenClassName: PropTypes.string,
};

export default {
  props: ILazyRenderBoxPropTypes,
  render() {
    return <div {...{ on: this.$listeners }}>{this.$slots.default}</div>;
  },
};
