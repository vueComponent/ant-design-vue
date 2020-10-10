import { CSSProperties, defineComponent, inject, PropType, VNodeTypes, computed } from 'vue';
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

export type StatisticPropsType = Parameters<typeof Statistic['setup']>['0'];

const Statistic = defineComponent({
  name: 'AStatistic',
  props: StatisticProps,
  setup(props, { slots }) {
    const configProvider = inject('configProvider', defaultConfigProvider);

    const getPrefixCls = configProvider.getPrefixCls;
    const prefixCls = computed(() => getPrefixCls('statistic', props.prefixCls));
    const title = computed(() => getComponentFromSetup(props, slots, 'title') as VNodeTypes);
    const prefix = computed(() => getComponentFromSetup(props, slots, 'prefix') as VNodeTypes);
    const suffix = computed(() => getComponentFromSetup(props, slots, 'suffix') as VNodeTypes);

    let formatter: VNodeTypes = undefined;
    if (typeof props.formatter === 'function') {
      formatter = props.formatter({ value: props.value });
    } else if (typeof slots['formatter'] === 'function') {
      formatter = slots['formatter']({ value: props.value });
    }

    return () => {
      const valueNode = (
        <StatisticNumber {...{ ...props, prefixCls: prefixCls.value, formatter }} />
      );

      return (
        <div class={prefixCls.value}>
          {title.value && <div class={`${prefixCls.value}-title`}>{title.value}</div>}
          <div style={props.valueStyle} class={`${prefixCls.value}-content`}>
            {prefix.value && (
              <span class={`${prefixCls.value}-content-prefix`}>{prefix.value}</span>
            )}
            {props.valueRender ? props.valueRender(valueNode) : valueNode}
            {suffix.value && (
              <span class={`${prefixCls.value}-content-suffix`}>{suffix.value}</span>
            )}
          </div>
        </div>
      );
    };
  },
});

export default Statistic;
