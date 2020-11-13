import padEnd from 'lodash-es/padEnd';
import { defineComponent, PropType, VNodeTypes } from 'vue';
import { FormatConfig, valueType } from './utils';

import initDefaultProps from '../_util/props-util/initDefaultProps';
interface NumberProps extends FormatConfig {
  value: valueType;
}
import PropTypes from '../_util/vue-types';
import { countdownValueType } from './utils';
export const NumberProps = {
  prefixCls: PropTypes.string,
  decimalSeparator: PropTypes.string,
  groupSeparator: PropTypes.string,
  format: PropTypes.string,
  value: {
    type: [String, Number, Object] as PropType<countdownValueType>,
  },

  valueRender: PropTypes.any,
  formatter: PropTypes.any,
  precision: PropTypes.number,
};
const StatisticNumber = defineComponent({
  inheritAttrs: false,
  props: initDefaultProps(NumberProps, {}),
  render() {
    const {
      value,
      formatter,
      precision,
      decimalSeparator,
      groupSeparator = '',
      prefixCls,
    } = this.$props;
    let valueNode: VNodeTypes;
    if (typeof formatter === 'function') {
      // Customize formatter
      valueNode = formatter({ value });
    } else {
      // Internal formatter
      const val = String(value);
      const cells = val.match(/^(-?)(\d*)(\.(\d+))?$/);
      // Process if illegal number
      if (!cells) {
        valueNode = val;
      } else {
        const negative = cells[1];
        let int = cells[2] || '0';
        let decimal = cells[4] || '';

        int = int.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
        if (typeof precision === 'number') {
          decimal = padEnd(decimal, precision, '0').slice(0, precision);
        }

        if (decimal) {
          decimal = `${decimalSeparator}${decimal}`;
        }

        valueNode = [
          <span key="int" class={`${prefixCls}-content-value-int`}>
            {negative}
            {int}
          </span>,
          decimal && (
            <span key="decimal" class={`${prefixCls}-content-value-decimal`}>
              {decimal}
            </span>
          ),
        ];
      }
    }
    return <span class={`${prefixCls}-content-value`}>{valueNode}</span>;
  },
});
export default StatisticNumber;
