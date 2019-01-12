import Vue from 'vue';
import Input from './Input';
import Group from './Group';
import Search from './Search';
import TextArea from './TextArea';
import antInputDirective from '../_util/antInputDirective';

Vue.use(antInputDirective);

Input.Group = Group;
Input.Search = Search;
Input.TextArea = TextArea;

/* istanbul ignore next */
Input.install = function(Vue) {
  Vue.component(Input.name, Input);
  Vue.component(Input.Group.name, Input.Group);
  Vue.component(Input.Search.name, Input.Search);
  Vue.component(Input.TextArea.name, Input.TextArea);
};

export default Input;
