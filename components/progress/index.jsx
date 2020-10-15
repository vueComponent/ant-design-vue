import Progress from './progress';

export { ProgressProps } from './progress';

/* istanbul ignore next */
Progress.install = function(app) {
  app.component(Progress.name, Progress);
  return app;
};

export default Progress;
