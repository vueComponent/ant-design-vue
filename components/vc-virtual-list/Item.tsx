import type { FunctionalComponent, PropType } from 'vue';
import { cloneVNode } from 'vue';
import { flattenChildren } from '../_util/props-util';

export interface ItemProps {
  setRef: (element: HTMLElement) => void;
}

const Item: FunctionalComponent<ItemProps> = ({ setRef }, { slots }) => {
  const children = flattenChildren(slots.default?.());

  return children && children.length
    ? cloneVNode(children[0], {
        ref: setRef as any,
      })
    : children;
};
Item.props = {
  setRef: {
    type: Function as PropType<(element: HTMLElement) => void>,
    default: () => {},
  },
};

export default Item;
