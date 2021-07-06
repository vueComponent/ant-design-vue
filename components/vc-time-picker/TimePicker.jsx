import moment from 'moment';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import {
  initDefaultProps,
  hasProp,
  getComponent,
  isValidElement,
  getEvents,
} from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import Trigger from '../vc-trigger';
import Panel from './Panel';
import placements from './placements';
import { defineComponent } from 'vue';

function noop() {}
function refFn(field, component) {
  this[field] = component;
}

export default defineComponent({
  name: 'VcTimePicker',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: initDefaultProps(
    {
      prefixCls: PropTypes.string,
      clearText: PropTypes.string,
      value: PropTypes.any,
      defaultOpenValue: {
        type: Object,
        default: () => {
          return moment();
        },
      },
      pickerInputClass: String,
      inputReadOnly: PropTypes.looseBool,
      disabled: PropTypes.looseBool,
      allowEmpty: PropTypes.looseBool,
      defaultValue: PropTypes.any,
      open: PropTypes.looseBool,
      defaultOpen: PropTypes.looseBool,
      align: PropTypes.object,
      placement: PropTypes.any,
      transitionName: PropTypes.string,
      getPopupContainer: PropTypes.func,
      placeholder: PropTypes.string,
      format: PropTypes.string,
      showHour: PropTypes.looseBool,
      showMinute: PropTypes.looseBool,
      showSecond: PropTypes.looseBool,
      popupClassName: PropTypes.string,
      popupStyle: PropTypes.object,
      disabledHours: PropTypes.func,
      disabledMinutes: PropTypes.func,
      disabledSeconds: PropTypes.func,
      hideDisabledOptions: PropTypes.looseBool,
      // onChange: PropTypes.func,
      // onAmPmChange: PropTypes.func,
      // onOpen: PropTypes.func,
      // onClose: PropTypes.func,
      // onFocus: PropTypes.func,
      // onBlur: PropTypes.func,
      name: PropTypes.string,
      autocomplete: PropTypes.string,
      use12Hours: PropTypes.looseBool,
      hourStep: PropTypes.number,
      minuteStep: PropTypes.number,
      secondStep: PropTypes.number,
      focusOnOpen: PropTypes.looseBool,
      // onKeyDown: PropTypes.func,
      autofocus: PropTypes.looseBool,
      id: PropTypes.string,
      inputIcon: PropTypes.any,
      clearIcon: PropTypes.any,
      addon: PropTypes.func,
    },
    {
      clearText: 'clear',
      prefixCls: 'rc-time-picker',
      defaultOpen: false,
      inputReadOnly: false,
      popupClassName: '',
      popupStyle: {},
      align: {},
      allowEmpty: true,
      showHour: true,
      showMinute: true,
      showSecond: true,
      disabledHours: noop,
      disabledMinutes: noop,
      disabledSeconds: noop,
      hideDisabledOptions: false,
      placement: 'bottomLeft',
      use12Hours: false,
      focusOnOpen: false,
    },
  ),
  data() {
    this.saveInputRef = refFn.bind(this, 'picker');
    this.savePanelRef = refFn.bind(this, 'panelInstance');
    const { defaultOpen, defaultValue, open = defaultOpen, value = defaultValue } = this;
    return {
      sOpen: open,
      sValue: value,
    };
  },

  watch: {
    value(val) {
      this.setState({
        sValue: val,
      });
    },
    open(val) {
      if (val !== undefined) {
        this.setState({
          sOpen: val,
        });
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.autofocus) {
        this.focus();
      }
    });
  },
  methods: {
    onPanelChange(value) {
      this.setValue(value);
    },

    onAmPmChange(ampm) {
      this.__emit('amPmChange', ampm);
    },

    onClear(event) {
      event.stopPropagation();
      this.setValue(null);
      this.setOpen(false);
    },

    onVisibleChange(open) {
      this.setOpen(open);
    },

    onEsc() {
      this.setOpen(false);
      this.focus();
    },

    onKeyDown(e) {
      if (e.keyCode === 40) {
        this.setOpen(true);
      }
    },
    onKeyDown2(e) {
      this.__emit('keydown', e);
    },

    setValue(value) {
      if (!hasProp(this, 'value')) {
        this.setState({
          sValue: value,
        });
      }
      this.__emit('change', value);
    },

    getFormat() {
      const { format, showHour, showMinute, showSecond, use12Hours } = this;
      if (format) {
        return format;
      }

      if (use12Hours) {
        const fmtString = [showHour ? 'h' : '', showMinute ? 'mm' : '', showSecond ? 'ss' : '']
          .filter(item => !!item)
          .join(':');

        return fmtString.concat(' a');
      }

      return [showHour ? 'HH' : '', showMinute ? 'mm' : '', showSecond ? 'ss' : '']
        .filter(item => !!item)
        .join(':');
    },

    getPanelElement() {
      const {
        prefixCls,
        placeholder,
        disabledHours,
        addon,
        disabledMinutes,
        disabledSeconds,
        hideDisabledOptions,
        inputReadOnly,
        showHour,
        showMinute,
        showSecond,
        defaultOpenValue,
        clearText,
        use12Hours,
        focusOnOpen,
        onKeyDown2,
        hourStep,
        minuteStep,
        secondStep,
        sValue,
      } = this;
      const clearIcon = getComponent(this, 'clearIcon');
      return (
        <Panel
          clearText={clearText}
          prefixCls={`${prefixCls}-panel`}
          ref={this.savePanelRef}
          value={sValue}
          inputReadOnly={inputReadOnly}
          onChange={this.onPanelChange}
          onAmPmChange={this.onAmPmChange}
          defaultOpenValue={defaultOpenValue}
          showHour={showHour}
          showMinute={showMinute}
          showSecond={showSecond}
          onEsc={this.onEsc}
          format={this.getFormat()}
          placeholder={placeholder}
          disabledHours={disabledHours}
          disabledMinutes={disabledMinutes}
          disabledSeconds={disabledSeconds}
          hideDisabledOptions={hideDisabledOptions}
          use12Hours={use12Hours}
          hourStep={hourStep}
          minuteStep={minuteStep}
          secondStep={secondStep}
          focusOnOpen={focusOnOpen}
          onKeydown={onKeyDown2}
          clearIcon={clearIcon}
          addon={addon}
        />
      );
    },

    getPopupClassName() {
      const { showHour, showMinute, showSecond, use12Hours, prefixCls, popupClassName } = this;

      let selectColumnCount = 0;
      if (showHour) {
        selectColumnCount += 1;
      }
      if (showMinute) {
        selectColumnCount += 1;
      }
      if (showSecond) {
        selectColumnCount += 1;
      }
      if (use12Hours) {
        selectColumnCount += 1;
      }
      // Keep it for old compatibility
      return classNames(
        popupClassName,
        {
          [`${prefixCls}-panel-narrow`]: (!showHour || !showMinute || !showSecond) && !use12Hours,
        },
        `${prefixCls}-panel-column-${selectColumnCount}`,
      );
    },

    setOpen(open) {
      if (this.sOpen !== open) {
        if (!hasProp(this, 'open')) {
          this.setState({ sOpen: open });
        }
        if (open) {
          this.__emit('open', { open });
        } else {
          this.__emit('close', { open });
        }
      }
    },

    focus() {
      this.picker.focus();
    },

    blur() {
      this.picker.blur();
    },
    onFocus(e) {
      this.__emit('focus', e);
    },
    onBlur(e) {
      this.__emit('blur', e);
    },
    renderClearButton() {
      const { sValue } = this;
      const { prefixCls, allowEmpty, clearText, disabled } = this.$props;
      if (!allowEmpty || !sValue || disabled) {
        return null;
      }
      const clearIcon = getComponent(this, 'clearIcon');
      if (isValidElement(clearIcon)) {
        const { onClick } = getEvents(clearIcon) || {};
        return cloneElement(clearIcon, {
          onClick: (...args) => {
            if (onClick) onClick(...args);
            this.onClear(...args);
          },
        });
      }

      return (
        <a
          role="button"
          class={`${prefixCls}-clear`}
          title={clearText}
          onClick={this.onClear}
          tabindex={0}
        >
          {clearIcon || <i class={`${prefixCls}-clear-icon`} />}
        </a>
      );
    },
  },

  render() {
    const {
      prefixCls,
      placeholder,
      placement,
      align,
      id,
      disabled,
      transitionName,
      getPopupContainer,
      name,
      autocomplete,
      autofocus,
      sOpen,
      sValue,
      onFocus,
      onBlur,
      popupStyle,
      pickerInputClass,
    } = this;
    const { class: className, style } = this.$attrs;
    const popupClassName = this.getPopupClassName();
    const inputIcon = getComponent(this, 'inputIcon');
    return (
      <Trigger
        prefixCls={`${prefixCls}-panel`}
        popupClassName={popupClassName}
        popupStyle={popupStyle}
        popupAlign={align}
        builtinPlacements={placements}
        popupPlacement={placement}
        action={disabled ? [] : ['click']}
        destroyPopupOnHide
        getPopupContainer={getPopupContainer}
        popupTransitionName={transitionName}
        popupVisible={sOpen}
        onPopupVisibleChange={this.onVisibleChange}
        popup={this.getPanelElement()}
      >
        <span class={classNames(prefixCls, className)} style={style}>
          <input
            class={pickerInputClass}
            ref={this.saveInputRef}
            type="text"
            placeholder={placeholder}
            name={name}
            onKeydown={this.onKeyDown}
            disabled={disabled}
            value={(sValue && sValue.format(this.getFormat())) || ''}
            autocomplete={autocomplete}
            onFocus={onFocus}
            onBlur={onBlur}
            autofocus={autofocus}
            readonly
            id={id}
          />
          {inputIcon || <span class={`${prefixCls}-icon`} />}
          {this.renderClearButton()}
        </span>
      </Trigger>
    );
  },
});
