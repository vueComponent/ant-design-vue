import { defineComponent } from 'vue';
import DefaultPanel from './DefaultPanel';
import { tourStepProps } from '../interface';

const TourStep = defineComponent({
  name: 'TourStep',
  inheritAttrs: false,
  props: tourStepProps(),
  setup(props, { attrs }) {
    return () => {
      const { current, renderPanel } = props;

      return (
        <>
          {typeof renderPanel === 'function' ? (
            renderPanel({ ...attrs, ...props }, current)
          ) : (
            <DefaultPanel {...attrs} {...props} />
          )}
        </>
      );
    };
  },
});

export default TourStep;
