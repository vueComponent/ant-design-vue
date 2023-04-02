import { useStyleRegister } from '../../_util/cssinjs';
import { resetIcon } from '../../style';
import { useToken } from '../../theme/internal';
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
    () => [
      {
        [`.${iconPrefixCls.value}`]: {
          ...resetIcon(),
          [`.${iconPrefixCls.value} .${iconPrefixCls.value}-icon`]: {
            display: 'block',
          },
        },
      },
    ],
  );
};

export default useStyle;
