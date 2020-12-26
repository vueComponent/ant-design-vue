import { flattenChildren, isValidElement } from '../_util/props-util';

export function convertChildrenToData(nodes: any[]): any[] {
  return flattenChildren(nodes)
    .map(node => {
      if (!isValidElement(node) || !node.type) {
        return null;
      }
      const { default: d, ...restSlot } = node.children || {};
      const children = d ? d() : [];
      const {
        key,
        props: { value, ...restProps },
      } = node;

      const data = {
        key,
        value,
        ...restProps,
      };
      Object.keys(restSlot).forEach(p => {
        if (typeof restSlot[p] === 'function') {
          data[p] = <>{restSlot[p]()}</>;
        }
      });
      const childData = convertChildrenToData(children);
      if (childData.length) {
        data.children = childData;
      }

      return data;
    })
    .filter(data => data);
}
