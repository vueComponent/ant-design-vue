import type { App } from 'vue';
import Segmented from './src';
import type { SegmentedProps } from './src';

Segmented.install = function (app: App) {
  app.component(Segmented.name, Segmented);
  return app;
};
export default Segmented;
export type { SegmentedProps };
