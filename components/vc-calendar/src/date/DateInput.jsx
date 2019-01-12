import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
import { getComponentFromProp } from '../../../_util/props-util';
import moment from 'moment';
import { formatDate } from '../util';

const DateInput = {
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    timePicker: PropTypes.object,
    value: PropTypes.object,
    disabledTime: PropTypes.any,
    format: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    locale: PropTypes.object,
    disabledDate: PropTypes.func,
    // onChange: PropTypes.func,
    // onClear: PropTypes.func,
    placeholder: PropTypes.string,
    // onSelect: PropTypes.func,
    selectedValue: PropTypes.object,
    clearIcon: PropTypes.any,
  },

  data() {
    const selectedValue = this.selectedValue;
    return {
      str: formatDate(selectedValue, this.format),
      invalid: false,
      hasFocus: false,
    };
  },
  watch: {
    selectedValue() {
      this.updateState();
    },
    format() {
      this.updateState();
    },
  },

  updated() {
    this.$nextTick(() => {
      if (
        this.$data.hasFocus &&
        !this.invalid &&
        !(this.cachedSelectionStart === 0 && this.cachedSelectionEnd === 0)
      ) {
        this.$refs.dateInputInstance.setSelectionRange(
          this.cachedSelectionStart,
          this.cachedSelectionEnd,
        );
      }
    });
  },
  methods: {
    updateState() {
      this.cachedSelectionStart = this.$refs.dateInputInstance.selectionStart;
      this.cachedSelectionEnd = this.$refs.dateInputInstance.selectionEnd;
      // when popup show, click body will call this, bug!
      const selectedValue = this.selectedValue;
      if (!this.$data.hasFocus) {
        this.setState({
          str: formatDate(selectedValue, this.format),
          invalid: false,
        });
      }
    },
    onInputChange(event) {
      const str = event.target.value;
      const { disabledDate, format, selectedValue } = this.$props;

      // 没有内容，合法并直接退出
      if (!str) {
        this.__emit('change', null);
        this.setState({
          invalid: false,
          str,
        });
        return;
      }

      const parsed = moment(str, format, true);
      if (!parsed.isValid()) {
        this.setState({
          invalid: true,
          str,
        });
        return;
      }
      const value = this.value.clone();
      value
        .year(parsed.year())
        .month(parsed.month())
        .date(parsed.date())
        .hour(parsed.hour())
        .minute(parsed.minute())
        .second(parsed.second());

      if (!value || (disabledDate && disabledDate(value))) {
        this.setState({
          invalid: true,
          str,
        });
        return;
      }

      if (selectedValue !== value || (selectedValue && value && !selectedValue.isSame(value))) {
        this.setState({
          str,
        });
        this.__emit('change', value);
      }
    },

    onClear() {
      this.setState({
        str: '',
      });
      this.__emit('clear', null);
    },

    getRootDOMNode() {
      return this.$el;
    },

    focus() {
      if (this.$refs.dateInputInstance) {
        this.$refs.dateInputInstance.focus();
      }
    },
    onFocus() {
      this.setState({ hasFocus: true });
    },

    onBlur() {
      this.setState((prevState, prevProps) => ({
        hasFocus: false,
        str: formatDate(prevProps.value, prevProps.format),
      }));
    },
  },

  render() {
    const { invalid, str, locale, prefixCls, placeholder, disabled, showClear } = this;
    const clearIcon = getComponentFromProp(this, 'clearIcon');
    const invalidClass = invalid ? `${prefixCls}-input-invalid` : '';
    return (
      <div class={`${prefixCls}-input-wrap`}>
        <div class={`${prefixCls}-date-input-wrap`}>
          <input
            ref="dateInputInstance"
            class={`${prefixCls}-input ${invalidClass}`}
            value={str}
            disabled={disabled}
            placeholder={placeholder}
            onInput={this.onInputChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
          />
        </div>
        {showClear ? (
          <a role="button" title={locale.clear} onClick={this.onClear}>
            {clearIcon || <span class={`${prefixCls}-clear-btn`} />}
          </a>
        ) : null}
      </div>
    );
  },
};

export default DateInput;
