import antDirective from '../_util/antDirective';
const base = {};
const install = function(Vue) {
  base.Vue = Vue;
  Vue.use(antDirective);
};
base.install = install;

export default base;
