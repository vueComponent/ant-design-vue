import Vue from 'vue';
import ConfirmDialog from './ConfirmDialog';
import { destroyFns } from './Modal';
import Base from '../base';
import Omit from 'omit.js';

export default function confirm(config) {
  const div = document.createElement('div');
  const el = document.createElement('div');
  div.appendChild(el);
  document.body.appendChild(div);
  let currentConfig = { ...Omit(config, ['parentContext']), close, visible: true };

  let confirmDialogInstance = null;
  const confirmDialogProps = { props: {} };
  function close(...args) {
    destroy(...args);
  }
  function update(newConfig) {
    currentConfig = {
      ...currentConfig,
      ...newConfig,
    };
    confirmDialogProps.props = currentConfig;
  }
  function destroy(...args) {
    if (confirmDialogInstance && div.parentNode) {
      confirmDialogInstance.$destroy();
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
    confirmDialogProps.props = props;
    const V = Base.Vue || Vue;
    return new V({
      el: el,
      parent: config.parentContext,
      data() {
        return { confirmDialogProps };
      },
      render() {
        // 先解构，避免报错，原因不详
        const cdProps = { ...this.confirmDialogProps };
        return <ConfirmDialog {...cdProps} />;
      },
    });
  }

  confirmDialogInstance = render(currentConfig);
  destroyFns.push(close);
  return {
    destroy: close,
    update,
  };
}
