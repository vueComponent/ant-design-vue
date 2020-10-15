import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
import { getComponent, findDOMNode } from '../../../_util/props-util';
import moment from 'moment';
import { formatDate } from '../util';
import KeyCode from '../../../_util/KeyCode';
import { withDirectives } from 'vue';
import antInput from '../../../_util/antInputDirective';

let cachedSelectionStart;
let cachedSelectionEnd;
let dateInputInstance;

const DateInput = {
  name: 'DateInput',
  inheritAttrs: false,
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    timePicker: PropTypes.object,
    value: PropTypes.object,
    disabledTime: PropTypes.any,
    format: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.func,
    ]),
    locale: PropTypes.object,
    disabledDate: PropTypes.func,
    // onChange: PropTypes.func,
    // onClear: PropTypes.func,
    placeholder: PropTypes.string,
    // onSelect: PropTypes.func,
    selectedValue: PropTypes.object,
    clearIcon: PropTypes.any,
    inputMode: PropTypes.string,
    inputReadOnly: PropTypes.looseBool,
    disabled: PropTypes.looseBool,
    showClear: PropTypes.looseBool,
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
      this.setState();
    },
    format() {
      this.setState();
    },
  },

  updated() {
    this.$nextTick(() => {
      if (
        dateInputInstance &&
        this.$data.hasFocus &&
        !this.invalid &&
        !(cachedSelectionStart === 0 && cachedSelectionEnd === 0)
      ) {
        dateInputInstance.setSelectionRange(cachedSelectionStart, cachedSelectionEnd);
      }
    });
  },
  getInstance() {
    return dateInputInstance;
  },
  methods: {
    getDerivedStateFromProps(nextProps, state) {
      let newState = {};
      if (dateInputInstance) {
        cachedSelectionStart = dateInputInstance.selectionStart;
        cachedSelectionEnd = dateInputInstance.selectionEnd;
      }
      // when popup show, click body will call this, bug!
      const selectedValue = nextProps.selectedValue;
      if (!state.hasFocus) {
        newState = {
          str: formatDate(selectedValue, this.format),
          invalid: false,
        };
      }
      return newState;
    },
    onClear() {
      this.setState({
        str: '',
      });
      this.__emit('clear', null);
    },
    onInputChange(e) {
      const { value: str, composing } = e.target;
      const { str: oldStr = '' } = this;
      if (e.isComposing || composing || oldStr === str) return;

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

      // 不合法直接退出
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
          invalid: false,
          str,
        });
        this.__emit('change', value);
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
    onKeyDown(event) {
      const { keyCode } = event;
      const { value, disabledDate } = this.$props;
      if (keyCode === KeyCode.ENTER) {
        const validateDate = !disabledDate || !disabledDate(value);
        if (validateDate) {
          this.__emit('select', value.clone());
        }
        event.preventDefault();
      }
    },
    getRootDOMNode() {
      return findDOMNode(this);
    },
    focus() {
      if (dateInputInstance) {
        dateInputInstance.focus();
      }
    },
    saveDateInput(dateInput) {
      dateInputInstance = dateInput;
    },
  },

  render() {
    const {
      invalid,
      str,
      locale,
      prefixCls,
      placeholder,
      disabled,
      showClear,
      inputMode,
      inputReadOnly,
    } = this;
    const clearIcon = getComponent(this, 'clearIcon');
    const invalidClass = invalid ? `${prefixCls}-input-invalid` : '';
    return (
      <div class={`${prefixCls}-input-wrap`}>
        <div class={`${prefixCls}-date-input-wrap`}>
          {withDirectives(
            <input
              ref={this.saveDateInput}
              class={`${prefixCls}-input ${invalidClass}`}
              value={str}
              disabled={disabled}
              placeholder={placeholder}
              onInput={this.onInputChange}
              onChange={this.onInputChange}
              onKeydown={this.onKeyDown}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              inputMode={inputMode}
              readonly={inputReadOnly}
            />,
            [[antInput]],
          )}
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
