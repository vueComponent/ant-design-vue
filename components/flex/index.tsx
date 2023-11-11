import { computed, defineComponent } from 'vue';
import type { CSSProperties } from 'vue';
import { useConfigContextInject } from '../config-provider/context';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
import { isPresetSize } from '../_util/gapSize';
import omit from '../_util/omit';
import { withInstall } from '../_util/type';
import type { FlexProps } from './interface';
import { flexProps } from './interface';
import createFlexClassNames from './utils';

const AFlex = defineComponent({
  name: 'AFlex',
  inheritAttrs: false,
  props: flexProps(),
  setup(props, { slots, attrs }) {
    const { flex: ctxFlex, direction: ctxDirection } = useConfigContextInject();
    const { prefixCls } = useConfigInject('flex', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const mergedCls = computed(() => [
      prefixCls.value,
      hashId.value,
      createFlexClassNames(prefixCls.value, props),
      {
        [`${prefixCls.value}-rtl`]: ctxDirection.value === 'rtl',
        [`${prefixCls.value}-gap-${props.gap}`]: isPresetSize(props.gap),
        [`${prefixCls.value}-vertical`]: props.vertical ?? ctxFlex?.value.vertical,
      },
    ]);
    return () => {
      const { flex, gap, component: Component = 'div', ...othersProps } = props;

      const mergedStyle: CSSProperties = {};

      if (flex) {
        mergedStyle.flex = flex;
      }

      if (gap && !isPresetSize(gap)) {
        mergedStyle.gap = `${gap}px`;
      }

      return wrapSSR(
        <Component
          class={[attrs.class, mergedCls.value]}
          style={[attrs.style as CSSProperties, mergedStyle]}
          {...omit(othersProps, ['justify', 'wrap', 'align', 'vertical'])}
        >
          {slots.default?.()}
        </Component>,
      );
    };
  },
});

export default withInstall(AFlex);
export type { FlexProps };
