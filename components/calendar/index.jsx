import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import { getOptionProps, hasProp, initDefaultProps, getListeners } from '../_util/props-util';
import * as moment from 'moment';
import FullCalendar from '../vc-calendar/src/FullCalendar';
import Header from './Header';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import interopDefault from '../_util/interopDefault';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import enUS from './locale/en_US';
import Base from '../base';
import { checkValidate, stringToMoment, momentToString, TimeType } from '../_util/moment-util';

function noop() {
  return null;
}

function zerofixed(v) {
  if (v < 10) {
    return `0${v}`;
  }
  return `${v}`;
}
function isMomentArray(value) {
  return Array.isArray(value) && !!value.find(val => moment.isMoment(val));
}
export const CalendarMode = PropTypes.oneOf(['month', 'year']);

export const CalendarProps = () => ({
  prefixCls: PropTypes.string,
  value: TimeType,
  defaultValue: TimeType,
  mode: CalendarMode,
  fullscreen: PropTypes.bool,
  // dateCellRender: PropTypes.func,
  // monthCellRender: PropTypes.func,
  // dateFullCellRender: PropTypes.func,
  // monthFullCellRender: PropTypes.func,
  locale: PropTypes.object,
  // onPanelChange?: (date?: moment.Moment, mode?: CalendarMode) => void;
  // onSelect?: (date?: moment.Moment) => void;
  disabledDate: PropTypes.func,
  validRange: PropTypes.custom(isMomentArray),
  headerRender: PropTypes.func,
  valueFormat: PropTypes.string,
});

const Calendar = {
  name: 'ACalendar',
  mixins: [BaseMixin],
  props: initDefaultProps(CalendarProps(), {
    locale: {},
    fullscreen: true,
  }),
  model: {
    prop: 'value',
    event: 'change',
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    const { value, defaultValue, valueFormat } = this;
    const sValue = value || defaultValue || interopDefault(moment)();
    checkValidate('Calendar', defaultValue, 'defaultValue', valueFormat);
    checkValidate('Calendar', value, 'value', valueFormat);
    this._sPrefixCls = undefined;
    return {
      sValue: stringToMoment(sValue, valueFormat),
      sMode: this.mode || 'month',
    };
  },
  watch: {
    value(val) {
      checkValidate('Calendar', val, 'value', this.valueFormat);
      this.setState({
        sValue: stringToMoment(val, this.valueFormat),
      });
    },
    mode(val) {
      this.setState({
        sMode: val,
      });
    },
  },
  methods: {
    onHeaderValueChange(value) {
      this.setValue(value, 'changePanel');
    },
    onHeaderTypeChange(mode) {
      this.sMode = mode;
      this.onPanelChange(this.sValue, mode);
    },
    onPanelChange(value, mode) {
      const val = this.valueFormat ? momentToString(value, this.valueFormat) : value;
      this.$emit('panelChange', val, mode);
      if (value !== this.sValue) {
        this.$emit('change', val);
      }
    },

    onSelect(value) {
      this.setValue(value, 'select');
    },
    setValue(value, way) {
      const prevValue = this.value ? stringToMoment(this.value, this.valueFormat) : this.sValue;
      const { sMode: mode, valueFormat } = this;
      if (!hasProp(this, 'value')) {
        this.setState({ sValue: value });
      }
      if (way === 'select') {
        if (prevValue && prevValue.month() !== value.month()) {
          this.onPanelChange(value, mode);
        }
        this.$emit('select', valueFormat ? momentToString(value, valueFormat) : value);
      } else if (way === 'changePanel') {
        this.onPanelChange(value, mode);
      }
    },
    getDateRange(validRange, disabledDate) {
      return current => {
        if (!current) {
          return false;
        }
        const [startDate, endDate] = validRange;
        const inRange = !current.isBetween(startDate, endDate, 'days', '[]');
        if (disabledDate) {
          return disabledDate(current) || inRange;
        }
        return inRange;
      };
    },
    getDefaultLocale() {
      const result = {
        ...enUS,
        ...this.$props.locale,
      };
      result.lang = {
        ...result.lang,
        ...(this.$props.locale || {}).lang,
      };
      return result;
    },
    monthCellRender2(value) {
      const { _sPrefixCls, $scopedSlots } = this;
      const monthCellRender = this.monthCellRender || $scopedSlots.monthCellRender || noop;
      return (
        <div class={`${_sPrefixCls}-month`}>
          <div class={`${_sPrefixCls}-value`}>{value.localeData().monthsShort(value)}</div>
          <div class={`${_sPrefixCls}-content`}>{monthCellRender(value)}</div>
        </div>
      );
    },

    dateCellRender2(value) {
      const { _sPrefixCls, $scopedSlots } = this;
      const dateCellRender = this.dateCellRender || $scopedSlots.dateCellRender || noop;
      return (
        <div class={`${_sPrefixCls}-date`}>
          <div class={`${_sPrefixCls}-value`}>{zerofixed(value.date())}</div>
          <div class={`${_sPrefixCls}-content`}>{dateCellRender(value)}</div>
        </div>
      );
    },

    renderCalendar(locale, localeCode) {
      const props = getOptionProps(this);
      const { sValue: value, sMode: mode, $scopedSlots } = this;
      if (value && localeCode) {
        value.locale(localeCode);
      }
      const {
        prefixCls: customizePrefixCls,
        fullscreen,
        dateFullCellRender,
        monthFullCellRender,
      } = props;
      const headerRender = this.headerRender || $scopedSlots.headerRender;
      const getPrefixCls = this.configProvider.getPrefixCls;
      const prefixCls = getPrefixCls('fullcalendar', customizePrefixCls);

      // To support old version react.
      // Have to add prefixCls on the instance.
      // https://github.com/facebook/react/issues/12397
      this._sPrefixCls = prefixCls;

      let cls = '';
      if (fullscreen) {
        cls += ` ${prefixCls}-fullscreen`;
      }

      const monthCellRender =
        monthFullCellRender || $scopedSlots.monthFullCellRender || this.monthCellRender2;
      const dateCellRender =
        dateFullCellRender || $scopedSlots.dateFullCellRender || this.dateCellRender2;

      let disabledDate = props.disabledDate;

      if (props.validRange) {
        disabledDate = this.getDateRange(props.validRange, disabledDate);
      }
      const fullCalendarProps = {
        props: {
          ...props,
          Select: {},
          locale: locale.lang,
          type: mode === 'year' ? 'month' : 'date',
          prefixCls,
          showHeader: false,
          value,
          monthCellRender,
          dateCellRender,
          disabledDate,
        },
        on: {
          ...getListeners(this),
          select: this.onSelect,
        },
      };
      return (
        <div class={cls}>
          <Header
            fullscreen={fullscreen}
            type={mode}
            headerRender={headerRender}
            value={value}
            locale={locale.lang}
            prefixCls={prefixCls}
            onTypeChange={this.onHeaderTypeChange}
            onValueChange={this.onHeaderValueChange}
            validRange={props.validRange}
          />
          <FullCalendar {...fullCalendarProps} />
        </div>
      );
    },
  },

  render() {
    return (
      <LocaleReceiver
        componentName="Calendar"
        defaultLocale={this.getDefaultLocale}
        scopedSlots={{ default: this.renderCalendar }}
      />
    );
  },
};

/* istanbul ignore next */
Calendar.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Calendar.name, Calendar);
};
export { HeaderProps } from './Header';
export default Calendar;
