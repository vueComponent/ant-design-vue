'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _KeyCode = require('../../_util/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _CalendarHeader = require('./calendar/CalendarHeader');

var _CalendarHeader2 = _interopRequireDefault(_CalendarHeader);

var _CalendarFooter = require('./calendar/CalendarFooter');

var _CalendarFooter2 = _interopRequireDefault(_CalendarFooter);

var _CalendarMixin = require('./mixin/CalendarMixin');

var _CalendarMixin2 = _interopRequireDefault(_CalendarMixin);

var _CommonMixin = require('./mixin/CommonMixin');

var _CommonMixin2 = _interopRequireDefault(_CommonMixin);

var _en_US = require('./locale/en_US');

var _en_US2 = _interopRequireDefault(_en_US);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var MonthCalendar = {
  props: {
    locale: _vueTypes2['default'].object.def(_en_US2['default']),
    format: _vueTypes2['default'].string,
    visible: _vueTypes2['default'].bool.def(true),
    prefixCls: _vueTypes2['default'].string.def('rc-calendar'),
    monthCellRender: _vueTypes2['default'].func,
    dateCellRender: _vueTypes2['default'].func,
    disabledDate: _vueTypes2['default'].func,
    monthCellContentRender: _vueTypes2['default'].func,
    renderFooter: _vueTypes2['default'].func.def(function () {
      return null;
    }),
    renderSidebar: _vueTypes2['default'].func.def(function () {
      return null;
    })
  },
  mixins: [_BaseMixin2['default'], _CommonMixin2['default'], _CalendarMixin2['default']],

  data: function data() {
    return { mode: 'month' };
  },

  methods: {
    onKeyDown: function onKeyDown(event) {
      var keyCode = event.keyCode;
      var ctrlKey = event.ctrlKey || event.metaKey;
      var stateValue = this.sValue;
      var disabledDate = this.disabledDate;

      var value = stateValue;
      switch (keyCode) {
        case _KeyCode2['default'].DOWN:
          value = stateValue.clone();
          value.add(3, 'months');
          break;
        case _KeyCode2['default'].UP:
          value = stateValue.clone();
          value.add(-3, 'months');
          break;
        case _KeyCode2['default'].LEFT:
          value = stateValue.clone();
          if (ctrlKey) {
            value.add(-1, 'years');
          } else {
            value.add(-1, 'months');
          }
          break;
        case _KeyCode2['default'].RIGHT:
          value = stateValue.clone();
          if (ctrlKey) {
            value.add(1, 'years');
          } else {
            value.add(1, 'months');
          }
          break;
        case _KeyCode2['default'].ENTER:
          if (!disabledDate || !disabledDate(stateValue)) {
            this.onSelect(stateValue);
          }
          event.preventDefault();
          return 1;
        default:
          return undefined;
      }
      if (value !== stateValue) {
        this.setValue(value);
        event.preventDefault();
        return 1;
      }
    },
    handlePanelChange: function handlePanelChange(_, mode) {
      if (mode !== 'date') {
        this.setState({ mode: mode });
      }
    }
  },

  render: function render() {
    var h = arguments[0];
    var mode = this.mode,
        value = this.sValue,
        props = this.$props,
        $scopedSlots = this.$scopedSlots;
    var prefixCls = props.prefixCls,
        locale = props.locale,
        disabledDate = props.disabledDate;

    var monthCellRender = this.monthCellRender || $scopedSlots.monthCellRender;
    var monthCellContentRender = this.monthCellContentRender || $scopedSlots.monthCellContentRender;
    var renderFooter = this.renderFooter || $scopedSlots.renderFooter;
    var children = h(
      'div',
      { 'class': prefixCls + '-month-calendar-content' },
      [h(
        'div',
        { 'class': prefixCls + '-month-header-wrap' },
        [h(_CalendarHeader2['default'], {
          attrs: {
            prefixCls: prefixCls,
            mode: mode,
            value: value,
            locale: locale,
            disabledMonth: disabledDate,
            monthCellRender: monthCellRender,
            monthCellContentRender: monthCellContentRender
          },
          on: {
            'monthSelect': this.onSelect,
            'valueChange': this.setValue,
            'panelChange': this.handlePanelChange
          }
        })]
      ), h(_CalendarFooter2['default'], {
        attrs: {
          prefixCls: prefixCls,
          renderFooter: renderFooter
        }
      })]
    );
    return this.renderRoot({
      'class': props.prefixCls + '-month-calendar',
      children: children
    });
  }
};

exports['default'] = MonthCalendar;
module.exports = exports['default'];