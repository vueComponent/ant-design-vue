'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TabBarMixin = require('./TabBarMixin');

var _TabBarMixin2 = _interopRequireDefault(_TabBarMixin);

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  mixins: [_TabBarMixin2['default'], _BaseMixin2['default']],
  name: 'TabBar',
  props: {
    prefixCls: {
      'default': 'ant-tabs',
      type: String
    },
    tabBarPosition: {
      'default': 'top',
      type: String
    },
    disabled: Boolean,
    activeKey: String,
    panels: Array
  },
  render: function render(h) {
    var tabs = this.getTabs(h);
    return this.getRootNode(tabs, h);
  }
};
module.exports = exports['default'];