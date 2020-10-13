import { App } from 'vue';
import Avatar from './Avatar';

/* istanbul ignore next */
Avatar.install = function(app: App) {
  app.component(Avatar.name, Avatar);
  return app;
};

export default Avatar;
