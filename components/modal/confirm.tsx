import { createVNode, render as vueRender } from 'vue';
import ConfirmDialog from './ConfirmDialog';
import type { ModalFuncProps } from './Modal';
import { destroyFns } from './Modal';
import ConfigProvider, { globalConfig } from '../config-provider';
import omit from '../_util/omit';

const defaultRootPrefixCls = '';

function getRootPrefixCls() {
  return defaultRootPrefixCls;
}

const confirm = (config: ModalFuncProps) => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  let currentConfig = {
    ...omit(config, ['parentContext', 'appContext']),
    close,
    visible: true,
  } as any;

  let confirmDialogInstance = null;
  function close(this: typeof close, ...args: any[]) {
    currentConfig = {
      ...currentConfig,
      visible: false,
      afterClose: destroy.bind(this, ...args),
    };
    update(currentConfig);
  }
  function update(newConfig: ModalFuncProps) {
    currentConfig = {
      ...currentConfig,
      ...newConfig,
    };
    if (confirmDialogInstance) {
      Object.assign(confirmDialogInstance.component.props, currentConfig);
      confirmDialogInstance.component.update();
    }
  }
  function destroy(...args: any[]) {
    if (confirmDialogInstance && div.parentNode) {
      // destroy
      vueRender(null, div);
      confirmDialogInstance.component.update();
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
  const Wrapper = (p: ModalFuncProps) => {
    const { getPrefixCls } = globalConfig();
    const rootPrefixCls = getPrefixCls(undefined, getRootPrefixCls());
    const prefixCls = p.prefixCls || `${rootPrefixCls}-modal`;
    return (
      <ConfigProvider prefixCls={rootPrefixCls}>
        <ConfirmDialog {...p} prefixCls={prefixCls}></ConfirmDialog>
      </ConfigProvider>
    );
  };
  function render(props: ModalFuncProps) {
    const vm = createVNode(Wrapper, { ...props });
    vm.appContext = config.parentContext || config.appContext || vm.appContext;
    vueRender(vm, div);
    return vm;
  }

  confirmDialogInstance = render(currentConfig);
  destroyFns.push(close);
  return {
    destroy: close,
    update,
  };
};

export default confirm;
