import type { CSSProperties } from 'vue';
import type { FullToken, GetDefaultToken } from '../../_theme/internal';
import { getLineHeight, mergeToken } from '../../_theme/internal';
import type { GenStyleFn } from '../../_theme/util/genComponentStyleHook';

/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken {
  /**
   * @desc 文字字重
   * @descEN Font weight of text
   */
  fontWeight: CSSProperties['fontWeight'];
  /**
   * @desc 默认按钮阴影
   * @descEN Shadow of default button
   */
  defaultShadow: string;
  /**
   * @desc 主要按钮阴影
   * @descEN Shadow of primary button
   */
  primaryShadow: string;
  /**
   * @desc 危险按钮阴影
   * @descEN Shadow of danger button
   */
  dangerShadow: string;
  /**
   * @desc 主要按钮文本颜色
   * @descEN Text color of primary button
   */
  primaryColor: string;
  /**
   * @desc 默认按钮文本颜色
   * @descEN Text color of default button
   */
  defaultColor: string;
  /**
   * @desc 默认按钮背景色
   * @descEN Background color of default button
   */
  defaultBg: string;
  /**
   * @desc 默认按钮边框颜色
   * @descEN Border color of default button
   */
  defaultBorderColor: string;
  /**
   * @desc 危险按钮文本颜色
   * @descEN Text color of danger button
   */
  dangerColor: string;
  /**
   * @desc 禁用状态边框颜色
   * @descEN Border color of disabled button
   */
  borderColorDisabled: string;
  /**
   * @desc 默认幽灵按钮文本颜色
   * @descEN Text color of default ghost button
   */
  defaultGhostColor: string;
  /**
   * @desc 幽灵按钮背景色
   * @descEN Background color of ghost button
   */
  ghostBg: string;
  /**
   * @desc 默认幽灵按钮边框颜色
   * @descEN Border color of default ghost button
   */
  defaultGhostBorderColor: string;
  /**
   * @desc 按钮横向内间距
   * @descEN Horizontal padding of button
   */
  paddingInline: CSSProperties['paddingInline'];
  /**
   * @desc 大号按钮横向内间距
   * @descEN Horizontal padding of large button
   */
  paddingInlineLG: CSSProperties['paddingInline'];
  /**
   * @desc 小号按钮横向内间距
   * @descEN Horizontal padding of small button
   */
  paddingInlineSM: CSSProperties['paddingInline'];
  /**
   * @desc 按钮横向内间距
   * @descEN Horizontal padding of button
   */
  paddingBlock: CSSProperties['paddingInline'];
  /**
   * @desc 大号按钮横向内间距
   * @descEN Horizontal padding of large button
   */
  paddingBlockLG: CSSProperties['paddingInline'];
  /**
   * @desc 小号按钮横向内间距
   * @descEN Horizontal padding of small button
   */
  paddingBlockSM: CSSProperties['paddingInline'];
  /**
   * @desc 只有图标的按钮图标尺寸
   * @descEN Icon size of button which only contains icon
   */
  onlyIconSize: number;
  /**
   * @desc 大号只有图标的按钮图标尺寸
   * @descEN Icon size of large button which only contains icon
   */
  onlyIconSizeLG: number;
  /**
   * @desc 小号只有图标的按钮图标尺寸
   * @descEN Icon size of small button which only contains icon
   */
  onlyIconSizeSM: number;
  /**
   * @desc 按钮组边框颜色
   * @descEN Border color of button group
   */
  groupBorderColor: string;
  /**
   * @desc 链接按钮悬浮态背景色
   * @descEN Background color of link button when hover
   */
  linkHoverBg: string;
  /**
   * @desc 文本按钮悬浮态背景色
   * @descEN Background color of text button when hover
   */
  textHoverBg: string;
  /**
   * @desc 按钮内容字体大小
   * @descEN Font size of button content
   */
  contentFontSize: number;
  /**
   * @desc 大号按钮内容字体大小
   * @descEN Font size of large button content
   */
  contentFontSizeLG: number;
  /**
   * @desc 小号按钮内容字体大小
   * @descEN Font size of small button content
   */
  contentFontSizeSM: number;
  /**
   * @desc 按钮内容字体行高
   * @descEN Line height of button content
   */
  contentLineHeight: number;
  /**
   * @desc 大号按钮内容字体行高
   * @descEN Line height of large button content
   */
  contentLineHeightLG: number;
  /**
   * @desc 小号按钮内容字体行高
   * @descEN Line height of small button content
   */
  contentLineHeightSM: number;
}

