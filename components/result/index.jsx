import omit from 'omit.js';
import PropTypes from '../_util/vue-types';
import { getOptionProps, getComponentFromProp } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';
import Icon from '../icon';
import Base from '../base';
import noFound from './noFound.svg';
import serverError from './serverError.svg';
import unauthorized from './unauthorized.svg';

export const IconMap = {
  success: 'check-circle',
  error: 'close-circle',
  info: 'exclamation-circle',
  warning: 'warning',
};

export const ExceptionMap = {
  '404': noFound,
  '500': serverError,
  '403': unauthorized,
};

// ExceptionImageMap keys
const ExceptionStatus = Object.keys(ExceptionMap);

export const ResultProps = {
  prefixCls: PropTypes.string,
  icon: PropTypes.string,
  status: PropTypes.oneOf(['success', 'error', 'info', 'warning', '404', '403', '500']).def('info'),
  title: PropTypes.string,
  subTitle: PropTypes.string,
  extra: PropTypes.any,
};


const Result = {
  name: 'AResult',
  props: ResultProps,
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  methods: {
    renderIcon(prefixCls, { status, icon }) {
      if (ExceptionStatus.includes(status)) {
        const svgImg = ExceptionMap[status];
        return (
          <div class={`${prefixCls}-icon ${prefixCls}-image`}>
            <img alt={status} src={svgImg} />
          </div>
        );
      }
      // prop `icon` require slot or VNode
      const iconString = IconMap[status];
      const iconNode = icon || <Icon type={iconString} theme="filled"/>;
      return <div class={`${prefixCls}-icon`}>{iconNode}</div>;
    },
    renderExtra(prefixCls, extra) {
      return extra && <div class={`${prefixCls}-extra`}>{extra}</div>;
    },
  },
  render() {
    const {
      prefixCls: customizePrefixCls,
      status,
      ...restProps
    } = getOptionProps(this);
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('result', customizePrefixCls);

    const title = getComponentFromProp(this, 'title') || null;
    const subTitle = getComponentFromProp(this, 'subTitle') || null;
    const icon = getComponentFromProp(this, 'icon') || null;

    return (
      <div class={`${prefixCls} ${prefixCls}-${status}`}>
        {this.renderIcon(prefixCls, { status, icon })}
        <div class={`${prefixCls}-title`}>{title}</div>
        <div class={`${prefixCls}-subtitle`}>{subTitle}</div>
        {this.$slots.default && <div class={`${prefixCls}-content`}>{this.$slots.default}</div>}
        {this.renderExtra(prefixCls, this.$slots.extra)}
      </div>
    );
  },
};

/* istanbul ignore next */
Result.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Result.name, Result);
};
export default Result;
