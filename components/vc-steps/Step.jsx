import PropTypes from '../_util/vue-types';
import { getOptionProps, getComponentFromProp, getListeners } from '../_util/props-util';

function isString(str) {
  return typeof str === 'string';
}

export default {
  name: 'Step',
  props: {
    prefixCls: PropTypes.string,
    wrapperStyle: PropTypes.object,
    itemWidth: PropTypes.string,
    status: PropTypes.string,
    iconPrefix: PropTypes.string,
    icon: PropTypes.any,
    adjustMarginRight: PropTypes.string,
    stepNumber: PropTypes.string,
    description: PropTypes.any,
    title: PropTypes.any,
    progressDot: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    tailContent: PropTypes.any,
    icons: PropTypes.shape({
      finish: PropTypes.any,
      error: PropTypes.any,
    }).loose,
  },
  methods: {
    renderIconNode() {
      const { prefixCls, stepNumber, status, iconPrefix, icons } = getOptionProps(this);
      let progressDot = this.progressDot;
      if (progressDot === undefined) {
        progressDot = this.$scopedSlots.progressDot;
      }
      const icon = getComponentFromProp(this, 'icon');
      const title = getComponentFromProp(this, 'title');
      const description = getComponentFromProp(this, 'description');
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
      status = 'wait',
      tailContent,
      adjustMarginRight,
    } = getOptionProps(this);

    const title = getComponentFromProp(this, 'title');
    const description = getComponentFromProp(this, 'description');

    const classString = {
      [`${prefixCls}-item`]: true,
      [`${prefixCls}-item-${status}`]: true,
      [`${prefixCls}-item-custom`]: getComponentFromProp(this, 'icon'),
    };
    const stepProps = {
      class: classString,
      on: getListeners(this),
    };
    const stepItemStyle = {};
    if (itemWidth) {
      stepItemStyle.width = itemWidth;
    }
    if (adjustMarginRight) {
      stepItemStyle.marginRight = adjustMarginRight;
    }
    return (
      <div {...stepProps} style={stepItemStyle}>
        <div class={`${prefixCls}-item-tail`}>{tailContent}</div>
        <div class={`${prefixCls}-item-icon`}>{this.renderIconNode()}</div>
        <div class={`${prefixCls}-item-content`}>
          <div class={`${prefixCls}-item-title`}>{title}</div>
          {description && <div class={`${prefixCls}-item-description`}>{description}</div>}
        </div>
      </div>
    );
  },
};
