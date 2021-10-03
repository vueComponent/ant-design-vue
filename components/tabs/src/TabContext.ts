import type { Tab } from './interface';
import type { PropType, InjectionKey } from 'vue';
import { provide, inject, defineComponent } from 'vue';

export interface TabContextProps {
  tabs: Tab[];
  prefixCls: string;
}

const TabsContextKey: InjectionKey<TabContextProps> = Symbol('tabsContextKey');

export const useProvideTabs = (props: TabContextProps) => {
  provide(TabsContextKey, props);
};

export const useInjectTabs = () => {
  return inject(TabsContextKey, { tabs: [], prefixCls: undefined });
};

const TabsContextProvider = defineComponent({
  name: 'TabsContextProvider',
  inheritAttrs: false,
  props: {
    tabs: { type: Object as PropType<TabContextProps['tabs']>, default: undefined },
    prefixCls: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    useProvideTabs(props);
    return () => slots.default?.();
  },
});

export default TabsContextProvider;
