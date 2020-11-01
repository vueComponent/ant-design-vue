import { App, Plugin } from 'vue';
import Dropdown from './dropdown';
import DropdownButton from './dropdown-button';

export { DropdownProps } from './dropdown';
export { DropdownButtonProps } from './dropdown-button';

Dropdown.Button = DropdownButton;

/* istanbul ignore next */
Dropdown.install = function(app: App) {
  app.component(Dropdown.name, Dropdown);
  app.component(DropdownButton.name, DropdownButton);
  return app;
};

export default Dropdown as typeof Dropdown &
  Plugin & {
    readonly Button: typeof DropdownButton;
  };
