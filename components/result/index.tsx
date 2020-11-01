import { App, defineComponent, inject, VNodeTypes, Plugin } from 'vue';
import PropTypes from '../_util/vue-types';
import { tuple } from '../_util/type';
import { getComponent } from '../_util/props-util';
import { defaultConfigProvider } from '../config-provider';
import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled';
import WarningFilled from '@ant-design/icons-vue/WarningFilled';
import noFound from './noFound';
import serverError from './serverError';
import unauthorized from './unauthorized';

export const IconMap = {
  success: CheckCircleFilled,
  error: CloseCircleFilled,
  info: ExclamationCircleFilled,
  warning: WarningFilled,
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
  icon: PropTypes.any,
  status: PropTypes.oneOf(tuple('success', 'error', 'info', 'warning', '404', '403', '500')).def(
    'info',
  ),
  title: PropTypes.any,
  subTitle: PropTypes.any,
  extra: PropTypes.any,
};

const renderIcon = (prefixCls: string, { status, icon }) => {
  if (ExceptionStatus.includes(`${status}`)) {
    const SVGComponent = ExceptionMap[status];
    return (
      <div class={`${prefixCls}-icon ${prefixCls}-image`}>
        <SVGComponent />
      </div>
    );
  }
  const IconComponent = IconMap[status];
  const iconNode = icon || <IconComponent />;
  return <div class={`${prefixCls}-icon`}>{iconNode}</div>;
};

const renderExtra = (prefixCls: string, extra: VNodeTypes) =>
  extra && <div class={`${prefixCls}-extra`}>{extra}</div>;

const Result = defineComponent({
  name: 'AResult',
  props: ResultProps,
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  render() {
    const { prefixCls: customizePrefixCls, status } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('result', customizePrefixCls);

    const title = getComponent(this, 'title');
    const subTitle = getComponent(this, 'subTitle');
    const icon = getComponent(this, 'icon');
    const extra = getComponent(this, 'extra');

    return (
      <div class={`${prefixCls} ${prefixCls}-${status}`}>
        {renderIcon(prefixCls, { status, icon })}
        <div class={`${prefixCls}-title`}>{title}</div>
        {subTitle && <div class={`${prefixCls}-subtitle`}>{subTitle}</div>}
        {this.$slots.default && <div class={`${prefixCls}-content`}>{this.$slots.default()}</div>}
        {renderExtra(prefixCls, extra)}
      </div>
    );
  },
});

/* add resource */
Result.PRESENTED_IMAGE_403 = ExceptionMap[403];
Result.PRESENTED_IMAGE_404 = ExceptionMap[404];
Result.PRESENTED_IMAGE_500 = ExceptionMap[500];

/* istanbul ignore next */
Result.install = function(app: App) {
  app.component(Result.name, Result);
  return app;
};

export default Result as typeof Result &
  Plugin & {
    readonly PRESENTED_IMAGE_403: typeof unauthorized;
    readonly PRESENTED_IMAGE_404: typeof noFound;
    readonly PRESENTED_IMAGE_500: typeof serverError;
  };
