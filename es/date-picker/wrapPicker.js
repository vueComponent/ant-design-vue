import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';

import TimePickerPanel from '../vc-time-picker/Panel';
import classNames from 'classnames';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { generateShowHourMinuteSecond } from '../time-picker';
import enUS from './locale/en_US';
import { getOptionProps, initDefaultProps } from '../_util/props-util';

function getColumns(_ref) {
  var showHour = _ref.showHour,
      showMinute = _ref.showMinute,
      showSecond = _ref.showSecond,
      use12Hours = _ref.use12Hours;

  var column = 0;
  if (showHour) {
    column += 1;
  }
  if (showMinute) {
    column += 1;
  }
  if (showSecond) {
    column += 1;
  }
  if (use12Hours) {
    column += 1;
  }
  return column;
}

export default function wrapPicker(Picker, props, defaultFormat) {
  return {
    name: Picker.name,
    props: initDefaultProps(props, {
      format: defaultFormat || 'YYYY-MM-DD',
      transitionName: 'slide-up',
      popupStyle: {},
      locale: {},
      prefixCls: 'ant-calendar',
      inputPrefixCls: 'ant-input'
    }),
    model: {
      prop: 'value',
      event: 'change'
    },

    mounted: function mounted() {
      var _this = this;

      var autoFocus = this.autoFocus,
          disabled = this.disabled;

      if (autoFocus && !disabled) {
        this.$nextTick(function () {
          _this.focus();
        });
      }
    },

    methods: {
      handleOpenChange: function handleOpenChange(open) {
        this.$emit('openChange', open);
      },
      handleFocus: function handleFocus(e) {
        this.$emit('focus', e);
      },
      handleBlur: function handleBlur(e) {
        this.$emit('blur', e);
      },
      focus: function focus() {
        this.$refs.picker.focus();
      },
      blur: function blur() {
        this.$refs.picker.blur();
      },
      getDefaultLocale: function getDefaultLocale() {
        var result = _extends({}, enUS, this.locale);
        result.lang = _extends({}, result.lang, (this.locale || {}).lang);
        return result;
      },
      renderPicker: function renderPicker(locale, localeCode) {
        var _classNames2;

        var h = this.$createElement;

        var props = getOptionProps(this);
        var prefixCls = props.prefixCls,
            inputPrefixCls = props.inputPrefixCls,
            size = props.size,
            showTime = props.showTime,
            disabled = props.disabled;

        var pickerClass = classNames(prefixCls + '-picker', _defineProperty({}, prefixCls + '-picker-' + size, !!size));
        var pickerInputClass = classNames(prefixCls + '-picker-input', inputPrefixCls, (_classNames2 = {}, _defineProperty(_classNames2, inputPrefixCls + '-lg', size === 'large'), _defineProperty(_classNames2, inputPrefixCls + '-sm', size === 'small'), _defineProperty(_classNames2, inputPrefixCls + '-disabled', disabled), _classNames2));

        var timeFormat = showTime && showTime.format || 'HH:mm:ss';
        var vcTimePickerProps = _extends({}, generateShowHourMinuteSecond(timeFormat), {
          format: timeFormat,
          use12Hours: showTime && showTime.use12Hours
        });
        var columns = getColumns(vcTimePickerProps);
        var timePickerCls = prefixCls + '-time-picker-column-' + columns;
        var timePickerPanelProps = {
          props: _extends({}, vcTimePickerProps, showTime, {
            prefixCls: prefixCls + '-time-picker',
            placeholder: locale.timePickerLocale.placeholder,
            transitionName: 'slide-up'
          }),
          'class': timePickerCls
        };
        var timePicker = showTime ? h(TimePickerPanel, timePickerPanelProps) : null;
        var pickerProps = {
          props: _extends({}, props, {
            pickerClass: pickerClass,
            pickerInputClass: pickerInputClass,
            locale: locale,
            localeCode: localeCode,
            timePicker: timePicker
          }),
          on: _extends({}, this.$listeners, {
            openChange: this.handleOpenChange,
            focus: this.handleFocus,
            blur: this.handleBlur
          }),
          ref: 'picker',
          scopedSlots: this.$scopedSlots || {}
        };
        return h(
          Picker,
          pickerProps,
          [h(
            'template',
            { slot: 'renderExtraFooter' },
            [this.$slots.renderExtraFooter]
          )]
        );
      }
    },

    render: function render() {
      var h = arguments[0];

      return h(LocaleReceiver, {
        attrs: {
          componentName: 'DatePicker',
          defaultLocale: this.getDefaultLocale
        },
        scopedSlots: { 'default': this.renderPicker }
      });
    }
  };
}