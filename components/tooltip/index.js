import ToolTip from './Tooltip';

/* istanbul ignore next */
ToolTip.install = function(app) {
  app.component(ToolTip.name, ToolTip);
  return app;
};

export default ToolTip;
