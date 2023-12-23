/* eslint-disable no-redeclare */
import type { CSSInterpolation, CSSObject } from '../../_util/_cssinjs';
import { token2CSSVar, useCSSVarRegister, useStyleRegister } from '../../_util/_cssinjs';
import warning from '../../_util/warning';
import { genCommonStyle, genLinkStyle } from '../../style';
import type {
  ComponentTokenMap,
  GlobalToken,
  OverrideToken,
  UseComponentStyleResult,
} from '../interface';
import useToken, { ignore, unitless } from '../useToken';
import genCalc from './calc';
import type AbstractCalculator from './calc/calculator';
import genMaxMin from './maxmin';
import statisticToken, { merge as mergeToken } from './statistic';
import useResetIconStyle from './useResetIconStyle';

import type { Ref } from 'vue';
import { defineComponent, computed, createVNode } from 'vue';
import { useConfigContextInject } from '../../config-provider/context';
import type { VueNode } from 'ant-design-vue/es/_util/type';
import { objectType } from 'ant-design-vue/es/_util/type';

export type OverrideTokenWithoutDerivative = ComponentTokenMap;
export type OverrideComponent = keyof OverrideTokenWithoutDerivative;
export type GlobalTokenWithComponent<C extends OverrideComponent> = GlobalToken &
  ComponentTokenMap[C];

type ComponentToken<C extends OverrideComponent> = Exclude<OverrideToken[C], undefined>;
type ComponentTokenKey<C extends OverrideComponent> = keyof ComponentToken<C>;

export interface StyleInfo {
  hashId: string;
  prefixCls: string;
  rootPrefixCls: string;
  iconPrefixCls: string;
}

export type CSSUtil = {
  calc: (number: any) => AbstractCalculator;
  max: (...values: (number | string)[]) => number | string;
  min: (...values: (number | string)[]) => number | string;
};

export type TokenWithCommonCls<T> = T & {
  /** Wrap component class with `.` prefix */
  componentCls: string;
  /** Origin prefix which do not have `.` prefix */
  prefixCls: string;
  /** Wrap icon class with `.` prefix */
  iconCls: string;
  /** Wrap ant prefixCls class with `.` prefix */
  antCls: string;
} & CSSUtil;

export type FullToken<C extends OverrideComponent> = TokenWithCommonCls<
  GlobalTokenWithComponent<C>
>;

export type GenStyleFn<C extends OverrideComponent> = (
  token: FullToken<C>,
  info: StyleInfo,
) => CSSInterpolation;

export type GetDefaultToken<C extends OverrideComponent> =
  | null
  | OverrideTokenWithoutDerivative[C]
  | ((token: GlobalToken) => OverrideTokenWithoutDerivative[C]);

export type FormatComponentToken<C extends OverrideComponent> = (
  token: NonNullable<OverrideTokenWithoutDerivative[C]>,
) => NonNullable<OverrideTokenWithoutDerivative[C]>;

const getDefaultComponentToken = <C extends OverrideComponent>(
  component: C,
  token: Ref<GlobalToken>,
  getDefaultToken: GetDefaultToken<C>,
) => {
  if (typeof getDefaultToken === 'function') {
    return getDefaultToken(mergeToken<GlobalToken>(token.value, token.value[component] ?? {}));
  }
  return getDefaultToken ?? {};
};

const getComponentToken = <C extends OverrideComponent>(
  component: C,
  token: Ref<GlobalToken>,
  defaultToken: OverrideTokenWithoutDerivative[C],
  options?: {
    deprecatedTokens?: [ComponentTokenKey<C>, ComponentTokenKey<C>][];
    format?: FormatComponentToken<C>;
  },
) => {
  const customToken = { ...(token.value[component] as ComponentToken<C>) };
  if (options?.deprecatedTokens) {
    const { deprecatedTokens } = options;
    deprecatedTokens.forEach(([oldTokenKey, newTokenKey]) => {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          !customToken?.[oldTokenKey],
          `The token '${String(oldTokenKey)}' of ${component} had deprecated, use '${String(
            newTokenKey,
          )}' instead.`,
        );
      }

      // Should wrap with `if` clause, or there will be `undefined` in object.
      if (customToken?.[oldTokenKey] || customToken?.[newTokenKey]) {
        customToken[newTokenKey] ??= customToken?.[oldTokenKey];
      }
    });
  }
  let mergedToken: any = { ...defaultToken, ...customToken };
  if (options?.format) {
    mergedToken = options.format(mergedToken);
  }

  // Remove same value as global token to minimize size
  Object.keys(mergedToken).forEach(key => {
    if (mergedToken[key] === token[key as keyof GlobalToken]) {
      delete mergedToken[key];
    }
  });

  return mergedToken;
};

