
import DateTHead from './DateTHead';
import DateTBody from './DateTBody';

export default {
  functional: true,
  render: function render(createElement, context) {
    var h = arguments[0];
    var props = context.props,
        _context$listeners = context.listeners,
        listeners = _context$listeners === undefined ? {} : _context$listeners;

    var prefixCls = props.prefixCls;
    var bodyProps = {
      props: props,
      on: listeners
    };
    return h(
      'table',
      { 'class': prefixCls + '-table', attrs: { cellSpacing: '0', role: 'grid' }
      },
      [h(DateTHead, bodyProps), h(DateTBody, bodyProps)]
    );
  }
};