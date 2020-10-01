import { cloneVNode, FunctionalComponent } from 'vue';

export interface ItemProps {
  setRef: (element: HTMLElement) => void;
}

const Item: FunctionalComponent<ItemProps> = ({ setRef }, { slots }) => {
  const children = slots.default?.();

  return children && children.length
    ? cloneVNode(children[0], {
        ref: setRef,
      })
    : children;
};

export default Item;
