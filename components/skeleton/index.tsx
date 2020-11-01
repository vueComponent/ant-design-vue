import { defineComponent, inject } from 'vue';
import classNames from '../_util/classNames';
import PropTypes, { withUndefined } from '../_util/vue-types';
import { initDefaultProps, hasProp } from '../_util/props-util';
import { defaultConfigProvider } from '../config-provider';
import Avatar, { SkeletonAvatarProps, ISkeletonAvatarProps } from './Avatar';
import Title, { SkeletonTitleProps, ISkeletonTitleProps } from './Title';
import Paragraph, { SkeletonParagraphProps, ISkeletonParagraphProps } from './Paragraph';
import { withInstall } from '../_util/type';

export const SkeletonProps = {
  active: PropTypes.looseBool,
  loading: PropTypes.looseBool,
  prefixCls: PropTypes.string,
  children: PropTypes.any,
  avatar: withUndefined(
    PropTypes.oneOfType([PropTypes.string, SkeletonAvatarProps, PropTypes.looseBool]),
  ),
  title: withUndefined(
    PropTypes.oneOfType([PropTypes.looseBool, PropTypes.string, SkeletonTitleProps]),
  ),
  paragraph: withUndefined(
    PropTypes.oneOfType([PropTypes.looseBool, PropTypes.string, SkeletonParagraphProps]),
  ),
};

function getComponentProps<T>(prop: T | boolean | undefined): T | {} {
  if (prop && typeof prop === 'object') {
    return prop;
  }
  return {};
}

function getAvatarBasicProps(hasTitle: boolean, hasParagraph: boolean): ISkeletonAvatarProps {
  if (hasTitle && !hasParagraph) {
    return { shape: 'square' };
  }

  return { shape: 'circle' };
}

function getTitleBasicProps(hasAvatar: boolean, hasParagraph: boolean): ISkeletonTitleProps {
  if (!hasAvatar && hasParagraph) {
    return { width: '38%' };
  }

  if (hasAvatar && hasParagraph) {
    return { width: '50%' };
  }

  return {};
}

function getParagraphBasicProps(hasAvatar: boolean, hasTitle: boolean): ISkeletonParagraphProps {
  const basicProps: ISkeletonParagraphProps = {};

  // Width
  if (!hasAvatar || !hasTitle) {
    basicProps.width = '61%';
  }

  // Rows
  if (!hasAvatar && hasTitle) {
    basicProps.rows = 3;
  } else {
    basicProps.rows = 2;
  }

  return basicProps;
}

const Skeleton = defineComponent({
  name: 'ASkeleton',
  props: initDefaultProps(SkeletonProps, {
    avatar: false,
    title: true,
    paragraph: true,
  }),
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  render() {
    const {
      prefixCls: customizePrefixCls,
      loading,
      avatar,
      title,
      paragraph,
      active,
    } = this.$props;
    const { getPrefixCls } = this.configProvider;
    const prefixCls = getPrefixCls('skeleton', customizePrefixCls);

    if (loading || !hasProp(this, 'loading')) {
      const hasAvatar = !!avatar || avatar === '';
      const hasTitle = !!title;
      const hasParagraph = !!paragraph;

      // Avatar
      let avatarNode;
      if (hasAvatar) {
        const avatarProps = {
          prefixCls: `${prefixCls}-avatar`,
          ...getAvatarBasicProps(hasTitle, hasParagraph),
          ...getComponentProps(avatar),
        };

        avatarNode = (
          <div class={`${prefixCls}-header`}>
            <Avatar {...avatarProps} />
          </div>
        );
      }

      let contentNode;
      if (hasTitle || hasParagraph) {
        // Title
        let $title;
        if (hasTitle) {
          const titleProps = {
            prefixCls: `${prefixCls}-title`,
            ...getTitleBasicProps(hasAvatar, hasParagraph),
            ...getComponentProps(title),
          };

          $title = <Title {...titleProps} />;
        }

        // Paragraph
        let paragraphNode;
        if (hasParagraph) {
          const paragraphProps = {
            prefixCls: `${prefixCls}-paragraph`,
            ...getParagraphBasicProps(hasAvatar, hasTitle),
            ...getComponentProps(paragraph),
          };

          paragraphNode = <Paragraph {...paragraphProps} />;
        }

        contentNode = (
          <div class={`${prefixCls}-content`}>
            {$title}
            {paragraphNode}
          </div>
        );
      }

      const cls = classNames(prefixCls, {
        [`${prefixCls}-with-avatar`]: hasAvatar,
        [`${prefixCls}-active`]: active,
      });

      return (
        <div class={cls}>
          {avatarNode}
          {contentNode}
        </div>
      );
    }
    return this.$slots.default?.();
  },
});

export default withInstall(Skeleton);
