import { defineComponent, shallowRef } from 'vue';
import type { CSSProperties } from 'vue';
import { useConfigContextInject } from '../config-provider/context';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
import classNames from '../_util/classNames';
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
    const flexRef = shallowRef();

    return () => {
      const { flex, gap, vertical = false, component: Component = 'div', ...othersProps } = props;

      const mergedVertical = vertical ?? ctxFlex?.value.vertical;

      const mergedCls = classNames(
        attrs.class,
        prefixCls.value,
        hashId.value,
        createFlexClassNames(prefixCls.value, props),
        {
          [`${prefixCls.value}-rtl`]: ctxDirection.value === 'rtl',
          [`${prefixCls.value}-gap-${gap}`]: isPresetSize(gap),
          [`${prefixCls.value}-vertical`]: mergedVertical,
        },
      );

      const mergedStyle = { ...(attrs.style as CSSProperties) };

      if (flex) {
        mergedStyle.flex = flex;
      }

      if (gap && !isPresetSize(gap)) {
        mergedStyle.gap = `${gap}px`;
      }

      return wrapSSR(
        <Component
          ref={flexRef.value}
          class={mergedCls}
          style={mergedStyle}
          {...omit(othersProps, ['justify', 'wrap', 'align'])}
        >
          {slots.default?.()}
        </Component>,
      );
    };
  },
});

export default withInstall(AFlex);
export type { FlexProps };
