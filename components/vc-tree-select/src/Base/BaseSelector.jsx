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
  open: PropTypes.bool,
  selectorValueList: PropTypes.array,
  allowClear: PropTypes.bool,
  showArrow: PropTypes.bool,
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
  disabled: PropTypes.bool,
  focused: PropTypes.bool,
});

function noop() {}
export default function(modeName) {
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
        tabindex: PropTypes.number,
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

        if (!allowClear || !selectorValueList.length || !selectorValueList[0].value) {
          return null;
        }
        const clearIcon = getComponent(this, 'clearIcon');
        return (
          <span key="clear" class={`${prefixCls}-selection__clear`} onClick={onSelectorClear}>
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
          <span key="arrow" class={`${prefixCls}-arrow`} style={{ outline: 'none' }}>
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
      } = this.$props;
      const { class: className, style, onClick = noop } = this.$attrs;
      const {
        vcTreeSelect: { onSelectorKeyDown },
      } = this;

      let myTabIndex = tabindex;
      if (disabled) {
        myTabIndex = null;
      }

      return (
        <span
          style={style}
          onClick={onClick}
          class={classNames(className, prefixCls, {
            [`${prefixCls}-open`]: open,
            [`${prefixCls}-focused`]: open || focused,
            [`${prefixCls}-disabled`]: disabled,
            [`${prefixCls}-enabled`]: !disabled,
            [`${prefixCls}-allow-clear`]: allowClear,
          })}
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
          <span
            key="selection"
            class={classNames(`${prefixCls}-selection`, `${prefixCls}-selection--${modeName}`)}
          >
            {renderSelection()}
            {this.renderClear()}
            {this.renderArrow()}

            {renderPlaceholder && renderPlaceholder()}
          </span>
        </span>
      );
    },
  };

  return BaseSelector;
}
