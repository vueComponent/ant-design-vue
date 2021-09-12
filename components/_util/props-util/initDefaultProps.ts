import type { PropType } from 'vue';
import type { VueTypeValidableDef, VueTypeDef } from 'vue-types';

const initDefaultProps = <T>(
  types: T,
  defaultProps: {
    [K in keyof T]?: T[K] extends VueTypeValidableDef<infer U>
      ? U
      : T[K] extends VueTypeDef<infer U>
      ? U
      : T[K] extends { type: PropType<infer U> }
      ? U
      : any;
  },
): T => {
  const propTypes: T = { ...types };
  Object.keys(defaultProps).forEach(k => {
    const prop = propTypes[k] as VueTypeValidableDef;
    if (prop) {
      if (prop.type || prop.default) {
        prop.default = defaultProps[k];
      } else if (prop.def) {
        prop.def(defaultProps[k]);
      } else {
        propTypes[k] = { type: prop, default: defaultProps[k] };
      }
    } else {
      throw new Error(`not have ${k} prop`);
    }
  });
  return propTypes;
};

export default initDefaultProps;
