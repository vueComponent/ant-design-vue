import type { App, Plugin } from 'vue';
import Timeline from './Timeline';
import TimelineItem from './TimelineItem';

export type { TimelineProps } from './Timeline';
export type { TimelineItemProps } from './TimelineItem';

Timeline.Item = TimelineItem;

/* istanbul ignore next */
Timeline.install = function (app: App) {
  app.component(Timeline.name, Timeline);
  app.component(TimelineItem.name, TimelineItem);
  return app;
};
export { TimelineItem };
export default Timeline as typeof Timeline &
  Plugin & {
    readonly Item: typeof TimelineItem;
  };
