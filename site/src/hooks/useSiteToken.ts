import { TinyColor } from '@ctrl/tinycolor';
import { computed, watch } from 'vue';
import { theme } from '../../../components';
import { useConfigContextInject } from '../../../components/config-provider/context';

const { useToken } = theme;

const useSiteToken = () => {
  const result = useToken();
  const { getPrefixCls, iconPrefixCls } = useConfigContextInject();
  const rootPrefixCls = computed(() => getPrefixCls());
  const { token } = result;

  const mergedToken = computed(() => ({
    theme: result.theme.value,
    hashId: result.hashId.value,
    token: {
      ...token.value,
      headerHeight: 64,
      menuItemBorder: 2,
      mobileMaxWidth: 767.99,
      siteMarkdownCodeBg: token.value.colorFillTertiary,
      antCls: `.${rootPrefixCls.value}`,
      iconCls: `.${iconPrefixCls.value}`,
      /** 56 */
      marginFarXS: (token.value.marginXXL / 6) * 7,
      /** 80 */
      marginFarSM: (token.value.marginXXL / 3) * 5,
      /** 96 */
      marginFar: token.value.marginXXL * 2,
      codeFamily: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`,
    },
  }));
  let styleDom: HTMLStyleElement | null = null;
  watch(
    mergedToken,
    () => {
      styleDom = styleDom || document.createElement('style');
      const tokenValue = mergedToken.value.token;
      const demoGridColor = token.value.colorPrimary;
      styleDom.innerHTML = `
      :root {
        --header-height: ${tokenValue.headerHeight}px;
        --menu-item-border: ${tokenValue.menuItemBorder}px;

        --primary-color: ${tokenValue.colorPrimary};
        --component-background: ${tokenValue.colorBgContainer};
        --body-background: ${tokenValue.colorBgContainer};
        --site-text-color: ${tokenValue.colorText};
        --demo-grid-color: ${demoGridColor};
        --demo-grid-color-65: ${new TinyColor(demoGridColor).setAlpha(0.75).toHex8String()};
        --demo-grid-color-75: ${new TinyColor(demoGridColor).setAlpha(0.75).toHex8String()};
        --site-text-color-secondary: ${tokenValue.colorTextSecondary};
        --site-border-color-split: ${tokenValue.colorSplit};
        --border-radius-base: ${tokenValue.borderRadius};
        --font-size-base: ${tokenValue.fontSize}px;
        --font-size-max: ${Math.max(tokenValue.fontSize - 1, 12)}px;
        --font-family: ${tokenValue.fontFamily};
        --code-family: ${tokenValue.codeFamily};

        --border-color-base: ${tokenValue.colorBorder};
        --purple-3: ${tokenValue['purple-3']};
        --purple-6: ${tokenValue['purple-6']};
        --text-color: ${tokenValue.colorText};
        --search-icon-color: #ced4d9;
        --ease-in-out-circ: ${tokenValue.motionEaseInOutCirc};
        --shadow-2: ${tokenValue.boxShadowSecondary};
        --link-color: ${tokenValue.colorLink};
        --error-color: ${tokenValue.colorError};
        --white: ${tokenValue.colorWhite};
        --green-6: ${tokenValue['green-6']};
        --gray-8: ${tokenValue['gray-8']};
        --magenta-7: ${tokenValue['magenta-7']};
        --line-height-base: ${tokenValue.lineHeight};
        --screen-md-min: ${tokenValue.screenMDMin}px;
        --screen-sm-min: ${tokenValue.screenSMMin}px;
        --screen-lg: ${tokenValue.screenLG}px;
        --mobile-max-width: ${tokenValue.mobileMaxWidth}px;
        --box-shadow-base: ${tokenValue.boxShadow}
        --animation-duration-base: ${tokenValue.motionDurationSlow};
        --ease-in-out: ${tokenValue.motionEaseInOut};
        --shadow-1-down: ${tokenValue.boxShadowCard};
        --box-shadow: ${tokenValue.boxShadow};
      }
    `;
      if (styleDom && !document.body.contains(styleDom)) {
        document.body.appendChild(styleDom);
      }
    },
    { immediate: true },
  );

  return mergedToken;
};

export default useSiteToken;
