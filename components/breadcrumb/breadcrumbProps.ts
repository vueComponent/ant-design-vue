import { Menu } from 'types/menu/menu';
import { PropType, VNode } from 'vue';
import PropTypes from '../_util/vue-types';
import { ItemRenderParams, VNodeElement } from './breadcrumbTypes';

const prefixCls = {
  type: String as PropType<string>,
};

const slotPropType = {
  type: [String, Number, Object, Array] as PropType<VNodeElement>,
};

const Route = PropTypes.shape({
  path: PropTypes.string,
  breadcrumbName: PropTypes.string,
  children: PropTypes.array,
}).loose;

export const breadcrumbProps = {
  prefixCls: String as PropType<string>,
  routes: PropTypes.arrayOf(Route),
  params: Object as PropType<any>,
  separator: {
    type: [String, Number, Object, Array] as PropType<VNodeElement>,
    default: '/',
  },
  itemRender: Function as PropType<(opt: ItemRenderParams) => VNode>,
};

export const breadcrumbItemProps = {
  prefixCls,
  href: String as PropType<string>,
  separator: slotPropType,
  overlay: [Object, Function] as PropType<Menu | (() => Menu)>,
};

export const breadcrumbSeparatorProps = {
  prefixCls,
};
