'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BadgeProps = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _ScrollNumber = require('./ScrollNumber');

var _ScrollNumber2 = _interopRequireDefault(_ScrollNumber);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propsUtil = require('../_util/props-util');

var _getTransitionProps = require('../_util/getTransitionProps');

var _getTransitionProps2 = _interopRequireDefault(_getTransitionProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var BadgeProps = exports.BadgeProps = {
  /** Number to show in badge */
  count: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].string, null]),
  showZero: _vueTypes2['default'].bool,
  /** Max count to show */
  overflowCount: _vueTypes2['default'].number,
  /** whether to show red dot without number */
  dot: _vueTypes2['default'].bool,
  prefixCls: _vueTypes2['default'].string,
  scrollNumberPrefixCls: _vueTypes2['default'].string,
  status: _vueTypes2['default'].oneOf(['success', 'processing', 'default', 'error', 'warning']),
  text: _vueTypes2['default'].string,
  offset: _vueTypes2['default'].array,
  numberStyle: _vueTypes2['default'].object.def({})
};

exports['default'] = {
  name: 'ABadge',
  props: (0, _propsUtil.initDefaultProps)(BadgeProps, {
    prefixCls: 'ant-badge',
    scrollNumberPrefixCls: 'ant-scroll-number',
    count: null,
    showZero: false,
    dot: false,
    overflowCount: 99
  }),

  render: function render() {
    var _classNames, _classNames2, _classNames3;

    var h = arguments[0];
    var count = this.count,
        showZero = this.showZero,
        prefixCls = this.prefixCls,
        scrollNumberPrefixCls = this.scrollNumberPrefixCls,
        overflowCount = this.overflowCount,
        dot = this.dot,
        status = this.status,
        text = this.text,
        offset = this.offset,
        $slots = this.$slots,
        numberStyle = this.numberStyle;

    var displayCount = count > overflowCount ? overflowCount + '+' : count;
    var isZero = displayCount === '0' || displayCount === 0;
    var isDot = dot && !isZero || status;
    // dot mode don't need count
    if (isDot) {
      displayCount = '';
    }
    var children = (0, _propsUtil.filterEmpty)($slots['default']);
    var isEmpty = displayCount === null || displayCount === undefined || displayCount === '';
    var hidden = (isEmpty || isZero && !showZero) && !isDot;
    var statusCls = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-status-dot', !!status), (0, _defineProperty3['default'])(_classNames, prefixCls + '-status-' + status, !!status), _classNames));
    var scrollNumberCls = (0, _classnames2['default'])((_classNames2 = {}, (0, _defineProperty3['default'])(_classNames2, prefixCls + '-dot', isDot), (0, _defineProperty3['default'])(_classNames2, prefixCls + '-count', !isDot), (0, _defineProperty3['default'])(_classNames2, prefixCls + '-multiple-words', !isDot && count && count.toString && count.toString().length > 1), (0, _defineProperty3['default'])(_classNames2, prefixCls + '-status-' + status, !!status), _classNames2));
    var badgeCls = (0, _classnames2['default'])(prefixCls, (_classNames3 = {}, (0, _defineProperty3['default'])(_classNames3, prefixCls + '-status', !!status), (0, _defineProperty3['default'])(_classNames3, prefixCls + '-not-a-wrapper', !children.length), _classNames3));
    var styleWithOffset = offset ? (0, _extends3['default'])({
      marginTop: offset[0],
      marginLeft: offset[1]
    }, numberStyle) : numberStyle;
    // <Badge status="success" />

    if (!children.length && status) {
      return h(
        'span',
        { 'class': badgeCls, style: styleWithOffset },
        [h('span', { 'class': statusCls }), h(
          'span',
          { 'class': prefixCls + '-status-text' },
          [text]
        )]
      );
    }

    var scrollNumber = hidden ? null : h(_ScrollNumber2['default'], {
      attrs: {
        prefixCls: scrollNumberPrefixCls,

        count: displayCount,
        title: count
      },
      directives: [{
        name: 'show',
        value: !hidden
      }],

      'class': scrollNumberCls, style: styleWithOffset
    });

    var statusText = hidden || !text ? null : h(
      'span',
      { 'class': prefixCls + '-status-text' },
      [text]
    );
    var transitionProps = (0, _getTransitionProps2['default'])(children.length ? prefixCls + '-zoom' : '');

    return h(
      'span',
      { 'class': badgeCls },
      [children, h(
        'transition',
        transitionProps,
        [scrollNumber]
      ), statusText]
    );
  }
};