import Vue from 'vue'
import Input from './Input'
import Group from './Group'
import Search from './Search'
import TextArea from './TextArea'
import antInputDirective from '../_util/antInputDirective'

Vue.use(antInputDirective)

Input.Group = Group
Input.Search = Search
Input.TextArea = TextArea
export default Input
