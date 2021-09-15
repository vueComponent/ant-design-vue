/**
 * Input Box is in different position for different mode.
 * This not the same design as `Select` cause it's followed by antd 0.x `Select`.
 * We will not follow the new design immediately since antd 3.x is already released.
 *
 * So this file named as Selector to avoid confuse.
 */
import { inject } from 'vue';
import { createRef } from '../util';
import PropTypes from '../../../_util/vue-types';
import classNames from '../../../_util/classNames';
import { initDefaultProps, getComponent } from '../../../_util/props-util';
import BaseMixin from '../../../_util/BaseMixin';
export const selectorPropTypes = () => ({
  prefixCls: PropTypes.string,
  open: PropTypes.looseBool,
  selectorValueList: PropTypes.array,
  allowClear: PropTypes.looseBool,
  showArrow: PropTypes.looseBool,
  // onClick: PropTypes.func,
  // onBlur: PropTypes.func,
  // onFocus: PropTypes.func,
  removeSelected: PropTypes.func,
  choiceTransitionName: PropTypes.string,
  // Pass by component
  ariaId: PropTypes.string,
  inputIcon: PropTypes.any,
  clearIcon: PropTypes.any,
  removeIcon: PropTypes.any,
  placeholder: PropTypes.any,
  disabled: PropTypes.looseBool,
  focused: PropTypes.looseBool,
  isMultiple: PropTypes.looseBool,
  showSearch: PropTypes.looseBool,
  searchValue: PropTypes.string,
});

function noop() {}
export default function () {
  const BaseSelector = {
    name: 'BaseSelector',
    inheritAttrs: false,
    mixins: [BaseMixin],
    props: initDefaultProps(
      {
        ...selectorPropTypes(),

        // Pass by HOC
        renderSelection: PropTypes.func.isRequired,
        renderPlaceholder: PropTypes.func,
        tabindex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      },
      {
        tabindex: 0,
      },
    ),
    setup() {
      return {
        vcTreeSelect: inject('vcTreeSelect', {}),
      };
    },
    created() {
      this.domRef = createRef();
    },
    methods: {
      onFocus(e) {
        const { focused } = this.$props;
        const {
          vcTreeSelect: { onSelectorFocus },
        } = this;

        if (!focused) {
          onSelectorFocus();
        }
        this.__emit('focus', e);
      },

      onBlur(e) {
        const {
          vcTreeSelect: { onSelectorBlur },
        } = this;

        // TODO: Not trigger when is inner component get focused
        onSelectorBlur();
        this.__emit('blur', e);
      },

      focus() {
        this.domRef.current.focus();
      },

      blur() {
        this.domRef.current.blur();
      },

      renderClear() {
        const { prefixCls, allowClear, selectorValueList } = this.$props;
        const {
          vcTreeSelect: { onSelectorClear },
        } = this;

        if (!allowClear || !selectorValueList.length) {
          return null;
        }
        const clearIcon = getComponent(this, 'clearIcon');
        return (
          <span
            key="clear"
            unselectable="on"
            aria-hidden="true"
            style="user-select: none;"
            class={`${prefixCls}-clear`}
            onClick={onSelectorClear}
          >
            {clearIcon}
          </span>
        );
      },

      renderArrow() {
        const { prefixCls, showArrow } = this.$props;
        if (!showArrow) {
          return null;
        }
        const inputIcon = getComponent(this, 'inputIcon');
        return (
          <span
            key="arrow"
            class={`${prefixCls}-arrow`}
            style={{ outline: 'none', userSelect: 'none' }}
          >
            {inputIcon}
          </span>
        );
      },
    },

    render() {
      const {
        prefixCls,
        open,
        focused,
        disabled,
        allowClear,
        ariaId,
        renderSelection,
        renderPlaceholder,
        tabindex,
        isMultiple,
        showArrow,
        showSearch,
      } = this.$props;
      const { class: className, style, onClick = noop } = this.$attrs;
      const {
        vcTreeSelect: { onSelectorKeyDown },
      } = this;

      let myTabIndex = tabindex;
      if (disabled) {
        myTabIndex = null;
      }
      const mergedClassName = classNames(prefixCls, className, {
        [`${prefixCls}-focused`]: open || focused,
        [`${prefixCls}-multiple`]: isMultiple,
        [`${prefixCls}-single`]: !isMultiple,
        [`${prefixCls}-allow-clear`]: allowClear,
        [`${prefixCls}-show-arrow`]: showArrow,
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-open`]: open,
        [`${prefixCls}-show-search`]: showSearch,
      });
      return (
        <div
          style={style}
          onClick={onClick}
          class={mergedClassName}
          ref={this.domRef}
          role="combobox"
          aria-expanded={open}
          aria-owns={open ? ariaId : undefined}
          aria-controls={open ? ariaId : undefined}
          aria-haspopup="listbox"
          aria-disabled={disabled}
          tabindex={myTabIndex}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeydown={onSelectorKeyDown}
        >
          <span class={`${prefixCls}-selector`}>
            {renderSelection()}
            {renderPlaceholder && renderPlaceholder()}
          </span>
          {this.renderArrow()}
          {this.renderClear()}
        </div>
      );
    },
  };

  return BaseSelector;
}
