import type { TransformOffset } from '../interface';
import { defineComponent, shallowRef } from 'vue';

const Transform = defineComponent({
  name: 'Transform',
  props: ['offset'],
  setup(
    props: {
      offset: TransformOffset;
    },
    { slots, expose },
  ) {
    const transformDomRef = shallowRef<HTMLDivElement>();
    expose({
      transformDomRef,
    });
    return () => (
      <div
        ref={transformDomRef}
        style={{
          position: 'absolute',
          left: `${props.offset.x}px`,
          top: `${props.offset.y}px`,
          zIndex: 1,
        }}
      >
        {slots.default?.()}
      </div>
    );
  },
});
export default Transform;
