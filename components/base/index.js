import antDirective from '../_util/antDirective';
const base = {};
const install = function(app) {
  // base.Vue = Vue;
  app.use(antDirective);
};
base.install = install;

export default base;
