import Dropdown from './dropdown';
import DropdownButton from './dropdown-button';

export { DropdownProps } from './dropdown';
export { DropdownButtonProps } from './dropdown-button';

Dropdown.Button = DropdownButton;

/* istanbul ignore next */
Dropdown.install = function(Vue) {
  Vue.component(Dropdown.name, Dropdown);
  Vue.component(DropdownButton.name, DropdownButton);
};

export default Dropdown;
