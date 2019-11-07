import { switchPropTypes } from './PropTypes';
import { isFunction } from '../_util/vue-types/utils';
import BaseMixin from '../_util/BaseMixin';
import { hasProp, getOptionProps, getComponentFromProp } from '../_util/props-util';

// function noop () {
// }
export default {
  name: 'VcSwitch',
  mixins: [BaseMixin],
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    ...switchPropTypes,
    prefixCls: switchPropTypes.prefixCls.def('rc-switch'),
    // onChange: switchPropTypes.onChange.def(noop),
    // onClick: switchPropTypes.onClick.def(noop),
  },
  data() {
    let checked = false;
    if (hasProp(this, 'checked')) {
      checked = !!this.checked;
    } else {
      checked = !!this.defaultChecked;
    }
    return {
      stateChecked: checked,
    };
  },
  watch: {
    checked(val) {
      this.stateChecked = val;
    },
  },
  mounted() {
    this.$nextTick(() => {
      const { autoFocus, disabled } = this;
      if (autoFocus && !disabled) {
        this.focus();
      }
    });
  },
  methods: {
    setChecked(checked, e) {
      if (!hasProp(this, 'checked')) {
        this.stateChecked = checked;
      }
      this.$emit('change', checked, e);
    },
    handleChange(checked, e) {
      if (this.disabled) {
        return;
      }
      if (isFunction(this.beforeChange)) {
        const before = this.beforeChange(checked);
        if (before) { // true or Promise
          if (before.then) {
            before.then(() => {
              this.setChecked(checked, e);
            });
          } else {
            this.setChecked(checked, e);
          }
        }
      } else {
        this.setChecked(checked, e);
      }
    },
    handleClick(e) {
      const checked = !this.stateChecked;
      this.handleChange(checked, e);
      this.$emit('click', checked, e);
    },
    handleKeyDown(e) {
      if (e.keyCode === 37) {
        // Left
        this.handleChange(false, e);
      } else if (e.keyCode === 39) {
        // Right
        this.handleChange(true, e);
      }
    },
    handleMouseUp(e) {
      if (this.$refs.refSwitchNode) {
        this.$refs.refSwitchNode.blur();
      }
      this.$emit('mouseup', e);
    },
    focus() {
      this.$refs.refSwitchNode.focus();
    },
    blur() {
      this.$refs.refSwitchNode.blur();
    },
  },
  render() {
    const { prefixCls, disabled, loadingIcon, tabIndex, ...restProps } = getOptionProps(this);
    const checked = this.stateChecked;
    const switchClassName = {
      [prefixCls]: true,
      [`${prefixCls}-checked`]: checked,
      [`${prefixCls}-disabled`]: disabled,
    };
    const spanProps = {
      props: { ...restProps },
      on: {
        ...this.$listeners,
        keydown: this.handleKeyDown,
        click: this.handleClick,
        mouseup: this.handleMouseUp,
      },
      attrs: {
        type: 'button',
        role: 'switch',
        'aria-checked': checked,
        disabled,
        tabIndex,
      },
      class: switchClassName,
      ref: 'refSwitchNode',
    };
    return (
      <button {...spanProps}>
        {loadingIcon}
        <span class={`${prefixCls}-inner`}>
          {checked
            ? getComponentFromProp(this, 'checkedChildren')
            : getComponentFromProp(this, 'unCheckedChildren')}
        </span>
      </button>
    );
  },
};
