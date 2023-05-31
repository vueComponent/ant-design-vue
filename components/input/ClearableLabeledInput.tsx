import classNames from '../_util/classNames';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import PropTypes from '../_util/vue-types';
import { cloneElement } from '../_util/vnode';
import type { CSSProperties, PropType, VNode } from 'vue';
import { defineComponent } from 'vue';
import type { VueNode } from '../_util/type';
import { anyType, tuple } from '../_util/type';
import type { Direction, SizeType } from '../config-provider';
import type { MouseEventHandler } from '../_util/EventInterface';
import { hasAddon } from './util';
import { FormItemInputContext } from '../form/FormItemContext';
import type { InputStatus } from '../_util/statusUtils';
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils';

const ClearableInputType = ['text', 'input'] as const;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ClearableLabeledInput',
  inheritAttrs: false,
  props: {
    prefixCls: String,
    inputType: PropTypes.oneOf(tuple('text', 'input')),
    value: anyType<VueNode>(),
    defaultValue: anyType<VueNode>(),
    allowClear: { type: Boolean, default: undefined },
    element: anyType<VueNode>(),
    handleReset: Function as PropType<MouseEventHandler>,
    disabled: { type: Boolean, default: undefined },
    direction: { type: String as PropType<Direction> },
    size: { type: String as PropType<SizeType> },
    suffix: anyType<VueNode>(),
    prefix: anyType<VueNode>(),
    addonBefore: anyType<VueNode>(),
    addonAfter: anyType<VueNode>(),
    readonly: { type: Boolean, default: undefined },
    focused: { type: Boolean, default: undefined },
    bordered: { type: Boolean, default: true },
    triggerFocus: { type: Function as PropType<() => void> },
    hidden: Boolean,
    status: String as PropType<InputStatus>,
    hashId: String,
  },
  setup(props, { slots, attrs }) {
    const statusContext = FormItemInputContext.useInject();
    const renderClearIcon = (prefixCls: string) => {
      const { value, disabled, readonly, handleReset, suffix = slots.suffix } = props;
      const needClear = !disabled && !readonly && value;
      const className = `${prefixCls}-clear-icon`;
      return (
        <CloseCircleFilled
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
        />
      );
    };
    const renderTextAreaWithClearIcon = (prefixCls: string, element: VNode) => {
      const {
        value,
        allowClear,
        direction,
        bordered,
        hidden,
        status: customStatus,
        addonAfter = slots.addonAfter,
        addonBefore = slots.addonBefore,
        hashId,
      } = props;

      const { status: contextStatus, hasFeedback } = statusContext;

      if (!allowClear) {
        return cloneElement(element, {
          value,
          disabled: props.disabled,
        });
      }
      const affixWrapperCls = classNames(
        `${prefixCls}-affix-wrapper`,
        `${prefixCls}-affix-wrapper-textarea-with-clear-btn`,
        getStatusClassNames(
          `${prefixCls}-affix-wrapper`,
          getMergedStatus(contextStatus, customStatus),
          hasFeedback,
        ),
        {
          [`${prefixCls}-affix-wrapper-rtl`]: direction === 'rtl',
          [`${prefixCls}-affix-wrapper-borderless`]: !bordered,
          // className will go to addon wrapper
          [`${attrs.class}`]: !hasAddon({ addonAfter, addonBefore }) && attrs.class,
        },
        hashId,
      );
      return (
        <span class={affixWrapperCls} style={attrs.style as CSSProperties} hidden={hidden}>
          {cloneElement(element, {
            style: null,
            value,
            disabled: props.disabled,
          })}
          {renderClearIcon(prefixCls)}
        </span>
      );
    };

    return () => {
      const { prefixCls, inputType, element = slots.element?.() } = props;
      if (inputType === ClearableInputType[0]) {
        return renderTextAreaWithClearIcon(prefixCls, element as VNode);
      }
      return null;
    };
  },
});
