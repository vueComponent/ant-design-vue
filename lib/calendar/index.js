'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CalendarProps = exports.CalendarMode = exports.MomentType = exports.HeaderProps = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _Header = require('./Header');

Object.defineProperty(exports, 'HeaderProps', {
  enumerable: true,
  get: function get() {
    return _Header.HeaderProps;
  }
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../_util/props-util');

var _moment = require('moment');

var moment = _interopRequireWildcard(_moment);

var _FullCalendar = require('../vc-calendar/src/FullCalendar');

var _FullCalendar2 = _interopRequireDefault(_FullCalendar);

var _LocaleReceiver = require('../locale-provider/LocaleReceiver');

var _LocaleReceiver2 = _interopRequireDefault(_LocaleReceiver);

var _Constants = require('./Constants');

var _Header2 = _interopRequireDefault(_Header);

var _interopDefault = require('../_util/interopDefault');

var _interopDefault2 = _interopRequireDefault(_interopDefault);

var _en_US = require('./locale/en_US');

var _en_US2 = _interopRequireDefault(_en_US);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {
  return null;
}

function zerofixed(v) {
  if (v < 10) {
    return '0' + v;
  }
  return '' + v;
}
var MomentType = exports.MomentType = {
  type: Object,
  validator: function validator(value) {
    return moment.isMoment(value);
  }
};
function isMomentArray(value) {
  return Array.isArray(value) && !!value.find(function (val) {
    return moment.isMoment(val);
  });
}
var CalendarMode = exports.CalendarMode = _vueTypes2['default'].oneOf(['month', 'year']);

var CalendarProps = exports.CalendarProps = function CalendarProps() {
  return {
    prefixCls: _vueTypes2['default'].string,
    value: MomentType,
    defaultValue: MomentType,
    mode: CalendarMode,
    fullscreen: _vueTypes2['default'].bool,
    // dateCellRender: PropTypes.func,
    // monthCellRender: PropTypes.func,
    // dateFullCellRender: PropTypes.func,
    // monthFullCellRender: PropTypes.func,
    locale: _vueTypes2['default'].any,
    // onPanelChange?: (date?: moment.Moment, mode?: CalendarMode) => void;
    // onSelect?: (date?: moment.Moment) => void;
    disabledDate: _vueTypes2['default'].func,
    validRange: _vueTypes2['default'].custom(isMomentArray)
  };
};

exports['default'] = {
  name: 'ACalendar',
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)(CalendarProps(), {
    locale: {},
    fullscreen: true,
    prefixCls: _Constants.PREFIX_CLS,
    mode: 'month'
  }),
  model: {
    prop: 'value',
    event: 'change'
  },
  data: function data() {
    var value = this.value || this.defaultValue || (0, _interopDefault2['default'])(moment)();
    if (!(0, _interopDefault2['default'])(moment).isMoment(value)) {
      throw new Error('The value/defaultValue of Calendar must be a moment object, ');
    }
    return {
      sValue: value,
      sMode: this.mode
    };
  },

  watch: {
    value: function value(val) {
      this.setState({
        sValue: val
      });
    },
    mode: function mode(val) {
      this.setState({
        sMode: val
      });
    }
  },
  methods: {
    monthCellRender2: function monthCellRender2(value) {
      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          $scopedSlots = this.$scopedSlots;

      var monthCellRender = this.monthCellRender || $scopedSlots.monthCellRender || noop;
      return h(
        'div',
        { 'class': prefixCls + '-month' },
        [h(
          'div',
          { 'class': prefixCls + '-value' },
          [value.localeData().monthsShort(value)]
        ), h(
          'div',
          { 'class': prefixCls + '-content' },
          [monthCellRender(value)]
        )]
      );
    },
    dateCellRender2: function dateCellRender2(value) {
      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          $scopedSlots = this.$scopedSlots;

      var dateCellRender = this.dateCellRender || $scopedSlots.dateCellRender || noop;
      return h(
        'div',
        { 'class': prefixCls + '-date' },
        [h(
          'div',
          { 'class': prefixCls + '-value' },
          [zerofixed(value.date())]
        ), h(
          'div',
          { 'class': prefixCls + '-content' },
          [dateCellRender(value)]
        )]
      );
    },
    setValue: function setValue(value, way) {
      if (!(0, _propsUtil.hasProp)(this, 'value')) {
        this.setState({ sValue: value });
      }
      if (way === 'select') {
        this.$emit('select', value);
        this.$emit('onChange', value);
      } else if (way === 'changePanel') {
        this.onPanelChange(value, this.sMode);
      }
    },
    setType: function setType(type) {
      var mode = type === 'date' ? 'month' : 'year';
      if (this.sMode !== mode) {
        this.setState({ sMode: mode });
        this.onPanelChange(this.sValue, mode);
      }
    },
    onHeaderValueChange: function onHeaderValueChange(value) {
      this.setValue(value, 'changePanel');
    },
    onHeaderTypeChange: function onHeaderTypeChange(type) {
      this.setType(type);
    },
    onPanelChange: function onPanelChange(value, mode) {
      this.$emit('panelChange', value, mode);
      if (value !== this.sValue) {
        this.$emit('onChange', value);
      }
    },
    onSelect: function onSelect(value) {
      this.setValue(value, 'select');
    },
    getDateRange: function getDateRange(validRange, disabledDate) {
      return function (current) {
        if (!current) {
          return false;
        }

        var _validRange = (0, _slicedToArray3['default'])(validRange, 2),
            startDate = _validRange[0],
            endDate = _validRange[1];

        var inRange = !current.isBetween(startDate, endDate, 'days', '[]');
        if (disabledDate) {
          return disabledDate(current) || inRange;
        }
        return inRange;
      };
    },
    renderCalendar: function renderCalendar(locale, localeCode) {
      var h = this.$createElement;

      var props = (0, _propsUtil.getOptionProps)(this);
      var value = this.sValue,
          mode = this.sMode,
          $listeners = this.$listeners,
          $scopedSlots = this.$scopedSlots;

      if (value && localeCode) {
        value.locale(localeCode);
      }
      var prefixCls = props.prefixCls,
          fullscreen = props.fullscreen,
          dateFullCellRender = props.dateFullCellRender,
          monthFullCellRender = props.monthFullCellRender;

      var type = mode === 'year' ? 'month' : 'date';

      var cls = '';
      if (fullscreen) {
        cls += ' ' + prefixCls + '-fullscreen';
      }

      var monthCellRender = monthFullCellRender || $scopedSlots.monthFullCellRender || this.monthCellRender2;
      var dateCellRender = dateFullCellRender || $scopedSlots.dateFullCellRender || this.dateCellRender2;

      var disabledDate = props.disabledDate;

      if (props.validRange) {
        disabledDate = this.getDateRange(props.validRange, disabledDate);
      }
      var fullCalendarProps = {
        props: (0, _extends3['default'])({}, props, {
          Select: {},
          locale: locale.lang,
          type: type,
          prefixCls: prefixCls,
          showHeader: false,
          value: value,
          monthCellRender: monthCellRender,
          dateCellRender: dateCellRender,
          disabledDate: disabledDate
        }),
        on: (0, _extends3['default'])({}, $listeners, {
          select: this.onSelect
        })
      };
      return h(
        'div',
        { 'class': cls },
        [h(_Header2['default'], {
          attrs: {
            fullscreen: fullscreen,
            type: type,
            value: value,
            locale: locale.lang,
            prefixCls: prefixCls,

            validRange: props.validRange
          },
          on: {
            'typeChange': this.onHeaderTypeChange,
            'valueChange': this.onHeaderValueChange
          }
        }), h(_FullCalendar2['default'], fullCalendarProps)]
      );
    }
  },

  render: function render() {
    var h = arguments[0];

    return h(_LocaleReceiver2['default'], {
      attrs: {
        componentName: 'Calendar',
        defaultLocale: _en_US2['default']
      },
      scopedSlots: { 'default': this.renderCalendar }
    });
  }
};