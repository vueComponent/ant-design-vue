import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { SkeletonElementProps } from './Element';
import Element, { skeletonElementProps } from './Element';
import omit from '../_util/omit';
import useStyle from './style';

export interface SkeletonInputProps extends Omit<SkeletonElementProps, 'size' | 'shape'> {
  size?: 'large' | 'small' | 'default';
  block?: boolean;
}

const SkeletonInput = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASkeletonInput',
  props: {
    ...omit(skeletonElementProps(), ['shape']),
    size: String as PropType<'large' | 'small' | 'default'>,
    block: Boolean,
  },
  setup(props) {
    const { prefixCls } = useConfigInject('skeleton', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const cls = computed(() =>
      classNames(
        prefixCls.value,
        `${prefixCls.value}-element`,
        {
          [`${prefixCls.value}-active`]: props.active,
          [`${prefixCls.value}-block`]: props.block,
        },
        hashId.value,
      ),
    );
    return () => {
      return wrapSSR(
        <div class={cls.value}>
          <Element {...props} prefixCls={`${prefixCls.value}-input`} />
        </div>,
      );
    };
  },
});

export default SkeletonInput;
