import _extends from 'babel-runtime/helpers/extends';
import Radio from './Radio';
import Group from './Group';

var Button = {
  'extends': Radio,
  name: 'ARadioButton',
  props: _extends({}, Radio.props, {
    prefixCls: {
      'default': 'ant-radio-button',
      type: String
    }
  })
};
Radio.Group = Group;
Radio.Button = Button;
export { Button, Group };
export default Radio;