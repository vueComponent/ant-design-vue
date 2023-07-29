import type { PropType } from 'vue';
import { defineComponent, toRefs, ref, computed } from 'vue';

import { Hue } from './Hue';
import { Saturation } from './Saturation';
import { Alpha } from './Alpha';

import type { ColorModel, ColorPickerBaseProps, AnyColor } from '../../types';
import { useColorManipulation } from '../../hooks/useColorManipulation';
import { useStyleSheet } from '../../hooks/useStyleSheet';
import { formatClassName } from '../../utils/format';

export interface AlphaColorPickerProps<T extends AnyColor>
  extends Partial<ColorPickerBaseProps<T>> {
  colorModel: ColorModel<T>;
}

export const AlphaColorPicker = defineComponent({
  name: 'AlphaColorPicker',
  props: {
    colorModel: { type: Object as PropType<ColorModel<AnyColor>> },
    color: { type: [String, Object] as PropType<AnyColor> },
    onChange: { type: Function as PropType<(newColor: AnyColor) => void> },
  },
  setup(props, { attrs }) {
    const { colorModel, color } = toRefs(props);

    const nodeRef = ref<HTMLDivElement>(null);
    useStyleSheet(nodeRef);

    const mergedColor = computed(() => color.value || colorModel.value.defaultColor);

    const [hsva, updateHsva] = useColorManipulation<AnyColor>(
      colorModel,
      mergedColor,
      props.onChange,
    );

    return () => {
      const nodeClassName = formatClassName(['vue-colorful', attrs.class]);

      return (
        <div {...attrs} ref={nodeRef} class={nodeClassName}>
          <Saturation hsva={hsva.value} onChange={updateHsva} />
          <Hue hue={hsva.value.h} onChange={updateHsva} />
          <Alpha hsva={hsva.value} onChange={updateHsva} class="vue-colorful__last-control" />
        </div>
      );
    };
  },
});
