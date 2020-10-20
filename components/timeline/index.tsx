import { App } from 'vue';
import Timeline from './Timeline';
import TimelineItem from './TimelineItem';

export { TimelineProps } from './Timeline';
export { TimeLineItemProps } from './TimelineItem';

Timeline.Item = TimelineItem;

/* istanbul ignore next */
Timeline.install = function(app: App) {
  app.component(Timeline.name, Timeline);
  app.component(TimelineItem.name, TimelineItem);
  return app;
};

export default Timeline as typeof Timeline & {
  readonly Item: typeof TimelineItem;
};
