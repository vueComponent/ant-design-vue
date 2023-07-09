import { watch, type Ref } from 'vue';
import useState from '../../_util/hooks/useState';
import type { Color } from '../color';
import { generateColor } from '../util';

function hasValue(value?: Color | string) {
  return value !== undefined;
}

const useColorState = (
  defaultStateValue: Color | string,
  option: {
    defaultValue?: Color | string;
    value?: Ref<Color | string>;
  },
) => {
  const { defaultValue, value: color } = option;
  const [colorValue, setColorValue] = useState(() => {
    let mergeState;
    if (hasValue(color.value)) {
      mergeState = color.value;
    } else if (hasValue(defaultValue)) {
      mergeState = defaultValue;
    } else {
      mergeState = defaultStateValue;
    }
    return generateColor(mergeState);
  });

  watch(option.value, value => {
    setColorValue(generateColor(value));
  });

  return [colorValue, setColorValue] as const;
};

export default useColorState;
