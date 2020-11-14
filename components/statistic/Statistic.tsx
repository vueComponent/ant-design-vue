import { defineComponent, inject, PropType } from 'vue';
import PropTypes from '../_util/vue-types';
import { getComponent } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import { defaultConfigProvider } from '../config-provider';
import StatisticNumber from './Number';
import { countdownValueType } from './utils';

export const StatisticProps = {
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
};

export default defineComponent({
  name: 'AStatistic',
  props: initDefaultProps(StatisticProps, {
    decimalSeparator: '.',
    groupSeparator: ',',
  }),

  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },

  render() {
    const { prefixCls: customizePrefixCls, value = 0, valueStyle, valueRender } = this.$props;
    const { getPrefixCls } = this.configProvider;
    const prefixCls = getPrefixCls('statistic', customizePrefixCls);

    const title = getComponent(this, 'title');
    const prefix = getComponent(this, 'prefix');
    const suffix = getComponent(this, 'suffix');
    const formatter = getComponent(this, 'formatter', {}, false);
    const props = {
      ...this.$props,
      prefixCls,
      value,
      formatter,
    };
    // data-for-update just for update component
    // https://github.com/vueComponent/ant-design-vue/pull/3170
    let valueNode = <StatisticNumber data-for-update={Date.now()} {...props} />;
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
});
