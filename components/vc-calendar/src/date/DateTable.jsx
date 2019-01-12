import DateTHead from './DateTHead';
import DateTBody from './DateTBody';

export default {
  functional: true,
  render(createElement, context) {
    const { props, listeners = {} } = context;
    const prefixCls = props.prefixCls;
    const bodyProps = {
      props,
      on: listeners,
    };
    return (
      <table class={`${prefixCls}-table`} cellSpacing="0" role="grid">
        <DateTHead {...bodyProps} />
        <DateTBody {...bodyProps} />
      </table>
    );
  },
};
