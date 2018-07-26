
function noop() {}
export default {
  functional: true,
  render: function render(createElement, context) {
    var h = arguments[0];
    var props = context.props,
        _context$listeners = context.listeners,
        listeners = _context$listeners === undefined ? {} : _context$listeners;
    var prefixCls = props.prefixCls,
        locale = props.locale,
        okDisabled = props.okDisabled;
    var _listeners$ok = listeners.ok,
        ok = _listeners$ok === undefined ? noop : _listeners$ok;

    var className = prefixCls + '-ok-btn';
    if (okDisabled) {
      className += ' ' + prefixCls + '-ok-btn-disabled';
    }
    return h(
      'a',
      { 'class': className, attrs: { role: 'button' },
        on: {
          'click': okDisabled ? noop : ok
        }
      },
      [locale.ok]
    );
  }
};