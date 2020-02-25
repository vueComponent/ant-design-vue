import { switchPropTypes } from './PropTypes';
import BaseMixin from '../_util/BaseMixin';
import { hasProp, getOptionProps, getComponentFromProp, getListeners } from '../_util/props-util';

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
      if (this.disabled) {
        return;
      }
      if (!hasProp(this, 'checked')) {
        this.stateChecked = checked;
      }
      this.$emit('change', checked, e);
    },
    handleClick(e) {
      const checked = !this.stateChecked;
      this.setChecked(checked, e);
      this.$emit('click', checked, e);
    },
    handleKeyDown(e) {
      if (e.keyCode === 37) {
        // Left
        this.setChecked(false, e);
      } else if (e.keyCode === 39) {
        // Right
        this.setChecked(true, e);
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
        ...getListeners(this),
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
