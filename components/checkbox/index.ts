import type { App, Plugin } from 'vue';
import Checkbox from './Checkbox';
import CheckboxGroup from './Group';
export type { CheckboxProps, CheckboxGroupProps, CheckboxOptionType } from './interface';
export { checkboxProps, checkboxGroupProps } from './interface';

Checkbox.Group = CheckboxGroup;

/* istanbul ignore next */
Checkbox.install = function (app: App) {
  app.component(Checkbox.name, Checkbox);
  app.component(CheckboxGroup.name, CheckboxGroup);
  return app;
};
export { CheckboxGroup };
export default Checkbox as typeof Checkbox &
  Plugin & {
    readonly Group: typeof CheckboxGroup;
  };
