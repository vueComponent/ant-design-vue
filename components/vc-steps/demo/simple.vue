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
      <div>
        <Steps current={1}>
          <Step title="已完成" />
          <Step title="进行中" />
          <Step title="待运行" />
          <Step title="待运行" />
        </Steps>
        <Steps current={1} style={{ marginTop: 40 }}>
          <Step title="已完成" description={description} />
          <Step title="进行中" description={description} />
          <Step title="待运行" description={description} />
          <Step title="待运行" description={description} />
        </Steps>
        <Steps current={1} style={{ marginTop: 40 }} status="error">
          <Step title="已完成" description={description} />
          <Step title="进行中" description={description} />
          <Step title="待运行" description={description} />
          <Step title="待运行" description={description} />
        </Steps>
      </div>
    );
  },
};
</script>
