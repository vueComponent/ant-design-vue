// export this package's api
import createForm from './createForm';
import createFormField from './createFormField';
import formShape from './propTypes';
import Vue from 'vue';
import ref from 'vue-ref';

Vue.use(ref, { name: 'ant-ref' });

export { createFormField, formShape, createForm };
