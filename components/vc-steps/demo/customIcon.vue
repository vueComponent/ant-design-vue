<script>
import Steps, { Step } from '../index'
import '../assets/index.less'
import '../assets/iconfont.less'

export default {
  data () {
    return {

    }
  },
  render () {
    const Icon = ({ type }) => <i className={`rcicon rcicon-${type}`} />
    return (
      <Steps current={1}>
        <Step title='步骤1' icon={<Icon type='cloud' />} />
        <Step title='步骤2' icon='apple' />
        <Step title='步骤3' icon='github' />
      </Steps>
    )
  },
}
</script>
