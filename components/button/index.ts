import type { App, Plugin } from 'vue';
import Button from './button';
import ButtonGroup from './button-group';

import type { ButtonProps, ButtonShape, ButtonType } from './buttonTypes';
import type { ButtonGroupProps } from './button-group';
import type { SizeType as ButtonSize } from '../config-provider';

export type { ButtonProps, ButtonShape, ButtonType, ButtonGroupProps, ButtonSize };

Button.Group = ButtonGroup;

/* istanbul ignore next */
Button.install = function (app: App) {
  app.component(Button.name, Button);
  app.component(ButtonGroup.name, ButtonGroup);
  return app;
};

export { ButtonGroup };

export default Button as typeof Button &
  Plugin & {
    readonly Group: typeof ButtonGroup;
  };
