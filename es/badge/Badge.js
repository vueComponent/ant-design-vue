import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';

import PropTypes from '../_util/vue-types';
import ScrollNumber from './ScrollNumber';
import classNames from 'classnames';
import { initDefaultProps, filterEmpty } from '../_util/props-util';
import getTransitionProps from '../_util/getTransitionProps';

export var BadgeProps = {
  /** Number to show in badge */
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string, null]),
  showZero: PropTypes.bool,
  /** Max count to show */
  overflowCount: PropTypes.number,
  /** whether to show red dot without number */
  dot: PropTypes.bool,
  prefixCls: PropTypes.string,
  scrollNumberPrefixCls: PropTypes.string,
  status: PropTypes.oneOf(['success', 'processing', 'default', 'error', 'warning']),
  text: PropTypes.string,
  offset: PropTypes.array,
  numberStyle: PropTypes.object.def({})
};

export default {
  name: 'ABadge',
  props: initDefaultProps(BadgeProps, {
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
    var children = filterEmpty($slots['default']);
    var isEmpty = displayCount === null || displayCount === undefined || displayCount === '';
    var hidden = (isEmpty || isZero && !showZero) && !isDot;
    var statusCls = classNames((_classNames = {}, _defineProperty(_classNames, prefixCls + '-status-dot', !!status), _defineProperty(_classNames, prefixCls + '-status-' + status, !!status), _classNames));
    var scrollNumberCls = classNames((_classNames2 = {}, _defineProperty(_classNames2, prefixCls + '-dot', isDot), _defineProperty(_classNames2, prefixCls + '-count', !isDot), _defineProperty(_classNames2, prefixCls + '-multiple-words', !isDot && count && count.toString && count.toString().length > 1), _defineProperty(_classNames2, prefixCls + '-status-' + status, !!status), _classNames2));
    var badgeCls = classNames(prefixCls, (_classNames3 = {}, _defineProperty(_classNames3, prefixCls + '-status', !!status), _defineProperty(_classNames3, prefixCls + '-not-a-wrapper', !children.length), _classNames3));
    var styleWithOffset = offset ? _extends({
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

    var scrollNumber = hidden ? null : h(ScrollNumber, {
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
    var transitionProps = getTransitionProps(children.length ? prefixCls + '-zoom' : '');

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