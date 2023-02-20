import type { HTMLAttributes, PropType } from 'vue';
import { defineComponent } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
import type { Direction } from '../config-provider';

// CSSINJS
import useStyle from './style';

export interface TypographyProps extends HTMLAttributes {
  direction?: Direction;
  prefixCls?: string;
}

export interface InternalTypographyProps extends TypographyProps {
  component?: string;
}
export const typographyProps = () => ({
  prefixCls: String,
  direction: String as PropType<Direction>,
  // Form Internal use
  component: String,
});
const Typography = defineComponent<InternalTypographyProps>({
  name: 'ATypography',
  inheritAttrs: false,
  props: typographyProps() as any,
  setup(props, { slots, attrs }) {
    const { prefixCls, direction } = useConfigInject('typography', props);

    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    return () => {
      const {
        prefixCls: _prefixCls,
        class: _className,
        direction: _direction,
        component: Component = 'article' as any,
        ...restProps
      } = { ...props, ...attrs };
      return wrapSSR(
        <Component
          class={classNames(
            prefixCls.value,
            { [`${prefixCls.value}-rtl`]: direction.value === 'rtl' },
            attrs.class,
            hashId.value,
          )}
          {...restProps}
        >
          {slots.default?.()}
        </Component>,
      );
    };
  },
});

export default Typography;
