import { switchPropTypes } from './PropTypes';
import BaseMixin from '../_util/BaseMixin';
import { hasProp, getOptionProps, getComponent } from '../_util/props-util';
import Omit from 'omit.js';

// function noop () {
// }
export default {
  name: 'VcSwitch',
  mixins: [BaseMixin],
  inheritAttrs: false,
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
      const { autofocus, disabled } = this;
      if (autofocus && !disabled) {
        this.focus();
      }
    });
  },
  methods: {
    saveRef(c) {
      this.refSwitchNode = c;
    },
    setChecked(checked, e) {
      if (this.disabled) {
        return;
      }
      if (!hasProp(this, 'checked')) {
        this.stateChecked = checked;
      }
      this.__emit('change', checked, e);
      this.__emit('update:checked', checked);
    },
    handleClick(e) {
      const checked = !this.stateChecked;
      this.setChecked(checked, e);
      this.__emit('click', checked, e);
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
      this.refSwitchNode?.blur();

      this.__emit('mouseup', e);
    },
    focus() {
      this.refSwitchNode?.focus();
    },
    blur() {
      this.refSwitchNode?.blur();
    },
  },
  render() {
    const { prefixCls, disabled, loadingIcon, ...restProps } = getOptionProps(this);
    const checked = this.stateChecked;
    const { $attrs } = this;
    const switchClassName = {
      [$attrs.class]: $attrs.class,
      [prefixCls]: true,
      [`${prefixCls}-checked`]: checked,
      [`${prefixCls}-disabled`]: disabled,
    };
    const spanProps = {
      ...Omit(restProps, [
        'checkedChildren',
        'unCheckedChildren',
        'checked',
        'autofocus',
        'defaultChecked',
      ]),
      ...$attrs,
      onKeydown: this.handleKeyDown,
      onClick: this.handleClick,
      onMouseup: this.handleMouseUp,
      type: 'button',
      role: 'switch',
      'aria-checked': checked,
      disabled,
      class: switchClassName,
      ref: this.saveRef,
    };

    return (
      <button {...spanProps}>
        {loadingIcon}
        <span class={`${prefixCls}-inner`}>
          {checked
            ? getComponent(this, 'checkedChildren')
            : getComponent(this, 'unCheckedChildren')}
        </span>
      </button>
    );
  },
};
