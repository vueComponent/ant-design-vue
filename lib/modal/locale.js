'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.changeConfirmLocale = changeConfirmLocale;
exports.getConfirmLocale = getConfirmLocale;

var _default = require('../locale-provider/default');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// export interface ModalLocale {
//   okText: string;
//   cancelText: string;
//   justOkText: string;
// }

var runtimeLocale = (0, _extends3['default'])({}, _default2['default'].Modal);

function changeConfirmLocale(newLocale) {
  if (newLocale) {
    runtimeLocale = (0, _extends3['default'])({}, runtimeLocale, newLocale);
  } else {
    runtimeLocale = (0, _extends3['default'])({}, _default2['default'].Modal);
  }
}

function getConfirmLocale() {
  return runtimeLocale;
}