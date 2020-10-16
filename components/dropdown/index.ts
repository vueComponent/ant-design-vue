import { App } from 'vue';
import Dropdown from './dropdown';
import DropdownButton from './dropdown-button';

export { DropdownProps } from './dropdown';
export { DropdownButtonProps } from './dropdown-button';

type Types = typeof Dropdown;
interface DropdownTypes extends Types {
  Button: typeof DropdownButton;
}

Dropdown.Button = DropdownButton;

/* istanbul ignore next */
Dropdown.install = function(app: App) {
  app.component(Dropdown.name, Dropdown);
  app.component(DropdownButton.name, DropdownButton);
  return app;
};

export default Dropdown as DropdownTypes;
