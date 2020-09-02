import { inject } from 'vue';
import moment from 'moment';
import omit from 'lodash-es/omit';
import MonthCalendar from '../vc-calendar/src/MonthCalendar';
import VcDatePicker from '../vc-calendar/src/Picker';
import classNames from '../_util/classNames';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import CalendarOutlined from '@ant-design/icons-vue/CalendarOutlined';
import { ConfigConsumerProps } from '../config-provider';
import interopDefault from '../_util/interopDefault';
import BaseMixin from '../_util/BaseMixin';
import {
  hasProp,
  getOptionProps,
  initDefaultProps,
  getComponent,
  isValidElement,
} from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import { formatDate } from './utils';
import { getDataAndAriaProps } from '../_util/util';

// export const PickerProps = {
//   value?: moment.Moment;
//   prefixCls: string;
// }
export default function createPicker(TheCalendar, props) {
  return {
    inheritAttrs: false,
    props: initDefaultProps(props, {
      allowClear: true,
      showToday: true,
    }),
    mixins: [BaseMixin],
    setup() {
      return {
        configProvider: inject('configProvider', ConfigConsumerProps),
      };
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
      saveInput(node) {
        this.input = node;
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
        this.$emit('change', value, formatDate(value, this.format));
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
        this.input?.focus();
      },

      blur() {
        this.input?.blur();
      },
      renderFooter(...args) {
        const { $slots, _prefixCls: prefixCls } = this;
        const renderExtraFooter = this.renderExtraFooter || $slots.renderExtraFooter;
        return renderExtraFooter ? (
          <div class={`${prefixCls}-footer-extra`}>
            {typeof renderExtraFooter === 'function'
              ? renderExtraFooter(...args)
              : renderExtraFooter}
          </div>
        ) : null;
      },
      onMouseEnter(e) {
        this.$emit('mouseenter', e);
      },
      onMouseLeave(e) {
        this.$emit('mouseleave', e);
      },
    },

    render() {
      const { $slots } = this;
      const { sValue: value, showDate, _open: open } = this.$data;
      let suffixIcon = getComponent(this, 'suffixIcon');
      suffixIcon = Array.isArray(suffixIcon) ? suffixIcon[0] : suffixIcon;
      const props = omit({ ...getOptionProps(this), ...this.$attrs }, ['onChange']);

      const { prefixCls: customizePrefixCls, locale, localeCode, inputReadOnly } = props;
      const getPrefixCls = this.configProvider.getPrefixCls;
      const prefixCls = getPrefixCls('calendar', customizePrefixCls);
      this._prefixCls = prefixCls;

      const dateRender = props.dateRender || $slots.dateRender;
      const monthCellContentRender = props.monthCellContentRender || $slots.monthCellContentRender;
      const placeholder = 'placeholder' in props ? props.placeholder : locale.lang.placeholder;

      const disabledTime = props.showTime ? props.disabledTime : null;

      const calendarClassName = classNames({
        [`${prefixCls}-time`]: props.showTime,
        [`${prefixCls}-month`]: MonthCalendar === TheCalendar,
      });

      if (value && localeCode) {
        value.locale(localeCode);
      }

      const pickerProps = {};
      const calendarProps = {};
      const pickerStyle = {};
      if (props.showTime) {
        // fix https://github.com/ant-design/ant-design/issues/1902
        calendarProps.onSelect = this.handleChange;
        pickerStyle.minWidth = '195px';
      } else {
        pickerProps.onChange = this.handleChange;
      }
      if ('mode' in props) {
        calendarProps.mode = props.mode;
      }
      const theCalendarProps = {
        ...calendarProps,
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
        inputReadOnly,
        onOk: props.onOk,
        onPanelChange: props.onPanelChange,
        onChange: this.handleCalendarChange,
        class: calendarClassName,
      };
      const calendar = <TheCalendar {...theCalendarProps} vSlots={$slots} />;

      const clearIcon =
        !props.disabled && props.allowClear && value ? (
          <CloseCircleFilled class={`${prefixCls}-picker-clear`} onClick={this.clearSelection} />
        ) : null;

      const inputIcon = (suffixIcon &&
        (isValidElement(suffixIcon) ? (
          cloneElement(suffixIcon, {
            class: `${prefixCls}-picker-icon`,
          })
        ) : (
          <span class={`${prefixCls}-picker-icon`}>{suffixIcon}</span>
        ))) || <CalendarOutlined class={`${prefixCls}-picker-icon`} />;

      const input = ({ value: inputValue }) => (
        <div>
          <input
            ref={this.saveInput}
            disabled={props.disabled}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            readonly
            value={formatDate(inputValue, this.format)}
            placeholder={placeholder}
            class={props.pickerInputClass}
            tabindex={props.tabindex}
            name={this.name}
          />
          {clearIcon}
          {inputIcon}
        </div>
      );
      const vcDatePickerProps = {
        ...props,
        ...pickerProps,
        calendar,
        value,
        prefixCls: `${prefixCls}-picker-container`,
        open,
        onOpenChange: this.handleOpenChange,
        style: props.popupStyle,
      };
      return (
        <span
          id={props.id}
          class={classNames(props.class, props.pickerClass)}
          style={{ ...pickerStyle, ...props.style }}
          // tabindex={props.disabled ? -1 : 0}
          // onFocus={focus}
          // onBlur={blur}
          {...getDataAndAriaProps(this.$attrs)}
          onMouseenter={this.onMouseEnter}
          onMouseleave={this.onMouseLeave}
        >
          <VcDatePicker
            {...vcDatePickerProps}
            vSlots={{ default: input, ...$slots }}
          ></VcDatePicker>
        </span>
      );
    },
  };
}
