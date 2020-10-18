import { App } from 'vue';
import ToolTip from './Tooltip';

/* istanbul ignore next */
ToolTip.install = function(app: App) {
  app.component(ToolTip.name, ToolTip);
  return app;
};

export default ToolTip;
