import ColorPicker from './ColorPicker';
/* istanbul ignore next */
ColorPicker.install = function (app) {
  app.component(ColorPicker.name, ColorPicker);
  return app;
};

export default ColorPicker;
