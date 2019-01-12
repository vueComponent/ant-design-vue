import ToolTip from './Tooltip';

/* istanbul ignore next */
ToolTip.install = function(Vue) {
  Vue.component(ToolTip.name, ToolTip);
};

export default ToolTip;
