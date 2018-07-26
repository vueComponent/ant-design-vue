'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../../_util/props-util');

var _vnode = require('../../_util/vnode');

var _createChainedFunction = require('../../_util/createChainedFunction');

var _createChainedFunction2 = _interopRequireDefault(_createChainedFunction);

var _KeyCode = require('../../_util/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _placements = require('./picker/placements');

var _placements2 = _interopRequireDefault(_placements);

var _trigger = require('../../trigger');

var _trigger2 = _interopRequireDefault(_trigger);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _timers = require('timers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function isMoment(value) {
  if (Array.isArray(value)) {
    return value.length === 0 || value.findIndex(function (val) {
      return val === undefined || _moment2['default'].isMoment(val);
    }) !== -1;
  } else {
    return value === undefined || _moment2['default'].isMoment(value);
  }
}
var MomentType = _vueTypes2['default'].custom(isMoment);
var Picker = {
  props: {
    animation: _vueTypes2['default'].oneOfType([_vueTypes2['default'].func, _vueTypes2['default'].string]),
    disabled: _vueTypes2['default'].bool,
    transitionName: _vueTypes2['default'].string,
    format: _vueTypes2['default'].string,
    // onChange: PropTypes.func,
    // onOpenChange: PropTypes.func,
    children: _vueTypes2['default'].func,
    getCalendarContainer: _vueTypes2['default'].func,
    calendar: _vueTypes2['default'].any,
    open: _vueTypes2['default'].bool,
    defaultOpen: _vueTypes2['default'].bool.def(false),
    prefixCls: _vueTypes2['default'].string.def('rc-calendar-picker'),
    placement: _vueTypes2['default'].any.def('bottomLeft'),
    value: _vueTypes2['default'].oneOfType([MomentType, _vueTypes2['default'].arrayOf(MomentType)]),
    defaultValue: _vueTypes2['default'].oneOfType([MomentType, _vueTypes2['default'].arrayOf(MomentType)]),
    align: _vueTypes2['default'].object.def({})
  },
  mixins: [_BaseMixin2['default']],

  data: function data() {
    var props = this.$props;
    var open = void 0;
    if ((0, _propsUtil.hasProp)(this, 'open')) {
      open = props.open;
    } else {
      open = props.defaultOpen;
    }
    var value = props.value || props.defaultValue;
    return {
      sOpen: open,
      sValue: value
    };
  },

  watch: {
    value: function value(val) {
      this.setState({
        sValue: val
      });
    },
    open: function open(val) {
      this.setState({
        sOpen: val
      });
    }
  },
  mounted: function mounted() {
    this.preSOpen = this.sOpen;
  },
  updated: function updated() {
    if (!this.preSOpen && this.sOpen) {
      // setTimeout is for making sure saveCalendarRef happen before focusCalendar
      this.focusTimeout = (0, _timers.setTimeout)(this.focusCalendar, 0);
    }
    this.preSOpen = this.sOpen;
  },
  beforeDestroy: function beforeDestroy() {
    clearTimeout(this.focusTimeout);
  },

  methods: {
    onCalendarKeyDown: function onCalendarKeyDown(event) {
      if (event.keyCode === _KeyCode2['default'].ESC) {
        event.stopPropagation();
        this.closeCalendar(this.focus);
      }
    },
    onCalendarSelect: function onCalendarSelect(value) {
      var cause = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var props = this.$props;
      if (!(0, _propsUtil.hasProp)(this, 'value')) {
        this.setState({
          sValue: value
        });
      }
      var calendarProps = (0, _propsUtil.getOptionProps)(props.calendar);
      if (cause.source === 'keyboard' || !calendarProps.timePicker && cause.source !== 'dateInput' || cause.source === 'todayButton') {
        this.closeCalendar(this.focus);
      }
      this.__emit('change', value);
    },
    onKeyDown: function onKeyDown(event) {
      if (event.keyCode === _KeyCode2['default'].DOWN && !this.sOpen) {
        this.openCalendar();
        event.preventDefault();
      }
    },
    onCalendarOk: function onCalendarOk() {
      this.closeCalendar(this.focus);
    },
    onCalendarClear: function onCalendarClear() {
      this.closeCalendar(this.focus);
    },
    onVisibleChange: function onVisibleChange(open) {
      this.setOpen(open);
    },
    getCalendarElement: function getCalendarElement() {
      var props = this.$props;
      var calendarProps = (0, _propsUtil.getOptionProps)(props.calendar);
      var calendarEvents = (0, _propsUtil.getEvents)(props.calendar);
      var value = this.sValue;

      var defaultValue = value;
      var extraProps = {
        ref: 'calendarInstance',
        props: {
          defaultValue: defaultValue || calendarProps.defaultValue,
          selectedValue: value
        },
        on: {
          keydown: this.onCalendarKeyDown,
          ok: (0, _createChainedFunction2['default'])(calendarEvents.ok, this.onCalendarOk),
          select: (0, _createChainedFunction2['default'])(calendarEvents.select, this.onCalendarSelect),
          clear: (0, _createChainedFunction2['default'])(calendarEvents.clear, this.onCalendarClear)
        }
      };

      return (0, _vnode.cloneElement)(props.calendar, extraProps);
    },
    setOpen: function setOpen(open, callback) {
      if (this.sOpen !== open) {
        if (!(0, _propsUtil.hasProp)(this, 'open')) {
          this.setState({
            sOpen: open
          }, callback);
        }
        this.__emit('openChange', open);
      }
    },
    openCalendar: function openCalendar(callback) {
      this.setOpen(true, callback);
    },
    closeCalendar: function closeCalendar(callback) {
      this.setOpen(false, callback);
    },
    focus: function focus() {
      if (!this.sOpen) {
        this.$el.focus();
      }
    },
    focusCalendar: function focusCalendar() {
      if (this.sOpen && this.calendarInstance && this.calendarInstance.componentInstance) {
        this.calendarInstance.componentInstance.focus();
      }
    }
  },

  render: function render() {
    var h = arguments[0];

    var props = (0, _propsUtil.getOptionProps)(this);
    var style = (0, _propsUtil.getStyle)(this);
    var prefixCls = props.prefixCls,
        placement = props.placement,
        getCalendarContainer = props.getCalendarContainer,
        align = props.align,
        animation = props.animation,
        disabled = props.disabled,
        dropdownClassName = props.dropdownClassName,
        transitionName = props.transitionName;
    var sValue = this.sValue,
        sOpen = this.sOpen;

    var children = this.$scopedSlots['default'];
    var childrenState = {
      value: sValue,
      open: sOpen
    };
    if (this.sOpen || !this.calendarInstance) {
      this.calendarInstance = this.getCalendarElement();
    }

    return h(
      _trigger2['default'],
      {
        attrs: {
          popupAlign: align,
          builtinPlacements: _placements2['default'],
          popupPlacement: placement,
          action: disabled && !sOpen ? [] : ['click'],
          destroyPopupOnHide: true,
          getPopupContainer: getCalendarContainer,
          popupStyle: style,
          popupAnimation: animation,
          popupTransitionName: transitionName,
          popupVisible: sOpen,

          prefixCls: prefixCls,
          popupClassName: dropdownClassName
        },
        on: {
          'popupVisibleChange': this.onVisibleChange
        }
      },
      [h(
        'template',
        { slot: 'popup' },
        [this.calendarInstance]
      ), (0, _vnode.cloneElement)(children(childrenState, props), { on: { keydown: this.onKeyDown } })]
    );
  }
};

exports['default'] = Picker;
module.exports = exports['default'];