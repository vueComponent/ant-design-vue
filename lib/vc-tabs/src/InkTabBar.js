'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _InkTabBarMixin = require('./InkTabBarMixin');

var _InkTabBarMixin2 = _interopRequireDefault(_InkTabBarMixin);

var _TabBarMixin = require('./TabBarMixin');

var _TabBarMixin2 = _interopRequireDefault(_TabBarMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'InkTabBar',
  mixins: [_TabBarMixin2['default'], _InkTabBarMixin2['default']],
  render: function render(h) {
    var inkBarNode = this.getInkBarNode();
    var tabs = this.getTabs(h);
    return this.getRootNode([inkBarNode, tabs], h);
  }
};
module.exports = exports['default'];