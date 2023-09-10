import type { CSSProperties, ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import { getPropsSlot } from '../_util/props-util';
import type { DropdownProps } from '../dropdown/dropdown';
import Dropdown from '../dropdown/dropdown';
import DownOutlined from '@ant-design/icons-vue/DownOutlined';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { MouseEventHandler } from '../_util/EventInterface';
import { eventType, objectType } from '../_util/type';
import type { CustomSlotsType, VueNode } from '../_util/type';

export const breadcrumbItemProps = () => ({
  prefixCls: String,
  href: String,
  separator: PropTypes.any,
  dropdownProps: objectType<DropdownProps>(),
  overlay: PropTypes.any,
  onClick: eventType<MouseEventHandler>(),
});

export type BreadcrumbItemProps = Partial<ExtractPropTypes<ReturnType<typeof breadcrumbItemProps>>>;
export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ABreadcrumbItem',
  inheritAttrs: false,
  __ANT_BREADCRUMB_ITEM: true,
  props: breadcrumbItemProps(),
  // emits: ['click'],
  slots: Object as CustomSlotsType<{
    separator: any;
    overlay: any;
    default: any;
  }>,
  setup(props, { slots, attrs, emit }) {
    const { prefixCls } = useConfigInject('breadcrumb', props);
    /**
     * if overlay is have
     * Wrap a Dropdown
     */
    const renderBreadcrumbNode = (breadcrumbItem: VueNode, prefixCls: string) => {
      const overlay = getPropsSlot(slots, props, 'overlay');
      if (overlay) {
        return (
          <Dropdown {...props.dropdownProps} overlay={overlay} placement="bottom">
            <span class={`${prefixCls}-overlay-link`}>
              {breadcrumbItem}
              <DownOutlined />
            </span>
          </Dropdown>
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
      const { class: cls, style, ...restAttrs } = attrs;
      let link: VueNode;
      if (props.href !== undefined) {
        link = (
          <a class={`${prefixCls.value}-link`} onClick={handleClick} {...restAttrs}>
            {children}
          </a>
        );
      } else {
        link = (
          <span class={`${prefixCls.value}-link`} onClick={handleClick} {...restAttrs}>
            {children}
          </span>
        );
      }
      // wrap to dropDown
      link = renderBreadcrumbNode(link, prefixCls.value);
      if (children !== undefined && children !== null) {
        return (
          <li class={cls} style={style as CSSProperties}>
            {link}
            {separator && <span class={`${prefixCls.value}-separator`}>{separator}</span>}
          </li>
        );
      }
      return null;
    };
  },
});
