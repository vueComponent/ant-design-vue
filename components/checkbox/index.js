import Checkbox from './Checkbox';
import CheckboxGroup from './Group';
import Base from '../base';

Checkbox.Group = CheckboxGroup;

/* istanbul ignore next */
Checkbox.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Checkbox.name, Checkbox);
  Vue.component(CheckboxGroup.name, CheckboxGroup);
};

export default Checkbox;
