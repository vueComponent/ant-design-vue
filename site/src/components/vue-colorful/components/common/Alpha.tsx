import type { PropType } from 'vue';
import { defineComponent, toRefs, computed } from 'vue';

import type { Interaction } from './Interactive';
import { Interactive } from './Interactive';
import { Pointer } from './Pointer';

import { hsvaToHslaString } from '../../utils/convert';
import { formatClassName } from '../../utils/format';
import { clamp } from '../../utils/clamp';
import { round } from '../../utils/round';
import type { HsvaColor } from '../../types';

export interface AlphaProps {
  hsva: HsvaColor;
  onChange: (newAlpha: { a: number }) => void;
}

export const Alpha = defineComponent({
  name: 'Alpha',
  props: {
    hsva: { type: Object as PropType<HsvaColor> },
    onChange: { type: Function as PropType<(newAlpha: { a: number }) => void> },
  },
  setup(props, { attrs }) {
    const { hsva } = toRefs(props);

    const handleMove = (interaction: Interaction) => {
      props.onChange({ a: interaction.left });
    };

    const handleKey = (offset: Interaction) => {
      // Alpha always fit into [0, 1] range
      props.onChange({ a: clamp(hsva.value.a + offset.left) });
    };

    // We use `Object.assign` instead of the spread operator
    // to prevent adding the polyfill (about 150 bytes gzipped)
    const colorFrom = computed(() => hsvaToHslaString(Object.assign({}, hsva.value, { a: 0 })));
    const colorTo = computed(() => hsvaToHslaString(Object.assign({}, hsva.value, { a: 1 })));

    return () => {
      const gradientStyle = {
        backgroundImage: `linear-gradient(90deg, ${colorFrom.value}, ${colorTo.value})`,
      };

      const nodeClassName = formatClassName(['vue-colorful__alpha', attrs.class]);

      const ariaValue = round(hsva.value.a * 100);

      return (
        <div {...attrs} class={nodeClassName}>
          <div class="vue-colorful__alpha-gradient" style={gradientStyle} />
          <Interactive
            onMove={handleMove}
            onKey={handleKey}
            aria-label="Alpha"
            aria-valuetext={`${ariaValue}%`}
            aria-valuenow={ariaValue}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <Pointer
              class="vue-colorful__alpha-pointer"
              left={hsva.value.a}
              color={hsvaToHslaString(hsva.value)}
            />
          </Interactive>
        </div>
      );
    };
  },
});
