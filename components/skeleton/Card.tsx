import { computed, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import Element, { skeletonElementProps } from './Element';
import useStyle from './style';
import omit from '../_util/omit';

const SkeletonCard = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASkeletonCard',
  props: omit(skeletonElementProps(), ['shape']),
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
          <Element {...props} prefixCls={`${prefixCls.value}-card`}></Element>
        </div>,
      );
    };
  },
});

export default SkeletonCard;
