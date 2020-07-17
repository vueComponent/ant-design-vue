import { inject } from 'vue';
import omit from 'omit.js';
import PropTypes from '../_util/vue-types';
import { getOptionProps, getComponent } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';
import VcRate from '../vc-rate';
import StarFilled from '@ant-design/icons-vue/StarFilled';
import Tooltip from '../tooltip';

export const RateProps = {
  prefixCls: PropTypes.string,
  count: PropTypes.number,
  value: PropTypes.value,
  defaultValue: PropTypes.value,
  allowHalf: PropTypes.bool,
  allowClear: PropTypes.bool,
  tooltips: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  character: PropTypes.any,
  autofocus: PropTypes.bool,
};

const Rate = {
  name: 'ARate',
  props: RateProps,
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  methods: {
    characterRender(node, { index }) {
      const { tooltips } = this.$props;
      if (!tooltips) return node;
      return <Tooltip title={tooltips[index]}>{node}</Tooltip>;
    },
    focus() {
      this.$refs.refRate.focus();
    },
    blur() {
      this.$refs.refRate.blur();
    },
  },
  render() {
    const { prefixCls: customizePrefixCls, ...restProps } = getOptionProps(this);
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('rate', customizePrefixCls);

    const character = getComponent(this, 'character') || <StarFilled />;
    const rateProps = {
      character,
      characterRender: this.characterRender,
      prefixCls,
      ...omit(restProps, ['tooltips']),
      ...this.$attrs,
      ref: 'refRate',
    };
    return <VcRate {...rateProps} />;
  },
};

/* istanbul ignore next */
Rate.install = function(app) {
  app.component(Rate.name, Rate);
};
export default Rate;
