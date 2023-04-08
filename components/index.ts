import type { App } from 'vue';

import * as components from './components';
import { default as version } from './version';
import cssinjs from './_util/cssinjs';
export * from './components';
export * from './_util/cssinjs';

export { default as theme } from './theme';
export const install = function (app: App) {
  Object.keys(components).forEach(key => {
    const component = components[key];
    if (component.install) {
      app.use(component);
    }
  });
  app.use(cssinjs.StyleProvider);
  app.config.globalProperties.$message = components.message;
  app.config.globalProperties.$notification = components.notification;
  app.config.globalProperties.$info = components.Modal.info;
  app.config.globalProperties.$success = components.Modal.success;
  app.config.globalProperties.$error = components.Modal.error;
  app.config.globalProperties.$warning = components.Modal.warning;
  app.config.globalProperties.$confirm = components.Modal.confirm;
  app.config.globalProperties.$destroyAll = components.Modal.destroyAll;
  return app;
};

export { version, cssinjs };

export default {
  version,
  install,
};
