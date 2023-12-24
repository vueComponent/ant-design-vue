import { useToken } from '../../_theme/internal';
import type { Ref } from 'vue';

/**
 * This hook is only for cssVar to add root className for components.
 * If root ClassName is needed, this hook could be refactored with `-root`
 * @param prefixCls
 */
const useCSSVarCls = (prefixCls: Ref<string>) => {
  const [, , , , cssVar] = useToken();

  return cssVar.value ? `${prefixCls.value}-css-var` : '';
};

export default useCSSVarCls;
