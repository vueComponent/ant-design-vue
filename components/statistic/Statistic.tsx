import { defineComponent, inject, VNodeTypes, computed } from 'vue';
import { VueTypeValidableDef } from 'vue-types';
import { defaultConfigProvider } from '../config-provider';
import { getComponent } from '../_util/props-util';
import PropTypes from '../_util/vue-types';
import StatisticNumber from './Number';

export const StatisticProps = {
  decimalSeparator: PropTypes.string.def('.'),
  formatter: PropTypes.func as VueTypeValidableDef<(params: { value: unknown }) => VNodeTypes>,
  groupSeparator: PropTypes.string.def(','),
  precision: PropTypes.number,
  prefix: PropTypes.VNodeChild,
  suffix: PropTypes.VNodeChild,
  title: PropTypes.VNodeChild,
  value: PropTypes.any,
  valueStyle: PropTypes.style,
  prefixCls: PropTypes.string,
  valueRender: PropTypes.func as VueTypeValidableDef<(node: VNodeTypes) => VNodeTypes>,
};

export type StatisticPropsType = Parameters<typeof Statistic['setup']>['0'];

const Statistic = defineComponent({
  name: 'AStatistic',
  props: StatisticProps,
  setup(props) {
    const configProvider = inject('configProvider', defaultConfigProvider);
    const getPrefixCls = configProvider.getPrefixCls;
    const prefixCls = computed(() => getPrefixCls('statistic', props.prefixCls));
    return { prefixCls };
  },
  render() {
    const { prefixCls, valueStyle, valueRender, value } = this;

    const valueNode = (
      <StatisticNumber
        {...{
          ...this.$props,
          prefixCls: this.prefixCls,
          formatter: getComponent(this, 'formatter', { value }),
        }}
      />
    );

    const title = getComponent(this, 'title');
    const prefix = getComponent(this, 'prefix');
    const suffix = getComponent(this, 'suffix');

    return (
      <div class={prefixCls}>
        {title && <div class={`${prefixCls}-title`}>{title}</div>}
        <div style={valueStyle} class={`${prefixCls}-content`}>
          {prefix && <span class={`${prefixCls}-content-prefix`}>{prefix}</span>}
          {valueRender ? valueRender(valueNode) : valueNode}
          {suffix && <span class={`${prefixCls}-content-suffix`}>{suffix}</span>}
        </div>
      </div>
    );
  },
});

export default Statistic;
