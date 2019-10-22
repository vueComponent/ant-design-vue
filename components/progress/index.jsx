import Progress from './progress';
import Base from '../base';

export { ProgressProps } from './progress';

/* istanbul ignore next */
Progress.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Progress.name, Progress);
};

export default Progress;
