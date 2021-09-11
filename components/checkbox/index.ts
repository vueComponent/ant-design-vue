import type { App, Plugin } from 'vue';
import Checkbox, { checkboxProps } from './Checkbox';
import CheckboxGroup from './Group';
export type { CheckboxProps } from './Checkbox';

Checkbox.Group = CheckboxGroup;

/* istanbul ignore next */
Checkbox.install = function (app: App) {
  app.component(Checkbox.name, Checkbox);
  app.component(CheckboxGroup.name, CheckboxGroup);
  return app;
};
export { CheckboxGroup, checkboxProps };
export default Checkbox as typeof Checkbox &
  Plugin & {
    readonly Group: typeof CheckboxGroup;
  };