const getCompVarPrefix = (component: string, prefix?: string) =>
  `${[
    prefix,
    component.replace(/([A-Z]+)([A-Z][a-z]+)/g, '$1-$2').replace(/([a-z])([A-Z])/g, '$1-$2'),
  ]
    .filter(Boolean)
    .join('-')}`;

export default function genComponentStyleHook<C extends OverrideComponent>(
  componentName: C | [C, string],
  styleFn: GenStyleFn<C>,
  getDefaultToken?:
    | null
    | OverrideTokenWithoutDerivative[C]
    | ((token: GlobalToken) => OverrideTokenWithoutDerivative[C]),
  options: {
    resetStyle?: boolean;
    // Deprecated token key map [["oldTokenKey", "newTokenKey"], ["oldTokenKey", "newTokenKey"]]
    deprecatedTokens?: [ComponentTokenKey<C>, ComponentTokenKey<C>][];
    /**
     * Only use component style in client side. Ignore in SSR.
     */
    clientOnly?: boolean;
    /**
     * Set order of component style. Default is -999.
     */
    order?: number;
    format?: FormatComponentToken<C>;
    injectStyle?: boolean;
  } = {},
) {
  const cells = (Array.isArray(componentName) ? componentName : [componentName, componentName]) as [
    C,
    string,
  ];

  const [component] = cells;
  const concatComponent = cells.join('-');

  return (_prefixCls?: Ref<string>): UseComponentStyleResult => {
    const prefixCls = computed(() => _prefixCls?.value);
    const [theme, realToken, hashId, token, cssVar] = useToken();
    const { getPrefixCls, iconPrefixCls, csp } = useConfigContextInject();

    const rootPrefixCls = computed(() => getPrefixCls());

    const type = computed(() => (cssVar.value ? 'css' : 'js'));
    const calc = computed(() => genCalc(type.value));
    const maxMin = computed(() => genMaxMin(type.value));

    // Shared config
    // const sharedConfig: Omit<Parameters<typeof useStyleRegister>[0], 'path'> = {
    //   theme: theme.value,
    //   token: token.value,
    //   hashId: hashId.value,
    //   nonce: () => csp.value?.nonce!,
    //   clientOnly: options.clientOnly,

    //   // antd is always at top of styles
    //   order: options.order || -999,
    // };

    const sharedConfig = computed(() => {
      return {
        theme: theme.value,
        token: token.value,
        hashId: hashId.value,
        nonce: () => csp.value.nonce!,
        clientOnly: options.clientOnly,

        // antd is always at top of styles
        order: options.order || -999,
      };
    });

    // Generate style for all a tags in antd component.
    useStyleRegister(
      computed(() => ({
        ...sharedConfig.value,
        clientOnly: false,
        path: ['Shared', rootPrefixCls.value],
      })),
      () =>
        [
          {
            // Link
            '&': genLinkStyle(token.value),
          },
        ] as CSSObject[],
    );

    // Generate style for icons
    useResetIconStyle(iconPrefixCls, csp);

    const wrapSSR = useStyleRegister(
      computed(() => ({
        ...sharedConfig.value,
        path: [concatComponent, prefixCls.value, iconPrefixCls.value],
      })),
      () => {
        if (options.injectStyle === false) {
          return [];
        }

        const { token: proxyToken, flush } = statisticToken(token.value);

        const defaultComponentToken = getDefaultComponentToken(
          component,
          realToken,
          getDefaultToken,
        );

        const componentCls = `.${prefixCls.value}`;
        const componentToken = getComponentToken(component, realToken, defaultComponentToken, {
          deprecatedTokens: options.deprecatedTokens,
          format: options.format,
        });

        if (cssVar) {
          Object.keys(defaultComponentToken).forEach(key => {
            defaultComponentToken[key] = `var(${token2CSSVar(
              key,
              getCompVarPrefix(component, cssVar.value.prefix),
            )})`;
          });
        }
        const mergedToken = mergeToken<
          TokenWithCommonCls<GlobalTokenWithComponent<OverrideComponent>>
        >(
          proxyToken,
          {
            componentCls,
            prefixCls: prefixCls.value,
            iconCls: `.${iconPrefixCls.value}`,
            antCls: `.${rootPrefixCls.value}`,
            calc: calc.value,
            max: maxMin.value.max,
            min: maxMin.value.min,
          },
          cssVar.value ? defaultComponentToken : componentToken,
        );

        const styleInterpolation = styleFn(mergedToken as unknown as FullToken<C>, {
          hashId: hashId.value,
          prefixCls: prefixCls.value,
          rootPrefixCls: rootPrefixCls.value,
          iconPrefixCls: iconPrefixCls.value,
        });
        flush(component, componentToken);
        return [
          options.resetStyle === false ? null : genCommonStyle(mergedToken, prefixCls.value),
          styleInterpolation,
        ] as CSSObject[];
      },
    );

    return [wrapSSR, hashId];
  };
}

