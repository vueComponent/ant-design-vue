import type { App, Plugin } from 'vue';
import Badge from './Badge';
import Ribbon from './Ribbon';
export type { BadgeProps } from './Badge';

Badge.install = function (app: App) {
  app.component(Badge.name, Badge);
  app.component(Ribbon.name, Ribbon);
  return app;
};

export { Ribbon as BadgeRibbon };

export default Badge as typeof Badge &
  Plugin & {
    readonly Ribbon: typeof Ribbon;
  };
