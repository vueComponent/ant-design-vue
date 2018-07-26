'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DraggerProps = exports.UploadChangeParam = exports.UploadListProps = exports.UploadProps = undefined;

var _interface = require('./interface');

Object.defineProperty(exports, 'UploadProps', {
  enumerable: true,
  get: function get() {
    return _interface.UploadProps;
  }
});
Object.defineProperty(exports, 'UploadListProps', {
  enumerable: true,
  get: function get() {
    return _interface.UploadListProps;
  }
});
Object.defineProperty(exports, 'UploadChangeParam', {
  enumerable: true,
  get: function get() {
    return _interface.UploadChangeParam;
  }
});

var _Dragger = require('./Dragger');

Object.defineProperty(exports, 'DraggerProps', {
  enumerable: true,
  get: function get() {
    return _Dragger.DraggerProps;
  }
});

var _Upload = require('./Upload');

var _Upload2 = _interopRequireDefault(_Upload);

var _Dragger2 = _interopRequireDefault(_Dragger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_Upload2['default'].Dragger = _Dragger2['default'];
exports['default'] = _Upload2['default'];