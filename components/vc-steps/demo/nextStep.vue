<script>
import Steps, { Step } from '../index';
import '../assets/index.less';
import '../assets/iconfont.less';

function generateRandomSteps() {
  const n = Math.floor(Math.random() * 3) + 3;
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push({
      title: `步骤${i + 1}`,
    });
  }
  return arr;
}
const steps = generateRandomSteps();
export default {
  data() {
    return {
      currentStep: Math.floor(Math.random() * steps.length),
    };
  },
  methods: {
    nextStep() {
      let s = this.currentStep + 1;
      if (s === steps.length) {
        s = 0;
      }
      this.currentStep = s;
    },
  },
  render() {
    const cs = this.currentStep;
    return (
      <form class="my-step-form">
        <div>这个demo随机生成3~6个步骤，初始随机进行到其中一个步骤</div>
        <div>当前正在执行第{cs + 1}步</div>
        <div class="my-step-container">
          <Steps current={cs}>
            {steps.map((s, i) => {
              return <Step key={i} title={s.title} />;
            })}
          </Steps>
        </div>

        <div>
          <button type="button" onClick={this.nextStep}>
            下一步
          </button>
        </div>
      </form>
    );
  },
};
</script>
<style>
.my-step-form {
  width: 100%;
}
.my-step-form > div {
  margin-bottom: 20px;
}
.my-step-container {
  width: 100%;
}
</style>
