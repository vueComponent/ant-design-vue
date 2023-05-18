import PropTypes, { withUndefined } from '../_util/vue-types';
import type { CSSProperties, ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';
import type { EventHandler } from '../_util/EventInterface';
import classNames from '../_util/classNames';
import type { VueNode } from '../_util/type';
import { booleanType, stringType, functionType } from '../_util/type';
import type { StepIconRender, Status } from './interface';
import omit from '../_util/omit';
function isString(str: any): str is string {
  return typeof str === 'string';
}
function noop() {}

export const VcStepProps = () => ({
  prefixCls: String,
  itemWidth: String,
  active: { type: Boolean, default: undefined },
  disabled: { type: Boolean, default: undefined },
  status: stringType<Status>(),
  iconPrefix: String,
  icon: PropTypes.any,
  adjustMarginRight: String,
  stepNumber: Number,
  stepIndex: Number,
  description: PropTypes.any,
  title: PropTypes.any,
  subTitle: PropTypes.any,
  progressDot: withUndefined(PropTypes.oneOfType([PropTypes.looseBool, PropTypes.func])),
  tailContent: PropTypes.any,
  icons: PropTypes.shape({
    finish: PropTypes.any,
    error: PropTypes.any,
  }).loose,
  onClick: functionType(),
  onStepClick: functionType<(next: number) => void>(),
  stepIcon: functionType<StepIconRender>(),
  itemRender: functionType<(stepItem: VueNode) => VueNode>(),
  __legacy: booleanType(),
});

export type VCStepProps = Partial<ExtractPropTypes<ReturnType<typeof VcStepProps>>>;
export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Step',
  inheritAttrs: false,
  props: VcStepProps(),
  setup(props, { slots, emit, attrs }) {
    const onItemClick: EventHandler = e => {
      emit('click', e);
      emit('stepClick', props.stepIndex);
    };
    // if (props.__legacy !== false) {
    //   warning(
    //     false,
    //     'Steps',
    //     'Step is deprecated, and not support inline type. Please use `items` directly. ',
    //   );
    // }
    const renderIconNode = ({ icon, title, description }) => {
      const {
        prefixCls,
        stepNumber,
        status,
        iconPrefix,
        icons,
        progressDot = slots.progressDot,
        stepIcon = slots.stepIcon,
      } = props;

      let iconNode;
      const iconClassName = classNames(`${prefixCls}-icon`, `${iconPrefix}icon`, {
        [`${iconPrefix}icon-${icon}`]: icon && isString(icon),
        [`${iconPrefix}icon-check`]:
          !icon && status === 'finish' && ((icons && !icons.finish) || !icons),
        [`${iconPrefix}icon-cross`]:
          !icon && status === 'error' && ((icons && !icons.error) || !icons),
      });
      const iconDot = <span class={`${prefixCls}-icon-dot`} />;
      // `progressDot` enjoy the highest priority
      if (progressDot) {
        if (typeof progressDot === 'function') {
          iconNode = (
            <span class={`${prefixCls}-icon`}>
              {progressDot({
                iconDot,
                index: stepNumber - 1,
                status,
                title,
                description,
                prefixCls,
              })}
            </span>
          );
        } else {
          iconNode = <span class={`${prefixCls}-icon`}>{iconDot}</span>;
        }
      } else if (icon && !isString(icon)) {
        iconNode = <span class={`${prefixCls}-icon`}>{icon}</span>;
      } else if (icons && icons.finish && status === 'finish') {
        iconNode = <span class={`${prefixCls}-icon`}>{icons.finish}</span>;
      } else if (icons && icons.error && status === 'error') {
        iconNode = <span class={`${prefixCls}-icon`}>{icons.error}</span>;
      } else if (icon || status === 'finish' || status === 'error') {
        iconNode = <span class={iconClassName} />;
      } else {
        iconNode = <span class={`${prefixCls}-icon`}>{stepNumber}</span>;
      }

      if (stepIcon) {
        iconNode = stepIcon({
          index: stepNumber - 1,
          status,
          title,
          description,
          node: iconNode,
        });
      }

      return iconNode;
    };
    return () => {
      const {
        prefixCls,
        itemWidth,
        active,
        status = 'wait',
        tailContent,
        adjustMarginRight,
        disabled,
        title = slots.title?.(),
        description = slots.description?.(),
        subTitle = slots.subTitle?.(),
        icon = slots.icon?.(),
        onClick,
        onStepClick,
      } = props;
      const mergedStatus = status || 'wait';
      const classString = classNames(`${prefixCls}-item`, `${prefixCls}-item-${mergedStatus}`, {
        [`${prefixCls}-item-custom`]: icon,
        [`${prefixCls}-item-active`]: active,
        [`${prefixCls}-item-disabled`]: disabled === true,
      });
      const stepItemStyle: CSSProperties = {};
      if (itemWidth) {
        stepItemStyle.width = itemWidth;
      }
      if (adjustMarginRight) {
        stepItemStyle.marginRight = adjustMarginRight;
      }

      const accessibilityProps: {
        role?: string;
        tabindex?: number;
        onClick?: EventHandler;
      } = {
        onClick: onClick || noop,
      };

      if (onStepClick && !disabled) {
        accessibilityProps.role = 'button';
        accessibilityProps.tabindex = 0;
        accessibilityProps.onClick = onItemClick;
      }
      const stepNode = (
        <div
          {...omit(attrs, ['__legacy'])}
          class={[classString, attrs.class]}
          style={[attrs.style as CSSProperties, stepItemStyle]}
        >
          <div {...accessibilityProps} class={`${prefixCls}-item-container`}>
            <div class={`${prefixCls}-item-tail`}>{tailContent}</div>
            <div class={`${prefixCls}-item-icon`}>
              {renderIconNode({ icon, title, description })}
            </div>
            <div class={`${prefixCls}-item-content`}>
              <div class={`${prefixCls}-item-title`}>
                {title}
                {subTitle && (
                  <div
                    title={typeof subTitle === 'string' ? subTitle : undefined}
                    class={`${prefixCls}-item-subtitle`}
                  >
                    {subTitle}
                  </div>
                )}
              </div>
              {description && <div class={`${prefixCls}-item-description`}>{description}</div>}
            </div>
          </div>
        </div>
      );
      if (props.itemRender) {
        return props.itemRender(stepNode);
      }
      return stepNode;
    };
  },
});
