import type { ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';
import PropsTypes from '../_util/vue-types';
import { flattenChildren } from '../_util/props-util';
import type { VueNode } from '../_util/type';
import { withInstall } from '../_util/type';
import useConfigInject from '../_util/hooks/useConfigInject';
export const commentProps = {
  actions: PropsTypes.array,
  /** The element to display as the comment author. */
  author: PropsTypes.VNodeChild,
  /** The element to display as the comment avatar - generally an antd Avatar */
  avatar: PropsTypes.VNodeChild,
  /** The main content of the comment */
  content: PropsTypes.VNodeChild,
  /** Comment prefix defaults to '.ant-comment' */
  prefixCls: PropsTypes.string,
  /** A datetime element containing the time to be displayed */
  datetime: PropsTypes.VNodeChild,
};

export type CommentProps = Partial<ExtractPropTypes<typeof commentProps>>;

const Comment = defineComponent({
  name: 'AComment',
  props: commentProps,
  slots: ['actions', 'author', 'avatar', 'content', 'datetime'],
  setup(props, { slots }) {
    const { prefixCls, direction } = useConfigInject('comment', props);
    const renderNested = (prefixCls: string, children: VueNode) => {
      return <div class={`${prefixCls}-nested`}>{children}</div>;
    };
    const getAction = (actions: VueNode[]) => {
      if (!actions || !actions.length) {
        return null;
      }
      const actionList = actions.map((action, index) => <li key={`action-${index}`}>{action}</li>);
      return actionList;
    };
    return () => {
      const pre = prefixCls.value;

      const actions = props.actions ?? slots.actions?.();
      const author = props.author ?? slots.author?.();
      const avatar = props.avatar ?? slots.avatar?.();
      const content = props.content ?? slots.content?.();
      const datetime = props.datetime ?? slots.datetime?.();

      const avatarDom = (
        <div class={`${pre}-avatar`}>
          {typeof avatar === 'string' ? <img src={avatar} alt="comment-avatar" /> : avatar}
        </div>
      );

      const actionDom = actions ? (
        <ul class={`${pre}-actions`}>{getAction(Array.isArray(actions) ? actions : [actions])}</ul>
      ) : null;

      const authorContent = (
        <div class={`${pre}-content-author`}>
          {author && <span class={`${pre}-content-author-name`}>{author}</span>}
          {datetime && <span class={`${pre}-content-author-time`}>{datetime}</span>}
        </div>
      );

      const contentDom = (
        <div class={`${pre}-content`}>
          {authorContent}
          <div class={`${pre}-content-detail`}>{content}</div>
          {actionDom}
        </div>
      );

      const comment = (
        <div class={`${pre}-inner`}>
          {avatarDom}
          {contentDom}
        </div>
      );
      const children = flattenChildren(slots.default?.());
      return (
        <div
          class={[
            pre,
            {
              [`${pre}-rtl`]: direction.value === 'rtl',
            },
          ]}
        >
          {comment}
          {children && children.length ? renderNested(pre, children) : null}
        </div>
      );
    };
  },
});

export default withInstall(Comment);
