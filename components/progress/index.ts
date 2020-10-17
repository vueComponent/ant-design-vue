import { App } from 'vue';
import Progress from './progress';

export { ProgressProps } from './props';

/* istanbul ignore next */
Progress.install = function(app: App) {
  app.component(Progress.name, Progress);
  return app;
};

export default Progress;
