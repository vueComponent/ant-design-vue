import Checkbox from './Checkbox';
import CheckboxGroup from './Group';

Checkbox.Group = CheckboxGroup;

/* istanbul ignore next */
Checkbox.install = function(app) {
  app.component(Checkbox.name, Checkbox);
  app.component(CheckboxGroup.name, CheckboxGroup);
};

export default Checkbox;
