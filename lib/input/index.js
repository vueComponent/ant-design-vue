'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Input = require('./Input');

var _Input2 = _interopRequireDefault(_Input);

var _Group = require('./Group');

var _Group2 = _interopRequireDefault(_Group);

var _Search = require('./Search');

var _Search2 = _interopRequireDefault(_Search);

var _TextArea = require('./TextArea');

var _TextArea2 = _interopRequireDefault(_TextArea);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_Input2['default'].Group = _Group2['default'];
_Input2['default'].Search = _Search2['default'];
_Input2['default'].TextArea = _TextArea2['default'];
exports['default'] = _Input2['default'];
module.exports = exports['default'];