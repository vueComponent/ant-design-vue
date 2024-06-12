import type { ExtractPropTypes } from 'vue';
import PropTypes from '../_util/vue-types';
import type { MouseEventHandler } from '../_util/EventInterface';
import { stringType, booleanType, functionType, objectType } from '../_util/type';
import type { BadgeProps } from '../badge';

export type FloatButtonType = 'default' | 'primary';

export type FloatButtonShape = 'circle' | 'square';

export type FloatButtonGroupTrigger = 'click' | 'hover';

export type FloatButtonBadgeProps = Omit<BadgeProps, 'status' | 'text' | 'title' | 'children'>;

export const floatButtonProps = () => {
  return {
    prefixCls: String,
    description: PropTypes.any,
    type: stringType<FloatButtonType>('default'),
    shape: stringType<FloatButtonShape>('circle'),
    tooltip: PropTypes.any,
    href: String,
    target: String,
    badge: objectType<FloatButtonBadgeProps>(),
    onClick: functionType<MouseEventHandler>(),
  };
};

export type FloatButtonProps = Partial<ExtractPropTypes<ReturnType<typeof floatButtonProps>>>;

export const floatButtonContentProps = () => {
  return {
    prefixCls: stringType<FloatButtonProps['prefixCls']>(),
  };
};

export type FloatButtonContentProps = Partial<
  ExtractPropTypes<ReturnType<typeof floatButtonContentProps>>
>;

export const floatButtonGroupProps = () => {
  return {
    ...floatButtonProps(),
    // 包含的 Float Button
    // 触发方式 (有触发方式为菜单模式）
    trigger: stringType<FloatButtonGroupTrigger>(),
    // 受控展开
    open: booleanType(),
    // 展开收起的回调
    onOpenChange: functionType<(open: boolean) => void>(),
    'onUpdate:open': functionType<(open: boolean) => void>(),
  };
};

export type FloatButtonGroupProps = Partial<
  ExtractPropTypes<ReturnType<typeof floatButtonGroupProps>>
>;

export const backTopProps = () => {
  return {
    ...floatButtonProps(),
    prefixCls: String,
    duration: Number,
    target: functionType<() => HTMLElement | Window | Document>(),
    visibilityHeight: Number,
    onClick: functionType<MouseEventHandler>(),
  };
};

export type BackTopProps = Partial<ExtractPropTypes<ReturnType<typeof backTopProps>>>;
