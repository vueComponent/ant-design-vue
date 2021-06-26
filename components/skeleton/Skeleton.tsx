import type { ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import PropTypes, { withUndefined } from '../_util/vue-types';
import { initDefaultProps } from '../_util/props-util';
import type { AvatarProps } from './Avatar';
import { avatarProps } from './Avatar';
import type { SkeletonTitleProps } from './Title';
import Title, { skeletonTitleProps } from './Title';
import type { SkeletonParagraphProps } from './Paragraph';
import Paragraph, { skeletonParagraphProps } from './Paragraph';
import Omit from 'omit.js';
import useConfigInject from '../_util/hooks/useConfigInject';
import Element from './Element';

/* This only for skeleton internal. */
type SkeletonAvatarProps = Omit<AvatarProps, 'active'>;

export const skeletonProps = {
  active: PropTypes.looseBool,
  loading: PropTypes.looseBool,
  prefixCls: PropTypes.string,
  avatar: withUndefined(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape(Omit(avatarProps, ['active'])).loose,
      PropTypes.looseBool,
    ]),
  ),
  title: withUndefined(
    PropTypes.oneOfType([
      PropTypes.looseBool,
      PropTypes.string,
      PropTypes.shape(skeletonTitleProps).loose,
    ]),
  ),
  paragraph: withUndefined(
    PropTypes.oneOfType([
      PropTypes.looseBool,
      PropTypes.string,
      PropTypes.shape(skeletonParagraphProps).loose,
    ]),
  ),
};

export type SkeletonProps = Partial<ExtractPropTypes<typeof skeletonProps>>;

function getComponentProps<T>(prop: T | boolean | undefined): T | {} {
  if (prop && typeof prop === 'object') {
    return prop;
  }
  return {};
}
function getAvatarBasicProps(hasTitle: boolean, hasParagraph: boolean): SkeletonAvatarProps {
  if (hasTitle && !hasParagraph) {
    // Square avatar
    return { size: 'large', shape: 'square' };
  }

  return { size: 'large', shape: 'circle' };
}

function getTitleBasicProps(hasAvatar: boolean, hasParagraph: boolean): SkeletonTitleProps {
  if (!hasAvatar && hasParagraph) {
    return { width: '38%' };
  }

  if (hasAvatar && hasParagraph) {
    return { width: '50%' };
  }

  return {};
}

function getParagraphBasicProps(hasAvatar: boolean, hasTitle: boolean): SkeletonParagraphProps {
  const basicProps: SkeletonParagraphProps = {};

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
  props: initDefaultProps(skeletonProps, {
    avatar: false,
    title: true,
    paragraph: true,
  }),
  setup(props, { slots }) {
    const { prefixCls, direction } = useConfigInject('skeleton', props);
    return () => {
      const { loading, avatar, title, paragraph, active, round } = props;
      const pre = prefixCls.value;
      if (loading || props.loading === undefined) {
        const hasAvatar = !!avatar || avatar === '';
        const hasTitle = !!title || title === '';
        const hasParagraph = !!paragraph || paragraph === '';

        // Avatar
        let avatarNode;
        if (hasAvatar) {
          const avatarProps = {
            prefixCls: `${pre}-avatar`,
            ...getAvatarBasicProps(hasTitle, hasParagraph),
            ...getComponentProps(avatar),
          };

          avatarNode = (
            <div class={`${pre}-header`}>
              <Element {...avatarProps} />
            </div>
          );
        }

        let contentNode;
        if (hasTitle || hasParagraph) {
          // Title
          let $title;
          if (hasTitle) {
            const titleProps = {
              prefixCls: `${pre}-title`,
              ...getTitleBasicProps(hasAvatar, hasParagraph),
              ...getComponentProps(title),
            };

            $title = <Title {...titleProps} />;
          }

          // Paragraph
          let paragraphNode;
          if (hasParagraph) {
            const paragraphProps = {
              prefixCls: `${pre}-paragraph`,
              ...getParagraphBasicProps(hasAvatar, hasTitle),
              ...getComponentProps(paragraph),
            };

            paragraphNode = <Paragraph {...paragraphProps} />;
          }

          contentNode = (
            <div class={`${pre}-content`}>
              {$title}
              {paragraphNode}
            </div>
          );
        }

        const cls = classNames(pre, {
          [`${pre}-with-avatar`]: hasAvatar,
          [`${pre}-active`]: active,
          [`${pre}-rtl`]: direction.value === 'rtl',
          [`${pre}-round`]: round,
        });

        return (
          <div class={cls}>
            {avatarNode}
            {contentNode}
          </div>
        );
      }
      return slots.default?.();
    };
  },
});

export default Skeleton;
