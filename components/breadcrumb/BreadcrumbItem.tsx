import { inject, defineComponent, computed, unref } from 'vue';
import { hasProp, getComponentFromSetup } from '../_util/props-util';
import { defaultConfigProvider, ConfigConsumerProps } from '../config-provider';
import DropDown from '../dropdown/dropdown';
import DownOutlined from '@ant-design/icons-vue/DownOutlined';
import { breadcrumbItemProps } from './breadcrumbProps';
import { BreadcrumbItemProps, VNodeElement } from './breadcrumbTypes';

export default defineComponent({
  name: 'ABreadcrumbItem',
  __ANT_BREADCRUMB_ITEM: true,
  props: breadcrumbItemProps,
  setup(propsValues, { slots, attrs }) {
    const propsRef = computed(() => {
      return { ...attrs, ...propsValues } as BreadcrumbItemProps;
    });
    const { getPrefixCls } = inject<ConfigConsumerProps>('configProvider', defaultConfigProvider);

    function renderBreadcrumbNode(breadcrumbItem, prefixCls) {
      const overlay = getComponentFromSetup(unref(propsRef), slots, 'overlay') as VNodeElement;
      if (overlay) {
        return (
          // TODO DropDown 失效问题?
          <DropDown
            v-slots={{ overlay: () => overlay }}
            trigger={['hover']}
            placement="bottomCenter"
          >
            <span class={`${prefixCls}-overlay-link`}>
              {breadcrumbItem}
              <DownOutlined />
            </span>
          </DropDown>
        );
      }
      return breadcrumbItem;
    }
    return () => {
      const props = unref(propsRef);
      const { prefixCls: customizePrefixCls } = props;
      const prefixCls = getPrefixCls('breadcrumb', customizePrefixCls);

      const separator =
        slots.separator?.() || (getComponentFromSetup(props, slots, 'separator') as VNodeElement);
      const children = slots.default?.();
      let link;
      if (hasProp(props, 'href')) {
        link = <a class={`${prefixCls}-link`}>{children}</a>;
      } else {
        link = <span class={`${prefixCls}-link`}>{children}</span>;
      }
      // wrap to dropDown
      link = renderBreadcrumbNode(link, prefixCls);
      if (children) {
        return (
          <span>
            {link}
            {separator && separator !== '' && (
              <span class={`${prefixCls}-separator`}>{separator}</span>
            )}
          </span>
        );
      }
      return null;
    };
  },
});
