import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
import { getOptionProps, getListeners } from '../../../_util/props-util';
import TodayButton from './TodayButton';
import OkButton from './OkButton';
import TimePickerButton from './TimePickerButton';

const CalendarFooter = {
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    showDateInput: PropTypes.bool,
    disabledTime: PropTypes.any,
    timePicker: PropTypes.any,
    selectedValue: PropTypes.any,
    showOk: PropTypes.bool,
    // onSelect: PropTypes.func,
    value: PropTypes.object,
    renderFooter: PropTypes.func,
    defaultValue: PropTypes.object,
    locale: PropTypes.object,
    showToday: PropTypes.bool,
    disabledDate: PropTypes.func,
    showTimePicker: PropTypes.bool,
    okDisabled: PropTypes.bool,
    mode: PropTypes.string,
  },
  methods: {
    onSelect(value) {
      this.__emit('select', value);
    },

    getRootDOMNode() {
      return this.$el;
    },
  },

  render() {
    const props = getOptionProps(this);
    const { value, prefixCls, showOk, timePicker, renderFooter, showToday, mode } = props;
    let footerEl = null;
    const extraFooter = renderFooter && renderFooter(mode);
    if (showToday || timePicker || extraFooter) {
      const btnProps = {
        props: {
          ...props,
          value: value,
        },
        on: getListeners(this),
      };
      let nowEl = null;
      if (showToday) {
        nowEl = <TodayButton key="todayButton" {...btnProps} />;
      }
      delete btnProps.props.value;
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
