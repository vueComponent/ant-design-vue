/* eslint-disable import/prefer-default-export */
import { defaultConfig, useToken as useInternalToken } from './internal';
import type { GlobalToken } from './interface';
import defaultAlgorithm from './themes/default';
import darkAlgorithm from './themes/dark';
import compactAlgorithm from './themes/compact';

// ZombieJ: We export as object to user but array in internal.
// This is used to minimize the bundle size for antd package but safe to refactor as object also.
// Please do not export internal `useToken` directly to avoid something export unexpected.
/** Get current context Design Token. Will be different if you are using nest theme config. */
function useToken() {
  const [theme, token, hashId] = useInternalToken();

  return { theme, token, hashId };
}

export { type GlobalToken };

export default {
  /** @private Test Usage. Do not use in production. */
  defaultConfig,

  /** Default seedToken */
  defaultSeed: defaultConfig.token,

  useToken,
  defaultAlgorithm,
  darkAlgorithm,
  compactAlgorithm,
};
