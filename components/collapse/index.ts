import type { App, Plugin } from 'vue';
import Collapse, { collapseProps } from './Collapse';
import ACollapsePanel, { collapsePanelProps } from './CollapsePanel';
export type { CollapseProps } from './Collapse';
export type { CollapsePanelProps } from './CollapsePanel';

Collapse.Panel = ACollapsePanel;

/* istanbul ignore next */
Collapse.install = function (app: App) {
  app.component(Collapse.name, Collapse);
  app.component(ACollapsePanel.name, ACollapsePanel);
  return app;
};

export { ACollapsePanel, collapseProps, collapsePanelProps };
export default Collapse as typeof Collapse &
  Plugin & {
    readonly Panel: typeof ACollapsePanel;
  };
