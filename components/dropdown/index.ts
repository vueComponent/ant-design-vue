import type { App, Plugin } from 'vue';
import Dropdown from './dropdown';
import ADropdownButton from './dropdown-button';
import { dropdownProps, dropdownButtonProps } from './props';
export type { DropdownProps } from './dropdown';
export type { DropdownButtonProps } from './dropdown-button';

Dropdown.Button = ADropdownButton;

/* istanbul ignore next */
Dropdown.install = function (app: App) {
  app.component(Dropdown.name, Dropdown);
  app.component(ADropdownButton.name, ADropdownButton);
  return app;
};

export { ADropdownButton, dropdownProps, dropdownButtonProps };

export default Dropdown as typeof Dropdown &
  Plugin & {
    readonly Button: typeof ADropdownButton;
  };
