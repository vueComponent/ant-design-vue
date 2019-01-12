import Modal from './Modal';
import modalConfirm from './confirm';

// export { ActionButtonProps } from './ActionButton'
// export { ModalProps, ModalFuncProps } from './Modal'

const info = function(props) {
  const config = {
    type: 'info',
    iconType: 'info-circle',
    okCancel: false,
    ...props,
  };
  return modalConfirm(config);
};

const success = function(props) {
  const config = {
    type: 'success',
    iconType: 'check-circle',
    okCancel: false,
    ...props,
  };
  return modalConfirm(config);
};

const error = function(props) {
  const config = {
    type: 'error',
    iconType: 'close-circle',
    okCancel: false,
    ...props,
  };
  return modalConfirm(config);
};

const warning = function(props) {
  const config = {
    type: 'warning',
    iconType: 'exclamation-circle',
    okCancel: false,
    ...props,
  };
  return modalConfirm(config);
};
const warn = warning;

const confirm = function(props) {
  const config = {
    type: 'confirm',
    okCancel: true,
    ...props,
  };
  return modalConfirm(config);
};
Modal.info = info;
Modal.success = success;
Modal.error = error;
Modal.warning = warning;
Modal.warn = warn;
Modal.confirm = confirm;

/* istanbul ignore next */
Modal.install = function(Vue) {
  Vue.component(Modal.name, Modal);
};

export default Modal;
