import shallowequal from 'shallowequal';
import { toRaw } from 'vue';

export default function(value, other, customizer, thisArg) {
  return shallowequal(toRaw(value), toRaw(other), customizer, thisArg);
}
