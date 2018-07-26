import _extends from 'babel-runtime/helpers/extends';
import Vue from 'vue';
import ConfirmDialog from './ConfirmDialog';

export default function confirm(config) {
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
    return new Vue({
      el: el,
      render: function render() {
        var h = arguments[0];

        return h(ConfirmDialog, confirmDialogProps);
      }
    });
  }

  confirmDialogInstance = render(_extends({}, config, { visible: true, close: close }));

  return {
    destroy: close
  };
}