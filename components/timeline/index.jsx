import Timeline from './Timeline';
import TimelineItem from './TimelineItem';
import Base from '../base';

export { TimelineProps } from './Timeline';
export { TimeLineItemProps } from './TimelineItem';

Timeline.Item = TimelineItem;

/* istanbul ignore next */
Timeline.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Timeline.name, Timeline);
  Vue.component(TimelineItem.name, TimelineItem);
};

export default Timeline;