export interface SubStyleComponentProps {
  prefixCls: Ref<string>;
}

// Get from second argument
type RestParameters<T extends any[]> = T extends [any, ...infer Rest] ? Rest : never;

export const genSubStyleComponent: <C extends OverrideComponent>(
  componentName: [C, string],
  ...args: RestParameters<Parameters<typeof genComponentStyleHook<C>>>
) => any = (componentName, styleFn, getDefaultToken, options) => {
  const useStyle = genComponentStyleHook(componentName, styleFn, getDefaultToken, {
    resetStyle: false,

    // Sub Style should default after root one
    order: -998,
    ...options,
  });

  const StyledComponent = defineComponent({
    props: {
      prefixCls: String,
    },
    setup(props) {
      const prefixCls = computed(() => props.prefixCls);
      useStyle(prefixCls);
      return () => {
        return null;
      };
    },
  });

  return StyledComponent;
};

export type CSSVarRegisterProps = {
  rootCls: string;
  component: string;
  cssVar: {
    prefix?: string;
    key?: string;
  };
};

const genCSSVarRegister = <C extends OverrideComponent>(
  component: C,
  getDefaultToken?: GetDefaultToken<C>,
  options?: {
    unitless?: {
      [key in ComponentTokenKey<C>]: boolean;
    };
    deprecatedTokens?: [ComponentTokenKey<C>, ComponentTokenKey<C>][];
    format?: FormatComponentToken<C>;
    injectStyle?: boolean;
  },
) => {
  function prefixToken(key: string) {
    return `${component}${key.slice(0, 1).toUpperCase()}${key.slice(1)}`;
  }

  const { unitless: originUnitless = {}, injectStyle = true } = options ?? {};
  const compUnitless: any = {
    [prefixToken('zIndexPopup')]: true,
  };
  Object.keys(originUnitless).forEach((key: keyof ComponentTokenKey<C>) => {
    compUnitless[prefixToken(key)] = originUnitless[key];
  });

  const CSSVarRegister = defineComponent({
    props: {
      rootCls: String,
      component: String,
      cssVar: objectType<{
        prefix: string;
        key: string;
      }>(),
    },
    setup(props) {
      const [, realToken] = useToken();
      useCSSVarRegister(
        {
          path: [props.component],
          prefix: props.cssVar.prefix,
          key: props.cssVar.key!,
          unitless: {
            ...unitless,
            ...compUnitless,
          },
          ignore,
          token: realToken.value,
          scope: props.rootCls,
        },
        () => {
          const defaultToken = getDefaultComponentToken(component, realToken, getDefaultToken);
          const componentToken = getComponentToken(component, realToken, defaultToken, {
            format: options?.format,
            deprecatedTokens: options?.deprecatedTokens,
          });
          Object.keys(defaultToken).forEach(key => {
            componentToken[prefixToken(key)] = componentToken[key];
            delete componentToken[key];
          });
          return componentToken;
        },
      );
      return null;
    },
  });

  const useCSSVar = (rootCls: Ref<string>) => {
    const [, , , , cssVar] = useToken();

    return [
      (node: VueNode): VueNode =>
        injectStyle && cssVar.value
          ? createVNode('Fragment', null, [
              createVNode(CSSVarRegister, {
                rootCls,
                cssVar: cssVar.value,
                component,
              }),
              node,
            ])
          : node,
      cssVar.value.key,
    ] as const;
  };

  return useCSSVar;
};

export const genStyleHooks = <C extends OverrideComponent>(
  component: C | [C, string],
  styleFn: GenStyleFn<C>,
  getDefaultToken?: GetDefaultToken<C>,
  options?: {
    resetStyle?: boolean;
    deprecatedTokens?: [ComponentTokenKey<C>, ComponentTokenKey<C>][];
    /**
     * Chance to format component token with user input.
     * Useful when need calculated token as css variables.
     */
    format?: FormatComponentToken<C>;
    /**
     * Component tokens that do not need unit.
     */
    unitless?: {
      [key in ComponentTokenKey<C>]: boolean;
    };
    /**
     * Only use component style in client side. Ignore in SSR.
     */
    clientOnly?: boolean;
    /**
     * Set order of component style.
     * @default -999
     */
    order?: number;
    /**
     * Whether generate styles
     * @default true
     */
    injectStyle?: boolean;
  },
) => {
  const useStyle = genComponentStyleHook(component, styleFn, getDefaultToken, options);

  const useCSSVar = genCSSVarRegister(
    Array.isArray(component) ? component[0] : component,
    getDefaultToken,
    options,
  );

  return (prefixCls: Ref<string>, rootCls: Ref<string> = prefixCls) => {
    const [, hashId] = useStyle(prefixCls);
    const [wrapCSSVar, cssVarCls] = useCSSVar(rootCls);

    return [wrapCSSVar, hashId, cssVarCls] as const;
  };
};
