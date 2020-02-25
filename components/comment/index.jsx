import PropsTypes from '../_util/vue-types';
import { initDefaultProps, getComponentFromProp, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';
import Base from '../base';
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
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
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
      <div class={prefixCls} {...{ on: getListeners(this) }}>
        {comment}
        {children ? this.renderNested(prefixCls, children) : null}
      </div>
    );
  },
};

/* istanbul ignore next */
Comment.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Comment.name, Comment);
};
export default Comment;
