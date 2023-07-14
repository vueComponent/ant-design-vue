import type { PropType } from 'vue';
import { defineComponent, toRefs } from 'vue';

import type { Interaction } from './Interactive';
import { Interactive } from './Interactive';
import { Pointer } from './Pointer';
import type { HsvaColor } from '../../types';
import { hsvaToHslString } from '../../utils/convert';
import { clamp } from '../../utils/clamp';
import { round } from '../../utils/round';

export interface SaturationProps {
  hsva: HsvaColor;
  onChange: (newColor: { s: number; v: number }) => void;
}

export const Saturation = defineComponent({
  name: 'Saturation',
  props: {
    hsva: { type: Object as PropType<HsvaColor> },
    onChange: { type: Function as PropType<(newColor: { s: number; v: number }) => void> },
  },
  setup(props, { attrs }) {
    const { hsva } = toRefs(props);

    const handleMove = (interaction: Interaction) => {
      props.onChange({
        s: interaction.left * 100,
        v: 100 - interaction.top * 100,
      });
    };

    const handleKey = (offset: Interaction) => {
      // Saturation and brightness always fit into [0, 100] range
      props.onChange({
        s: clamp(hsva.value.s + offset.left * 100, 0, 100),
        v: clamp(hsva.value.v - offset.top * 100, 0, 100),
      });
    };

    return () => {
      const containerStyle = {
        backgroundColor: hsvaToHslString({ h: hsva.value.h, s: 100, v: 100, a: 1 }),
      };

      return (
        <div {...attrs} class="vue-colorful__saturation" style={containerStyle}>
          <Interactive
            onMove={handleMove}
            onKey={handleKey}
            aria-label="Color"
            aria-valuetext={`Saturation ${round(hsva.value.s)}%, Brightness ${round(
              hsva.value.v,
            )}%`}
          >
            <Pointer
              class="vue-colorful__saturation-pointer"
              top={1 - hsva.value.v / 100}
              left={hsva.value.s / 100}
              color={hsvaToHslString(hsva.value)}
            />
          </Interactive>
        </div>
      );
    };
  },
});
