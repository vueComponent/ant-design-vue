import Timeline from './Timeline';

export { TimelineProps } from './Timeline';
export { TimeLineItemProps } from './TimelineItem';
import TimelineItem from './TimelineItem';

Timeline.Item = TimelineItem;

/* istanbul ignore next */
Timeline.install = function(Vue) {
  Vue.component(Timeline.name, Timeline);
  Vue.component(TimelineItem.name, TimelineItem);
};

export default Timeline;
