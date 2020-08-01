import { createApp } from 'vue';
import ConfirmDialog from './ConfirmDialog';
import { destroyFns } from './Modal';

import Omit from 'omit.js';

export default function confirm(config) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  let currentConfig = { ...Omit(config, ['parentContext']), close, visible: true };

  let confirmDialogInstance = null;
  let confirmDialogProps = {};
  function close(...args) {
    currentConfig = {
      ...currentConfig,
      visible: false,
      afterClose: destroy.bind(this, ...args),
    };
    update(currentConfig);
  }
  function update(newConfig) {
    currentConfig = {
      ...currentConfig,
      ...newConfig,
    };
    confirmDialogInstance &&
      Object.assign(confirmDialogInstance, { confirmDialogProps: currentConfig });
  }
  function destroy(...args) {
    if (confirmDialogInstance && div.parentNode) {
      confirmDialogInstance.vIf = false; // hack destroy
      confirmDialogInstance = null;
      div.parentNode.removeChild(div);
    }
    const triggerCancel = args.some(param => param && param.triggerCancel);
    if (config.onCancel && triggerCancel) {
      config.onCancel(...args);
    }
    for (let i = 0; i < destroyFns.length; i++) {
      const fn = destroyFns[i];
      if (fn === close) {
        destroyFns.splice(i, 1);
        break;
      }
    }
  }

  function render(props) {
    confirmDialogProps = props;
    return createApp({
      parent: config.parentContext,
      data() {
        return { confirmDialogProps, vIf: true };
      },
      render() {
        // 先解构，避免报错，原因不详
        const cdProps = { ...this.confirmDialogProps };
        return this.vIf ? <ConfirmDialog {...cdProps} /> : null;
      },
    }).mount(div);
  }

  confirmDialogInstance = render(currentConfig);
  destroyFns.push(close);
  return {
    destroy: close,
    update,
  };
}
