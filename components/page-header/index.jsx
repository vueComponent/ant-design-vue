import classnames from 'classnames';
import PropTypes from '../_util/vue-types';
import { ConfigConsumerProps } from '../config-provider';
import Icon from '../icon';
import Breadcrumb from '../breadcrumb';
import Avatar from '../avatar';
import TransButton from '../_util/transButton';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import Base from '../base';

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
  className: PropTypes.string,
};

const renderBack = (h, prefixCls, backIcon, onBack) => {
  if (!backIcon || !onBack) {
    return null;
  }
  return (
    <LocaleReceiver componentName="PageHeader">
      {({ back }) => (
        <div class={`${prefixCls}-back`}>
          <TransButton
            onClick={e => {
              if (onBack) {
                onBack(e);
              }
            }}
            className={`${prefixCls}-back-button`}
            aria-label={back}
          >
            {backIcon}
          </TransButton>
        </div>
      )}
    </LocaleReceiver>
  );
};

const renderBreadcrumb = (h, breadcrumb) => {
  return <Breadcrumb {...{ props: breadcrumb }} />;
};

const renderTitle = (h, prefixCls, props) => {
  const {
    title,
    avatar,
    subTitle,
    tags,
    extra,
    backIcon = <Icon type="arrow-left" />,
    onBack,
  } = props;
  const headingPrefixCls = `${prefixCls}-heading`;
  if (title || subTitle || tags || extra) {
    const backIconDom = renderBack(h, prefixCls, backIcon, onBack);
    return (
      <div class={headingPrefixCls}>
        {backIconDom}
        {avatar && <Avatar {...{ props: avatar }} />}
        {title && <span class={`${headingPrefixCls}-title`}>{title}</span>}
        {subTitle && <span class={`${headingPrefixCls}-sub-title`}>{subTitle}</span>}
        {tags && <span class={`${headingPrefixCls}-tags`}>{tags}</span>}
        {extra && <span class={`${headingPrefixCls}-extra`}>{extra}</span>}
      </div>
    );
  }
  return null;
};

const renderFooter = (h, prefixCls, footer) => {
  if (footer) {
    return <div class={`${prefixCls}-footer`}>{footer}</div>;
  }
  return null;
};

const renderChildren = (h, prefixCls, children) => {
  return <div class={`${prefixCls}-content`}>{children}</div>;
};

const PageHeader = {
  name: 'APageHeader',
  props: PageHeaderProps,
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  render(h) {
    const { getPrefixCls } = this.configProvider;
    const {
      prefixCls: customizePrefixCls,
      footer,
      breadcrumb,
      className: customizeClassName,
    } = this.$props;
    const children = this.$slots.default;

    const prefixCls = getPrefixCls('page-header', customizePrefixCls);
    const breadcrumbDom = breadcrumb && breadcrumb.routes ? renderBreadcrumb(h, breadcrumb) : null;
    const className = classnames(prefixCls, customizeClassName, {
      'has-breadcrumb': breadcrumbDom,
      'has-footer': footer,
    });

    return (
      <div class={className}>
        {breadcrumbDom}
        {renderTitle(h, prefixCls, { ...this.$props, ...this.$slots, onBack: this.$listeners.back })}
        {children && renderChildren(h, prefixCls, children)}
        {renderFooter(h, prefixCls, footer)}
      </div>
    );
  },
};

/* istanbul ignore next */
PageHeader.install = function(Vue) {
  Vue.use(Base);
  Vue.component(PageHeader.name, PageHeader);
};

export default PageHeader;
