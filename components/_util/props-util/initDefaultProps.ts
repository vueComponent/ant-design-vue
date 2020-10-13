import { VueTypeValidableDef, VueTypeDef } from 'vue-types';

const initDefaultProps = <T>(
  propTypes: T,
  defaultProps: {
    [K in keyof T]?: T[K] extends VueTypeValidableDef<infer U>
      ? U
      : T[K] extends VueTypeDef<infer U>
      ? U
      : any;
  },
): T => {
  Object.keys(defaultProps).forEach(k => {
    const prop = propTypes[k] as VueTypeValidableDef;
    if (prop) {
      prop.default = defaultProps[k];
    } else {
      throw new Error(`not have ${k} prop`);
    }
  });
  return propTypes;
};

export default initDefaultProps;
