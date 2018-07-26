
import PropTypes from '../_util/vue-types';
import { cloneElement } from '../_util/vnode';
import { filterEmpty, getComponentFromProp, getSlotOptions } from '../_util/props-util';
import warning from '../_util/warning';
import BreadcrumbItem from './BreadcrumbItem';

var Route = PropTypes.shape({
  path: PropTypes.string,
  breadcrumbName: PropTypes.string
}).loose;

var BreadcrumbProps = {
  prefixCls: PropTypes.string.def('ant-breadcrumb'),
  routes: PropTypes.arrayOf(Route),
  params: PropTypes.any,
  separator: PropTypes.any,
  itemRender: PropTypes.func
};

function getBreadcrumbName(route, params) {
  if (!route.breadcrumbName) {
    return null;
  }
  var paramsKeys = Object.keys(params).join('|');
  var name = route.breadcrumbName.replace(new RegExp(':(' + paramsKeys + ')', 'g'), function (replacement, key) {
    return params[key] || replacement;
  });
  return name;
}

export default {
  name: 'ABreadcrumb',
  props: BreadcrumbProps,
  methods: {
    defaultItemRender: function defaultItemRender(_ref) {
      var route = _ref.route,
          params = _ref.params,
          routes = _ref.routes,
          paths = _ref.paths;
      var h = this.$createElement;

      var isLastItem = routes.indexOf(route) === routes.length - 1;
      var name = getBreadcrumbName(route, params);
      return isLastItem ? h('span', [name]) : h(
        'a',
        {
          attrs: { href: '#/' + paths.join('/') }
        },
        [name]
      );
    }
  },
  render: function render() {
    var h = arguments[0];

    var crumbs = void 0;
    var prefixCls = this.prefixCls,
        routes = this.routes,
        _params = this.params,
        params = _params === undefined ? {} : _params,
        $slots = this.$slots,
        $scopedSlots = this.$scopedSlots;

    var children = filterEmpty($slots['default']);
    var separator = getComponentFromProp(this, 'separator');
    if (routes && routes.length > 0) {
      var paths = [];
      var itemRender = this.itemRender || $scopedSlots.itemRender || this.defaultItemRender;
      crumbs = routes.map(function (route) {
        route.path = route.path || '';
        var path = route.path.replace(/^\//, '');
        Object.keys(params).forEach(function (key) {
          path = path.replace(':' + key, params[key]);
        });
        if (path) {
          paths.push(path);
        }
        return h(
          BreadcrumbItem,
          {
            attrs: { separator: separator },
            key: route.breadcrumbName || path },
          [itemRender({ route: route, params: params, routes: routes, paths: paths })]
        );
      });
    } else if (children.length) {
      crumbs = children.map(function (element, index) {
        warning(getSlotOptions(element).__ANT_BREADCRUMB_ITEM, 'Breadcrumb only accepts Breadcrumb.Item as it\'s children');
        return cloneElement(element, {
          props: { separator: separator },
          key: index
        });
      });
    }
    return h(
      'div',
      { 'class': prefixCls },
      [crumbs]
    );
  }
};