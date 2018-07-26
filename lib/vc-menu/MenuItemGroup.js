'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var MenuItemGroup = {
  name: 'MenuItemGroup',

  props: {
    renderMenuItem: _vueTypes2['default'].func,
    index: _vueTypes2['default'].number,
    className: _vueTypes2['default'].string,
    rootPrefixCls: _vueTypes2['default'].string,
    disabled: _vueTypes2['default'].bool.def(true),
    title: _vueTypes2['default'].any
  },
  isMenuItemGroup: true,
  methods: {
    renderInnerMenuItem: function renderInnerMenuItem(item, subIndex) {
      var _$props = this.$props,
          renderMenuItem = _$props.renderMenuItem,
          index = _$props.index;

      return renderMenuItem(item, index, subIndex);
    }
  },
  render: function render() {
    var h = arguments[0];

    var props = this.$props;
    var rootPrefixCls = props.rootPrefixCls;

    var titleClassName = rootPrefixCls + '-item-group-title';
    var listClassName = rootPrefixCls + '-item-group-list';
    return h(
      'li',
      { 'class': rootPrefixCls + '-item-group' },
      [h(
        'div',
        {
          'class': titleClassName,
          attrs: { title: typeof props.title === 'string' ? props.title : undefined
          }
        },
        [(0, _propsUtil.getComponentFromProp)(this, 'title')]
      ), h(
        'ul',
        { 'class': listClassName },
        [this.$slots['default'] && this.$slots['default'].map(this.renderInnerMenuItem)]
      )]
    );
  }
};

exports['default'] = MenuItemGroup;
module.exports = exports['default'];