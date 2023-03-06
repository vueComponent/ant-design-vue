import type { CSSInterpolation } from 'ant-design-vue/es/_util/cssinjs';
import { useStyleRegister } from 'ant-design-vue/es/_util/cssinjs';
import { theme as antdTheme } from 'ant-design-vue';
import type { GlobalToken } from 'ant-design-vue/es/theme/interface';
import { computed } from 'vue';
import type { VueNode } from 'ant-design-vue/es/_util/type';
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

    console.log(rootCls);

    return [
      useStyleRegister(
        computed(() => ({
          theme: theme.value,
          hashId: hashId.value,
          token: token.value,
          path: [path],
        })),
        () => styleFn({ ...token, rootCls: `.${rootCls}` } as any),
      ) as (node: VueNode) => VueNode,
      hashId,
    ];
  };
};

export default makeStyle;
