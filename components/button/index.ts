import { App, Plugin } from 'vue';
import Button from './button';
import ButtonGroup from './button-group';
export type {ButtonProps} from './button'

Button.Group = ButtonGroup;

/* istanbul ignore next */
Button.install = function(app: App) {
  app.component(Button.name, Button);
  app.component(ButtonGroup.name, ButtonGroup);
  return app;
};
export {ButtonGroup}
export default Button as typeof Button &
  Plugin & {
    readonly Group: typeof ButtonGroup;
  };
