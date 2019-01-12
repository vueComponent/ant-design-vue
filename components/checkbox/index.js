import Checkbox from './Checkbox';
import CheckboxGroup from './Group';

Checkbox.Group = CheckboxGroup;

/* istanbul ignore next */
Checkbox.install = function(Vue) {
  Vue.component(Checkbox.name, Checkbox);
  Vue.component(CheckboxGroup.name, CheckboxGroup);
};

export default Checkbox;
