import Button from './button';
import ButtonGroup from './button-group';

Button.Group = ButtonGroup;

/* istanbul ignore next */
Button.install = function(Vue) {
  Vue.component(Button.name, Button);
  Vue.component(ButtonGroup.name, ButtonGroup);
};

export default Button;
