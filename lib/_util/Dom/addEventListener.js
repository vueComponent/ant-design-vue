'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = addEventListenerWrap;

var _addDomEventListener = require('add-dom-event-listener');

var _addDomEventListener2 = _interopRequireDefault(_addDomEventListener);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function addEventListenerWrap(target, eventType, cb) {
  return (0, _addDomEventListener2['default'])(target, eventType, cb);
}
module.exports = exports['default'];