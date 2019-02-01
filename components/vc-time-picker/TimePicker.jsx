import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import Trigger from '../vc-trigger';
import Panel from './Panel';
import placements from './placements';
import moment from 'moment';
import { initDefaultProps, hasProp, getComponentFromProp } from '../_util/props-util';

function noop() {}

export default {
  name: 'VcTimePicker',
  mixins: [BaseMixin],
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
      inputReadOnly: PropTypes.bool,
      disabled: PropTypes.bool,
      allowEmpty: PropTypes.bool,
      defaultValue: PropTypes.any,
      open: PropTypes.bool,
      defaultOpen: PropTypes.bool,
      align: PropTypes.object,
      placement: PropTypes.any,
      transitionName: PropTypes.string,
      getPopupContainer: PropTypes.func,
      placeholder: PropTypes.string,
      format: PropTypes.string,
      showHour: PropTypes.bool,
      showMinute: PropTypes.bool,
      showSecond: PropTypes.bool,
      popupClassName: PropTypes.string,
      disabledHours: PropTypes.func,
      disabledMinutes: PropTypes.func,
      disabledSeconds: PropTypes.func,
      hideDisabledOptions: PropTypes.bool,
      // onChange: PropTypes.func,
      // onOpen: PropTypes.func,
      // onClose: PropTypes.func,
      // onFocus: PropTypes.func,
      // onBlur: PropTypes.func,
      name: PropTypes.string,
      autoComplete: PropTypes.string,
      use12Hours: PropTypes.bool,
      hourStep: PropTypes.number,
      minuteStep: PropTypes.number,
      secondStep: PropTypes.number,
      focusOnOpen: PropTypes.bool,
      // onKeyDown: PropTypes.func,
      autoFocus: PropTypes.bool,
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
      align: {},
      id: '',
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
      if (this.autoFocus) {
        this.focus();
      }
    });
  },
  methods: {
    onPanelChange(value) {
      this.setValue(value);
    },

    onPanelClear() {
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
        allowEmpty,
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
      const clearIcon = getComponentFromProp(this, 'clearIcon');
      return (
        <Panel
          clearText={clearText}
          prefixCls={`${prefixCls}-panel`}
          ref="panel"
          value={sValue}
          inputReadOnly={inputReadOnly}
          onChange={this.onPanelChange}
          onClear={this.onPanelClear}
          defaultOpenValue={defaultOpenValue}
          showHour={showHour}
          showMinute={showMinute}
          showSecond={showSecond}
          onEsc={this.onEsc}
          allowEmpty={allowEmpty}
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
      const { showHour, showMinute, showSecond, use12Hours, prefixCls } = this;
      let popupClassName = this.popupClassName;
      // Keep it for old compatibility
      if ((!showHour || !showMinute || !showSecond) && !use12Hours) {
        popupClassName += ` ${prefixCls}-panel-narrow`;
      }
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
      popupClassName += ` ${prefixCls}-panel-column-${selectColumnCount}`;
      return popupClassName;
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
      this.$refs.picker.focus();
    },

    blur() {
      this.$refs.picker.blur();
    },
    onFocus(e) {
      this.__emit('focus', e);
    },
    onBlur(e) {
      this.__emit('blur', e);
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
      autoComplete,
      autoFocus,
      inputReadOnly,
      sOpen,
      sValue,
      onFocus,
      onBlur,
    } = this;
    const popupClassName = this.getPopupClassName();
    const inputIcon = getComponentFromProp(this, 'inputIcon');
    return (
      <Trigger
        prefixCls={`${prefixCls}-panel`}
        popupClassName={popupClassName}
        popupAlign={align}
        builtinPlacements={placements}
        popupPlacement={placement}
        action={disabled ? [] : ['click']}
        destroyPopupOnHide
        getPopupContainer={getPopupContainer}
        popupTransitionName={transitionName}
        popupVisible={sOpen}
        onPopupVisibleChange={this.onVisibleChange}
      >
        <template slot="popup">{this.getPanelElement()}</template>
        <span class={`${prefixCls}`}>
          <input
            class={`${prefixCls}-input`}
            ref="picker"
            type="text"
            placeholder={placeholder}
            name={name}
            onKeydown={this.onKeyDown}
            disabled={disabled}
            value={(sValue && sValue.format(this.getFormat())) || ''}
            autoComplete={autoComplete}
            onFocus={onFocus}
            onBlur={onBlur}
            autoFocus={autoFocus}
            readOnly={!!inputReadOnly}
            id={id}
          />
          {inputIcon || <span class={`${prefixCls}-icon`} />}
        </span>
      </Trigger>
    );
  },
};
