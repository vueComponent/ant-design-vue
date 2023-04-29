import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { OverflowContextProvider, useInjectOverflowContext } from './context';
import Item from './Item';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'RawItem',
  inheritAttrs: false,
  props: {
    component: PropTypes.any,
    title: PropTypes.any,
    id: String,
    onMouseenter: { type: Function },
    onMouseleave: { type: Function },
    onClick: { type: Function },
    onKeydown: { type: Function },
    onFocus: { type: Function },
    role: String,
    tabindex: Number,
  },
  setup(props, { slots, attrs }) {
    const context = useInjectOverflowContext();

    return () => {
      // Render directly when context not provided
      if (!context.value) {
        const { component: Component = 'div', ...restProps } = props;
        return (
          <Component {...restProps} {...attrs}>
            {slots.default?.()}
          </Component>
        );
      }

      const { className: contextClassName, ...restContext } = context.value;
      const { class: className, ...restProps } = attrs;
      // Do not pass context to sub item to avoid multiple measure
      return (
        <OverflowContextProvider value={null}>
          <Item
            class={classNames(contextClassName, className)}
            {...restContext}
            {...restProps}
            {...props}
            v-slots={slots}
          ></Item>
        </OverflowContextProvider>
      );
    };
  },
});
