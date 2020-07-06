import ColorPicker from './ColorPicker';
import Base from '../base';
/* istanbul ignore next */
ColorPicker.install = function(Vue) {
  Vue.use(Base);
  Vue.component(ColorPicker.name, ColorPicker);
};

export default ColorPicker;
