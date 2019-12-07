import classNames from 'classnames';
import PropTypes from '../_util/vue-types';
import { initDefaultProps, hasProp } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';
import Avatar, { SkeletonAvatarProps } from './Avatar';
import Title, { SkeletonTitleProps } from './Title';
import Paragraph, { SkeletonParagraphProps } from './Paragraph';
import Base from '../base';

export const SkeletonProps = {
  active: PropTypes.bool,
  loading: PropTypes.bool,
  prefixCls: PropTypes.string,
  children: PropTypes.any,
  avatar: PropTypes.oneOfType([PropTypes.string, SkeletonAvatarProps, PropTypes.bool]),
  title: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, SkeletonTitleProps]),
  paragraph: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, SkeletonParagraphProps]),
};

function getComponentProps(prop) {
  if (prop && typeof prop === 'object') {
    return prop;
  }
  return {};
}

function getAvatarBasicProps(hasTitle, hasParagraph) {
  if (hasTitle && !hasParagraph) {
    return { shape: 'square' };
  }

  return { shape: 'circle' };
}

function getTitleBasicProps(hasAvatar, hasParagraph) {
  if (!hasAvatar && hasParagraph) {
    return { width: '38%' };
  }

  if (hasAvatar && hasParagraph) {
    return { width: '50%' };
  }

  return {};
}

function getParagraphBasicProps(hasAvatar, hasTitle) {
  const basicProps = {};

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

const Skeleton = {
  name: 'ASkeleton',
  props: initDefaultProps(SkeletonProps, {
    avatar: false,
    title: true,
    paragraph: true,
  }),
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
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
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('skeleton', customizePrefixCls);

    if (loading || !hasProp(this, 'loading')) {
      const hasAvatar = !!avatar || avatar === '';
      const hasTitle = !!title;
      const hasParagraph = !!paragraph;

      // Avatar
      let avatarNode;
      if (hasAvatar) {
        const avatarProps = {
          props: {
            prefixCls: `${prefixCls}-avatar`,
            ...getAvatarBasicProps(hasTitle, hasParagraph),
            ...getComponentProps(avatar),
          },
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
            props: {
              prefixCls: `${prefixCls}-title`,
              ...getTitleBasicProps(hasAvatar, hasParagraph),
              ...getComponentProps(title),
            },
          };

          $title = <Title {...titleProps} />;
        }

        // Paragraph
        let paragraphNode;
        if (hasParagraph) {
          const paragraphProps = {
            props: {
              prefixCls: `${prefixCls}-paragraph`,
              ...getParagraphBasicProps(hasAvatar, hasTitle),
              ...getComponentProps(paragraph),
            },
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
    return this.$slots.default && this.$slots.default[0];
  },
};
/* istanbul ignore next */
Skeleton.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Skeleton.name, Skeleton);
};
export default Skeleton;
