// export this package's api
import createForm from './createForm';
import createFormField from './createFormField';
import formShape from './propTypes';
import Vue from 'vue';
import antRefDirective from '../../_util/antRefDirective';
Vue.use(antRefDirective);

export { createForm, createFormField, formShape };