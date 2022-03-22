import type { App } from 'vue';

import * as components from './components';
import { default as version } from './version';
export * from './components';

export const aGlobalProperties = {
  $message: components.message,
  $notification: components.notification,
  $info: components.Modal.info,
  $success: components.Modal.success,
  $error: components.Modal.error,
  $warning: components.Modal.warning,
  $confirm: components.Modal.confirm,
  $destroyAll: components.Modal.destroyAll,
};

export const install = function (app: App) {
  Object.keys(components).forEach(key => {
    const component = components[key];
    if (component.install) {
      app.use(component);
    }
  });

  Object.keys(aGlobalProperties).forEach(key => {
    app.config.globalProperties[key] = aGlobalProperties[key];
  });

  return app;
};

export type AComponentCustomProperties = typeof aGlobalProperties;

export { version };

export default {
  version,
  install,
};
