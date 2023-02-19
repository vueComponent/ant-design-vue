import type { Ref } from 'vue';
import createContext from '../_util/createContext';

import type { FloatButtonShape } from './interface';

const FloatButtonGroupContext = createContext<{ shape: Ref<FloatButtonShape> } | undefined>(
  undefined,
);

export default FloatButtonGroupContext;
