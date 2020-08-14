import { inject } from 'vue';
import PropsTypes from '../_util/vue-types';
import { getComponent, getSlot } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';
export const CommentProps = {
  actions: PropsTypes.array,
  /** The element to display as the comment author. */
  author: PropsTypes.any,
  /** The element to display as the comment avatar - generally an antd Avatar */
  avatar: PropsTypes.any,
  /** The main content of the comment */
  content: PropsTypes.any,
  /** Comment prefix defaults to '.ant-comment' */
  prefixCls: PropsTypes.string,
  /** A datetime element containing the time to be displayed */
  datetime: PropsTypes.any,
};

const Comment = {
  name: 'AComment',
  props: CommentProps,
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  methods: {
    getAction(actions) {
      if (!actions || !actions.length) {
        return null;
      }
      const actionList = actions.map((action, index) => <li key={`action-${index}`}>{action}</li>);
      return actionList;
    },
    renderNested(prefixCls, children) {
      return <div class={`${prefixCls}-nested`}>{children}</div>;
    },
  },

  render() {
    const { prefixCls: customizePrefixCls } = this.$props;

    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('comment', customizePrefixCls);

    const actions = getComponent(this, 'actions');
    const author = getComponent(this, 'author');
    const avatar = getComponent(this, 'avatar');
    const content = getComponent(this, 'content');
    const datetime = getComponent(this, 'datetime');

    const avatarDom = (
      <div class={`${prefixCls}-avatar`}>
        {typeof avatar === 'string' ? <img src={avatar} alt="comment-avatar" /> : avatar}
      </div>
    );

    const actionDom = actions ? (
      <ul class={`${prefixCls}-actions`}>
        {this.getAction(Array.isArray(actions) ? actions : [actions])}
      </ul>
    ) : null;

    const authorContent = (
      <div class={`${prefixCls}-content-author`}>
        {author && <span class={`${prefixCls}-content-author-name`}>{author}</span>}
        {datetime && <span class={`${prefixCls}-content-author-time`}>{datetime}</span>}
      </div>
    );

    const contentDom = (
      <div class={`${prefixCls}-content`}>
        {authorContent}
        <div class={`${prefixCls}-content-detail`}>{content}</div>
        {actionDom}
      </div>
    );

    const comment = (
      <div class={`${prefixCls}-inner`}>
        {avatarDom}
        {contentDom}
      </div>
    );
    const children = getSlot(this);
    return (
      <div class={prefixCls}>
        {comment}
        {children && children.length ? this.renderNested(prefixCls, children) : null}
      </div>
    );
  },
};

/* istanbul ignore next */
Comment.install = function(app) {
  app.component(Comment.name, Comment);
};
export default Comment;
