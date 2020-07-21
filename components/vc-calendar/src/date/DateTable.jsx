import DateTHead from './DateTHead';
import DateTBody from './DateTBody';

const DateTable = (_, { attrs }) => {
  const prefixCls = attrs.prefixCls;
  return (
    <table class={`${prefixCls}-table`} cellSpacing="0" role="grid">
      <DateTHead {...attrs} />
      <DateTBody {...attrs} />
    </table>
  );
};

DateTable.inheritAttrs = false;

export default DateTable;
