import { defineComponent, inject, VNodeTypes, ExtractPropTypes } from 'vue';
import PropTypes from '../_util/vue-types';
import { getComponent, getOptionProps, getSlot } from '../_util/props-util';
import { defaultConfigProvider } from '../config-provider';
import ArrowLeftOutlined from '@ant-design/icons-vue/ArrowLeftOutlined';
import Breadcrumb from '../breadcrumb';
import Avatar from '../avatar';
import TransButton from '../_util/transButton';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { withInstall } from '../_util/type';

export const PageHeaderProps = {
  backIcon: PropTypes.VNodeChild,
  prefixCls: PropTypes.string,
  title: PropTypes.VNodeChild,
  subTitle: PropTypes.VNodeChild,
  breadcrumb: PropTypes.object,
  tags: PropTypes.any,
  footer: PropTypes.VNodeChild,
  extra: PropTypes.VNodeChild,
  avatar: PropTypes.object,
  ghost: PropTypes.looseBool,
  onBack: PropTypes.func,
};

const renderBack = (
  instance: any,
  prefixCls: string,
  backIcon: VNodeTypes,
  onBack: (e: HTMLElement) => void,
) => {
  if (!backIcon || !onBack) {
    return null;
  }
  return (
    <LocaleReceiver
      componentName="PageHeader"
      children={({ back }: any) => (
        <div class={`${prefixCls}-back`}>
          <TransButton
            onClick={e => {
              instance.$emit('back', e);
            }}
            class={`${prefixCls}-back-button`}
            aria-label={back}
          >
            {backIcon}
          </TransButton>
        </div>
      )}
    ></LocaleReceiver>
  );
};

const renderBreadcrumb = breadcrumb => {
  return <Breadcrumb {...breadcrumb} />;
};

const renderTitle = (prefixCls: string, instance: any) => {
  const { avatar } = instance;
  const title = getComponent(instance, 'title');
  const subTitle = getComponent(instance, 'subTitle');
  const tags = getComponent(instance, 'tags');
  const extra = getComponent(instance, 'extra');
  const backIcon =
    getComponent(instance, 'backIcon') !== undefined ? (
      getComponent(instance, 'backIcon')
    ) : (
      <ArrowLeftOutlined />
    );
  const onBack = instance.onBack;
  const headingPrefixCls = `${prefixCls}-heading`;
  if (title || subTitle || tags || extra) {
    const backIconDom = renderBack(instance, prefixCls, backIcon, onBack);
    return (
      <div class={headingPrefixCls}>
        {backIconDom}
        {avatar && <Avatar {...avatar} />}
        {title && <span class={`${headingPrefixCls}-title`}>{title}</span>}
        {subTitle && <span class={`${headingPrefixCls}-sub-title`}>{subTitle}</span>}
        {tags && <span class={`${headingPrefixCls}-tags`}>{tags}</span>}
        {extra && <span class={`${headingPrefixCls}-extra`}>{extra}</span>}
      </div>
    );
  }
  return null;
};

const renderFooter = (prefixCls: string, footer: VNodeTypes) => {
  if (footer) {
    return <div class={`${prefixCls}-footer`}>{footer}</div>;
  }
  return null;
};

const renderChildren = (prefixCls: string, children: VNodeTypes) => {
  return <div class={`${prefixCls}-content`}>{children}</div>;
};

const PageHeader = defineComponent({
  name: 'APageHeader',
  props: PageHeaderProps,
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  render() {
    const { getPrefixCls, pageHeader } = this.configProvider;
    const props = getOptionProps(this) as ExtractPropTypes<typeof PageHeaderProps>;
    const { prefixCls: customizePrefixCls, breadcrumb } = props;
    const footer = getComponent(this, 'footer');
    const children = getSlot(this);
    let ghost = true;

    // Use `ghost` from `props` or from `ConfigProvider` instead.
    if ('ghost' in props) {
      ghost = props.ghost;
    } else if (pageHeader && 'ghost' in pageHeader) {
      ghost = pageHeader.ghost;
    }
    const prefixCls = getPrefixCls('page-header', customizePrefixCls);
    const breadcrumbDom = breadcrumb && breadcrumb.routes ? renderBreadcrumb(breadcrumb) : null;
    const className = [
      prefixCls,
      {
        'has-breadcrumb': breadcrumbDom,
        'has-footer': footer,
        [`${prefixCls}-ghost`]: ghost,
      },
    ];

    return (
      <div class={className}>
        {breadcrumbDom}
        {renderTitle(prefixCls, this)}
        {children.length ? renderChildren(prefixCls, children) : null}
        {renderFooter(prefixCls, footer)}
      </div>
    );
  },
});

export default withInstall(PageHeader);
