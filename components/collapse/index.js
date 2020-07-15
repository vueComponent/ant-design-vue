import Collapse from './Collapse';
import CollapsePanel from './CollapsePanel';

Collapse.Panel = CollapsePanel;

/* istanbul ignore next */
Collapse.install = function(app) {
  app.component(Collapse.name, Collapse);
  app.component(CollapsePanel.name, CollapsePanel);
};

export default Collapse;
