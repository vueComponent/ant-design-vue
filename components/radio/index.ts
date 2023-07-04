import type { App, Plugin } from 'vue';
import Radio from './Radio';
import Group from './Group';
import Button from './RadioButton';
export type { RadioProps } from './Radio';
export type { RadioGroupProps } from './Group';
export type { RadioChangeEventTarget, RadioChangeEvent } from './interface';

Radio.Group = Group;
Radio.Button = Button;

/* istanbul ignore next */
Radio.install = function (app: App) {
  app.component(Radio.name, Radio);
  app.component(Radio.Group.name, Radio.Group);
  app.component(Radio.Button.name, Radio.Button);
  return app;
};

export { Button, Group, Button as RadioButton, Group as RadioGroup };
export default Radio as typeof Radio &
  Plugin & {
    readonly Group: typeof Group;
    readonly Button: typeof Button;
  };
