import type { PropType } from 'vue';
import { defineComponent, inject } from 'vue';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import { getOptionProps, hasProp } from '../_util/props-util';
import dayjs from 'dayjs';
import FullCalendar from '../vc-calendar/src/FullCalendar';
import Header from './Header';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import interopDefault from '../_util/interopDefault';
import { defaultConfigProvider } from '../config-provider';
import enUS from './locale/en_US';
import { checkValidate, stringToDayjs, dayjsToString, TimeType } from '../_util/dayjs-util';
import { tuple, withInstall } from '../_util/type';

function noop() {
  return null;
}

function zerofixed(v: number) {
  if (v < 10) {
    return `0${v}`;
  }
  return `${v}`;
}

const CalendarModeTypes = tuple('month', 'year');
export type CalendarMode = typeof CalendarModeTypes[number];

export const CalendarProps = {
  monthCellRender: PropTypes.func,
  dateCellRender: PropTypes.func,
  monthFullCellRender: PropTypes.func,
  dateFullCellRender: PropTypes.func,
  prefixCls: PropTypes.string,
  value: TimeType,
  defaultValue: TimeType,
  mode: PropTypes.oneOf(CalendarModeTypes),
  fullscreen: PropTypes.looseBool.def(true),
  locale: PropTypes.object.def({}),
  disabledDate: PropTypes.func,
  validRange: {
    type: Array as PropType<dayjs.Dayjs[]>,
  },
  headerRender: PropTypes.func,
  valueFormat: PropTypes.string,
  onPanelChange: PropTypes.func,
  onSelect: PropTypes.func,
  onChange: PropTypes.func,
  'onUpdate:value': PropTypes.func,
};

const Calendar = defineComponent({
  name: 'ACalendar',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: CalendarProps,
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
      sPrefixCls: undefined,
    };
  },
  data() {
    const { value, defaultValue, valueFormat } = this;
    const sValue = value || defaultValue || interopDefault(dayjs)();
    checkValidate('Calendar', defaultValue, 'defaultValue', valueFormat);
    checkValidate('Calendar', value, 'value', valueFormat);
    return {
      sValue: stringToDayjs(sValue, valueFormat),
      sMode: this.mode || 'month',
    };
  },
  watch: {
    value(val) {
      checkValidate('Calendar', val, 'value', this.valueFormat);
      this.setState({
        sValue: stringToDayjs(val, this.valueFormat),
      });
    },
    mode(val) {
      this.setState({
        sMode: val,
      });
    },
  },
  methods: {
    onHeaderValueChange(value: dayjs.Dayjs) {
      this.setValue(value, 'changePanel');
    },
    onHeaderTypeChange(mode: CalendarMode) {
      this.sMode = mode;
      this.triggerPanelChange(this.sValue, mode);
    },
    triggerPanelChange(value: dayjs.Dayjs, mode: CalendarMode | undefined) {
      const val = this.valueFormat ? dayjsToString(value, this.valueFormat) : value;
      if (value !== this.sValue) {
        this.$emit('update:value', val);
        this.$emit('change', val);
      }
      this.$emit('panelChange', val, mode);
    },

    triggerSelect(value: dayjs.Dayjs) {
      this.setValue(value, 'select');
    },
    setValue(value: dayjs.Dayjs, way: 'select' | 'changePanel') {
      const prevValue = this.value ? stringToDayjs(this.value, this.valueFormat) : this.sValue;
      const { sMode: mode, valueFormat } = this;
      if (!hasProp(this, 'value')) {
        this.setState({ sValue: value });
      }
      if (way === 'select') {
        const val = valueFormat ? dayjsToString(value, valueFormat) : value;
        if (prevValue && prevValue.month() !== value.month()) {
          this.triggerPanelChange(value, mode);
        } else {
          this.$emit('update:value', val);
        }
        this.$emit('select', val);
      } else if (way === 'changePanel') {
        this.triggerPanelChange(value, mode);
      }
    },
    getDateRange(
      validRange: [dayjs.Dayjs, dayjs.Dayjs],
      disabledDate?: (current: dayjs.Dayjs) => boolean,
    ) {
      return (current: dayjs.Dayjs) => {
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
    monthCellRender2({ current: value }) {
      const { sPrefixCls, $slots } = this;
      const monthCellRender: Function = this.monthCellRender || $slots.monthCellRender || noop;
      return (
        <div class={`${sPrefixCls}-month`}>
          <div class={`${sPrefixCls}-value`}>{value.localeData().monthsShort(value)}</div>
          <div class={`${sPrefixCls}-content`}>{monthCellRender({ current: value })}</div>
        </div>
      );
    },

    dateCellRender2({ current: value }) {
      const { sPrefixCls, $slots } = this;
      const dateCellRender: Function = this.dateCellRender || $slots.dateCellRender || noop;
      return (
        <div class={`${sPrefixCls}-date`}>
          <div class={`${sPrefixCls}-value`}>{zerofixed(value.date())}</div>
          <div class={`${sPrefixCls}-content`}>{dateCellRender({ current: value })}</div>
        </div>
      );
    },

    renderCalendar(locale: any, localeCode: string) {
      const props: any = { ...getOptionProps(this), ...this.$attrs };
      const { sValue: value, sMode: mode, $slots } = this;
      if (value && localeCode) {
        value.locale(localeCode);
      }
      const {
        prefixCls: customizePrefixCls,
        fullscreen,
        dateFullCellRender,
        monthFullCellRender,
        class: className,
        style,
      } = props;
      const headerRender = this.headerRender || $slots.headerRender;
      const getPrefixCls = this.configProvider.getPrefixCls;
      const prefixCls = getPrefixCls('fullcalendar', customizePrefixCls);

      // To support old version react.
      // Have to add prefixCls on the instance.
      // https://github.com/facebook/react/issues/12397
      this.sPrefixCls = prefixCls;

      let cls = className || '';
      if (fullscreen) {
        cls += ` ${prefixCls}-fullscreen`;
      }

      const monthCellRender =
        monthFullCellRender || $slots.monthFullCellRender || this.monthCellRender2;
      const dateCellRender =
        dateFullCellRender || $slots.dateFullCellRender || this.dateCellRender2;

      let disabledDate = props.disabledDate;

      if (props.validRange) {
        disabledDate = this.getDateRange(props.validRange, disabledDate);
      }
      const fullCalendarProps = {
        ...props,
        ...this.$attrs,
        Select: {},
        locale: locale.lang,
        type: mode === 'year' ? 'month' : 'date',
        prefixCls,
        showHeader: false,
        value,
        monthCellRender,
        dateCellRender,
        disabledDate,
        onSelect: this.triggerSelect,
      };
      return (
        <div class={cls} style={style}>
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
        children={this.renderCalendar}
      />
    );
  },
});

export { HeaderProps } from './Header';

export default withInstall(Calendar);
