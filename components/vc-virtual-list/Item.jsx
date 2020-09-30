import { cloneVNode } from 'vue';

function Item({ setRef }, { slots }) {
  const children = slots?.default();
  return children && children.length
    ? cloneVNode(children[0], {
        ref: setRef,
      })
    : children;
}
Item.props = {
  setRef: {
    type: Function,
    default: () => {},
  },
};
export default Item;
