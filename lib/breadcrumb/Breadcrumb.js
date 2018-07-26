'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _vnode = require('../_util/vnode');

var _propsUtil = require('../_util/props-util');

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

var _BreadcrumbItem = require('./BreadcrumbItem');

var _BreadcrumbItem2 = _interopRequireDefault(_BreadcrumbItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Route = _vueTypes2['default'].shape({
  path: _vueTypes2['default'].string,
  breadcrumbName: _vueTypes2['default'].string
}).loose;

var BreadcrumbProps = {
  prefixCls: _vueTypes2['default'].string.def('ant-breadcrumb'),
  routes: _vueTypes2['default'].arrayOf(Route),
  params: _vueTypes2['default'].any,
  separator: _vueTypes2['default'].any,
  itemRender: _vueTypes2['default'].func
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

exports['default'] = {
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

    var children = (0, _propsUtil.filterEmpty)($slots['default']);
    var separator = (0, _propsUtil.getComponentFromProp)(this, 'separator');
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
          _BreadcrumbItem2['default'],
          {
            attrs: { separator: separator },
            key: route.breadcrumbName || path },
          [itemRender({ route: route, params: params, routes: routes, paths: paths })]
        );
      });
    } else if (children.length) {
      crumbs = children.map(function (element, index) {
        (0, _warning2['default'])((0, _propsUtil.getSlotOptions)(element).__ANT_BREADCRUMB_ITEM, 'Breadcrumb only accepts Breadcrumb.Item as it\'s children');
        return (0, _vnode.cloneElement)(element, {
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
module.exports = exports['default'];