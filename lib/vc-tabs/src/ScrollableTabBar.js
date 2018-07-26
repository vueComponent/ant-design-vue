'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ScrollableTabBarMixin = require('./ScrollableTabBarMixin');

var _ScrollableTabBarMixin2 = _interopRequireDefault(_ScrollableTabBarMixin);

var _TabBarMixin = require('./TabBarMixin');

var _TabBarMixin2 = _interopRequireDefault(_TabBarMixin);

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'ScrollableTabBar',
  mixins: [_TabBarMixin2['default'], _ScrollableTabBarMixin2['default'], _BaseMixin2['default']],
  render: function render(h) {
    var inkBarNode = this.getInkBarNode();
    var tabs = this.getTabs(h);
    var scrollbarNode = this.getScrollBarNode([inkBarNode, tabs]);
    return this.getRootNode(scrollbarNode, h);
  }
};
module.exports = exports['default'];