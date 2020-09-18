import { inject, VNodeTypes, CSSProperties, App, SetupContext } from 'vue';
import classNames from '../_util/classNames';
import { ConfigConsumerProps } from '../config-provider';

export interface CommentProps {
  /** List of action items rendered below the comment content */
  actions?: Array<VNodeTypes>;
  /** The element to display as the comment author. */
  author?: VNodeTypes;
  /** The element to display as the comment avatar - generally an antd Avatar */
  avatar?: VNodeTypes;
  /** The main content of the comment */
  content: VNodeTypes;
  /** Comment prefix defaults to '.ant-comment' */
  prefixCls?: string;
  /** Additional style for the comment */
  style?: CSSProperties;
  /** A datetime element containing the time to be displayed */
  datetime?: VNodeTypes;
}

const Comment = (
  {
    actions,
    author,
    avatar,
    content,
    prefixCls: customizePrefixCls,
    datetime,
    ...otherProps
  }: CommentProps,
  { slots }: SetupContext,
) => {
  const { getPrefixCls } = inject('configProvider', ConfigConsumerProps);

  const renderNested = (prefixCls: string, nestedChildren: any) => {
    return <div class={classNames(`${prefixCls}-nested`)}>{nestedChildren}</div>;
  };

  const prefixCls = getPrefixCls('comment', customizePrefixCls);

  const avatarDom = avatar ? (
    <div class={`${prefixCls}-avatar`}>
      {typeof avatar === 'string' ? <img src={avatar} alt="comment-avatar" /> : avatar}
    </div>
  ) : null;

  const actionDom =
    actions && actions.length ? (
      <ul class={`${prefixCls}-actions`}>
        {actions.map((action, index) => (
          <li key={`action-${index}`}>{action}</li> // eslint-disable-line react/no-array-index-key
        ))}
      </ul>
    ) : null;

  const authorContent = (author || datetime) && (
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
  const cls = classNames(prefixCls);

  const children = slots.default?.();

  return (
    <div {...otherProps} class={cls}>
      <div class={`${prefixCls}-inner`}>
        {avatarDom}
        {contentDom}
      </div>
      {children ? renderNested(prefixCls, children) : null}
    </div>
  );
};

Comment.displayName = 'AComment';

/* istanbul ignore next */
Comment.install = function(app: App) {
  app.component(Comment.name, Comment);
};

export default Comment;
