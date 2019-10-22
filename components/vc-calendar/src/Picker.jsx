import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import { getOptionProps, hasProp, getEvents, getStyle } from '../../_util/props-util';
import { cloneElement } from '../../_util/vnode';
import createChainedFunction from '../../_util/createChainedFunction';
import KeyCode from '../../_util/KeyCode';
import placements from './picker/placements';
import Trigger from '../../vc-trigger';
import moment from 'moment';
import { setTimeout } from 'timers';
function isMoment(value) {
  if (Array.isArray(value)) {
    return (
      value.length === 0 || value.findIndex(val => val === undefined || moment.isMoment(val)) !== -1
    );
  } else {
    return value === undefined || moment.isMoment(value);
  }
}
const MomentType = PropTypes.custom(isMoment);
const Picker = {
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
    align: PropTypes.object.def({}),
    dropdownClassName: PropTypes.string,
  },
  mixins: [BaseMixin],

  data() {
    const props = this.$props;
    let open;
    if (hasProp(this, 'open')) {
      open = props.open;
    } else {
      open = props.defaultOpen;
    }
    const value = props.value || props.defaultValue;
    return {
      sOpen: open,
      sValue: value,
    };
  },
  watch: {
    value(val) {
      this.setState({
        sValue: val,
      });
    },
    open(val) {
      this.setState({
        sOpen: val,
      });
    },
  },
  mounted() {
    this.preSOpen = this.sOpen;
  },
  updated() {
    if (!this.preSOpen && this.sOpen) {
      // setTimeout is for making sure saveCalendarRef happen before focusCalendar
      this.focusTimeout = setTimeout(this.focusCalendar, 0);
    }
    this.preSOpen = this.sOpen;
  },

  beforeDestroy() {
    clearTimeout(this.focusTimeout);
  },
  methods: {
    onCalendarKeyDown(event) {
      if (event.keyCode === KeyCode.ESC) {
        event.stopPropagation();
        this.closeCalendar(this.focus);
      }
    },

    onCalendarSelect(value, cause = {}) {
      const props = this.$props;
      if (!hasProp(this, 'value')) {
        this.setState({
          sValue: value,
        });
      }
      const calendarProps = getOptionProps(props.calendar);
      if (
        cause.source === 'keyboard' ||
        cause.source === 'dateInputSelect' ||
        (!calendarProps.timePicker && cause.source !== 'dateInput') ||
        cause.source === 'todayButton'
      ) {
        this.closeCalendar(this.focus);
      }
      this.__emit('change', value);
    },

    onKeyDown(event) {
      if (!this.sOpen && (event.keyCode === KeyCode.DOWN || event.keyCode === KeyCode.ENTER)) {
        this.openCalendar();
        event.preventDefault();
      }
    },

    onCalendarOk() {
      this.closeCalendar(this.focus);
    },

    onCalendarClear() {
      this.closeCalendar(this.focus);
    },

    onVisibleChange(open) {
      this.setOpen(open);
    },

    getCalendarElement() {
      const props = this.$props;
      const calendarProps = getOptionProps(props.calendar);
      const calendarEvents = getEvents(props.calendar);
      const { sValue: value } = this;
      const defaultValue = value;
      const extraProps = {
        ref: 'calendarInstance',
        props: {
          defaultValue: defaultValue || calendarProps.defaultValue,
          selectedValue: value,
        },
        on: {
          keydown: this.onCalendarKeyDown,
          ok: createChainedFunction(calendarEvents.ok, this.onCalendarOk),
          select: createChainedFunction(calendarEvents.select, this.onCalendarSelect),
          clear: createChainedFunction(calendarEvents.clear, this.onCalendarClear),
        },
      };

      return cloneElement(props.calendar, extraProps);
    },

    setOpen(open, callback) {
      if (this.sOpen !== open) {
        if (!hasProp(this, 'open')) {
          this.setState(
            {
              sOpen: open,
            },
            callback,
          );
        }
        this.__emit('openChange', open);
      }
    },

    openCalendar(callback) {
      this.setOpen(true, callback);
    },

    closeCalendar(callback) {
      this.setOpen(false, callback);
    },

    focus() {
      if (!this.sOpen) {
        this.$el.focus();
      }
    },

    focusCalendar() {
      if (this.sOpen && this.calendarInstance && this.calendarInstance.componentInstance) {
        this.calendarInstance.componentInstance.focus();
      }
    },
  },

  render() {
    const props = getOptionProps(this);
    const style = getStyle(this);
    const {
      prefixCls,
      placement,
      getCalendarContainer,
      align,
      animation,
      disabled,
      dropdownClassName,
      transitionName,
    } = props;
    const { sValue, sOpen } = this;
    const children = this.$scopedSlots.default;
    const childrenState = {
      value: sValue,
      open: sOpen,
    };
    if (this.sOpen || !this.calendarInstance) {
      this.calendarInstance = this.getCalendarElement();
    }

    return (
      <Trigger
        popupAlign={align}
        builtinPlacements={placements}
        popupPlacement={placement}
        action={disabled && !sOpen ? [] : ['click']}
        destroyPopupOnHide
        getPopupContainer={getCalendarContainer}
        popupStyle={style}
        popupAnimation={animation}
        popupTransitionName={transitionName}
        popupVisible={sOpen}
        onPopupVisibleChange={this.onVisibleChange}
        prefixCls={prefixCls}
        popupClassName={dropdownClassName}
      >
        <template slot="popup">{this.calendarInstance}</template>
        {cloneElement(children(childrenState, props), { on: { keydown: this.onKeyDown } })}
      </Trigger>
    );
  },
};

export default Picker;
