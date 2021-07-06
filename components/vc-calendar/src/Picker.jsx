import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import { getOptionProps, hasProp, getEvents, findDOMNode } from '../../_util/props-util';
import { cloneElement } from '../../_util/vnode';
import createChainedFunction from '../../_util/createChainedFunction';
import KeyCode from '../../_util/KeyCode';
import placements from './picker/placements';
import Trigger from '../../vc-trigger';
import moment from 'moment';
import isNil from 'lodash-es/isNil';
import { defineComponent } from 'vue';
const TimeType = {
  validator(value) {
    if (Array.isArray(value)) {
      return (
        value.length === 0 || value.findIndex(val => !isNil(val) && !moment.isMoment(val)) === -1
      );
    } else {
      return isNil(value) || moment.isMoment(value);
    }
  },
};

function refFn(field, component) {
  this[field] = component;
}

const Picker = defineComponent({
  name: 'Picker',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: {
    animation: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    disabled: PropTypes.looseBool,
    transitionName: PropTypes.string,
    format: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.func]),
    // onChange: PropTypes.func,
    // onOpenChange: PropTypes.func,
    getCalendarContainer: PropTypes.func,
    calendar: PropTypes.any,
    open: PropTypes.looseBool,
    defaultOpen: PropTypes.looseBool.def(false),
    prefixCls: PropTypes.string.def('rc-calendar-picker'),
    placement: PropTypes.any.def('bottomLeft'),
    value: TimeType,
    defaultValue: TimeType,
    align: PropTypes.object.def(() => ({})),
    dropdownClassName: PropTypes.string,
    dateRender: PropTypes.func,
    children: PropTypes.func,
  },

  data() {
    const props = this.$props;
    this.calendarElement = null;
    this.saveCalendarRef = refFn.bind(this, 'calendarInstance');
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
      this.focusTimeout = setTimeout(this.focusCalendar, 100);
    }
    this.preSOpen = this.sOpen;
  },

  beforeUnmount() {
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

    onCalendarBlur() {
      this.setOpen(false);
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
        ref: this.saveCalendarRef,
        defaultValue: defaultValue || calendarProps.defaultValue,
        selectedValue: value,
        onKeydown: this.onCalendarKeyDown,
        onOk: createChainedFunction(calendarEvents.onOk, this.onCalendarOk),
        onSelect: createChainedFunction(calendarEvents.onSelect, this.onCalendarSelect),
        onClear: createChainedFunction(calendarEvents.onClear, this.onCalendarClear),
        onBlur: createChainedFunction(calendarEvents.onBlur, this.onCalendarBlur),
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
        findDOMNode(this).focus();
      }
    },

    focusCalendar() {
      if (this.sOpen && !!this.calendarInstance) {
        this.calendarInstance.focus();
      }
    },
  },

  render() {
    const props = getOptionProps(this);
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
    const childrenState = {
      value: sValue,
      open: sOpen,
    };
    const children = this.$slots.default(childrenState);
    if (this.sOpen || !this.calendarElement) {
      this.calendarElement = this.getCalendarElement();
    }

    return (
      <Trigger
        popupAlign={align}
        builtinPlacements={placements}
        popupPlacement={placement}
        action={disabled && !sOpen ? [] : ['click']}
        destroyPopupOnHide
        getPopupContainer={getCalendarContainer}
        popupStyle={this.$attrs.style || {}}
        popupAnimation={animation}
        popupTransitionName={transitionName}
        popupVisible={sOpen}
        onPopupVisibleChange={this.onVisibleChange}
        prefixCls={prefixCls}
        popupClassName={dropdownClassName}
        popup={this.calendarElement}
      >
        {cloneElement(children, { onKeydown: this.onKeyDown })}
      </Trigger>
    );
  },
});

export default Picker;
