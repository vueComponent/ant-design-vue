
import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import { getOptionProps, hasProp, getEvents, getStyle } from '../../_util/props-util';
import { cloneElement } from '../../_util/vnode';
import createChainedFunction from '../../_util/createChainedFunction';
import KeyCode from '../../_util/KeyCode';
import placements from './picker/placements';
import Trigger from '../../trigger';
import moment from 'moment';
import { setTimeout } from 'timers';
function isMoment(value) {
  if (Array.isArray(value)) {
    return value.length === 0 || value.findIndex(function (val) {
      return val === undefined || moment.isMoment(val);
    }) !== -1;
  } else {
    return value === undefined || moment.isMoment(value);
  }
}
var MomentType = PropTypes.custom(isMoment);
var Picker = {
  props: {
    animation: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    disabled: PropTypes.bool,
    transitionName: PropTypes.string,
    format: PropTypes.string,
    // onChange: PropTypes.func,
    // onOpenChange: PropTypes.func,
    children: PropTypes.func,
    getCalendarContainer: PropTypes.func,
    calendar: PropTypes.any,
    open: PropTypes.bool,
    defaultOpen: PropTypes.bool.def(false),
    prefixCls: PropTypes.string.def('rc-calendar-picker'),
    placement: PropTypes.any.def('bottomLeft'),
    value: PropTypes.oneOfType([MomentType, PropTypes.arrayOf(MomentType)]),
    defaultValue: PropTypes.oneOfType([MomentType, PropTypes.arrayOf(MomentType)]),
    align: PropTypes.object.def({})
  },
  mixins: [BaseMixin],

  data: function data() {
    var props = this.$props;
    var open = void 0;
    if (hasProp(this, 'open')) {
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
      this.focusTimeout = setTimeout(this.focusCalendar, 0);
    }
    this.preSOpen = this.sOpen;
  },
  beforeDestroy: function beforeDestroy() {
    clearTimeout(this.focusTimeout);
  },

  methods: {
    onCalendarKeyDown: function onCalendarKeyDown(event) {
      if (event.keyCode === KeyCode.ESC) {
        event.stopPropagation();
        this.closeCalendar(this.focus);
      }
    },
    onCalendarSelect: function onCalendarSelect(value) {
      var cause = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var props = this.$props;
      if (!hasProp(this, 'value')) {
        this.setState({
          sValue: value
        });
      }
      var calendarProps = getOptionProps(props.calendar);
      if (cause.source === 'keyboard' || !calendarProps.timePicker && cause.source !== 'dateInput' || cause.source === 'todayButton') {
        this.closeCalendar(this.focus);
      }
      this.__emit('change', value);
    },
    onKeyDown: function onKeyDown(event) {
      if (event.keyCode === KeyCode.DOWN && !this.sOpen) {
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
      var calendarProps = getOptionProps(props.calendar);
      var calendarEvents = getEvents(props.calendar);
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
          ok: createChainedFunction(calendarEvents.ok, this.onCalendarOk),
          select: createChainedFunction(calendarEvents.select, this.onCalendarSelect),
          clear: createChainedFunction(calendarEvents.clear, this.onCalendarClear)
        }
      };

      return cloneElement(props.calendar, extraProps);
    },
    setOpen: function setOpen(open, callback) {
      if (this.sOpen !== open) {
        if (!hasProp(this, 'open')) {
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

    var props = getOptionProps(this);
    var style = getStyle(this);
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
      Trigger,
      {
        attrs: {
          popupAlign: align,
          builtinPlacements: placements,
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
      ), cloneElement(children(childrenState, props), { on: { keydown: this.onKeyDown } })]
    );
  }
};

export default Picker;