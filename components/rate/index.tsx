import { inject, defineComponent, VNode } from 'vue';
import omit from 'omit.js';
import PropTypes from '../_util/vue-types';
import { getOptionProps, getComponent } from '../_util/props-util';
import { defaultConfigProvider } from '../config-provider';
import VcRate from '../vc-rate';
import StarFilled from '@ant-design/icons-vue/StarFilled';
import Tooltip from '../tooltip';
import { withInstall } from '../_util/type';

export const RateProps = {
  prefixCls: PropTypes.string,
  count: PropTypes.number,
  value: PropTypes.number,
  defaultValue: PropTypes.number,
  allowHalf: PropTypes.looseBool,
  allowClear: PropTypes.looseBool,
  tooltips: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.looseBool,
  character: PropTypes.any,
  autofocus: PropTypes.looseBool,
};

const Rate = defineComponent({
  name: 'ARate',
  props: RateProps,
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  methods: {
    characterRender(node: VNode, { index }) {
      const { tooltips } = this.$props;
      if (!tooltips) return node;
      return <Tooltip title={tooltips[index]}>{node}</Tooltip>;
    },
    focus() {
      (this.$refs.refRate as HTMLUListElement).focus();
    },
    blur() {
      (this.$refs.refRate as HTMLUListElement).blur();
    },
  },
  render() {
    const { prefixCls: customizePrefixCls, ...restProps } = getOptionProps(this);
    const { getPrefixCls } = this.configProvider;
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
});

export default withInstall(Rate);
