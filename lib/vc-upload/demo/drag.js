'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  render: function render() {
    var h = arguments[0];

    var uploaderProps = {
      props: {
        action: '/upload.do',
        type: 'drag',
        accept: '.png',
        beforeUpload: function beforeUpload(file) {
          console.log('beforeUpload', file.name);
        }
      },
      on: {
        start: function start(file) {
          console.log('onStart', file.name);
        },
        success: function success(file) {
          console.log('onSuccess', file);
        },
        progress: function progress(step, file) {
          console.log('onProgress', Math.round(step.percent), file.name);
        },
        error: function error(err) {
          console.log('onError', err);
        }
      },
      style: { display: 'inline-block', width: '200px', height: '200px', background: '#eee' }
    };
    return h(_index2['default'], uploaderProps);
  }
};
module.exports = exports['default'];