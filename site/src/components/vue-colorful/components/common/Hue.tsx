import type { PropType } from 'vue';
import { defineComponent, toRefs } from 'vue';

import type { Interaction } from './Interactive';
import { Interactive } from './Interactive';
import { Pointer } from './Pointer';

import { hsvaToHslString } from '../../utils/convert';
import { formatClassName } from '../../utils/format';
import { clamp } from '../../utils/clamp';
import { round } from '../../utils/round';

export interface Props {
  className?: string;
  hue: number;
  onChange: (newHue: { h: number }) => void;
}

export const Hue = defineComponent({
  name: 'Hue',
  props: {
    hue: { type: Number },
    onChange: { type: Function as PropType<(newHue: { h: number }) => void> },
  },
  setup(props, { attrs }) {
    const { hue } = toRefs(props);

    const handleMove = (interaction: Interaction) => {
      props.onChange({ h: 360 * interaction.left });
    };

    const handleKey = (offset: Interaction) => {
      // Hue measured in degrees of the color circle ranging from 0 to 360
      props.onChange({
        h: clamp(hue.value + offset.left * 360, 0, 360),
      });
    };
    return () => {
      const nodeClassName = formatClassName(['vue-colorful__hue', attrs.class]);

      return (
        <div class={nodeClassName}>
          <Interactive
            onMove={handleMove}
            onKey={handleKey}
            aria-label="Hue"
            aria-valuenow={round(hue.value)}
            aria-valuemax="360"
            aria-valuemin="0"
          >
            <Pointer
              class="vue-colorful__hue-pointer"
              left={hue.value / 360}
              color={hsvaToHslString({ h: hue.value, s: 100, v: 100, a: 1 })}
            />
          </Interactive>
        </div>
      );
    };
  },
});
