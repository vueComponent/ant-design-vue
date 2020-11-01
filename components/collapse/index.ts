import { App, Plugin } from 'vue';
import Collapse from './Collapse';
import CollapsePanel from './CollapsePanel';

Collapse.Panel = CollapsePanel;

/* istanbul ignore next */
Collapse.install = function(app: App) {
  app.component(Collapse.name, Collapse);
  app.component(CollapsePanel.name, CollapsePanel);
  return app;
};

export default Collapse as typeof Collapse &
  Plugin & {
    readonly Panel: typeof CollapsePanel;
  };
