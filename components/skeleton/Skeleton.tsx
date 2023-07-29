import type { ExtractPropTypes, PropType } from 'vue';
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import { initDefaultProps } from '../_util/props-util';
import type { SkeletonAvatarProps as AvatarProps } from './Avatar';
import type { SkeletonTitleProps } from './Title';
import Title from './Title';
import type { SkeletonParagraphProps } from './Paragraph';
import Paragraph from './Paragraph';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import Element from './Element';
import useStyle from './style';

/* This only for skeleton internal. */
type SkeletonAvatarProps = Omit<AvatarProps, 'active'>;

export const skeletonProps = () => ({
  active: { type: Boolean, default: undefined },
  loading: { type: Boolean, default: undefined },
  prefixCls: String,
  avatar: {
    type: [Boolean, Object] as PropType<SkeletonAvatarProps | boolean>,
    default: undefined as SkeletonAvatarProps | boolean,
  },
  title: {
    type: [Boolean, Object] as PropType<SkeletonTitleProps | boolean>,
    default: undefined as SkeletonTitleProps | boolean,
  },
  paragraph: {
    type: [Boolean, Object] as PropType<SkeletonParagraphProps | boolean>,
    default: undefined as SkeletonParagraphProps | boolean,
  },
  round: { type: Boolean, default: undefined },
});

export type SkeletonProps = Partial<ExtractPropTypes<ReturnType<typeof skeletonProps>>>;

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
  compatConfig: { MODE: 3 },
  name: 'ASkeleton',
  props: initDefaultProps(skeletonProps(), {
    avatar: false,
    title: true,
    paragraph: true,
  }),
  setup(props, { slots }) {
    const { prefixCls, direction } = useConfigInject('skeleton', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    return () => {
      const { loading, avatar, title, paragraph, active, round } = props;
      const pre = prefixCls.value;
      if (loading || props.loading === undefined) {
        const hasAvatar = !!avatar || (avatar as string) === '';
        const hasTitle = !!title || (title as string) === '';
        const hasParagraph = !!paragraph || (paragraph as string) === '';

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
          [hashId.value]: true,
        });

        return wrapSSR(
          <div class={cls}>
            {avatarNode}
            {contentNode}
          </div>,
        );
      }
      return slots.default?.();
    };
  },
});

export default Skeleton;
