import Badge from './Badge';

/* istanbul ignore next */
Badge.install = function(app) {
  app.component(Badge.name, Badge);
};

export default Badge;
