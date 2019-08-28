import Dropdown from './dropdown';
import DropdownButton from './dropdown-button';

export { DropdownProps } from './dropdown';
export { DropdownButtonProps } from './dropdown-button';
import Base from '../base';

Dropdown.Button = DropdownButton;

/* istanbul ignore next */
Dropdown.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Dropdown.name, Dropdown);
  Vue.component(DropdownButton.name, DropdownButton);
};

export default Dropdown;
