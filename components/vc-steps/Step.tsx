import PropTypes, { withUndefined } from '../_util/vue-types';
import type { CSSProperties } from 'vue';
import { defineComponent } from 'vue';
import type { EventHandler } from '../_util/EventInterface';

function isString(str: any): str is string {
  return typeof str === 'string';
}
function noop() {}
export default defineComponent({
  name: 'Step',
  props: {
    prefixCls: PropTypes.string,
    wrapperStyle: PropTypes.style,
    itemWidth: PropTypes.string,
    active: PropTypes.looseBool,
    disabled: PropTypes.looseBool,
    status: PropTypes.string,
    iconPrefix: PropTypes.string,
    icon: PropTypes.any,
    adjustMarginRight: PropTypes.string,
    stepNumber: PropTypes.number,
    stepIndex: PropTypes.number,
    description: PropTypes.any,
    title: PropTypes.any,
    subTitle: PropTypes.any,
    progressDot: withUndefined(PropTypes.oneOfType([PropTypes.looseBool, PropTypes.func])),
    tailContent: PropTypes.any,
    icons: PropTypes.shape({
      finish: PropTypes.any,
      error: PropTypes.any,
    }).loose,
    onClick: PropTypes.func,
    onStepClick: PropTypes.func,
    stepIcon: PropTypes.func,
  },
  slots: ['title', 'subTitle', 'description', 'tailContent', 'stepIcon', 'progressDot'],
  emits: ['click', 'stepClick'],
  setup(props, { slots, emit }) {
    const onItemClick: EventHandler = e => {
      emit('click', e);
      emit('stepClick', props.stepIndex);
    };

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

      let iconNode: any;
      const iconClassName = {
        [`${prefixCls}-icon`]: true,
        [`${iconPrefix}icon`]: true,
        [`${iconPrefix}icon-${icon}`]: icon && isString(icon),
        [`${iconPrefix}icon-check`]: !icon && status === 'finish' && icons && !icons.finish,
        [`${iconPrefix}icon-close`]: !icon && status === 'error' && icons && !icons.error,
      };
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

      const classString = {
        [`${prefixCls}-item`]: true,
        [`${prefixCls}-item-${status}`]: true,
        [`${prefixCls}-item-custom`]: icon,
        [`${prefixCls}-item-active`]: active,
        [`${prefixCls}-item-disabled`]: disabled === true,
      };
      const stepProps = {
        class: classString,
      };
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
      return (
        <div {...stepProps} style={stepItemStyle}>
          <div {...accessibilityProps} class={`${prefixCls}-item-container`}>
            <div class={`${prefixCls}-item-tail`}>{tailContent}</div>
            <div class={`${prefixCls}-item-icon`}>
              {renderIconNode({ icon, title, description })}
            </div>
            <div class={`${prefixCls}-item-content`}>
              <div class={`${prefixCls}-item-title`}>
                {title}
                {subTitle && (
                  <div title={subTitle} class={`${prefixCls}-item-subtitle`}>
                    {subTitle}
                  </div>
                )}
              </div>
              {description && <div class={`${prefixCls}-item-description`}>{description}</div>}
            </div>
          </div>
        </div>
      );
    };
  },
});
