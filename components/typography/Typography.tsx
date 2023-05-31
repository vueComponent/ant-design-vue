import type { HTMLAttributes, PropType } from 'vue';
import { defineComponent } from 'vue';
import useConfigInject from '../_util/hooks/useConfigInject';
import classNames from '../_util/classNames';
import type { Direction } from '../config-provider';

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
const Typography = defineComponent({
  name: 'ATypography',
  inheritAttrs: false,
  props: typographyProps(),
  setup(props, { slots, attrs }) {
    const { prefixCls, direction } = useConfigInject('typography', props);
    return () => {
      const {
        prefixCls: _prefixCls,
        direction: _direction,
        component: Component = 'article' as any,
        ...restProps
      } = { ...props, ...attrs };
      return (
        <Component
          {...restProps}
          class={classNames(
            prefixCls.value,
            { [`${prefixCls.value}-rtl`]: direction.value === 'rtl' },
            attrs.class,
          )}
        >
          {slots.default?.()}
        </Component>
      );
    };
  },
});

export default Typography;
