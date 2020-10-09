import { Component, CSSProperties, defineComponent, inject, PropType, VNodeTypes } from 'vue';
import { defaultConfigProvider } from '../config-provider';
import { getComponentFromSetup } from '../_util/props-util';
import StatisticNumber from './Number';

export const StatisticProps = {
  decimalSeparator: { type: String, default: '.' },
  formatter: {
    type: Function as PropType<(params: { value: string | number | object }) => VNodeTypes>,
  },
  groupSeparator: { type: String, default: ',' },
  precision: { type: Number },
  prefix: { type: String },
  suffix: { type: String },
  title: { type: String },
  value: { type: [String, Number, Object], default: 0 },
  valueStyle: { type: Object as PropType<CSSProperties> },
  prefixCls: { type: String },
  valueRender: { type: Function as PropType<(node: VNodeTypes) => VNodeTypes> },
};

const Statistic = defineComponent({
  name: 'AStatistic',
  props: StatisticProps,
  setup(props, { slots }) {
    const configProvider = inject('configProvider', defaultConfigProvider);
    const { prefixCls: customizePrefixCls, value, valueStyle } = props;
    const getPrefixCls = configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('statistic', customizePrefixCls);

    const title = getComponentFromSetup(props, slots, 'title') as VNodeTypes;
    const prefix = getComponentFromSetup(props, slots, 'prefix') as VNodeTypes;
    const suffix = getComponentFromSetup(props, slots, 'suffix') as VNodeTypes;

    let formatter: VNodeTypes = undefined;
    if (typeof props.formatter === 'function') {
      formatter = props.formatter({ value });
    } else if (typeof slots['formatter'] === 'function') {
      formatter = slots['formatter']({ value });
    }

    // const formatter = getComponentFromSetup(props, slots, 'formatter', { value }) as VNodeTypes;

    let valueNode = <StatisticNumber {...{ ...props, prefixCls, value, formatter }} />;
    if (props.valueRender) {
      valueNode = props.valueRender(valueNode);
    }
    return () => (
      <div class={prefixCls}>
        {title && <div class={`${prefixCls}-title`}>{title}</div>}
        <div style={valueStyle} class={`${prefixCls}-content`}>
          {prefix && <span class={`${prefixCls}-content-prefix`}>{prefix}</span>}
          {valueNode}
          {suffix && <span class={`${prefixCls}-content-suffix`}>{suffix}</span>}
        </div>
      </div>
    );
  },
});
export default Statistic;

export type StatisticPropsType = Parameters<typeof Statistic['setup']>['0'];
