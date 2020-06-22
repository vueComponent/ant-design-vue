import Dropdown from './dropdown';
import DropdownButton from './dropdown-button';

export { DropdownProps } from './dropdown';
export { DropdownButtonProps } from './dropdown-button';

Dropdown.Button = DropdownButton;

/* istanbul ignore next */
Dropdown.install = function(app) {
  app.component(Dropdown.name, Dropdown);
  app.component(DropdownButton.name, DropdownButton);
};

export default Dropdown;
