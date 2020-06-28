import { inject } from 'vue';
import PropTypes from '../_util/vue-types';
import { getComponent, initDefaultProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';
import StatisticNumber from './Number';

export const StatisticProps = {
  prefixCls: PropTypes.string,
  decimalSeparator: PropTypes.string,
  groupSeparator: PropTypes.string,
  format: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  valueStyle: PropTypes.any,
  valueRender: PropTypes.any,
  formatter: PropTypes.any,
  precision: PropTypes.number,
  prefix: PropTypes.any,
  suffix: PropTypes.any,
  title: PropTypes.any,
  onFinish: PropTypes.func,
};

export default {
  name: 'AStatistic',
  props: initDefaultProps(StatisticProps, {
    decimalSeparator: '.',
    groupSeparator: ',',
  }),

  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },

  render() {
    const { prefixCls: customizePrefixCls, value = 0, valueStyle, valueRender } = this.$props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('statistic', customizePrefixCls);

    const title = getComponent(this, 'title');
    let prefix = getComponent(this, 'prefix');
    let suffix = getComponent(this, 'suffix');
    const formatter = getComponent(this, 'formatter', {}, false);
    const props = {
      ...this.$props,
      prefixCls,
      value,
      formatter,
    };
    let valueNode = <StatisticNumber {...props} />;
    if (valueRender) {
      valueNode = valueRender(valueNode);
    }

    return (
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
};
