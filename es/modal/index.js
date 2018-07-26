import _extends from 'babel-runtime/helpers/extends';
import Modal from './Modal';
import modalConfirm from './confirm';

// export { ActionButtonProps } from './ActionButton'
// export { ModalProps, ModalFuncProps } from './Modal'

var info = function info(props) {
  var config = _extends({
    type: 'info',
    iconType: 'info-circle',
    okCancel: false
  }, props);
  return modalConfirm(config);
};

var success = function success(props) {
  var config = _extends({
    type: 'success',
    iconType: 'check-circle',
    okCancel: false
  }, props);
  return modalConfirm(config);
};

var error = function error(props) {
  var config = _extends({
    type: 'error',
    iconType: 'cross-circle',
    okCancel: false
  }, props);
  return modalConfirm(config);
};

var warning = function warning(props) {
  var config = _extends({
    type: 'warning',
    iconType: 'exclamation-circle',
    okCancel: false
  }, props);
  return modalConfirm(config);
};
var warn = warning;

var confirm = function confirm(props) {
  var config = _extends({
    type: 'confirm',
    okCancel: true
  }, props);
  return modalConfirm(config);
};
Modal.info = info;
Modal.success = success;
Modal.error = error;
Modal.warning = warning;
Modal.warn = warn;
Modal.confirm = confirm;

export default Modal;