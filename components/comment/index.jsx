import PropsTypes from '../_util/vue-types';
import { initDefaultProps, getComponentFromProp } from '../_util/props-util';

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
  props: initDefaultProps(CommentProps, {
    prefixCls: 'ant-comment',
  }),
  methods: {
    getAction(actions) {
      if (!actions || !actions.length) {
        return null;
      }
      const actionList = actions.map((action, index) => <li key={`action-${index}`}>{action}</li>);
      return actionList;
    },
    renderNested(children) {
      const { prefixCls } = this.$props;

      return <div class={`${prefixCls}-nested`}>{children}</div>;
    },
  },

  render() {
    const { prefixCls } = this.$props;

    const actions = getComponentFromProp(this, 'actions');
    const author = getComponentFromProp(this, 'author');
    const avatar = getComponentFromProp(this, 'avatar');
    const content = getComponentFromProp(this, 'content');
    const datetime = getComponentFromProp(this, 'datetime');

    const avatarDom = (
      <div class={`${prefixCls}-avatar`}>
        {typeof avatar === 'string' ? <img src={avatar} /> : avatar}
      </div>
    );

    const actionDom =
      actions && actions.length ? (
        <ul class={`${prefixCls}-actions`}>{this.getAction(actions)}</ul>
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
    const children = this.$slots.default;
    return (
      <div class={prefixCls} {...{ on: this.$listeners }}>
        {comment}
        {children ? this.renderNested(children) : null}
      </div>
    );
  },
};

/* istanbul ignore next */
Comment.install = function(Vue) {
  Vue.component(Comment.name, Comment);
};
export default Comment;
