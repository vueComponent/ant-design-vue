'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnchorLinkProps = exports.AnchorProps = undefined;

var _Anchor = require('./Anchor');

Object.defineProperty(exports, 'AnchorProps', {
  enumerable: true,
  get: function get() {
    return _Anchor.AnchorProps;
  }
});

var _AnchorLink = require('./AnchorLink');

Object.defineProperty(exports, 'AnchorLinkProps', {
  enumerable: true,
  get: function get() {
    return _AnchorLink.AnchorLinkProps;
  }
});

var _Anchor2 = _interopRequireDefault(_Anchor);

var _AnchorLink2 = _interopRequireDefault(_AnchorLink);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_Anchor2['default'].Link = _AnchorLink2['default'];
exports['default'] = _Anchor2['default'];