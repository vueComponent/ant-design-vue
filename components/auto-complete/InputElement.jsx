import { cloneElement } from '../_util/vnode';
import { flattenChildren } from '../_util/props-util';

const InputElement = (_, { attrs, slots }) => {
  const children = flattenChildren(slots.default?.())[0];
  return cloneElement(children, { ...attrs });
};
InputElement.inheritAttrs = false;
export default InputElement;
