// export this package's api
// base 2.9.3
import Vue from 'vue';
import TreeSelect from './src';
import ref from 'vue-ref';

Vue.use(ref, { name: 'ant-ref' });
export default TreeSelect;

export { TreeNode, SHOW_ALL, SHOW_PARENT, SHOW_CHILD } from './src';
