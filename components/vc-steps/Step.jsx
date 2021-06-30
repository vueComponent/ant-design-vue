import PropTypes, { withUndefined } from '../_util/vue-types';
import { getOptionProps, getComponent } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import { defineComponent } from 'vue';

function isString(str) {
  return typeof str === 'string';
}
function noop() {}
export default defineComponent({
  name: 'Step',
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    wrapperStyle: PropTypes.object,
    itemWidth: PropTypes.string,
    active: PropTypes.looseBool,
    disabled: PropTypes.looseBool,
    status: PropTypes.string,
    iconPrefix: PropTypes.string,
    icon: PropTypes.any,
    adjustMarginRight: PropTypes.string,
    stepNumber: PropTypes.string,
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
  },
  methods: {
    onItemClick(...args) {
      this.__emit('click', ...args);
      this.__emit('stepClick', this.stepIndex);
    },
    renderIconNode() {
      const { prefixCls, stepNumber, status, iconPrefix, icons, progressDot } =
        getOptionProps(this);
      const icon = getComponent(this, 'icon');
      const title = getComponent(this, 'title');
      const description = getComponent(this, 'description');
      let iconNode;
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
              {progressDot({ index: stepNumber - 1, status, title, description, prefixCls })}
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
      return iconNode;
    },
  },
  render() {
    const {
      prefixCls,
      itemWidth,
      active,
      status = 'wait',
      tailContent,
      adjustMarginRight,
      disabled,
      onClick,
      onStepClick,
    } = getOptionProps(this);

    const title = getComponent(this, 'title');
    const subTitle = getComponent(this, 'subTitle');
    const description = getComponent(this, 'description');

    const classString = {
      [`${prefixCls}-item`]: true,
      [`${prefixCls}-item-${status}`]: true,
      [`${prefixCls}-item-custom`]: getComponent(this, 'icon'),
      [`${prefixCls}-item-active`]: active,
      [`${prefixCls}-item-disabled`]: disabled === true,
    };
    const stepProps = {
      class: classString,
    };
    const stepItemStyle = {};
    if (itemWidth) {
      stepItemStyle.width = itemWidth;
    }
    if (adjustMarginRight) {
      stepItemStyle.marginRight = adjustMarginRight;
    }

    const accessibilityProps = {
      onClick: onClick || noop,
    };

    if (onStepClick && !disabled) {
      accessibilityProps.role = 'button';
      accessibilityProps.tabindex = 0;
      accessibilityProps.onClick = this.onItemClick;
    }
    return (
      <div {...stepProps} style={stepItemStyle}>
        <div {...accessibilityProps} class={`${prefixCls}-item-container`}>
          <div class={`${prefixCls}-item-tail`}>{tailContent}</div>
          <div class={`${prefixCls}-item-icon`}>{this.renderIconNode()}</div>
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
  },
});
