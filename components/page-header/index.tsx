import type { ExtractPropTypes, PropType } from 'vue';
import { defineComponent, shallowRef, computed } from 'vue';
import PropTypes from '../_util/vue-types';
import { filterEmpty, flattenChildren, isEmptyContent } from '../_util/props-util';
import ArrowLeftOutlined from '@ant-design/icons-vue/ArrowLeftOutlined';
import ArrowRightOutlined from '@ant-design/icons-vue/ArrowRightOutlined';
import Breadcrumb from '../breadcrumb';
import type { AvatarProps } from '../avatar';
import Avatar from '../avatar';
import TransButton from '../_util/transButton';
import LocaleReceiver from '../locale-provider/LocaleReceiver';

import { objectType, vNodeType, withInstall } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { CustomSlotsType } from '../_util/type';

import classNames from '../_util/classNames';
import ResizeObserver from '../vc-resize-observer';
import useDestroyed from '../_util/hooks/useDestroyed';
import type { MouseEventHandler } from '../_util/EventInterface';
import Space from '../space';

// CSSINJS
import useStyle from './style';

export const pageHeaderProps = () => ({
  backIcon: vNodeType(),
  prefixCls: String,
  title: vNodeType(),
  subTitle: vNodeType(),
  breadcrumb: PropTypes.object,
  tags: vNodeType(),
  footer: vNodeType(),
  extra: vNodeType(),
  avatar: objectType<AvatarProps>(),
  ghost: { type: Boolean, default: undefined },
  onBack: Function as PropType<MouseEventHandler>,
});

export type PageHeaderProps = Partial<ExtractPropTypes<ReturnType<typeof pageHeaderProps>>>;

const PageHeader = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'APageHeader',
  inheritAttrs: false,
  props: pageHeaderProps(),
  // emits: ['back'],
  slots: Object as CustomSlotsType<{
    backIcon: any;
    avatar: any;
    breadcrumb: any;
    title: any;
    subTitle: any;
    tags: any;
    extra: any;
    footer: any;
    default: any;
  }>,
  setup(props, { emit, slots, attrs }) {
    const { prefixCls, direction, pageHeader } = useConfigInject('page-header', props);

    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const compact = shallowRef(false);
    const isDestroyed = useDestroyed();
    const onResize = ({ width }: { width: number }) => {
      if (!isDestroyed.value) {
        compact.value = width < 768;
      }
    };
    const ghost = computed(() => props.ghost ?? pageHeader?.value?.ghost ?? true);

    const getBackIcon = () => {
      return (
        props.backIcon ??
        slots.backIcon?.() ??
        (direction.value === 'rtl' ? <ArrowRightOutlined /> : <ArrowLeftOutlined />)
      );
    };

    const renderBack = (backIcon: any) => {
      if (!backIcon || !props.onBack) {
        return null;
      }
      return (
        <LocaleReceiver
          componentName="PageHeader"
          children={({ back }: any) => (
            <div class={`${prefixCls.value}-back`}>
              <TransButton
                onClick={e => {
                  emit('back', e);
                }}
                class={`${prefixCls.value}-back-button`}
                aria-label={back}
              >
                {backIcon}
              </TransButton>
            </div>
          )}
        ></LocaleReceiver>
      );
    };

    const renderBreadcrumb = () => {
      return props.breadcrumb ? <Breadcrumb {...props.breadcrumb} /> : slots.breadcrumb?.();
    };

    const renderTitle = () => {
      const { avatar } = props;
      const title = props.title ?? slots.title?.();
      const subTitle = props.subTitle ?? slots.subTitle?.();
      const tags = props.tags ?? slots.tags?.();
      const extra = props.extra ?? slots.extra?.();
      const headingPrefixCls = `${prefixCls.value}-heading`;
      const hasHeading = title || subTitle || tags || extra;
      // If there is nothing, return a null
      if (!hasHeading) {
        return null;
      }
      const backIcon = getBackIcon();
      const backIconDom = renderBack(backIcon);
      const hasTitle = backIconDom || avatar || hasHeading;
      return (
        <div class={headingPrefixCls}>
          {hasTitle && (
            <div class={`${headingPrefixCls}-left`}>
              {backIconDom}
              {avatar ? <Avatar {...avatar} /> : slots.avatar?.()}
              {title && (
                <span
                  class={`${headingPrefixCls}-title`}
                  title={typeof title === 'string' ? title : undefined}
                >
                  {title}
                </span>
              )}
              {subTitle && (
                <span
                  class={`${headingPrefixCls}-sub-title`}
                  title={typeof subTitle === 'string' ? subTitle : undefined}
                >
                  {subTitle}
                </span>
              )}
              {tags && <span class={`${headingPrefixCls}-tags`}>{tags}</span>}
            </div>
          )}
          {extra && (
            <span class={`${headingPrefixCls}-extra`}>
              <Space>{extra}</Space>
            </span>
          )}
        </div>
      );
    };

    const renderFooter = () => {
      const footer = props.footer ?? filterEmpty(slots.footer?.());
      return isEmptyContent(footer) ? null : (
        <div class={`${prefixCls.value}-footer`}>{footer}</div>
      );
    };

    const renderChildren = (children: any) => {
      return <div class={`${prefixCls.value}-content`}>{children}</div>;
    };
    return () => {
      const hasBreadcrumb = props.breadcrumb?.routes || slots.breadcrumb;
      const hasFooter = props.footer || slots.footer;
      const children = flattenChildren(slots.default?.());
      const className = classNames(
        prefixCls.value,
        {
          'has-breadcrumb': hasBreadcrumb,
          'has-footer': hasFooter,
          [`${prefixCls.value}-ghost`]: ghost.value,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-compact`]: compact.value,
        },
        attrs.class,
        hashId.value,
      );
      return wrapSSR(
        <ResizeObserver onResize={onResize}>
          <div {...attrs} class={className}>
            {renderBreadcrumb()}
            {renderTitle()}
            {children.length ? renderChildren(children) : null}
            {renderFooter()}
          </div>
        </ResizeObserver>,
      );
    };
  },
});

export default withInstall(PageHeader);
