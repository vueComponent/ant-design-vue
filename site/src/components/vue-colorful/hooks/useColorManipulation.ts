import type { Ref } from 'vue';
import { ref, watch } from 'vue';
import type { ColorModel, AnyColor, HsvaColor } from '../types';
import { equalColorObjects } from '../utils/compare';
import { useEventCallback } from './useEventCallback';

export function useColorManipulation<T extends AnyColor>(
  colorModel: Ref<ColorModel<T>>,
  color: Ref<T>,
  onChange?: (color: T) => void,
): [Ref<HsvaColor>, (color: Partial<HsvaColor>) => void] {
  // Save onChange callback in the ref for avoiding "useCallback hell"
  const onChangeCallback = useEventCallback<T>(onChange);

  // No matter which color model is used (HEX, RGB(A) or HSL(A)),
  // all internal calculations are based on HSVA model
  const hsva = ref<HsvaColor>(colorModel.value.toHsva(color.value));

  // By using this ref we're able to prevent extra updates
  // and the effects recursion during the color conversion
  const cache = ref({ color, hsva: hsva.value });

  // Update local HSVA-value if `color` property value is changed,
  // but only if that's not the same color that we just sent to the parent

  watch(color, val => {
    if (!colorModel.value.equal(val, cache.value.color)) {
      const newHsva = colorModel.value.toHsva(val);
      cache.value = { hsva: newHsva, color: val };
      hsva.value = newHsva;
    }
  });
  watch(colorModel, val => {
    if (!val.equal(color.value, cache.value.color)) {
      const newHsva = val.toHsva(color.value);
      cache.value = { hsva: newHsva, color: color.value };
      hsva.value = newHsva;
    }

    let newColor;
    if (
      !equalColorObjects(hsva.value, cache.value.hsva) &&
      !val.equal((newColor = val.fromHsva(hsva.value)), cache.value.color)
    ) {
      cache.value = { hsva: hsva.value, color: newColor };
      onChangeCallback(newColor);
    }
  });
  // Trigger `onChange` callback only if an updated color is different from cached one;
  // save the new color to the ref to prevent unnecessary updates

  watch(hsva, val => {
    let newColor;
    if (
      !equalColorObjects(val, cache.value.hsva) &&
      !colorModel.value.equal((newColor = colorModel.value.fromHsva(val)), cache.value.color)
    ) {
      cache.value = { hsva: val, color: newColor };
      onChangeCallback(newColor);
    }
  });

  // Merge the current HSVA color object with updated params.
  // For example, when a child component sends `h` or `s` only
  const handleChange = (params: Partial<HsvaColor>) => {
    hsva.value = Object.assign({}, hsva.value, params);
  };

  return [hsva, handleChange];
}
