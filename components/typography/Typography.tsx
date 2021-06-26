import PropTypes from '../_util/vue-types';
import type { HTMLAttributes } from 'vue';
import { defineComponent } from 'vue';
import useConfigInject from '../_util/hooks/useConfigInject';
import classNames from '../_util/classNames';

export interface TypographyProps extends HTMLAttributes {
  prefixCls?: string;
}

interface InternalTypographyProps extends TypographyProps {
  component?: string;
}

const Typography = defineComponent<InternalTypographyProps>({
  name: 'ATypography',
  inheritAttrs: false,
  setup(props, { slots, attrs }) {
    const { prefixCls } = useConfigInject('typography', props);
    return () => {
      const {
        prefixCls: _prefixCls,
        class: _className,
        component: Component = 'article' as any,
        ...restProps
      } = { ...props, ...attrs };
      return (
        <Component class={classNames(prefixCls.value, attrs.class)} {...restProps}>
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
