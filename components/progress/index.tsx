import Progress from './progress';
import { App } from 'vue';
export { ProgressProps } from './progress';

/* istanbul ignore next */
Progress.install = function(app: App) {
  app.component(Progress.name, Progress);
};

export default Progress;
