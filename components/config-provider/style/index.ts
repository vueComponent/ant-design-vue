import type { CSSObject } from '../../_util/_cssinjs';
import { useStyleRegister } from '../../_util/_cssinjs';
import { resetIcon } from '../../style';
import { useToken } from '../../_theme/internal';
import { computed, Ref } from 'vue';

const useStyle = (iconPrefixCls: Ref<string>) => {
  const [theme, token] = useToken();
  // Generate style for icons
  return useStyleRegister(
    computed(() => ({
      theme: theme.value,
      token: token.value,
      hashId: '',
      path: ['ant-design-icons', iconPrefixCls.value],
    })),
    () =>
      [
        {
          [`.${iconPrefixCls.value}`]: {
            ...resetIcon(),
            [`.${iconPrefixCls.value} .${iconPrefixCls.value}-icon`]: {
              display: 'block',
            },
          },
        },
      ] as CSSObject[],
  );
};

export default useStyle;
