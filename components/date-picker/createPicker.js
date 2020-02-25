import * as moment from 'moment';
import omit from 'lodash/omit';
import MonthCalendar from '../vc-calendar/src/MonthCalendar';
import VcDatePicker from '../vc-calendar/src/Picker';
import classNames from 'classnames';
import Icon from '../icon';
import { ConfigConsumerProps } from '../config-provider';
import interopDefault from '../_util/interopDefault';
import BaseMixin from '../_util/BaseMixin';
import {
  hasProp,
  getOptionProps,
  initDefaultProps,
  mergeProps,
  getComponentFromProp,
  isValidElement,
  getListeners,
} from '../_util/props-util';
import { cloneElement } from '../_util/vnode';

// export const PickerProps = {
//   value?: moment.Moment;
//   prefixCls: string;
// }
function noop() {}
export default function createPicker(TheCalendar, props) {
  return {
    props: initDefaultProps(props, {
      allowClear: true,
      showToday: true,
    }),
    mixins: [BaseMixin],
    model: {
      prop: 'value',
      event: 'change',
    },
    inject: {
      configProvider: { default: () => ConfigConsumerProps },
    },
    data() {
      const value = this.value || this.defaultValue;
      if (value && !interopDefault(moment).isMoment(value)) {
        throw new Error(
          'The value/defaultValue of DatePicker or MonthPicker must be ' + 'a moment object',
        );
      }
      return {
        sValue: value,
        showDate: value,
        _open: !!this.open,
      };
    },
    watch: {
      open(val) {
        const props = getOptionProps(this);
        const state = {};
        state._open = val;
        if ('value' in props && !val && props.value !== this.showDate) {
          state.showDate = props.value;
        }
        this.setState(state);
      },
      value(val) {
        const state = {};
        state.sValue = val;
        if (val !== this.sValue) {
          state.showDate = val;
        }
        this.setState(state);
      },
      _open(val, oldVal) {
        this.$nextTick(() => {
          if (!hasProp(this, 'open') && oldVal && !val) {
            this.focus();
          }
        });
      },
    },
    methods: {
      renderFooter(...args) {
        const { $scopedSlots, $slots, _prefixCls: prefixCls } = this;
        const renderExtraFooter =
          this.renderExtraFooter || $scopedSlots.renderExtraFooter || $slots.renderExtraFooter;
        return renderExtraFooter ? (
          <div class={`${prefixCls}-footer-extra`}>
            {typeof renderExtraFooter === 'function'
              ? renderExtraFooter(...args)
              : renderExtraFooter}
          </div>
        ) : null;
      },

      clearSelection(e) {
        e.preventDefault();
        e.stopPropagation();
        this.handleChange(null);
      },

      handleChange(value) {
        if (!hasProp(this, 'value')) {
          this.setState({
            sValue: value,
            showDate: value,
          });
        }
        this.$emit('change', value, (value && value.format(this.format)) || '');
      },

      handleCalendarChange(value) {
        this.setState({ showDate: value });
      },
      handleOpenChange(open) {
        const props = getOptionProps(this);
        if (!('open' in props)) {
          this.setState({ _open: open });
        }
        this.$emit('openChange', open);
      },
      focus() {
        this.$refs.input.focus();
      },

      blur() {
        this.$refs.input.blur();
      },
      onMouseEnter(e) {
        this.$emit('mouseenter', e);
      },
      onMouseLeave(e) {
        this.$emit('mouseleave', e);
      },
    },

    render() {
      const { $scopedSlots } = this;
      const { sValue: value, showDate, _open: open } = this.$data;
      let suffixIcon = getComponentFromProp(this, 'suffixIcon');
      suffixIcon = Array.isArray(suffixIcon) ? suffixIcon[0] : suffixIcon;
      const listeners = getListeners(this);
      const { panelChange = noop, focus = noop, blur = noop, ok = noop } = listeners;
      const props = getOptionProps(this);

      const { prefixCls: customizePrefixCls, locale, localeCode } = props;
      const getPrefixCls = this.configProvider.getPrefixCls;
      const prefixCls = getPrefixCls('calendar', customizePrefixCls);
      this._prefixCls = prefixCls;

      const dateRender = props.dateRender || $scopedSlots.dateRender;
      const monthCellContentRender =
        props.monthCellContentRender || $scopedSlots.monthCellContentRender;
      const placeholder = 'placeholder' in props ? props.placeholder : locale.lang.placeholder;

      const disabledTime = props.showTime ? props.disabledTime : null;

      const calendarClassName = classNames({
        [`${prefixCls}-time`]: props.showTime,
        [`${prefixCls}-month`]: MonthCalendar === TheCalendar,
      });

      if (value && localeCode) {
        value.locale(localeCode);
      }

      const pickerProps = { props: {}, on: {} };
      const calendarProps = { props: {}, on: {} };
      const pickerStyle = {};
      if (props.showTime) {
        // fix https://github.com/ant-design/ant-design/issues/1902
        calendarProps.on.select = this.handleChange;
        pickerStyle.width = '195px';
      } else {
        pickerProps.on.change = this.handleChange;
      }
      if ('mode' in props) {
        calendarProps.props.mode = props.mode;
      }
      const theCalendarProps = mergeProps(calendarProps, {
        props: {
          disabledDate: props.disabledDate,
          disabledTime,
          locale: locale.lang,
          timePicker: props.timePicker,
          defaultValue: props.defaultPickerValue || interopDefault(moment)(),
          dateInputPlaceholder: placeholder,
          prefixCls,
          dateRender,
          format: props.format,
          showToday: props.showToday,
          monthCellContentRender,
          renderFooter: this.renderFooter,
          value: showDate,
        },
        on: {
          ok: ok,
          panelChange,
          change: this.handleCalendarChange,
        },
        class: calendarClassName,
        scopedSlots: $scopedSlots,
      });
      const calendar = <TheCalendar {...theCalendarProps} />;

      const clearIcon =
        !props.disabled && props.allowClear && value ? (
          <Icon
            type="close-circle"
            class={`${prefixCls}-picker-clear`}
            onClick={this.clearSelection}
            theme="filled"
          />
        ) : null;

      const inputIcon = (suffixIcon &&
        (isValidElement(suffixIcon) ? (
          cloneElement(suffixIcon, {
            class: `${prefixCls}-picker-icon`,
          })
        ) : (
          <span class={`${prefixCls}-picker-icon`}>{suffixIcon}</span>
        ))) || <Icon type="calendar" class={`${prefixCls}-picker-icon`} />;

      const input = ({ value: inputValue }) => (
        <div>
          <input
            ref="input"
            disabled={props.disabled}
            onFocus={focus}
            onBlur={blur}
            readOnly
            value={(inputValue && inputValue.format(props.format)) || ''}
            placeholder={placeholder}
            class={props.pickerInputClass}
            tabIndex={props.tabIndex}
          />
          {clearIcon}
          {inputIcon}
        </div>
      );
      const vcDatePickerProps = {
        props: {
          ...props,
          ...pickerProps.props,
          calendar,
          value,
          prefixCls: `${prefixCls}-picker-container`,
        },
        on: {
          ...omit(listeners, 'change'),
          ...pickerProps.on,
          open,
          onOpenChange: this.handleOpenChange,
        },
        style: props.popupStyle,
        scopedSlots: { default: input, ...$scopedSlots },
      };
      return (
        <span
          class={props.pickerClass}
          style={pickerStyle}
          // tabIndex={props.disabled ? -1 : 0}
          // onFocus={focus}
          // onBlur={blur}
          onMouseenter={this.onMouseEnter}
          onMouseleave={this.onMouseLeave}
        >
          <VcDatePicker {...vcDatePickerProps} />
        </span>
      );
    },
  };
}
