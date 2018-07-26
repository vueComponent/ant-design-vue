'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _tooltip = require('../tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _abstractTooltipProps = require('../tooltip/abstractTooltipProps');

var _abstractTooltipProps2 = _interopRequireDefault(_abstractTooltipProps);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var props = (0, _abstractTooltipProps2['default'])();
exports['default'] = {
  name: 'APopover',
  props: (0, _extends3['default'])({}, props, {
    prefixCls: _vueTypes2['default'].string.def('ant-popover'),
    transitionName: _vueTypes2['default'].string.def('zoom-big'),
    content: _vueTypes2['default'].any,
    title: _vueTypes2['default'].any
  }),
  model: {
    prop: 'visible',
    event: 'visibleChange'
  },
  methods: {
    getPopupDomNode: function getPopupDomNode() {
      return this.$refs.tooltip.getPopupDomNode();
    }
  },

  render: function render(h) {
    var title = this.title,
        prefixCls = this.prefixCls,
        $slots = this.$slots;

    var props = (0, _propsUtil.getOptionProps)(this);
    delete props.title;
    delete props.content;
    var tooltipProps = {
      props: (0, _extends3['default'])({}, props),
      ref: 'tooltip',
      on: this.$listeners
    };
    return h(
      _tooltip2['default'],
      tooltipProps,
      [h(
        'template',
        { slot: 'title' },
        [h('div', [(title || $slots.title) && h(
          'div',
          { 'class': prefixCls + '-title' },
          [(0, _propsUtil.getComponentFromProp)(this, 'title')]
        ), h(
          'div',
          { 'class': prefixCls + '-inner-content' },
          [(0, _propsUtil.getComponentFromProp)(this, 'content')]
        )])]
      ), this.$slots['default']]
    );
  }
};
module.exports = exports['default'];