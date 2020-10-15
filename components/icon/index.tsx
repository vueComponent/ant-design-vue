import { App } from 'vue';
import warning from '../_util/warning';

const Icon = () => {
  warning(false, 'Icon', 'Empty Icon');
  return null;
};

Icon.displayName = 'AIcon';

/* istanbul ignore next */
Icon.install = function(app: App) {
  app.component(Icon.displayName, Icon);
  return app;
};

export default Icon;
