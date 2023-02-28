import createContext from '../_util/createContext';

import type { FloatButtonShape } from './interface';

const FloatButtonGroupContext = createContext<{ shape: FloatButtonShape } | undefined>(undefined);

export default FloatButtonGroupContext;
