import type { ExtractPropTypes, PropType } from 'vue';
import { defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import StatisticNumber from './Number';
import type { countdownValueType } from './utils';
import Skeleton from '../skeleton/Skeleton';
import useConfigInject from '../_util/hooks/useConfigInject';

export const statisticProps = {
  prefixCls: PropTypes.string,
  decimalSeparator: PropTypes.string,
  groupSeparator: PropTypes.string,
  format: PropTypes.string,
  value: {
    type: [String, Number, Object] as PropType<countdownValueType>,
  },
  valueStyle: PropTypes.style,
  valueRender: PropTypes.any,
  formatter: PropTypes.any,
  precision: PropTypes.number,
  prefix: PropTypes.VNodeChild,
  suffix: PropTypes.VNodeChild,
  title: PropTypes.VNodeChild,
  onFinish: PropTypes.func,
  loading: PropTypes.looseBool,
};

export type StatisticProps = Partial<ExtractPropTypes<typeof statisticProps>>;

export default defineComponent({
  name: 'AStatistic',
  props: initDefaultProps(statisticProps, {
    decimalSeparator: '.',
    groupSeparator: ',',
    loading: false,
  }),
  slots: ['title', 'prefix', 'suffix', 'formatter'],
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
