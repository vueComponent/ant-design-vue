import Collapse from './Collapse';
import CollapsePanel from './CollapsePanel';

Collapse.Panel = CollapsePanel;

/* istanbul ignore next */
Collapse.install = function(Vue) {
  Vue.component(Collapse.name, Collapse);
  Vue.component(CollapsePanel.name, CollapsePanel);
};

export default Collapse;
