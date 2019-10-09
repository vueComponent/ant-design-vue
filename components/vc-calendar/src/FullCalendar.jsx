import moment from 'moment';
import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import { getOptionProps, hasProp } from '../../_util/props-util';
import DateTable from './date/DateTable';
import MonthTable from './month/MonthTable';
import CalendarMixin, { getNowByCurrentStateValue } from './mixin/CalendarMixin';
import CommonMixin from './mixin/CommonMixin';
import CalendarHeader from './full-calendar/CalendarHeader';
import enUs from './locale/en_US';
const FullCalendar = {
  props: {
    locale: PropTypes.object.def(enUs),
    format: PropTypes.string,
    visible: PropTypes.bool.def(true),
    prefixCls: PropTypes.string.def('rc-calendar'),
    defaultType: PropTypes.string.def('date'),
    type: PropTypes.string,
    fullscreen: PropTypes.bool.def(false),
    monthCellRender: PropTypes.func,
    dateCellRender: PropTypes.func,
    showTypeSwitch: PropTypes.bool.def(true),
    Select: PropTypes.object.isRequired,
    headerComponents: PropTypes.array,
    headerComponent: PropTypes.object, // The whole header component
    headerRender: PropTypes.func,
    showHeader: PropTypes.bool.def(true),
    disabledDate: PropTypes.func,
    value: PropTypes.object,
    defaultValue: PropTypes.object,
    selectedValue: PropTypes.object,
    defaultSelectedValue: PropTypes.object,
    renderFooter: PropTypes.func.def(() => null),
    renderSidebar: PropTypes.func.def(() => null),
  },
  mixins: [BaseMixin, CommonMixin, CalendarMixin],
  data() {
    let type;
    if (hasProp(this, 'type')) {
      type = this.type;
    } else {
      type = this.defaultType;
    }
    const props = this.$props;
    return {
      sType: type,
      sValue: props.value || props.defaultValue || moment(),
      sSelectedValue: props.selectedValue || props.defaultSelectedValue,
    };
  },
  watch: {
    type(val) {
      this.setState({
        sType: val,
      });
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
  methods: {
    onMonthSelect(value) {
      this.onSelect(value, {
        target: 'month',
      });
    },
    setType(type) {
      if (!hasProp(this, 'type')) {
        this.setState({
          sType: type,
        });
      }
      this.__emit('typeChange', type);
    },
  },

  render() {
    const props = getOptionProps(this);
    const {
      locale,
      prefixCls,
      fullscreen,
      showHeader,
      headerComponent,
      headerRender,
      disabledDate,
    } = props;
    const { sValue: value, sType: type, $listeners } = this;

    let header = null;
    if (showHeader) {
      if (headerRender) {
        header = headerRender(value, type, locale);
      } else {
        const TheHeader = headerComponent || CalendarHeader;
        const headerProps = {
          props: {
            ...props,
            prefixCls: `${prefixCls}-full`,
            type,
            value,
          },
          on: {
            ...$listeners,
            typeChange: this.setType,
            valueChange: this.setValue,
          },
          key: 'calendar-header',
        };
        header = <TheHeader {...headerProps} />;
      }
    }

    const table =
      type === 'date' ? (
        <DateTable
          dateRender={props.dateCellRender}
          contentRender={props.dateCellContentRender}
          locale={locale}
          prefixCls={prefixCls}
          onSelect={this.onSelect}
          value={value}
          disabledDate={disabledDate}
        />
      ) : (
        <MonthTable
          cellRender={props.monthCellRender}
          contentRender={props.monthCellContentRender}
          locale={locale}
          onSelect={this.onMonthSelect}
          prefixCls={`${prefixCls}-month-panel`}
          value={value}
          disabledDate={disabledDate}
        />
      );

    const children = [
      header,
      <div key="calendar-body" class={`${prefixCls}-calendar-body`}>
        {table}
      </div>,
    ];

    const className = [`${prefixCls}-full`];

    if (fullscreen) {
      className.push(`${prefixCls}-fullscreen`);
    }

    return this.renderRoot({
      children,
      class: className.join(' '),
    });
  },
};

export default FullCalendar;
