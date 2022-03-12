import PropTypes from '../_util/vue-types';
import type { HTMLAttributes } from 'vue';
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

const Typography = defineComponent<InternalTypographyProps>({
  name: 'ATypography',
  inheritAttrs: false,
  setup(props, { slots, attrs }) {
    const { prefixCls, direction } = useConfigInject('typography', props);
    return () => {
      const {
        prefixCls: _prefixCls,
        class: _className,
        direction: _direction,
        component: Component = 'article' as any,
        ...restProps
      } = { ...props, ...attrs };
      return (
        <Component
          class={classNames(
            prefixCls.value,
            { [`${prefixCls.value}-rtl`]: direction.value === 'rtl' },
            attrs.class,
          )}
          {...restProps}
        >
          {slots.default?.()}
        </Component>
      );
    };
  },
});

Typography.props = {
  prefixCls: PropTypes.string,
  component: PropTypes.string,
};

export default Typography;
