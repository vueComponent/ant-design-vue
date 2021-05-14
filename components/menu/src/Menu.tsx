import usePrefixCls from 'ant-design-vue/es/_util/hooks/usePrefixCls';
import { defineComponent, ExtractPropTypes } from 'vue';
import useProvideMenu from './hooks/useMenuContext';

export const menuProps = {
  prefixCls: String,
};

export type MenuProps = Partial<ExtractPropTypes<typeof menuProps>>;

export default defineComponent({
  name: 'AMenu',
  props: menuProps,
  setup(props, { slots }) {
    const prefixCls = usePrefixCls('menu', props);
    useProvideMenu({ prefixCls });
    return () => {
      return <div>{slots.default?.()}</div>;
    };
  },
});
