import type { CSSObject } from '../../_util/cssinjs';
import { resetComponent, clearFix } from '../../_style';
const dropdownStyle={
    dropdownVerticalPadding:'5px',
    itemHoverBg:'#f5f5f5',
}
export const genTabsDropdownStyle = (token): CSSObject => {  
  return {
    ...resetComponent(token),
    position: `absolute`,
    top: `-9999px`,
    left: `-9999px`,
    zIndex:`  ${token.zIndexPopupBase}`,
    display: `block`,
   [` &-hidden`] :{
      display: `none`,
    },
  
  [`  &-menu `]:{
      maxHeight:' 200px',
      margin: 0,
      padding: `${token.padding}px 0`,
      overflowx: 'hidden',
      overflowY: 'auto',
      textAlign: 'left',
      listStyleType: 'none',
      backgroundColor: ` ${token.colorBgBase}`,
      backgroundClip: `padding-box`,
      borderRadius: ` ${token.radiusBase}px`,
      outline: `none`,
      boxShadow: `${token.boxShadow}`,
  
      [`&-item`]: {
        display: `flex`,
        alignItems: `center`,
        minWidth: `120px`,
        margin: 0,
        padding: `${dropdownStyle.dropdownVerticalPadding}  ${token.paddingSM}px`,
        overflow: `hidden`,
        color:` ${token.colorText}`,
        fontWeight: `normal`,
        fontSize:` ${token.fontSize}px`,
        lineHeight: `${token.lineHeight} `,
        whiteSpace: `nowrap`,
        textOverflow: `ellipsis`,
        cursor: `pointer`,
        transition: `all 0.3s`,
  
       [` > span`] :{
          flex: 1,
          whiteSpace: `nowrap`,
        },
  
       [` &-remove `]:{
          flex: `none`,
          marginLeft:` ${token.marginSM}px`,
          color:`  ${token.colorTextSecondary}`,
          fontSize: `${token.fontSizeSM}px`,
          background: `transparent`,
          border: 0,
          cursor: `pointer`,
         [` &:hover `]:{
            color:`${token.colorInfoHover}`,
        }
        },
  
       [`&:hover `]:{
          background:` ${dropdownStyle.itemHoverBg}`,
        },
  
      [`  &-disabled `]:{
        [`  &,
          &:hover`]: {
            color:` ${token.colorTextDisabled}`,
            background: `transparent`,
            cursor: `not-allowed`,
          }
        }
      }
    }
  }}