import { defineComponent } from 'vue';
import type { PresetDate } from './interface';

export default defineComponent({
  name: 'PresetPanel',
  props: {
    prefixCls: String,
    presets: {
      type: Array as () => PresetDate<any>[],
      default: () => [],
    },
    currentPreset: {
      type: Object as () => PresetDate<any> | null,
      default: null,
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
            {props.presets.map(preset => (
              <li
                key={preset.key}
                class={{
                  [`${props.prefixCls}-preset-active`]: props.currentPreset?.key === preset.key,
                }}
                onClick={e => {
                  e.stopPropagation();
                  props.onClick(preset.value, preset);
                }}
                onMouseenter={() => {
                  props.onHover?.(preset.value);
                }}
                onMouseleave={() => {
                  props.onHover?.(null);
                }}
              >
                {preset.label}
              </li>
            ))}
          </ul>
        </div>
      );
    };
  },
});
