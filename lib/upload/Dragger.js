'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _propsUtil = require('../_util/props-util');

var _Upload = require('./Upload');

var _Upload2 = _interopRequireDefault(_Upload);

var _interface = require('./interface');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'AUploadDragger',
  props: _interface.UploadProps,
  render: function render() {
    var h = arguments[0];

    var props = (0, _propsUtil.getOptionProps)(this);
    var draggerProps = {
      props: (0, _extends3['default'])({}, props, {
        type: 'drag'
      }),
      on: this.$listeners,
      style: { height: this.height }
    };
    return h(
      _Upload2['default'],
      draggerProps,
      [this.$slots['default']]
    );
  }
};
module.exports = exports['default'];