import { defineComponent } from 'vue';

const Palette = defineComponent({
  name: 'Palette',
  props: ['prefixCls'],
  setup(props, { slots }) {
    return () => (
      <div
        class={`${props.prefixCls}-palette`}
        style={{
          position: 'relative',
        }}
      >
        {slots.default?.()}
      </div>
    );
  },
});

export default Palette;
