import { App, Plugin } from 'vue';
import Badge from './Badge';
import Ribbon from './Ribbon';

Badge.install = function(app: App) {
  app.component(Badge.name, Badge);
  app.component(Ribbon.name, Ribbon);
  return app;
};

export default Badge as typeof Badge &
  Plugin & {
    readonly Ribbon: typeof Ribbon;
  };
