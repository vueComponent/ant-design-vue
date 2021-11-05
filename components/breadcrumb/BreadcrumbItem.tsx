import type { ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import { getPropsSlot } from '../_util/props-util';
import DropDown from '../dropdown/dropdown';
import DownOutlined from '@ant-design/icons-vue/DownOutlined';
import useConfigInject from '../_util/hooks/useConfigInject';

const breadcrumbItemProps = {
  prefixCls: PropTypes.string,
  href: PropTypes.string,
  separator: PropTypes.any,
  overlay: PropTypes.any,
};

export type BreadcrumbItemProps = Partial<ExtractPropTypes<typeof breadcrumbItemProps>>;
export default defineComponent({
  name: 'ABreadcrumbItem',
  __ANT_BREADCRUMB_ITEM: true,
  props: breadcrumbItemProps,
  emits: ['click'],
  slots: ['separator', 'overlay'],
  setup(props, { slots, emit }) {
    const { prefixCls } = useConfigInject('breadcrumb', props);
    /**
     * if overlay is have
     * Wrap a DropDown
     */
    const renderBreadcrumbNode = (breadcrumbItem: JSX.Element, prefixCls: string) => {
      const overlay = getPropsSlot(slots, props, 'overlay');
      if (overlay) {
        return (
          <DropDown overlay={overlay} placement="bottomCenter">
            <span class={`${prefixCls}-overlay-link`}>
              {breadcrumbItem}
              <DownOutlined />
            </span>
          </DropDown>
        );
      }
      return breadcrumbItem;
    };

    const handleClick = (e: MouseEvent) => {
      emit('click', e);
    };

    return () => {
      const separator = getPropsSlot(slots, props, 'separator') ?? '/';
      const children = getPropsSlot(slots, props);
      let link: JSX.Element;
      if (props.href !== undefined) {
        link = <a class={`${prefixCls.value}-link`}>{children}</a>;
      } else {
        link = <span class={`${prefixCls.value}-link`}>{children}</span>;
      }
      // wrap to dropDown
      link = renderBreadcrumbNode(link, prefixCls.value);
      if (children) {
        return (
          <span onClick={handleClick}>
            {link}
            {separator && <span class={`${prefixCls.value}-separator`}>{separator}</span>}
          </span>
        );
      }
      return null;
    };
  },
});
