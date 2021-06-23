import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import moment from 'moment';
import { withDirectives } from 'vue';
import antInput from '../_util/antInputDirective';

const Header = {
  inheritAttrs: false,
  name: 'Header',
  mixins: [BaseMixin],
  props: {
    format: PropTypes.string,
    prefixCls: PropTypes.string,
    disabledDate: PropTypes.func,
    placeholder: PropTypes.string,
    clearText: PropTypes.string,
    value: PropTypes.object,
    inputReadOnly: PropTypes.looseBool.def(false),
    hourOptions: PropTypes.array,
    minuteOptions: PropTypes.array,
    secondOptions: PropTypes.array,
    disabledHours: PropTypes.func,
    disabledMinutes: PropTypes.func,
    disabledSeconds: PropTypes.func,
    // onChange: PropTypes.func,
    // onClear: PropTypes.func,
    // onEsc: PropTypes.func,
    allowEmpty: PropTypes.looseBool,
    defaultOpenValue: PropTypes.object,
    currentSelectPanel: PropTypes.string,
    focusOnOpen: PropTypes.looseBool,
    // onKeyDown: PropTypes.func,
    clearIcon: PropTypes.any,
  },
  data() {
    const { value, format } = this;
    return {
      str: (value && value.format(format)) || '',
      invalid: false,
    };
  },

  mounted() {
    if (this.focusOnOpen) {
      // Wait one frame for the panel to be positioned before focusing
      const requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
      requestAnimationFrame(() => {
        this.refInput.focus();
        this.refInput.select();
      });
    }
  },
  watch: {
    value(val) {
      this.$nextTick(() => {
        this.setState({
          str: (val && val.format(this.format)) || '',
          invalid: false,
        });
      });
    },
  },

  methods: {
    onInputChange(e) {
      const { value: str, composing } = e.target;
      const { str: oldStr = '' } = this;
      if (e.isComposing || composing || oldStr === str) return;

      this.setState({
        str,
      });
      const {
        format,
        hourOptions,
        minuteOptions,
        secondOptions,
        disabledHours,
        disabledMinutes,
        disabledSeconds,
        value: originalValue,
      } = this;

      if (str) {
        const value = this.getProtoValue().clone();
        const parsed = moment(str, format, true);
        if (!parsed.isValid()) {
          this.setState({
            invalid: true,
          });
          return;
        }
        value.hour(parsed.hour()).minute(parsed.minute()).second(parsed.second());

        // if time value not allowed, response warning.
        if (
          hourOptions.indexOf(value.hour()) < 0 ||
          minuteOptions.indexOf(value.minute()) < 0 ||
          secondOptions.indexOf(value.second()) < 0
        ) {
          this.setState({
            invalid: true,
          });
          return;
        }

        // if time value is disabled, response warning.
        const disabledHourOptions = disabledHours();
        const disabledMinuteOptions = disabledMinutes(value.hour());
        const disabledSecondOptions = disabledSeconds(value.hour(), value.minute());
        if (
          (disabledHourOptions && disabledHourOptions.indexOf(value.hour()) >= 0) ||
          (disabledMinuteOptions && disabledMinuteOptions.indexOf(value.minute()) >= 0) ||
          (disabledSecondOptions && disabledSecondOptions.indexOf(value.second()) >= 0)
        ) {
          this.setState({
            invalid: true,
          });
          return;
        }

        if (originalValue) {
          if (
            originalValue.hour() !== value.hour() ||
            originalValue.minute() !== value.minute() ||
            originalValue.second() !== value.second()
          ) {
            // keep other fields for rc-calendar
            const changedValue = originalValue.clone();
            changedValue.hour(value.hour());
            changedValue.minute(value.minute());
            changedValue.second(value.second());
            this.__emit('change', changedValue);
          }
        } else if (originalValue !== value) {
          this.__emit('change', value);
        }
      } else {
        this.__emit('change', null);
      }

      this.setState({
        invalid: false,
      });
    },

    onKeyDown(e) {
      if (e.keyCode === 27) {
        this.__emit('esc');
      }
      this.__emit('keydown', e);
    },

    getProtoValue() {
      return this.value || this.defaultOpenValue;
    },

    getInput() {
      const { prefixCls, placeholder, inputReadOnly, invalid, str } = this;
      const invalidClass = invalid ? `${prefixCls}-input-invalid` : '';
      return withDirectives(
        <input
          class={`${prefixCls}-input ${invalidClass}`}
          ref={ref => {
            this.refInput = ref;
          }}
          onKeydown={this.onKeyDown}
          value={str}
          placeholder={placeholder}
          onInput={this.onInputChange}
          onChange={this.onInputChange}
          readonly={!!inputReadOnly}
        />,
        [[antInput]],
      );
    },
  },

  render() {
    const { prefixCls } = this;
    return <div class={`${prefixCls}-input-wrap`}>{this.getInput()}</div>;
  },
};

export default Header;
