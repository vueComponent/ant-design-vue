import type { App, Plugin } from 'vue';
import Timeline, { timelineProps } from './Timeline';
import TimelineItem, { timelineItemProps } from './TimelineItem';

export type { TimelineProps } from './Timeline';
export type { TimelineItemProps } from './TimelineItem';

Timeline.Item = TimelineItem;

/* istanbul ignore next */
Timeline.install = function (app: App) {
  app.component(Timeline.name, Timeline);
  app.component(TimelineItem.name, TimelineItem);
  return app;
};
export { TimelineItem, timelineProps, timelineItemProps };
export default Timeline as typeof Timeline &
  Plugin & {
    readonly Item: typeof TimelineItem;
  };
