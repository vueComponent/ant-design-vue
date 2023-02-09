import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';

export interface ComponentToken {}

type CommentToken = FullToken<'Comment'> & {
  commentBg: string;
  commentPaddingBase: string;
  commentNestIndent: string;
  commentFontSizeBase: number;
  commentFontSizeSm: number;
  commentAuthorNameColor: string;
  commentAuthorTimeColor: string;
  commentActionColor: string;
  commentActionHoverColor: string;
  commentActionsMarginBottom: string;
  commentActionsMarginTop: number;
  commentContentDetailPMarginBottom: string;
};

const genBaseStyle: GenerateStyle<CommentToken> = token => {
  const {
    componentCls,
    commentBg,
    commentPaddingBase,
    commentNestIndent,
    commentFontSizeBase,
    commentFontSizeSm,
    commentAuthorNameColor,
    commentAuthorTimeColor,
    commentActionColor,
    commentActionHoverColor,
    commentActionsMarginBottom,
    commentActionsMarginTop,
    commentContentDetailPMarginBottom,
  } = token;

  return {
    [componentCls]: {
      position: 'relative',
      backgroundColor: commentBg,

      [`${componentCls}-inner`]: {
        display: 'flex',
        padding: commentPaddingBase,
      },

      [`${componentCls}-avatar`]: {
        position: 'relative',
        flexShrink: 0,
        marginRight: token.marginSM,
        cursor: 'pointer',

        [`img`]: {
          width: '32px',
          height: '32px',
          borderRadius: '50%',
        },
      },

      [`${componentCls}-content`]: {
        position: 'relative',
        flex: `1 1 auto`,
        minWidth: `1px`,
        fontSize: commentFontSizeBase,
        wordWrap: 'break-word',

        [`&-author`]: {
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          marginBottom: token.marginXXS,
          fontSize: commentFontSizeBase,

          [`& > a,& > span`]: {
            paddingRight: token.paddingXS,
            fontSize: commentFontSizeSm,
            lineHeight: `18px`,
          },

          [`&-name`]: {
            color: commentAuthorNameColor,
            fontSize: commentFontSizeBase,
            transition: `color ${token.motionDurationSlow}`,

            [`> *`]: {
              color: commentAuthorNameColor,

              [`&:hover`]: {
                color: commentAuthorNameColor,
              },
            },
          },

          [`&-time`]: {
            color: commentAuthorTimeColor,
            whiteSpace: 'nowrap',
            cursor: 'auto',
          },
        },

        [`&-detail p`]: {
          marginBottom: commentContentDetailPMarginBottom,
          whiteSpace: 'pre-wrap',
        },
      },

      [`${componentCls}-actions`]: {
        marginTop: commentActionsMarginTop,
        marginBottom: commentActionsMarginBottom,
        paddingLeft: 0,

        [`> li`]: {
          display: 'inline-block',
          color: commentActionColor,

          [`> span`]: {
            marginRight: '10px',
            color: commentActionColor,
            fontSize: commentFontSizeSm,
            cursor: 'pointer',
            transition: `color ${token.motionDurationSlow}`,
            userSelect: 'none',

            [`&:hover`]: {
              color: commentActionHoverColor,
            },
          },
        },
      },

      [`${componentCls}-nested`]: {
        marginLeft: commentNestIndent,
      },

      '&-rtl': {
        direction: 'rtl',
      },
    },
  };
};

export default genComponentStyleHook('Comment', token => {
  const commentToken = mergeToken<CommentToken>(token, {
    commentBg: 'inherit',
    commentPaddingBase: `${token.paddingMD}px 0`,
    commentNestIndent: `44px`,
    commentFontSizeBase: token.fontSize,
    commentFontSizeSm: token.fontSizeSM,
    commentAuthorNameColor: token.colorTextTertiary,
    commentAuthorTimeColor: token.colorTextPlaceholder,
    commentActionColor: token.colorTextTertiary,
    commentActionHoverColor: token.colorTextSecondary,
    commentActionsMarginBottom: 'inherit',
    commentActionsMarginTop: token.marginSM,
    commentContentDetailPMarginBottom: 'inherit',
  });

  return [genBaseStyle(commentToken)];
});
