'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DateTHead = require('./DateTHead');

var _DateTHead2 = _interopRequireDefault(_DateTHead);

var _DateTBody = require('./DateTBody');

var _DateTBody2 = _interopRequireDefault(_DateTBody);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
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
      [h(_DateTHead2['default'], bodyProps), h(_DateTBody2['default'], bodyProps)]
    );
  }
};
module.exports = exports['default'];