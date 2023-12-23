import type { CSSObject } from '../../_util/_cssinjs';
import { useStyleRegister } from '../../_util/_cssinjs';
import { resetIcon } from '../../style';
import type { CSPConfig } from '../../config-provider';
import useToken from '../useToken';
import type { Ref } from 'vue';
import { computed } from 'vue';

const useResetIconStyle = (iconPrefixCls: Ref<string>, csp?: Ref<CSPConfig>) => {
  const [theme, token] = useToken();

  // Generate style for icons
  return useStyleRegister(
    computed(() => ({
      theme: theme.value,
      token,
      hashId: '',
      path: ['ant-design-icons', iconPrefixCls.value],
      nonce: () => csp && csp.value.nonce!,
    })),
    () =>
      [
        {
          [`.${iconPrefixCls}`]: {
            ...resetIcon(),
            [`.${iconPrefixCls} .${iconPrefixCls}-icon`]: {
              display: 'block',
            },
          },
        },
      ] as CSSObject[],
  );
};

export default useResetIconStyle;
