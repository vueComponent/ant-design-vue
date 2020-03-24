import Modal, { destroyFns } from './Modal';
import modalConfirm from './confirm';
import InfoCircleOutlined from '@ant-design/icons-vue/InfoCircleOutlined';
import CheckCircleOutlined from '@ant-design/icons-vue/CheckCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons-vue/CloseCircleOutlined';
import ExclamationCircleOutlined from '@ant-design/icons-vue/ExclamationCircleOutlined';
import Base from '../base';

// export { ActionButtonProps } from './ActionButton'
// export { ModalProps, ModalFuncProps } from './Modal'

const info = function(props) {
  const config = {
    type: 'info',
    icon: h => {
      return <InfoCircleOutlined />;
    },
    okCancel: false,
    ...props,
  };
  return modalConfirm(config);
};

const success = function(props) {
  const config = {
    type: 'success',
    icon: h => {
      return <CheckCircleOutlined />;
    },
    okCancel: false,
    ...props,
  };
  return modalConfirm(config);
};

const error = function(props) {
  const config = {
    type: 'error',
    icon: h => {
      return <CloseCircleOutlined />;
    },
    okCancel: false,
    ...props,
  };
  return modalConfirm(config);
};

const warning = function(props) {
  const config = {
    type: 'warning',
    icon: h => {
      return <ExclamationCircleOutlined />;
    },
    okCancel: false,
    ...props,
  };
  return modalConfirm(config);
};
const warn = warning;

const confirm = function confirmFn(props) {
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

Modal.destroyAll = function destroyAllFn() {
  while (destroyFns.length) {
    const close = destroyFns.pop();
    if (close) {
      close();
    }
  }
};

/* istanbul ignore next */
Modal.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Modal.name, Modal);
};

export default Modal;
