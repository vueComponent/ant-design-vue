
import DateConstants from './DateConstants';
import moment from 'moment';

export default {
  functional: true,
  render: function render(createElement, context) {
    var h = arguments[0];
    var props = context.props;

    var value = props.value;
    var localeData = value.localeData();
    var prefixCls = props.prefixCls;
    var veryShortWeekdays = [];
    var weekDays = [];
    var firstDayOfWeek = localeData.firstDayOfWeek();
    var showWeekNumberEl = void 0;
    var now = moment();
    for (var dateColIndex = 0; dateColIndex < DateConstants.DATE_COL_COUNT; dateColIndex++) {
      var index = (firstDayOfWeek + dateColIndex) % DateConstants.DATE_COL_COUNT;
      now.day(index);
      veryShortWeekdays[dateColIndex] = localeData.weekdaysMin(now);
      weekDays[dateColIndex] = localeData.weekdaysShort(now);
    }

    if (props.showWeekNumber) {
      showWeekNumberEl = h(
        'th',
        {
          attrs: {
            role: 'columnheader'
          },
          'class': prefixCls + '-column-header ' + prefixCls + '-week-number-header'
        },
        [h(
          'span',
          { 'class': prefixCls + '-column-header-inner' },
          ['x']
        )]
      );
    }
    var weekDaysEls = weekDays.map(function (day, xindex) {
      return h(
        'th',
        {
          key: xindex,
          attrs: { role: 'columnheader',
            title: day
          },
          'class': prefixCls + '-column-header'
        },
        [h(
          'span',
          { 'class': prefixCls + '-column-header-inner' },
          [veryShortWeekdays[xindex]]
        )]
      );
    });
    return h('thead', [h(
      'tr',
      {
        attrs: { role: 'row' }
      },
      [showWeekNumberEl, weekDaysEls]
    )]);
  }
};