<script>
import Steps, { Step } from '../index';
import '../assets/index.less';
import '../assets/iconfont.less';

export default {
  data() {
    return {};
  },
  render() {
    return (
      <Steps current={1}>
        <Step title="步骤1">
          <i class={`rcicon rcicon-cloud`} slot="icon" />
        </Step>
        <Step title="步骤2" icon="apple" />
        <Step title="步骤3" icon="github" />
      </Steps>
    );
  },
};
</script>
