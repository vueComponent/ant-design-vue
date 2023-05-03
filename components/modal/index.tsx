import type { App, Plugin } from 'vue';
import type { ModalFunc, ModalFuncProps } from './Modal';
import Modal from './Modal';
import confirm, { withWarn, withInfo, withSuccess, withError, withConfirm } from './confirm';
import useModal from './useModal';
import destroyFns from './destroyFns';
export type { ActionButtonProps } from '../_util/ActionButton';
export type { ModalProps, ModalFuncProps } from './Modal';

function modalWarn(props: ModalFuncProps) {
  return confirm(withWarn(props));
}
Modal.useModal = useModal;
Modal.info = function infoFn(props: ModalFuncProps) {
  return confirm(withInfo(props));
};

Modal.success = function successFn(props: ModalFuncProps) {
  return confirm(withSuccess(props));
};

Modal.error = function errorFn(props: ModalFuncProps) {
  return confirm(withError(props));
};

Modal.warning = modalWarn;

Modal.warn = modalWarn;

Modal.confirm = function confirmFn(props: ModalFuncProps) {
  return confirm(withConfirm(props));
};

Modal.destroyAll = function destroyAllFn() {
  while (destroyFns.length) {
    const close = destroyFns.pop();
    if (close) {
      close();
    }
  }
};

/* istanbul ignore next */
Modal.install = function (app: App) {
  app.component(Modal.name, Modal);
  return app;
};

export default Modal as typeof Modal &
  Plugin & {
    readonly info: ModalFunc;

    readonly success: ModalFunc;

    readonly error: ModalFunc;

    readonly warn: ModalFunc;

    readonly warning: ModalFunc;

    readonly confirm: ModalFunc;

    readonly destroyAll: () => void;

    readonly useModal: typeof useModal;
  };
