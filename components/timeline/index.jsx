import Timeline from './Timeline';
import TimelineItem from './TimelineItem';

export { TimelineProps } from './Timeline';
export { TimeLineItemProps } from './TimelineItem';

Timeline.Item = TimelineItem;

/* istanbul ignore next */
Timeline.install = function(app) {
  app.component(Timeline.name, Timeline);
  app.component(TimelineItem.name, TimelineItem);
};

export default Timeline;
