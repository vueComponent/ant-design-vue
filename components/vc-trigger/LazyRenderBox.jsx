import { Text } from 'vue';
import PropTypes from '../_util/vue-types';
import { getSlot } from '../_util/props-util';

export default {
  name: 'LazyRenderBox',
  props: {
    visible: PropTypes.looseBool,
    hiddenClassName: PropTypes.string,
  },
  render() {
    const { hiddenClassName } = this.$props;
    const child = getSlot(this);
    if (
      hiddenClassName ||
      (child && child.length > 1) ||
      (child && child[0] && child[0].type === Text)
    ) {
      // const cls = '';
      // if (!visible && hiddenClassName) {
      //   // cls += ` ${hiddenClassName}`
      // }
      return <div>{child}</div>;
    }
    return child && child[0];
  },
};
