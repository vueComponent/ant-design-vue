import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import StatisticNumber from './Number';
import type { valueType } from './utils';
import Skeleton from '../skeleton/Skeleton';
import useConfigInject from '../config-provider/hooks/useConfigInject';

// CSSINJS
import useStyle from './style';

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
  inheritAttrs: false,
  props: initDefaultProps(statisticProps(), {
    decimalSeparator: '.',
    groupSeparator: ',',
    loading: false,
  }),
  slots: ['title', 'prefix', 'suffix', 'formatter'],
  setup(props, { slots, attrs }) {
    const { prefixCls, direction } = useConfigInject('statistic', props);

    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);

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
      return wrapSSR(
        <div
          {...attrs}
          class={[pre, { [`${pre}-rtl`]: direction.value === 'rtl' }, attrs.class, hashId.value]}
        >
          {title && <div class={`${pre}-title`}>{title}</div>}
          <Skeleton paragraph={false} loading={props.loading}>
            <div style={valueStyle} class={`${pre}-content`}>
              {prefix && <span class={`${pre}-content-prefix`}>{prefix}</span>}
              {valueNode}
              {suffix && <span class={`${pre}-content-suffix`}>{suffix}</span>}
            </div>
          </Skeleton>
        </div>,
      );
    };
  },
});
