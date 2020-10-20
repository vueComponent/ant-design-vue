import { App } from 'vue';
import Radio from './Radio';
import Group from './Group';
import Button from './RadioButton';

Radio.Group = Group;
Radio.Button = Button;

/* istanbul ignore next */
Radio.install = function(app: App) {
  app.component(Radio.name, Radio);
  app.component(Radio.Group.name, Radio.Group);
  app.component(Radio.Button.name, Radio.Button);
  return app;
};

export { Button, Group };
export default Radio;
