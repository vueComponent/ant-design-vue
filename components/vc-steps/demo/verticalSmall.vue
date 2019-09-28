<script>
import Steps, { Step } from '../index';
import '../assets/index.less';
import '../assets/iconfont.less';

export default {
  data() {
    return {
      description:
        '这里是多信息的描述啊这里是多信息的描述啊这里是多信息的描述啊这里是多信息的描述啊这里是多信息的描述啊',
    };
  },
  render() {
    const { description } = this;
    return (
      <Steps direction="vertical" size="small">
        <Step title="已完成" description={description} />
        <Step title="进行中" description={description} />
        <Step title="待运行" description={description} />
        <Step title="待运行" description={description} />
        <Step title="待运行" description={description} />
      </Steps>
    );
  },
};
</script>
