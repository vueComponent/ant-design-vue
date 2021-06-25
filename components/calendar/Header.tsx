import type { PropType } from 'vue';
import { defineComponent, inject } from 'vue';
import Select from '../select';
import { Group, Button } from '../radio';
import PropTypes from '../_util/vue-types';
import { defaultConfigProvider } from '../config-provider';
import type { VueNode } from '../_util/type';
import type moment from 'moment';
import type { RadioChangeEvent } from '../radio/interface';

function getMonthsLocale(value: moment.Moment): string[] {
  const current = value.clone();
  const localeData = value.localeData();
  const months = [];
  for (let i = 0; i < 12; i++) {
    current.month(i);
    months.push(localeData.monthsShort(current));
  }
  return months;
}
export interface RenderHeader {
  value: moment.Moment;
  onChange?: (value: moment.Moment) => void;
  type: string;
  onTypeChange: (type: string) => void;
}
export type HeaderRender = (headerRender: RenderHeader) => VueNode;
export const HeaderProps = {
  prefixCls: PropTypes.string,
  locale: PropTypes.any,
  fullscreen: PropTypes.looseBool,
  yearSelectOffset: PropTypes.number,
  yearSelectTotal: PropTypes.number,
  type: PropTypes.string,
  value: {
    type: Object as PropType<moment.Moment>,
  },
  validRange: {
    type: Array as PropType<moment.Moment[]>,
  },
  headerRender: PropTypes.func,
  onValueChange: PropTypes.func,
  onTypeChange: PropTypes.func,
};

export default defineComponent({
  name: 'CalendarHeader',
  inheritAttrs: false,
  props: {
    ...HeaderProps,
    yearSelectOffset: PropTypes.number.def(10),
    yearSelectTotal: PropTypes.number.def(20),
  },
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
      calendarHeaderNode: undefined,
    };
  },
  // private calendarHeaderNode: HTMLDivElement;
  methods: {
    getYearSelectElement(prefixCls: string, year: number) {
      const { yearSelectOffset, yearSelectTotal, locale = {}, fullscreen, validRange } = this;
      let start = year - yearSelectOffset;
      let end = start + yearSelectTotal;
      if (validRange) {
        start = validRange[0].get('year');
        end = validRange[1].get('year') + 1;
      }
      const suffix = locale && locale.year === '年' ? '年' : '';
      const options: { label: string; value: number }[] = [];
      for (let index = start; index < end; index++) {
        options.push({ label: `${index}${suffix}`, value: index });
      }
      return (
        <Select
          size={fullscreen ? undefined : 'small'}
          class={`${prefixCls}-year-select`}
          onChange={this.onYearChange}
          value={year}
          options={options}
          getPopupContainer={() => this.calendarHeaderNode}
        ></Select>
      );
    },

    getMonthSelectElement(prefixCls: string, month: number, months: string[]) {
      const { fullscreen, validRange, value } = this;
      let start = 0;
      let end = 11;
      if (validRange) {
        const [rangeStart, rangeEnd] = validRange;
        const currentYear = value.get('year');
        if (rangeEnd.get('year') === currentYear) {
          end = rangeEnd.get('month') + 1;
        }
        if (rangeStart.get('year') === currentYear) {
          start = rangeStart.get('month');
        }
      }
      const options: { label: string; value: number }[] = [];
      for (let index = start; index <= end; index += 1) {
        options.push({
          label: months[index],
          value: index,
        });
      }

      return (
        <Select
          size={fullscreen ? undefined : 'small'}
          class={`${prefixCls}-month-select`}
          value={month}
          options={options}
          onChange={this.onMonthChange}
          getPopupContainer={() => this.calendarHeaderNode}
        ></Select>
      );
    },

    onYearChange(year: string) {
      const { value, validRange } = this;
      const newValue = value.clone();
      newValue.year(parseInt(year, 10));
      // switch the month so that it remains within range when year changes
      if (validRange) {
        const [start, end] = validRange;
        const newYear = newValue.get('year');
        const newMonth = newValue.get('month');
        if (newYear === end.get('year') && newMonth > end.get('month')) {
          newValue.month(end.get('month'));
        }
        if (newYear === start.get('year') && newMonth < start.get('month')) {
          newValue.month(start.get('month'));
        }
      }
      this.$emit('valueChange', newValue);
    },

    onMonthChange(month: string) {
      const newValue = this.value.clone();
      newValue.month(parseInt(month, 10));
      this.$emit('valueChange', newValue);
    },

    onInternalTypeChange(e: RadioChangeEvent) {
      this.triggerTypeChange(e.target.value);
    },

    triggerTypeChange(val: string) {
      this.$emit('typeChange', val);
    },
    getMonthYearSelections(getPrefixCls) {
      const { prefixCls: customizePrefixCls, type, value } = this.$props;

      const prefixCls = getPrefixCls('fullcalendar', customizePrefixCls);
      const yearReactNode = this.getYearSelectElement(prefixCls, value.year());
      const monthReactNode =
        type === 'month'
          ? this.getMonthSelectElement(prefixCls, value.month(), getMonthsLocale(value))
          : null;
      return {
        yearReactNode,
        monthReactNode,
      };
    },

    getTypeSwitch() {
      const { locale = {}, type, fullscreen } = this.$props;
      const size = fullscreen ? 'default' : 'small';
      return (
        <Group onChange={this.onInternalTypeChange} value={type} size={size}>
          <Button value="month">{locale.month}</Button>
          <Button value="year">{locale.year}</Button>
        </Group>
      );
    },
    triggerValueChange(...args: any[]) {
      this.$emit('valueChange', ...args);
    },
    saveCalendarHeaderNode(node: HTMLElement) {
      this.calendarHeaderNode = node;
    },
    headerRenderCustom(headerRender: HeaderRender) {
      const { type, value } = this.$props;
      return headerRender({
        value,
        type: type || 'month',
        onChange: this.triggerValueChange,
        onTypeChange: this.triggerTypeChange,
      });
    },
  },

  render() {
    const { prefixCls: customizePrefixCls, headerRender } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('fullcalendar', customizePrefixCls);
    const typeSwitch = this.getTypeSwitch();
    const { yearReactNode, monthReactNode } = this.getMonthYearSelections(getPrefixCls);
    return headerRender ? (
      this.headerRenderCustom(headerRender)
    ) : (
      <div class={`${prefixCls}-header`} ref={this.saveCalendarHeaderNode as any}>
        {yearReactNode}
        {monthReactNode}
        {typeSwitch}
      </div>
    );
  },
});
