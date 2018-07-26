'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports['default'] = confirm;

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _ConfirmDialog = require('./ConfirmDialog');

var _ConfirmDialog2 = _interopRequireDefault(_ConfirmDialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function confirm(config) {
  var div = document.createElement('div');
  var el = document.createElement('div');
  div.appendChild(el);
  document.body.appendChild(div);

  var confirmDialogInstance = null;
  function close() {
    destroy.apply(undefined, arguments);
  }

  function destroy() {
    if (confirmDialogInstance && div.parentNode) {
      confirmDialogInstance.$destroy();
      confirmDialogInstance = null;
      div.parentNode.removeChild(div);
    }

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var triggerCancel = args && args.length && args.some(function (param) {
      return param && param.triggerCancel;
    });
    if (config.onCancel && triggerCancel) {
      config.onCancel.apply(config, args);
    }
  }

  function render(props) {
    var confirmDialogProps = {
      props: props
    };
    return new _vue2['default']({
      el: el,
      render: function render() {
        var h = arguments[0];

        return h(_ConfirmDialog2['default'], confirmDialogProps);
      }
    });
  }

  confirmDialogInstance = render((0, _extends3['default'])({}, config, { visible: true, close: close }));

  return {
    destroy: close
  };
}
module.exports = exports['default'];