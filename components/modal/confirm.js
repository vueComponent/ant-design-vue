import Vue from 'vue';
import ConfirmDialog from './ConfirmDialog';

export default function confirm(config) {
  const div = document.createElement('div');
  const el = document.createElement('div');
  div.appendChild(el);
  document.body.appendChild(div);
  let currentConfig = { ...config, close, visible: true };

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
  }

  function render(props) {
    confirmDialogProps.props = props;
    return new Vue({
      el: el,
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

  return {
    destroy: close,
    update,
  };
}
