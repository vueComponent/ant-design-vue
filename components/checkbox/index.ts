import type { App, Plugin } from 'vue';
import Checkbox from './Checkbox';
import ACheckboxGroup from './Group';
export type { CheckboxProps, CheckboxGroupProps, CheckboxOptionType } from './interface';
export { checkboxProps, checkboxGroupProps } from './interface';

Checkbox.Group = ACheckboxGroup;

/* istanbul ignore next */
Checkbox.install = function (app: App) {
  app.component(Checkbox.name, Checkbox);
  app.component(ACheckboxGroup.name, ACheckboxGroup);
  return app;
};
export { ACheckboxGroup };
export default Checkbox as typeof Checkbox &
  Plugin & {
    readonly Group: typeof ACheckboxGroup;
  };
