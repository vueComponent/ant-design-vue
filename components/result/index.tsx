import { inject, App, defineComponent, computed } from 'vue';
import { getComponentFromSetup } from '../_util/props-util';
import { defaultConfigProvider, ConfigConsumerProps } from '../config-provider';
import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled';
import WarningFilled from '@ant-design/icons-vue/WarningFilled';
import noFound from './noFound';
import serverError from './serverError';
import unauthorized from './unauthorized';
import { ResultProps, VNodeElement } from './resultTypes';
import resultProps from './resultProps';

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

const renderIcon = (prefixCls, { status, icon }) => {
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

const renderExtra = (prefixCls, extra) => extra && <div class={`${prefixCls}-extra`}>{extra}</div>;

const Result = defineComponent({
  name: 'AResult',
  props: resultProps,
  setup: (propsValues, { attrs, slots }) => {
    const propsRef = computed(() => {
      return { ...attrs, ...propsValues } as ResultProps;
    });
    const { getPrefixCls } = inject<ConfigConsumerProps>('configProvider', defaultConfigProvider);

    return () => {
      const { prefixCls: customizePrefixCls, status } = propsRef.value;
      const prefixCls = getPrefixCls('result', customizePrefixCls);

      const title = getComponentFromSetup(propsValues, slots, 'title') as VNodeElement;
      const subTitle = getComponentFromSetup(propsValues, slots, 'subTitle') as VNodeElement;
      const icon = getComponentFromSetup(propsValues, slots, 'icon') as VNodeElement;
      const extra = getComponentFromSetup(propsValues, slots, 'extra') as VNodeElement;
      return (
        <div class={`${prefixCls} ${prefixCls}-${status}`}>
          {renderIcon(prefixCls, { status, icon })}
          <div class={`${prefixCls}-title`}>{title}</div>
          {subTitle && <div class={`${prefixCls}-subtitle`}>{subTitle}</div>}
          {slots.default && <div class={`${prefixCls}-content`}>{slots.default?.()}</div>}
          {renderExtra(prefixCls, extra)}
        </div>
      );
    };
  },
});

/* add resource */
Result.PRESENTED_IMAGE_403 = ExceptionMap[403];
Result.PRESENTED_IMAGE_404 = ExceptionMap[404];
Result.PRESENTED_IMAGE_500 = ExceptionMap[500];

/* istanbul ignore next */
Result.install = function(app: App<Element>) {
  app.component(Result.name, Result);
};
export default Result;
