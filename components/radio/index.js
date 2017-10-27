import Radio from './Radio.vue'
import RadioGroup from './Group.vue'

Radio.Group = RadioGroup
Radio.Button = {
  extends: Radio,
  props: {
    ...Radio.props,
    prefixCls: {
      default: 'ant-radio-button',
      type: String,
    },
  },
}
export default Radio

