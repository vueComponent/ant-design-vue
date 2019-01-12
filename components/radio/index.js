import Radio from './Radio';
import Group from './Group';
import Button from './RadioButton';

Radio.Group = Group;
Radio.Button = Button;

/* istanbul ignore next */
Radio.install = function(Vue) {
  Vue.component(Radio.name, Radio);
  Vue.component(Radio.Group.name, Radio.Group);
  Vue.component(Radio.Button.name, Radio.Button);
};

export { Button, Group };
export default Radio;
