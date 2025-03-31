import type { App, Plugin } from 'vue';
import FloatButton from './FloatButton';
import AFloatButtonGroup from './FloatButtonGroup';
import ABackTop from './BackTop';

import type {
  FloatButtonProps,
  FloatButtonShape,
  FloatButtonType,
  FloatButtonGroupProps,
  BackTopProps,
} from './interface';

import type { SizeType as FloatButtonSize } from '../config-provider';

export type {
  FloatButtonProps,
  FloatButtonShape,
  FloatButtonType,
  FloatButtonGroupProps,
  BackTopProps,
  FloatButtonSize,
};

FloatButton.Group = AFloatButtonGroup;
FloatButton.BackTop = ABackTop;

/* istanbul ignore next */
FloatButton.install = function (app: App) {
  app.component(FloatButton.name, FloatButton);
  app.component(AFloatButtonGroup.name, AFloatButtonGroup);
  app.component(ABackTop.name, ABackTop);
  return app;
};

export { AFloatButtonGroup, ABackTop };

export default FloatButton as typeof FloatButton &
  Plugin & {
    readonly Group: typeof AFloatButtonGroup;
    readonly BackTop: typeof ABackTop;
  };
