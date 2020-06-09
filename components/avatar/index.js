import Avatar from './Avatar';

/* istanbul ignore next */
Avatar.install = function(app) {
  app.component(Avatar.name, Avatar);
};

export default Avatar;
