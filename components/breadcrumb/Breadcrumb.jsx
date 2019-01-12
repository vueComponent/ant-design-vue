import PropTypes from '../_util/vue-types';
import { cloneElement } from '../_util/vnode';
import { filterEmpty, getComponentFromProp, getSlotOptions } from '../_util/props-util';
import warning from '../_util/warning';
import BreadcrumbItem from './BreadcrumbItem';

const Route = PropTypes.shape({
  path: PropTypes.string,
  breadcrumbName: PropTypes.string,
}).loose;

const BreadcrumbProps = {
  prefixCls: PropTypes.string.def('ant-breadcrumb'),
  routes: PropTypes.arrayOf(Route),
  params: PropTypes.any,
  separator: PropTypes.any,
  itemRender: PropTypes.func,
};

function getBreadcrumbName(route, params) {
  if (!route.breadcrumbName) {
    return null;
  }
  const paramsKeys = Object.keys(params).join('|');
  const name = route.breadcrumbName.replace(
    new RegExp(`:(${paramsKeys})`, 'g'),
    (replacement, key) => params[key] || replacement,
  );
  return name;
}

export default {
  name: 'ABreadcrumb',
  props: BreadcrumbProps,
  methods: {
    defaultItemRender({ route, params, routes, paths }) {
      const isLastItem = routes.indexOf(route) === routes.length - 1;
      const name = getBreadcrumbName(route, params);
      return isLastItem ? <span>{name}</span> : <a href={`#/${paths.join('/')}`}>{name}</a>;
    },
  },
  render() {
    let crumbs;
    const { prefixCls, routes, params = {}, $slots, $scopedSlots } = this;
    const children = filterEmpty($slots.default);
    const separator = getComponentFromProp(this, 'separator');
    if (routes && routes.length > 0) {
      const paths = [];
      const itemRender = this.itemRender || $scopedSlots.itemRender || this.defaultItemRender;
      crumbs = routes.map(route => {
        route.path = route.path || '';
        let path = route.path.replace(/^\//, '');
        Object.keys(params).forEach(key => {
          path = path.replace(`:${key}`, params[key]);
        });
        if (path) {
          paths.push(path);
        }
        return (
          <BreadcrumbItem separator={separator} key={route.breadcrumbName || path}>
            {itemRender({ route, params, routes, paths })}
          </BreadcrumbItem>
        );
      });
    } else if (children.length) {
      crumbs = children.map((element, index) => {
        warning(
          getSlotOptions(element).__ANT_BREADCRUMB_ITEM,
          "Breadcrumb only accepts Breadcrumb.Item as it's children",
        );
        return cloneElement(element, {
          props: { separator },
          key: index,
        });
      });
    }
    return <div class={prefixCls}>{crumbs}</div>;
  },
};
