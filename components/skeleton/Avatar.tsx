import type { ExtractPropTypes, PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import Element, { skeletonElementProps } from './Element';
import useStyle from './style';

export const avatarProps = () => {
  return {
    ...skeletonElementProps(),
    shape: String as PropType<'circle' | 'square'>,
  };
};

export type SkeletonAvatarProps = Partial<ExtractPropTypes<ReturnType<typeof avatarProps>>>;

const SkeletonAvatar = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASkeletonAvatar',
  props: initDefaultProps(avatarProps(), {
    size: 'default',
    shape: 'circle',
  }),
  setup(props) {
    const { prefixCls } = useConfigInject('skeleton', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const cls = computed(() =>
      classNames(
        prefixCls.value,
        `${prefixCls.value}-element`,
        {
          [`${prefixCls.value}-active`]: props.active,
        },
        hashId.value,
      ),
    );
    return () => {
      return wrapSSR(
        <div class={cls.value}>
          <Element {...props} prefixCls={`${prefixCls.value}-avatar`} />
        </div>,
      );
    };
  },
});

export default SkeletonAvatar;
