import { getArrowOffset } from '../../style/placementArrow';
import {
  initMoveMotion,
  initSlideMotion,
  initZoomMotion,
  slideDownIn,
  slideDownOut,
  slideUpIn,
  slideUpOut,
} from '../../style/motion';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import genButtonStyle from './button';
import genStatusStyle from './status';
import { genFocusStyle, resetComponent, roundedArrow } from '../../style';

export interface ComponentToken {
  zIndexPopup: number;
}

export interface DropdownToken extends FullToken<'Dropdown'> {
  rootPrefixCls: string;
  dropdownArrowDistance: number;
  dropdownArrowOffset: number;
  dropdownPaddingVertical: number;
  dropdownEdgeChildPadding: number;
  menuCls: string;
}

// =============================== Base ===============================
const genBaseStyle: GenerateStyle<DropdownToken> = token => {
  const {
    componentCls,
    menuCls,
    zIndexPopup,
    dropdownArrowDistance,
    dropdownArrowOffset,
    sizePopupArrow,
    antCls,
    iconCls,
    motionDurationMid,
    dropdownPaddingVertical,
    fontSize,
    dropdownEdgeChildPadding,
    colorTextDisabled,
    fontSizeIcon,
    controlPaddingHorizontal,
    colorBgElevated,
    boxShadowPopoverArrow,
  } = token;

  return [
    {
      [componentCls]: {
        ...resetComponent(token),

        position: 'absolute',
        top: -9999,
        left: {
          _skip_check_: true,
          value: -9999,
        },
        zIndex: zIndexPopup,
        display: 'block',

        // A placeholder out of dropdown visible range to avoid close when user moving
        '&::before': {
          position: 'absolute',
          insetBlock: -dropdownArrowDistance + sizePopupArrow / 2,
          // insetInlineStart: -7, // FIXME: Seems not work for hidden element
          zIndex: -9999,
          opacity: 0.0001,
          content: '""',
        },

        [`${componentCls}-wrap`]: {
          position: 'relative',

          [`${antCls}-btn > ${iconCls}-down`]: {
            fontSize: fontSizeIcon,
          },

          [`${iconCls}-down::before`]: {
            transition: `transform ${motionDurationMid}`,
          },
        },

        [`${componentCls}-wrap-open`]: {
          [`${iconCls}-down::before`]: {
            transform: `rotate(180deg)`,
          },
        },

        [`
        &-hidden,
        &-menu-hidden,
        &-menu-submenu-hidden
      `]: {
          display: 'none',
        },

        // =============================================================
        // ==                          Arrow                          ==
        // =============================================================
        // Offset the popover to account for the dropdown arrow
        [`
        &-show-arrow${componentCls}-placement-topLeft,
        &-show-arrow${componentCls}-placement-top,
        &-show-arrow${componentCls}-placement-topRight
      `]: {
          paddingBottom: dropdownArrowDistance,
        },

        [`
        &-show-arrow${componentCls}-placement-bottomLeft,
        &-show-arrow${componentCls}-placement-bottom,
        &-show-arrow${componentCls}-placement-bottomRight
      `]: {
          paddingTop: dropdownArrowDistance,
        },

        // Note: .popover-arrow is outer, .popover-arrow:after is inner
        [`${componentCls}-arrow`]: {
          position: 'absolute',
          zIndex: 1, // lift it up so the menu wouldn't cask shadow on it
          display: 'block',

          ...roundedArrow(
            sizePopupArrow,
            token.borderRadiusXS,
            token.borderRadiusOuter,
            colorBgElevated,
            boxShadowPopoverArrow,
          ),
        },

        [`
        &-placement-top > ${componentCls}-arrow,
        &-placement-topLeft > ${componentCls}-arrow,
        &-placement-topRight > ${componentCls}-arrow
      `]: {
          bottom: dropdownArrowDistance,
          transform: 'translateY(100%) rotate(180deg)',
        },

        [`&-placement-top > ${componentCls}-arrow`]: {
          left: {
            _skip_check_: true,
            value: '50%',
          },
          transform: 'translateX(-50%) translateY(100%) rotate(180deg)',
        },

        [`&-placement-topLeft > ${componentCls}-arrow`]: {
          left: {
            _skip_check_: true,
            value: dropdownArrowOffset,
          },
        },

        [`&-placement-topRight > ${componentCls}-arrow`]: {
          right: {
            _skip_check_: true,
            value: dropdownArrowOffset,
          },
        },

        [`
          &-placement-bottom > ${componentCls}-arrow,
          &-placement-bottomLeft > ${componentCls}-arrow,
          &-placement-bottomRight > ${componentCls}-arrow
        `]: {
          top: dropdownArrowDistance,
          transform: `translateY(-100%)`,
        },

        [`&-placement-bottom > ${componentCls}-arrow`]: {
          left: {
            _skip_check_: true,
            value: '50%',
          },
          transform: `translateY(-100%) translateX(-50%)`,
        },

        [`&-placement-bottomLeft > ${componentCls}-arrow`]: {
          left: {
            _skip_check_: true,
            value: dropdownArrowOffset,
          },
        },

        [`&-placement-bottomRight > ${componentCls}-arrow`]: {
          right: {
            _skip_check_: true,
            value: dropdownArrowOffset,
          },
        },

        // =============================================================
        // ==                         Motion                          ==
        // =============================================================
        // When position is not enough for dropdown, the placement will revert.
        // We will handle this with revert motion name.
        [`&${antCls}-slide-down-enter${antCls}-slide-down-enter-active${componentCls}-placement-bottomLeft,
          &${antCls}-slide-down-appear${antCls}-slide-down-appear-active${componentCls}-placement-bottomLeft,
          &${antCls}-slide-down-enter${antCls}-slide-down-enter-active${componentCls}-placement-bottom,
          &${antCls}-slide-down-appear${antCls}-slide-down-appear-active${componentCls}-placement-bottom,
          &${antCls}-slide-down-enter${antCls}-slide-down-enter-active${componentCls}-placement-bottomRight,
          &${antCls}-slide-down-appear${antCls}-slide-down-appear-active${componentCls}-placement-bottomRight`]:
          {
            animationName: slideUpIn,
          },

        [`&${antCls}-slide-up-enter${antCls}-slide-up-enter-active${componentCls}-placement-topLeft,
          &${antCls}-slide-up-appear${antCls}-slide-up-appear-active${componentCls}-placement-topLeft,
          &${antCls}-slide-up-enter${antCls}-slide-up-enter-active${componentCls}-placement-top,
          &${antCls}-slide-up-appear${antCls}-slide-up-appear-active${componentCls}-placement-top,
          &${antCls}-slide-up-enter${antCls}-slide-up-enter-active${componentCls}-placement-topRight,
          &${antCls}-slide-up-appear${antCls}-slide-up-appear-active${componentCls}-placement-topRight`]:
          {
            animationName: slideDownIn,
          },

        [`&${antCls}-slide-down-leave${antCls}-slide-down-leave-active${componentCls}-placement-bottomLeft,
          &${antCls}-slide-down-leave${antCls}-slide-down-leave-active${componentCls}-placement-bottom,
          &${antCls}-slide-down-leave${antCls}-slide-down-leave-active${componentCls}-placement-bottomRight`]:
          {
            animationName: slideUpOut,
          },

        [`&${antCls}-slide-up-leave${antCls}-slide-up-leave-active${componentCls}-placement-topLeft,
          &${antCls}-slide-up-leave${antCls}-slide-up-leave-active${componentCls}-placement-top,
          &${antCls}-slide-up-leave${antCls}-slide-up-leave-active${componentCls}-placement-topRight`]:
          {
            animationName: slideDownOut,
          },
      },
    },

    {
      // =============================================================
      // ==                          Menu                           ==
      // =============================================================
      [`${componentCls} ${menuCls}`]: {
        position: 'relative',
        margin: 0,
      },

      [`${menuCls}-submenu-popup`]: {
        position: 'absolute',
        zIndex: zIndexPopup,
        background: 'transparent',
        boxShadow: 'none',
        transformOrigin: '0 0',

        'ul,li': {
          listStyle: 'none',
        },

        ul: {
          marginInline: '0.3em',
        },
      },

      [`${componentCls}, ${componentCls}-menu-submenu`]: {
        [menuCls]: {
          padding: dropdownEdgeChildPadding,
          listStyleType: 'none',
          backgroundColor: colorBgElevated,
          backgroundClip: 'padding-box',
          borderRadius: token.borderRadiusLG,
          outline: 'none',
          boxShadow: token.boxShadowSecondary,
          ...genFocusStyle(token),

          [`${menuCls}-item-group-title`]: {
            padding: `${dropdownPaddingVertical}px ${controlPaddingHorizontal}px`,
            color: token.colorTextDescription,
            transition: `all ${motionDurationMid}`,
          },

          // ======================= Item Content =======================
          [`${menuCls}-item`]: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            borderRadius: token.borderRadiusSM,
          },

          [`${menuCls}-item-icon`]: {
            minWidth: fontSize,
            marginInlineEnd: token.marginXS,
            fontSize: token.fontSizeSM,
          },

          [`${menuCls}-title-content`]: {
            flex: 'auto',

            '> a': {
              color: 'inherit',
              transition: `all ${motionDurationMid}`,

              '&:hover': {
                color: 'inherit',
              },

              '&::after': {
                position: 'absolute',
                inset: 0,
                content: '""',
              },
            },
          },

          // =========================== Item ===========================
          [`${menuCls}-item, ${menuCls}-submenu-title`]: {
            clear: 'both',
            margin: 0,
            padding: `${dropdownPaddingVertical}px ${controlPaddingHorizontal}px`,
            color: token.colorText,
            fontWeight: 'normal',
            fontSize,
            lineHeight: token.lineHeight,
            cursor: 'pointer',
            transition: `all ${motionDurationMid}`,

            [`&:hover, &-active`]: {
              backgroundColor: token.controlItemBgHover,
            },

            ...genFocusStyle(token),

            '&-selected': {
              color: token.colorPrimary,
              backgroundColor: token.controlItemBgActive,
              '&:hover, &-active': {
                backgroundColor: token.controlItemBgActiveHover,
              },
            },

            '&-disabled': {
              color: colorTextDisabled,
              cursor: 'not-allowed',

              '&:hover': {
                color: colorTextDisabled,
                backgroundColor: colorBgElevated,
                cursor: 'not-allowed',
              },

              a: {
                pointerEvents: 'none',
              },
            },

            '&-divider': {
              height: 1, // By design
              margin: `${token.marginXXS}px 0`,
              overflow: 'hidden',
              lineHeight: 0,
              backgroundColor: token.colorSplit,
            },

            [`${componentCls}-menu-submenu-expand-icon`]: {
              position: 'absolute',
              insetInlineEnd: token.paddingXS,

              [`${componentCls}-menu-submenu-arrow-icon`]: {
                marginInlineEnd: '0 !important',
                color: token.colorTextDescription,
                fontSize: fontSizeIcon,
                fontStyle: 'normal',
              },
            },
          },

          [`${menuCls}-item-group-list`]: {
            margin: `0 ${token.marginXS}px`,
            padding: 0,
            listStyle: 'none',
          },

          [`${menuCls}-submenu-title`]: {
            paddingInlineEnd: controlPaddingHorizontal + token.fontSizeSM,
          },

          [`${menuCls}-submenu-vertical`]: {
            position: 'relative',
          },

          [`${menuCls}-submenu${menuCls}-submenu-disabled ${componentCls}-menu-submenu-title`]: {
            [`&, ${componentCls}-menu-submenu-arrow-icon`]: {
              color: colorTextDisabled,
              backgroundColor: colorBgElevated,
              cursor: 'not-allowed',
            },
          },

          // https://github.com/ant-design/ant-design/issues/19264
          [`${menuCls}-submenu-selected ${componentCls}-menu-submenu-title`]: {
            color: token.colorPrimary,
          },
        },
      },
    },

    // Follow code may reuse in other components
    [
      initSlideMotion(token, 'slide-up'),
      initSlideMotion(token, 'slide-down'),
      initMoveMotion(token, 'move-up'),
      initMoveMotion(token, 'move-down'),
      initZoomMotion(token, 'zoom-big'),
    ],
  ];
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Dropdown',
  (token, { rootPrefixCls }) => {
    const {
      marginXXS,
      sizePopupArrow,
      controlHeight,
      fontSize,
      lineHeight,
      paddingXXS,
      componentCls,
      borderRadiusOuter,
      borderRadiusLG,
    } = token;

    const dropdownPaddingVertical = (controlHeight - fontSize * lineHeight) / 2;
    const { dropdownArrowOffset } = getArrowOffset({
      sizePopupArrow,
      contentRadius: borderRadiusLG,
      borderRadiusOuter,
    });

    const dropdownToken = mergeToken<DropdownToken>(token, {
      menuCls: `${componentCls}-menu`,
      rootPrefixCls,
      dropdownArrowDistance: sizePopupArrow / 2 + marginXXS,
      dropdownArrowOffset,
      dropdownPaddingVertical,
      dropdownEdgeChildPadding: paddingXXS,
    });
    return [
      genBaseStyle(dropdownToken),
      genButtonStyle(dropdownToken),
      genStatusStyle(dropdownToken),
    ];
  },
  token => ({
    zIndexPopup: token.zIndexPopupBase + 50,
  }),
);
