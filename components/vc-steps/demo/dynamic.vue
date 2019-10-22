<script>
import Steps, { Step } from '../index';
import '../assets/index.less';
import '../assets/iconfont.less';

export default {
  data() {
    return {
      steps: [
        {
          title: '已完成',
          description:
            '这里是多信息的描述啊描述啊描述啊描述啊哦耶哦耶哦耶哦耶哦耶哦耶哦耶哦耶哦耶哦耶哦耶哦耶',
        },
        {
          title: '进行中',
          description:
            '这里是多信息的描述啊描述啊描述啊描述啊哦耶哦耶哦耶哦耶哦耶哦耶哦耶哦耶哦耶哦耶哦耶哦耶',
        },
        {
          title: '待运行',
          description:
            '这里是多信息的描述啊描述啊描述啊描述啊哦耶哦耶哦耶哦耶哦耶哦耶哦耶哦耶哦耶哦耶哦耶哦耶',
        },
        {
          title: '待运行',
          description:
            '这里是多信息的描述啊描述啊描述啊描述啊哦耶哦耶哦耶哦耶哦耶哦耶哦耶哦耶哦耶哦耶哦耶哦耶',
        },
      ],
    };
  },
  methods: {
    addStep() {
      this.steps.push({
        title: '待运行',
        description: '新的节点',
      });
    },
  },
  render() {
    return (
      <div>
        <button onClick={this.addStep}>Add new step</button>
        <Steps>
          {this.steps.map((step, i) => (
            <Step key={i} title={step.title} description={step.description} />
          ))}
        </Steps>
      </div>
    );
  },
};
</script>
