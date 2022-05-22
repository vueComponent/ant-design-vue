import type { CSSProperties } from 'vue';
import { defineComponent, ref } from 'vue';
import classNames from '../_util/classNames';
import type { MouseEventHandler } from '../_util/EventInterface';
import { cloneElement } from '../_util/vnode';
import { baseInputProps } from './inputProps';
import { hasAddon, hasPrefixSuffix } from './utils/commonUtils';

export default defineComponent({
  name: 'BaseInput',
  inheritAttrs: false,
  props: baseInputProps(),
  setup(props, { slots, attrs }) {
    const containerRef = ref();
    const onInputMouseDown: MouseEventHandler = e => {
      if (containerRef.value?.contains(e.target as Element)) {
        const { triggerFocus } = props;
        triggerFocus?.();
      }
    };
    const getClearIcon = () => {
      const {
        allowClear,
        value,
        disabled,
        readonly,
        handleReset,
        suffix = slots.suffix,
        prefixCls,
      } = props;
      if (!allowClear) {
        return null;
      }
      const needClear = !disabled && !readonly && value;
      const className = `${prefixCls}-clear-icon`;
      const iconNode = slots.clearIcon?.() || '*';
      return (
        <span
          onClick={handleReset}
          // Do not trigger onBlur when clear input
          onMousedown={e => e.preventDefault()}
          class={classNames(
            {
              [`${className}-hidden`]: !needClear,
              [`${className}-has-suffix`]: !!suffix,
            },
            className,
          )}
          role="button"
          tabindex={-1}
        >
          {iconNode}
        </span>
      );
    };

    return () => {
      const {
        focused,
        value,

        disabled,
        allowClear,
        readonly,
        hidden,
        prefixCls,
        prefix = slots.prefix?.(),
        suffix = slots.suffix?.(),
        addonAfter = slots.addonAfter,
        addonBefore = slots.addonBefore,
        inputElement,
        affixWrapperClassName,
        wrapperClassName,
        groupClassName,
      } = props;
      let element = cloneElement(inputElement, {
        value,
        hidden,
      });
      // ================== Prefix & Suffix ================== //
      if (hasPrefixSuffix({ prefix, suffix, allowClear })) {
        const affixWrapperPrefixCls = `${prefixCls}-affix-wrapper`;
        const affixWrapperCls = classNames(
          affixWrapperPrefixCls,
          {
            [`${affixWrapperPrefixCls}-disabled`]: disabled,
            [`${affixWrapperPrefixCls}-focused`]: focused,
            [`${affixWrapperPrefixCls}-readonly`]: readonly,
            [`${affixWrapperPrefixCls}-input-with-clear-btn`]: suffix && allowClear && value,
          },
          !hasAddon({ addonAfter, addonBefore }) && attrs.class,
          affixWrapperClassName,
        );

        const suffixNode = (suffix || allowClear) && (
          <span class={`${prefixCls}-suffix`}>
            {getClearIcon()}
            {suffix}
          </span>
        );

        element = (
          <span
            class={affixWrapperCls}
            style={attrs.style as CSSProperties}
            hidden={!hasAddon({ addonAfter, addonBefore }) && hidden}
            onMousedown={onInputMouseDown}
            ref={containerRef}
          >
            {prefix && <span class={`${prefixCls}-prefix`}>{prefix}</span>}
            {cloneElement(inputElement, {
              style: null,
              value,
              hidden: null,
            })}
            {suffixNode}
          </span>
        );
      }
      // ================== Addon ================== //
      if (hasAddon({ addonAfter, addonBefore })) {
        const wrapperCls = `${prefixCls}-group`;
        const addonCls = `${wrapperCls}-addon`;

        const mergedWrapperClassName = classNames(
          `${prefixCls}-wrapper`,
          wrapperCls,
          wrapperClassName,
        );

        const mergedGroupClassName = classNames(
          `${prefixCls}-group-wrapper`,
          attrs.class,
          groupClassName,
        );

        // Need another wrapper for changing display:table to display:inline-block
        // and put style prop in wrapper
        return (
          <span class={mergedGroupClassName} style={attrs.style as CSSProperties} hidden={hidden}>
            <span class={mergedWrapperClassName}>
              {addonBefore && <span class={addonCls}>{addonBefore}</span>}
              {cloneElement(element, { style: null, hidden: null })}
              {addonAfter && <span class={addonCls}>{addonAfter}</span>}
            </span>
          </span>
        );
      }
      return element;
    };
  },
});
