import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import { getOptionProps, hasProp, initDefaultProps, getListeners } from '../_util/props-util';
import * as moment from 'moment';
import FullCalendar from '../vc-calendar/src/FullCalendar';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import Header from './Header';
import interopDefault from '../_util/interopDefault';
import { ConfigConsumerProps } from '../config-provider';
import enUS from './locale/en_US';
import Base from '../base';

function noop() {
  return null;
}

function zerofixed(v) {
  if (v < 10) {
    return `0${v}`;
  }
  return `${v}`;
}
export const MomentType = {
  type: Object,
  validator: function(value) {
    return moment.isMoment(value);
  },
};
function isMomentArray(value) {
  return Array.isArray(value) && !!value.find(val => moment.isMoment(val));
}
export const CalendarMode = PropTypes.oneOf(['month', 'year']);

export const CalendarProps = () => ({
  prefixCls: PropTypes.string,
  value: MomentType,
  defaultValue: MomentType,
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
});

const Calendar = {
  name: 'ACalendar',
  mixins: [BaseMixin],
  props: initDefaultProps(CalendarProps(), {
    locale: {},
    fullscreen: true,
    mode: 'month',
  }),
  model: {
    prop: 'value',
    event: 'change',
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    const value = this.value || this.defaultValue || interopDefault(moment)();
    if (!interopDefault(moment).isMoment(value)) {
      throw new Error('The value/defaultValue of Calendar must be a moment object, ');
    }
    this._sPrefixCls = undefined;
    return {
      sValue: value,
      sMode: this.mode,
    };
  },
  watch: {
    value(val) {
      this.setState({
        sValue: val,
      });
    },
    mode(val) {
      this.setState({
        sMode: val,
      });
    },
  },
  methods: {
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

    setValue(value, way) {
      if (way === 'select') {
        this.$emit('select', value);
      } else if (way === 'changePanel') {
        this.onPanelChange(value, this.sMode);
      }
      if (!hasProp(this, 'value')) {
        this.setState({ sValue: value });
      }
    },

    setType(type) {
      const mode = type === 'date' ? 'month' : 'year';
      if (this.sMode !== mode) {
        this.setState({ sMode: mode });
        this.onPanelChange(this.sValue, mode);
      }
    },

    onHeaderValueChange(value) {
      this.setValue(value, 'changePanel');
    },

    onHeaderTypeChange(type) {
      this.setType(type);
    },

    onPanelChange(value, mode) {
      this.$emit('panelChange', value, mode);
      if (value !== this.sValue) {
        this.$emit('change', value);
      }
    },

    onSelect(value) {
      this.setValue(value, 'select');
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
      const getPrefixCls = this.configProvider.getPrefixCls;
      const prefixCls = getPrefixCls('fullcalendar', customizePrefixCls);
      const type = mode === 'year' ? 'month' : 'date';

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
          type: type,
          prefixCls: prefixCls,
          showHeader: false,
          value: value,
          monthCellRender: monthCellRender,
          dateCellRender: dateCellRender,
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
            type={type}
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
