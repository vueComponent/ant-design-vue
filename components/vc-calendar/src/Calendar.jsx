import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import { getOptionProps, hasProp, getComponentFromProp } from '../../_util/props-util';
import { cloneElement } from '../../_util/vnode';
import KeyCode from '../../_util/KeyCode';
import moment from 'moment';
import DateTable from './date/DateTable';
import CalendarHeader from './calendar/CalendarHeader';
import CalendarFooter from './calendar/CalendarFooter';
import CalendarMixin, { getNowByCurrentStateValue } from './mixin/CalendarMixin';
import CommonMixin from './mixin/CommonMixin';
import DateInput from './date/DateInput';
import enUs from './locale/en_US';
import { getTimeConfig, getTodayTime, syncTime } from './util';
import { goStartMonth, goEndMonth, goTime } from './util/toTime';

const Calendar = {
  props: {
    locale: PropTypes.object.def(enUs),
    format: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    visible: PropTypes.bool.def(true),
    prefixCls: PropTypes.string.def('rc-calendar'),
    // prefixCls: PropTypes.string,
    defaultValue: PropTypes.object,
    value: PropTypes.object,
    selectedValue: PropTypes.object,
    defaultSelectedValue: PropTypes.object,
    mode: PropTypes.oneOf(['time', 'date', 'month', 'year', 'decade']),
    // locale: PropTypes.object,
    showDateInput: PropTypes.bool.def(true),
    showWeekNumber: PropTypes.bool,
    showToday: PropTypes.bool.def(true),
    showOk: PropTypes.bool,
    // onSelect: PropTypes.func,
    // onOk: PropTypes.func,
    // onKeyDown: PropTypes.func,
    timePicker: PropTypes.any,
    dateInputPlaceholder: PropTypes.any,
    // onClear: PropTypes.func,
    // onChange: PropTypes.func,
    // onPanelChange: PropTypes.func,
    disabledDate: PropTypes.func,
    disabledTime: PropTypes.any,
    dateRender: PropTypes.func,
    renderFooter: PropTypes.func.def(() => null),
    renderSidebar: PropTypes.func.def(() => null),
    clearIcon: PropTypes.any,
    focusablePanel: PropTypes.bool.def(true),
  },

  mixins: [BaseMixin, CommonMixin, CalendarMixin],

  data() {
    const props = this.$props;
    return {
      sMode: this.mode || 'date',
      sValue: props.value || props.defaultValue || moment(),
      sSelectedValue: props.selectedValue || props.defaultSelectedValue,
    };
  },
  watch: {
    mode(val) {
      this.setState({ sMode: val });
    },
    value(val) {
      const sValue = val || this.defaultValue || getNowByCurrentStateValue(this.sValue);
      this.setState({
        sValue,
      });
    },
    selectedValue(val) {
      this.setState({
        sSelectedValue: val,
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.saveFocusElement(DateInput.getInstance());
    });
  },
  methods: {
    onPanelChange(value, mode) {
      const { sValue } = this;
      if (!hasProp(this, 'mode')) {
        this.setState({ sMode: mode });
      }
      this.__emit('panelChange', value || sValue, mode);
    },
    onKeyDown(event) {
      if (event.target.nodeName.toLowerCase() === 'input') {
        return undefined;
      }
      const keyCode = event.keyCode;
      // mac
      const ctrlKey = event.ctrlKey || event.metaKey;
      const { disabledDate, sValue: value } = this;
      switch (keyCode) {
        case KeyCode.DOWN:
          this.goTime(1, 'weeks');
          event.preventDefault();
          return 1;
        case KeyCode.UP:
          this.goTime(-1, 'weeks');
          event.preventDefault();
          return 1;
        case KeyCode.LEFT:
          if (ctrlKey) {
            this.goTime(-1, 'years');
          } else {
            this.goTime(-1, 'days');
          }
          event.preventDefault();
          return 1;
        case KeyCode.RIGHT:
          if (ctrlKey) {
            this.goTime(1, 'years');
          } else {
            this.goTime(1, 'days');
          }
          event.preventDefault();
          return 1;
        case KeyCode.HOME:
          this.setValue(goStartMonth(value));
          event.preventDefault();
          return 1;
        case KeyCode.END:
          this.setValue(goEndMonth(value));
          event.preventDefault();
          return 1;
        case KeyCode.PAGE_DOWN:
          this.goTime(1, 'month');
          event.preventDefault();
          return 1;
        case KeyCode.PAGE_UP:
          this.goTime(-1, 'month');
          event.preventDefault();
          return 1;
        case KeyCode.ENTER:
          if (!disabledDate || !disabledDate(value)) {
            this.onSelect(value, {
              source: 'keyboard',
            });
          }
          event.preventDefault();
          return 1;
        default:
          this.__emit('keydown', event);
          return 1;
      }
    },

    onClear() {
      this.onSelect(null);
      this.__emit('clear');
    },

    onOk() {
      const { sSelectedValue } = this;
      if (this.isAllowedDate(sSelectedValue)) {
        this.__emit('ok', sSelectedValue);
      }
    },

    onDateInputChange(value) {
      this.onSelect(value, {
        source: 'dateInput',
      });
    },
    onDateInputSelect(value) {
      this.onSelect(value, {
        source: 'dateInputSelect',
      });
    },
    onDateTableSelect(value) {
      const { timePicker, sSelectedValue } = this;
      if (!sSelectedValue && timePicker) {
        const timePickerProps = getOptionProps(timePicker);
        const timePickerDefaultValue = timePickerProps.defaultValue;
        if (timePickerDefaultValue) {
          syncTime(timePickerDefaultValue, value);
        }
      }
      this.onSelect(value);
    },
    onToday() {
      const { sValue } = this;
      const now = getTodayTime(sValue);
      this.onSelect(now, {
        source: 'todayButton',
      });
    },
    getRootDOMNode() {
      return this.$el;
    },
    openTimePicker() {
      this.onPanelChange(null, 'time');
    },
    closeTimePicker() {
      this.onPanelChange(null, 'date');
    },
    goTime(direction, unit) {
      this.setValue(goTime(this.sValue, direction, unit));
    },
  },

  render() {
    const {
      locale,
      prefixCls,
      disabledDate,
      dateInputPlaceholder,
      timePicker,
      disabledTime,
      showDateInput,
      sValue,
      sSelectedValue,
      sMode,
      renderFooter,
      $props: props,
    } = this;
    const clearIcon = getComponentFromProp(this, 'clearIcon');
    const showTimePicker = sMode === 'time';
    const disabledTimeConfig =
      showTimePicker && disabledTime && timePicker
        ? getTimeConfig(sSelectedValue, disabledTime)
        : null;

    let timePickerEle = null;

    if (timePicker && showTimePicker) {
      const timePickerOriginProps = getOptionProps(timePicker);
      const timePickerProps = {
        props: {
          showHour: true,
          showSecond: true,
          showMinute: true,
          ...timePickerOriginProps,
          ...disabledTimeConfig,
          value: sSelectedValue,
          disabledTime,
        },
        on: {
          change: this.onDateInputChange,
        },
      };

      if (timePickerOriginProps.defaultValue !== undefined) {
        timePickerProps.props.defaultOpenValue = timePickerOriginProps.defaultValue;
      }
      timePickerEle = cloneElement(timePicker, timePickerProps);
    }

    const dateInputElement = showDateInput ? (
      <DateInput
        format={this.getFormat()}
        key="date-input"
        value={sValue}
        locale={locale}
        placeholder={dateInputPlaceholder}
        showClear
        disabledTime={disabledTime}
        disabledDate={disabledDate}
        onClear={this.onClear}
        prefixCls={prefixCls}
        selectedValue={sSelectedValue}
        onChange={this.onDateInputChange}
        clearIcon={clearIcon}
        onSelect={this.onDateInputSelect}
      />
    ) : null;
    const children = [];
    if (props.renderSidebar) {
      children.push(props.renderSidebar());
    }
    children.push(
      <div class={`${prefixCls}-panel`} key="panel">
        {dateInputElement}
        <div tabIndex={props.focusablePanel ? 0 : undefined} class={`${prefixCls}-date-panel`}>
          <CalendarHeader
            locale={locale}
            mode={sMode}
            value={sValue}
            onValueChange={this.setValue}
            onPanelChange={this.onPanelChange}
            renderFooter={renderFooter}
            showTimePicker={showTimePicker}
            prefixCls={prefixCls}
          />
          {timePicker && showTimePicker ? (
            <div class={`${prefixCls}-time-picker`}>
              <div class={`${prefixCls}-time-picker-panel`}>{timePickerEle}</div>
            </div>
          ) : null}
          <div class={`${prefixCls}-body`}>
            <DateTable
              locale={locale}
              value={sValue}
              selectedValue={sSelectedValue}
              prefixCls={prefixCls}
              dateRender={props.dateRender}
              onSelect={this.onDateTableSelect}
              disabledDate={disabledDate}
              showWeekNumber={props.showWeekNumber}
            />
          </div>

          <CalendarFooter
            showOk={props.showOk}
            mode={sMode}
            renderFooter={props.renderFooter}
            locale={locale}
            prefixCls={prefixCls}
            showToday={props.showToday}
            disabledTime={disabledTime}
            showTimePicker={showTimePicker}
            showDateInput={props.showDateInput}
            timePicker={timePicker}
            selectedValue={sSelectedValue}
            value={sValue}
            disabledDate={disabledDate}
            okDisabled={
              props.showOk !== false && (!sSelectedValue || !this.isAllowedDate(sSelectedValue))
            }
            onOk={this.onOk}
            onSelect={this.onSelect}
            onToday={this.onToday}
            onOpenTimePicker={this.openTimePicker}
            onCloseTimePicker={this.closeTimePicker}
          />
        </div>
      </div>,
    );

    return this.renderRoot({
      children,
      class: props.showWeekNumber ? `${prefixCls}-week-number` : '',
    });
  },
};

export default Calendar;
