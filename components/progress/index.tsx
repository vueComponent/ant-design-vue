import { App } from 'vue';
import Progress from './progress';

export { ProgressProps } from './progress';

/* istanbul ignore next */
Progress.install = function(app: App) {
  app.component(Progress.name, Progress);
};

export default Progress;
