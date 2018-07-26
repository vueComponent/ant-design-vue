
import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
import moment from 'moment';

var DateInput = {
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    timePicker: PropTypes.object,
    value: PropTypes.object,
    disabledTime: PropTypes.any,
    format: PropTypes.string,
    locale: PropTypes.object,
    disabledDate: PropTypes.func,
    // onChange: PropTypes.func,
    // onClear: PropTypes.func,
    placeholder: PropTypes.string,
    // onSelect: PropTypes.func,
    selectedValue: PropTypes.object
  },

  data: function data() {
    var selectedValue = this.selectedValue;
    return {
      str: selectedValue && selectedValue.format(this.format) || '',
      invalid: false
    };
  },

  watch: {
    selectedValue: function selectedValue() {
      this.updateState();
    },
    format: function format() {
      this.updateState();
    }
  },

  updated: function updated() {
    var _this = this;

    this.$nextTick(function () {
      if (!_this.invalid) {
        _this.$refs.dateInputInstance.setSelectionRange(_this.cachedSelectionStart, _this.cachedSelectionEnd);
      }
    });
  },

  methods: {
    updateState: function updateState() {
      this.cachedSelectionStart = this.$refs.dateInputInstance.selectionStart;
      this.cachedSelectionEnd = this.$refs.dateInputInstance.selectionEnd;
      // when popup show, click body will call this, bug!
      var selectedValue = this.selectedValue;
      this.setState({
        str: selectedValue && selectedValue.format(this.format) || '',
        invalid: false
      });
    },
    onInputChange: function onInputChange(event) {
      var str = event.target.value;
      this.setState({
        str: str
      });
      var value = void 0;
      var disabledDate = this.disabledDate,
          format = this.format;

      if (str) {
        var parsed = moment(str, format, true);
        if (!parsed.isValid()) {
          this.setState({
            invalid: true
          });
          return;
        }
        value = this.value.clone();
        value.year(parsed.year()).month(parsed.month()).date(parsed.date()).hour(parsed.hour()).minute(parsed.minute()).second(parsed.second());

        if (value && (!disabledDate || !disabledDate(value))) {
          var originalValue = this.selectedValue;
          if (originalValue && value) {
            if (!originalValue.isSame(value)) {
              this.__emit('change', value);
            }
          } else if (originalValue !== value) {
            this.__emit('change', value);
          }
        } else {
          this.setState({
            invalid: true
          });
          return;
        }
      } else {
        this.__emit('change', null);
      }
      this.setState({
        invalid: false
      });
    },
    onClear: function onClear() {
      this.setState({
        str: ''
      });
      this.__emit('clear', null);
    },
    getRootDOMNode: function getRootDOMNode() {
      return this.$el;
    },
    focus: function focus() {
      if (this.$refs.dateInputInstance) {
        this.$refs.dateInputInstance.focus();
      }
    }
  },

  render: function render() {
    var h = arguments[0];
    var invalid = this.invalid,
        str = this.str,
        locale = this.locale,
        prefixCls = this.prefixCls,
        placeholder = this.placeholder,
        disabled = this.disabled,
        showClear = this.showClear;

    var invalidClass = invalid ? prefixCls + '-input-invalid' : '';
    return h(
      'div',
      { 'class': prefixCls + '-input-wrap' },
      [h(
        'div',
        { 'class': prefixCls + '-date-input-wrap' },
        [h('input', {
          ref: 'dateInputInstance',
          'class': prefixCls + '-input ' + invalidClass,
          domProps: {
            'value': str
          },
          attrs: {
            disabled: disabled,
            placeholder: placeholder
          },
          on: {
            'input': this.onInputChange
          }
        })]
      ), showClear ? h('a', {
        'class': prefixCls + '-clear-btn',
        attrs: { role: 'button',
          title: locale.clear
        },
        on: {
          'click': this.onClear
        }
      }) : null]
    );
  }
};

export default DateInput;