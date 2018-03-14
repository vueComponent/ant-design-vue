import Radio from './Radio'
import Group from './Group'

const Button = {
  extends: Radio,
  props: {
    ...Radio.props,
    prefixCls: {
      default: 'ant-radio-button',
      type: String,
    },
  },
}
Radio.Group = Group
Radio.Button = Button
export { Button, Group }
export default Radio

