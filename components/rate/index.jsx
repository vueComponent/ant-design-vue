import PropTypes from '../_util/vue-types';
import { initDefaultProps, getOptionProps, getComponentFromProp } from '../_util/props-util';
import VcRate from '../vc-rate';
import Icon from '../icon';

export const RateProps = {
  prefixCls: PropTypes.string,
  count: PropTypes.number,
  value: PropTypes.value,
  defaultValue: PropTypes.value,
  allowHalf: PropTypes.bool,
  allowClear: PropTypes.bool,
  disabled: PropTypes.bool,
  character: PropTypes.any,
  autoFocus: PropTypes.bool,
};

const Rate = {
  name: 'ARate',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: initDefaultProps(RateProps, {
    prefixCls: 'ant-rate',
  }),
  methods: {
    focus() {
      this.$refs.refRate.focus();
    },
    blur() {
      this.$refs.refRate.blur();
    },
  },
  render() {
    const character = getComponentFromProp(this, 'character') || (
      <Icon type="star" theme="filled" />
    );
    const rateProps = {
      props: {
        character,
        ...getOptionProps(this),
      },
      on: this.$listeners,
      ref: 'refRate',
    };
    return <VcRate {...rateProps} />;
  },
};

/* istanbul ignore next */
Rate.install = function(Vue) {
  Vue.component(Rate.name, Rate);
};
export default Rate;
