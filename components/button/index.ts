import type { App, Plugin } from 'vue';
import Button from './button';
import AButtonGroup from './button-group';

import type { ButtonProps, ButtonShape, ButtonType } from './buttonTypes';
import type { ButtonGroupProps } from './button-group';
import type { SizeType as ButtonSize } from '../config-provider';

export type { ButtonProps, ButtonShape, ButtonType, ButtonGroupProps, ButtonSize };

Button.Group = AButtonGroup;

/* istanbul ignore next */
Button.install = function (app: App) {
  app.component(Button.name, Button);
  app.component(AButtonGroup.name, AButtonGroup);
  return app;
};

export { AButtonGroup };

export default Button as typeof Button &
  Plugin & {
    readonly Group: typeof AButtonGroup;
  };
