import type { App, Plugin } from 'vue';
import Collapse from './Collapse';
import CollapsePanel from './CollapsePanel';
export type { CollapseProps } from './Collapse';
export type { CollapsePanelProps } from './CollapsePanel';

Collapse.Panel = CollapsePanel;

/* istanbul ignore next */
Collapse.install = function (app: App) {
  app.component(Collapse.name, Collapse);
  app.component(CollapsePanel.name, CollapsePanel);
  return app;
};

export { CollapsePanel };
export default Collapse as typeof Collapse &
  Plugin & {
    readonly Panel: typeof CollapsePanel;
  };
