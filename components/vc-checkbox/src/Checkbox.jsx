import { nextTick } from 'vue';
import classNames from '../../_util/classNames';
import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import { getOptionProps, hasProp, initDefaultProps } from '../../_util/props-util';

export default {
  name: 'Checkbox',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: initDefaultProps(
    {
      prefixCls: PropTypes.string,
      name: PropTypes.string,
      id: PropTypes.string,
      type: PropTypes.string,
      defaultChecked: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
      checked: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
      disabled: PropTypes.bool,
      // onFocus: PropTypes.func,
      // onBlur: PropTypes.func,
      // onChange: PropTypes.func,
      // onClick: PropTypes.func,
      tabindex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      readonly: PropTypes.bool,
      autofocus: PropTypes.bool,
      value: PropTypes.any,
    },
    {
      prefixCls: 'rc-checkbox',
      type: 'checkbox',
      defaultChecked: false,
    },
  ),
  data() {
    const checked = hasProp(this, 'checked') ? this.checked : this.defaultChecked;
    return {
      sChecked: checked,
    };
  },
  watch: {
    checked(val) {
      this.sChecked = val;
    },
  },
  mounted() {
    nextTick(() => {
      if (process.env.NODE_ENV === 'test') {
        if (this.autofocus) {
          this.$refs.input && this.$refs.input.focus();
        }
      }
    });
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    },

    blur() {
      this.$refs.input.blur();
    },

    handleChange(e) {
      const props = getOptionProps(this);
      if (props.disabled) {
        return;
      }
      if (!('checked' in props)) {
        this.sChecked = e.target.checked;
      }
      this.$forceUpdate(); // change前，维持现有状态
      e.shiftKey = this.eventShiftKey;
      const eventObj = {
        target: {
          ...props,
          checked: e.target.checked,
        },
        stopPropagation() {
          e.stopPropagation();
        },
        preventDefault() {
          e.preventDefault();
        },
        nativeEvent: e,
      };
      this.__emit('update:checked', eventObj);
      this.__emit('change', eventObj);
      this.eventShiftKey = false;
    },
    onClick(e) {
      this.__emit('click', e);
      // onChange没能获取到shiftKey，使用onClick hack
      this.eventShiftKey = e.shiftKey;
    },
  },

  render() {
    const {
      prefixCls,
      name,
      id,
      type,
      disabled,
      readonly,
      tabindex,
      autofocus,
      value,
      ...others
    } = getOptionProps(this);
    const { class: className, onFocus, onBlur } = this.$attrs;
    const globalProps = Object.keys({ ...others, ...this.$attrs }).reduce((prev, key) => {
      if (key.substr(0, 5) === 'aria-' || key.substr(0, 5) === 'data-' || key === 'role') {
        prev[key] = others[key];
      }
      return prev;
    }, {});

    const { sChecked } = this;
    const classString = classNames(prefixCls, className, {
      [`${prefixCls}-checked`]: sChecked,
      [`${prefixCls}-disabled`]: disabled,
    });
    const inputProps = {
      name,
      id,
      type,
      readonly,
      disabled,
      tabindex,
      class: `${prefixCls}-input`,
      checked: !!sChecked,
      autofocus,
      value,
      ...globalProps,
      onChange: this.handleChange,
      onClick: this.onClick,
      onFocus,
      onBlur,
    };

    return (
      <span class={classString}>
        <input ref="input" {...inputProps} />
        <span class={`${prefixCls}-inner`} />
      </span>
    );
  },
};