export interface ButtonToken extends FullToken<'Button'> {
  buttonPaddingHorizontal: CSSProperties['paddingInline'];
  buttonPaddingVertical: CSSProperties['paddingBlock'];
  buttonIconOnlyFontSize: number;
}

export const prepareToken: (token: Parameters<GenStyleFn<'Button'>>[0]) => ButtonToken = token => {
  const { paddingInline, onlyIconSize, paddingBlock } = token;

  const buttonToken = mergeToken<ButtonToken>(token, {
    buttonPaddingHorizontal: paddingInline,
    buttonPaddingVertical: paddingBlock,
    buttonIconOnlyFontSize: onlyIconSize,
  });

  return buttonToken;
};

export const prepareComponentToken: GetDefaultToken<'Button'> = token => {
  const contentFontSize = token.contentFontSize ?? token.fontSize;
  const contentFontSizeSM = token.contentFontSizeSM ?? token.fontSize;
  const contentFontSizeLG = token.contentFontSizeLG ?? token.fontSizeLG;
  const contentLineHeight = token.contentLineHeight ?? getLineHeight(contentFontSize);
  const contentLineHeightSM = token.contentLineHeightSM ?? getLineHeight(contentFontSizeSM);
  const contentLineHeightLG = token.contentLineHeightLG ?? getLineHeight(contentFontSizeLG);

  return {
    fontWeight: 400,
    defaultShadow: `0 ${token.controlOutlineWidth}px 0 ${token.controlTmpOutline}`,
    primaryShadow: `0 ${token.controlOutlineWidth}px 0 ${token.controlOutline}`,
    dangerShadow: `0 ${token.controlOutlineWidth}px 0 ${token.colorErrorOutline}`,
    primaryColor: token.colorTextLightSolid,
    dangerColor: token.colorTextLightSolid,
    borderColorDisabled: token.colorBorder,
    defaultGhostColor: token.colorBgContainer,
    ghostBg: 'transparent',
    defaultGhostBorderColor: token.colorBgContainer,
    paddingInline: token.paddingContentHorizontal - token.lineWidth,
    paddingInlineLG: token.paddingContentHorizontal - token.lineWidth,
    paddingInlineSM: 8 - token.lineWidth,
    onlyIconSize: token.fontSizeLG,
    onlyIconSizeSM: token.fontSizeLG - 2,
    onlyIconSizeLG: token.fontSizeLG + 2,
    groupBorderColor: token.colorPrimaryHover,
    linkHoverBg: 'transparent',
    textHoverBg: token.colorBgTextHover,
    defaultColor: token.colorText,
    defaultBg: token.colorBgContainer,
    defaultBorderColor: token.colorBorder,
    defaultBorderColorDisabled: token.colorBorder,
    contentFontSize,
    contentFontSizeSM,
    contentFontSizeLG,
    contentLineHeight,
    contentLineHeightSM,
    contentLineHeightLG,
    paddingBlock: Math.max(
      (token.controlHeight - contentFontSize * contentLineHeight) / 2 - token.lineWidth,
      0,
    ),
    paddingBlockSM: Math.max(
      (token.controlHeightSM - contentFontSizeSM * contentLineHeightSM) / 2 - token.lineWidth,
      0,
    ),
    paddingBlockLG: Math.max(
      (token.controlHeightLG - contentFontSizeLG * contentLineHeightLG) / 2 - token.lineWidth,
      0,
    ),
  };
};
