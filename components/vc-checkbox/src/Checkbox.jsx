import PropTypes from '../../_util/vue-types';
import classNames from 'classnames';
import {
  getOptionProps,
  hasProp,
  initDefaultProps,
  getAttrs,
  getListeners,
} from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';

export default {
  name: 'Checkbox',
  mixins: [BaseMixin],
  inheritAttrs: false,
  model: {
    prop: 'checked',
    event: 'change',
  },
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
      tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      readOnly: PropTypes.bool,
      autoFocus: PropTypes.bool,
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
    this.$nextTick(() => {
      if (this.autoFocus) {
        this.$refs.input && this.$refs.input.focus();
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
      this.__emit('change', {
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
        nativeEvent: { ...e, shiftKey: this.eventShiftKey },
      });
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
      readOnly,
      tabIndex,
      autoFocus,
      value,
      ...others
    } = getOptionProps(this);
    const attrs = getAttrs(this);
    const globalProps = Object.keys({ ...others, ...attrs }).reduce((prev, key) => {
      if (key.substr(0, 5) === 'aria-' || key.substr(0, 5) === 'data-' || key === 'role') {
        prev[key] = others[key];
      }
      return prev;
    }, {});

    const { sChecked } = this;
    const classString = classNames(prefixCls, {
      [`${prefixCls}-checked`]: sChecked,
      [`${prefixCls}-disabled`]: disabled,
    });

    return (
      <span class={classString}>
        <input
          name={name}
          id={id}
          type={type}
          readOnly={readOnly}
          disabled={disabled}
          tabIndex={tabIndex}
          class={`${prefixCls}-input`}
          checked={!!sChecked}
          autoFocus={autoFocus}
          ref="input"
          value={value}
          {...{
            attrs: globalProps,
            on: {
              ...getListeners(this),
              change: this.handleChange,
              click: this.onClick,
            },
          }}
        />
        <span class={`${prefixCls}-inner`} />
      </span>
    );
  },
};
