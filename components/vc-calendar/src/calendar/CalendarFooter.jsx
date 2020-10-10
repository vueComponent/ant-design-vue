import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
import { getOptionProps, findDOMNode } from '../../../_util/props-util';
import TodayButton from './TodayButton';
import OkButton from './OkButton';
import TimePickerButton from './TimePickerButton';

const CalendarFooter = {
  name: 'CalendarFooter',
  inheritAttrs: false,
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    showDateInput: PropTypes.looseBool,
    disabledTime: PropTypes.any,
    timePicker: PropTypes.any,
    selectedValue: PropTypes.any,
    showOk: PropTypes.looseBool,
    // onSelect: PropTypes.func,
    value: PropTypes.object,
    renderFooter: PropTypes.func,
    defaultValue: PropTypes.object,
    locale: PropTypes.object,
    showToday: PropTypes.looseBool,
    disabledDate: PropTypes.func,
    showTimePicker: PropTypes.looseBool,
    okDisabled: PropTypes.looseBool,
    mode: PropTypes.string,
  },
  methods: {
    onSelect(value) {
      this.__emit('select', value);
    },

    getRootDOMNode() {
      return findDOMNode(this);
    },
  },

  render() {
    const props = getOptionProps(this);
    const { value, prefixCls, showOk, timePicker, renderFooter, showToday, mode } = props;
    let footerEl = null;
    const extraFooter = renderFooter && renderFooter(mode);
    if (showToday || timePicker || extraFooter) {
      const btnProps = {
        ...props,
        ...this.$attrs,
        value,
      };
      let nowEl = null;
      if (showToday) {
        nowEl = <TodayButton key="todayButton" {...btnProps} />;
      }
      delete btnProps.value;
      let okBtn = null;
      if (showOk === true || (showOk !== false && !!timePicker)) {
        okBtn = <OkButton key="okButton" {...btnProps} />;
      }
      let timePickerBtn = null;
      if (timePicker) {
        timePickerBtn = <TimePickerButton key="timePickerButton" {...btnProps} />;
      }

      let footerBtn;
      if (nowEl || timePickerBtn || okBtn || extraFooter) {
        footerBtn = (
          <span class={`${prefixCls}-footer-btn`}>
            {extraFooter}
            {nowEl}
            {timePickerBtn}
            {okBtn}
          </span>
        );
      }
      const cls = {
        [`${prefixCls}-footer`]: true,
        [`${prefixCls}-footer-show-ok`]: !!okBtn,
      };
      footerEl = <div class={cls}>{footerBtn}</div>;
    }
    return footerEl;
  },
};

export default CalendarFooter;
