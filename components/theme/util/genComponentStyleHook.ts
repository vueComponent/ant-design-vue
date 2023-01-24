/* eslint-disable no-redeclare */

import { useStyleRegister } from '../../_util/cssinjs';
import type { CSSInterpolation } from '../../_util/cssinjs';
import { genCommonStyle, genLinkStyle } from '../../_style';
import type { UseComponentStyleResult } from '../internal';
import { mergeToken, statisticToken, useToken } from '../internal';
import type { ComponentTokenMap, GlobalToken } from '../interface';
import useConfigInject from 'ant-design-vue/es/_util/hooks/useConfigInject';

export type OverrideTokenWithoutDerivative = ComponentTokenMap;
export type OverrideComponent = keyof OverrideTokenWithoutDerivative;
export type GlobalTokenWithComponent<ComponentName extends OverrideComponent> = GlobalToken &
  ComponentTokenMap[ComponentName];

export interface StyleInfo<ComponentName extends OverrideComponent> {
  hashId: string;
  prefixCls: string;
  rootPrefixCls: string;
  iconPrefixCls: string;
  overrideComponentToken: ComponentTokenMap[ComponentName];
}

export type TokenWithCommonCls<T> = T & {
  /** Wrap component class with `.` prefix */
  componentCls: string;
  /** Origin prefix which do not have `.` prefix */
  prefixCls: string;
  /** Wrap icon class with `.` prefix */
  iconCls: string;
  /** Wrap ant prefixCls class with `.` prefix */
  antCls: string;
};
export type FullToken<ComponentName extends OverrideComponent> = TokenWithCommonCls<
  GlobalTokenWithComponent<ComponentName>
>;

export default function genComponentStyleHook<ComponentName extends OverrideComponent>(
  component: ComponentName,
  styleFn: (token: FullToken<ComponentName>, info: StyleInfo<ComponentName>) => CSSInterpolation,
  getDefaultToken?:
    | OverrideTokenWithoutDerivative[ComponentName]
    | ((token: GlobalToken) => OverrideTokenWithoutDerivative[ComponentName]),
) {
  return (prefixCls: string): UseComponentStyleResult => {
    const [theme, token, hashId] = useToken();
    const { getPrefixCls, iconPrefixCls } = useConfigInject('', {});
    const rootPrefixCls = getPrefixCls();

    // Generate style for all a tags in antd component.
    useStyleRegister(
      {
        theme: theme.value,
        token: token.value,
        hashId: hashId.value,
        path: ['Shared', rootPrefixCls],
      },
      () => [
        {
          // Link
          '&': genLinkStyle(token.value),
        },
      ],
    );

    return [
      useStyleRegister(
        {
          theme: theme.value,
          token: token.value,
          hashId: hashId.value,
          path: [component, prefixCls, iconPrefixCls.value],
        },
        () => {
          const { token: proxyToken, flush } = statisticToken(token.value);

          const defaultComponentToken =
            typeof getDefaultToken === 'function'
              ? (getDefaultToken as any)(proxyToken)
              : getDefaultToken;
          const mergedComponentToken = { ...defaultComponentToken, ...token.value[component] };

          const componentCls = `.${prefixCls}`;
          const mergedToken = mergeToken<
            TokenWithCommonCls<GlobalTokenWithComponent<OverrideComponent>>
          >(
            proxyToken,
            {
              componentCls,
              prefixCls,
              iconCls: `.${iconPrefixCls}`,
              antCls: `.${rootPrefixCls}`,
            },
            mergedComponentToken,
          );

          const styleInterpolation = styleFn(mergedToken as unknown as FullToken<ComponentName>, {
            hashId: hashId.value,
            prefixCls,
            rootPrefixCls,
            iconPrefixCls: iconPrefixCls.value,
            overrideComponentToken: token.value[component],
          });
          flush(component, mergedComponentToken);
          return [genCommonStyle(token.value, prefixCls), styleInterpolation];
        },
      ),
      hashId.value,
    ];
  };
}
