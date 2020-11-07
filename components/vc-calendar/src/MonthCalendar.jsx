import moment from 'moment';
import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import KeyCode from '../../_util/KeyCode';
import CalendarHeader from './calendar/CalendarHeader';
import CalendarFooter from './calendar/CalendarFooter';
import CalendarMixin from './mixin/CalendarMixin';
import CommonMixin from './mixin/CommonMixin';
import enUs from './locale/en_US';
import { defineComponent } from 'vue';
const MonthCalendar = defineComponent({
  name: 'MonthCalendar',
  mixins: [BaseMixin, CommonMixin, CalendarMixin],
  inheritAttrs: false,
  props: {
    locale: PropTypes.object.def(enUs),
    format: PropTypes.string,
    visible: PropTypes.looseBool.def(true),
    prefixCls: PropTypes.string.def('rc-calendar'),
    monthCellRender: PropTypes.func,
    value: PropTypes.object,
    defaultValue: PropTypes.object,
    selectedValue: PropTypes.object,
    defaultSelectedValue: PropTypes.object,
    disabledDate: PropTypes.func,
    monthCellContentRender: PropTypes.func,
    renderFooter: PropTypes.func.def(() => null),
    renderSidebar: PropTypes.func.def(() => null),
  },

  data() {
    const props = this.$props;
    return {
      mode: 'month',
      sValue: props.value || props.defaultValue || moment(),
      sSelectedValue: props.selectedValue || props.defaultSelectedValue,
    };
  },
  methods: {
    onKeyDown(event) {
      const keyCode = event.keyCode;
      const ctrlKey = event.ctrlKey || event.metaKey;
      const stateValue = this.sValue;
      const { disabledDate } = this;
      let value = stateValue;
      switch (keyCode) {
        case KeyCode.DOWN:
          value = stateValue.clone();
          value.add(3, 'months');
          break;
        case KeyCode.UP:
          value = stateValue.clone();
          value.add(-3, 'months');
          break;
        case KeyCode.LEFT:
          value = stateValue.clone();
          if (ctrlKey) {
            value.add(-1, 'years');
          } else {
            value.add(-1, 'months');
          }
          break;
        case KeyCode.RIGHT:
          value = stateValue.clone();
          if (ctrlKey) {
            value.add(1, 'years');
          } else {
            value.add(1, 'months');
          }
          break;
        case KeyCode.ENTER:
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

    handlePanelChange(_, mode) {
      if (mode !== 'date') {
        this.setState({ mode });
      }
    },
  },

  render() {
    const { mode, sValue: value, $props: props, $slots } = this;
    const { prefixCls, locale, disabledDate } = props;
    const monthCellRender = this.monthCellRender || $slots.monthCellRender;
    const monthCellContentRender = this.monthCellContentRender || $slots.monthCellContentRender;
    const renderFooter = this.renderFooter || $slots.renderFooter;
    const children = (
      <div class={`${prefixCls}-month-calendar-content`}>
        <div class={`${prefixCls}-month-header-wrap`}>
          <CalendarHeader
            prefixCls={prefixCls}
            mode={mode}
            value={value}
            locale={locale}
            disabledMonth={disabledDate}
            monthCellRender={monthCellRender}
            monthCellContentRender={monthCellContentRender}
            onMonthSelect={this.onSelect}
            onValueChange={this.setValue}
            onPanelChange={this.handlePanelChange}
          />
        </div>
        <CalendarFooter prefixCls={prefixCls} renderFooter={renderFooter} />
      </div>
    );
    return this.renderRoot({
      class: `${props.prefixCls}-month-calendar`,
      children,
    });
  },
});

export default MonthCalendar;
