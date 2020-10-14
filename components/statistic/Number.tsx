import padEnd from 'lodash-es/padEnd';
import { FunctionalComponent, VNodeTypes } from 'vue';
import { StatisticProps, StatisticPropsType } from './Statistic';
import PropTypes from '../_util/vue-types/index';

const StatisticNumber: FunctionalComponent<Omit<StatisticPropsType, 'formatter'> & {
  formatter?: VNodeTypes;
}> = props => {
  const { formatter, value, groupSeparator, precision, decimalSeparator, prefixCls } = props;
  let valueNode: VNodeTypes;

  if (formatter) {
    valueNode = formatter;
  } else {
    const val = String(value);
    const cells = val.match(/^(-?)(\d*)(\.(\d+))?$/);
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
      valueNode = (
        <>
          <span key="int" class={`${prefixCls}-content-value-int`}>
            {negative}
            {int}
          </span>
          {decimal && (
            <span key="decimal" class={`${prefixCls}-content-value-decimal`}>
              {decimal}
            </span>
          )}
        </>
      );
    }
  }

  return <span class={`${prefixCls}-content-value`}>{valueNode}</span>;
};

StatisticNumber.props = { ...StatisticProps, formatter: PropTypes.VNodeChild };

export default StatisticNumber;
