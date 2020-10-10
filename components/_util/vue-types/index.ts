import { createTypes, VueTypeValidableDef, VueTypesInterface } from 'vue-types';
const PropTypes = createTypes({
  func: undefined,
  bool: undefined,
  string: undefined,
  number: undefined,
  array: undefined,
  object: undefined,
  integer: undefined,
});

PropTypes.extend([
  {
    name: 'looseBool',
    getter: true,
    type: Boolean,
    default: undefined,
  },
]);

export function withUndefined(type: any) {
  type.default = undefined;
  return type;
}

export default PropTypes as VueTypesInterface & {
  readonly looseBool: VueTypeValidableDef<boolean> & {
    default: boolean;
  };
};
