import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import StatisticNumber from './Number';
import type { valueType } from './utils';
import Skeleton from '../skeleton/Skeleton';
import useConfigInject from '../_util/hooks/useConfigInject';
import type { CustomSlotsType } from '../_util/type';

export const statisticProps = () => ({
  prefixCls: String,
  decimalSeparator: String,
  groupSeparator: String,
  format: String,
  value: {
    type: [String, Number, Object] as PropType<valueType>,
  },
  valueStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  valueRender: PropTypes.any,
  formatter: PropTypes.any,
  precision: Number,
  prefix: PropTypes.any,
  suffix: PropTypes.any,
  title: PropTypes.any,
  loading: { type: Boolean, default: undefined },
});

export type StatisticProps = Partial<ExtractPropTypes<ReturnType<typeof statisticProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AStatistic',
  props: initDefaultProps(statisticProps(), {
    decimalSeparator: '.',
    groupSeparator: ',',
    loading: false,
  }),
  slots: Object as CustomSlotsType<{
    title?: any;
    prefix?: any;
    suffix?: any;
    formatter?: any;
    default?: any;
  }>,
  setup(props, { slots }) {
    const { prefixCls, direction } = useConfigInject('statistic', props);
    return () => {
      const { value = 0, valueStyle, valueRender } = props;
      const pre = prefixCls.value;
      const title = props.title ?? slots.title?.();
      const prefix = props.prefix ?? slots.prefix?.();
      const suffix = props.suffix ?? slots.suffix?.();
      const formatter = props.formatter ?? slots.formatter;
      // data-for-update just for update component
      // https://github.com/vueComponent/ant-design-vue/pull/3170
      let valueNode = (
        <StatisticNumber
          data-for-update={Date.now()}
          {...{ ...props, prefixCls: pre, value, formatter }}
        />
      );
      if (valueRender) {
        valueNode = valueRender(valueNode);
      }
      return (
        <div class={[pre, { [`${pre}-rtl`]: direction.value === 'rtl' }]}>
          {title && <div class={`${pre}-title`}>{title}</div>}
          <Skeleton paragraph={false} loading={props.loading}>
            <div style={valueStyle} class={`${pre}-content`}>
              {prefix && <span class={`${pre}-content-prefix`}>{prefix}</span>}
              {valueNode}
              {suffix && <span class={`${pre}-content-suffix`}>{suffix}</span>}
            </div>
          </Skeleton>
        </div>
      );
    };
  },
});
