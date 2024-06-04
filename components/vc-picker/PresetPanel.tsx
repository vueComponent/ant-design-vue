import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PresetPanel',
  props: {
    prefixCls: String,
    presets: {
      type: Array,
      default: () => [],
    },
    onClick: Function,
    onHover: Function,
  },
  setup(props) {
    return () => {
      if (!props.presets.length) {
        return null;
      }
      return (
        <div class={`${props.prefixCls}-presets`}>
          <ul>
            {props.presets.map(({ label, value }, index) => (
              <li
                key={index}
                onClick={e => {
                  e.stopPropagation();
                  props.onClick(value);
                }}
                onMouseenter={() => {
                  props.onHover?.(value);
                }}
                onMouseleave={() => {
                  props.onHover?.(null);
                }}
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      );
    };
  },
});
