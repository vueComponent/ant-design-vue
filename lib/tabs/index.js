'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabContent = exports.TabPane = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _tabs = require('./tabs');

var _tabs2 = _interopRequireDefault(_tabs);

var _TabPane = require('../vc-tabs/src/TabPane');

var _TabPane2 = _interopRequireDefault(_TabPane);

var _TabContent = require('../vc-tabs/src/TabContent');

var _TabContent2 = _interopRequireDefault(_TabContent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_tabs2['default'].TabPane = (0, _extends3['default'])({}, _TabPane2['default'], { name: 'ATabPane', __ANT_TAB_PANE: true });
_tabs2['default'].TabContent = (0, _extends3['default'])({}, _TabContent2['default'], { name: 'ATabContent' });
exports['default'] = _tabs2['default'];
exports.TabPane = _TabPane2['default'];
exports.TabContent = _TabContent2['default'];