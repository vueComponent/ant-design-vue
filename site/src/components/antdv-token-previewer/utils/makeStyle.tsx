import type { CSSInterpolation } from 'ant-design-vue/es/_util/cssinjs';
import { useStyleRegister } from 'ant-design-vue/es/_util/cssinjs';
import { theme as antdTheme } from 'ant-design-vue';
import type { GlobalToken } from 'ant-design-vue/es/theme/interface';
import { mergeToken } from 'ant-design-vue/es/theme/internal';
import { computed } from 'vue';
import useConfigInject from 'ant-design-vue/es/config-provider/hooks/useConfigInject';

import type { UseComponentStyleResult } from 'ant-design-vue/es/theme/internal';
const makeStyle = (
  path: string,
  styleFn: (token: GlobalToken & { rootCls: string }) => CSSInterpolation,
) => {
  return (): UseComponentStyleResult => {
    const { theme, token, hashId } = antdTheme.useToken();

    const { getPrefixCls } = useConfigInject('', {});

    const rootCls = getPrefixCls();

    const componentInfo = computed(() => {
      return {
        theme: theme.value,
        token: token.value,
        hashId: hashId.value,
        path: [path],
      };
    });
    return [
      useStyleRegister(componentInfo, () => {
        const mergedToken = mergeToken<GlobalToken & { rootCls: string }>(token.value, {
          rootCls: `.${rootCls}`,
        });
        const styleInterpolation = styleFn(mergedToken);

        return [styleInterpolation];
      }),
      hashId,
    ];
  };
};

export default makeStyle;
