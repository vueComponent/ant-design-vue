'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Step = undefined;

var _Steps = require('./Steps');

var _Steps2 = _interopRequireDefault(_Steps);

var _Step = require('./Step');

var _Step2 = _interopRequireDefault(_Step);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// base rc-steps 3.3.1
_Steps2['default'].Step = _Step2['default'];

exports.Step = _Step2['default'];
exports['default'] = _Steps2['default'];