import { inject } from 'vue';
import PropTypes from '../_util/vue-types';
import { getComponent, getOptionProps, getSlot } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';
import ArrowLeftOutlined from '@ant-design/icons-vue/ArrowLeftOutlined';
import Breadcrumb from '../breadcrumb';
import Avatar from '../avatar';
import TransButton from '../_util/transButton';
import LocaleReceiver from '../locale-provider/LocaleReceiver';

export const PageHeaderProps = {
  backIcon: PropTypes.any,
  prefixCls: PropTypes.string,
  title: PropTypes.any,
  subTitle: PropTypes.any,
  breadcrumb: PropTypes.object,
  tags: PropTypes.any,
  footer: PropTypes.any,
  extra: PropTypes.any,
  avatar: PropTypes.object,
  ghost: PropTypes.bool,
  onBack: PropTypes.func,
};

const renderBack = (instance, prefixCls, backIcon, onBack) => {
  if (!backIcon || !onBack) {
    return null;
  }
  return (
    <LocaleReceiver
      componentName="PageHeader"
      children={({ back }) => (
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

const renderTitle = (prefixCls, instance) => {
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

const renderFooter = (prefixCls, footer) => {
  if (footer) {
    return <div class={`${prefixCls}-footer`}>{footer}</div>;
  }
  return null;
};

const renderChildren = (prefixCls, children) => {
  return <div class={`${prefixCls}-content`}>{children}</div>;
};

const PageHeader = {
  name: 'APageHeader',
  props: PageHeaderProps,
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  render() {
    const { getPrefixCls, pageHeader } = this.configProvider;
    const props = getOptionProps(this);
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
};

/* istanbul ignore next */
PageHeader.install = function(app) {
  app.component(PageHeader.name, PageHeader);
};

export default PageHeader;
