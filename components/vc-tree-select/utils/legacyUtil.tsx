import { warning } from '../../vc-util/warning';
import { isValidElement } from '../../_util/props-util';
import type {
  DataNode,
  LegacyDataNode,
  ChangeEventExtra,
  InternalDataEntity,
  RawValueType,
  LegacyCheckedNode,
} from '../interface';
import TreeNode from '../TreeNode';

export function convertChildrenToData(nodes): DataNode[] {
  return nodes
    .map(node => {
      if (!isValidElement(node) || !node.type) {
        return null;
      }

      const {
        key,
        props: { children, value, ...restProps },
      } = node;

      const data = {
        key,
        value,
        ...restProps,
      };

      const childData = convertChildrenToData(children);
      if (childData.length) {
        data.children = childData;
      }

      return data;
    })
    .filter(data => data);
}

export function fillLegacyProps(dataNode: DataNode): LegacyDataNode {
  // Skip if not dataNode exist
  if (!dataNode) {
    return dataNode as LegacyDataNode;
  }

  const cloneNode = { ...dataNode };

  if (!('props' in cloneNode)) {
    Object.defineProperty(cloneNode, 'props', {
      get() {
        warning(
          false,
          'New `rc-tree-select` not support return node instance as argument anymore. Please consider to remove `props` access.',
        );
        return cloneNode;
      },
    });
  }

  return cloneNode as LegacyDataNode;
}

export function fillAdditionalInfo(
  extra: ChangeEventExtra,
  triggerValue: RawValueType,
  checkedValues: RawValueType[],
  treeData: InternalDataEntity[],
  showPosition: boolean,
) {
  let triggerNode = null;
  let nodeList: LegacyCheckedNode[] = null;

  function generateMap() {
    function dig(list: InternalDataEntity[], level = '0', parentIncluded = false) {
      return list
        .map((dataNode, index) => {
          const pos = `${level}-${index}`;
          const included = checkedValues.includes(dataNode.value);
          const children = dig(dataNode.children || [], pos, included);
          const node = <TreeNode {...dataNode}>{children.map(child => child.node)}</TreeNode>;

          // Link with trigger node
          if (triggerValue === dataNode.value) {
            triggerNode = node;
          }

          if (included) {
            const checkedNode: LegacyCheckedNode = {
              pos,
              node,
              children,
            };

            if (!parentIncluded) {
              nodeList.push(checkedNode);
            }

            return checkedNode;
          }
          return null;
        })
        .filter(node => node);
    }

    if (!nodeList) {
      nodeList = [];

      dig(treeData);

      // Sort to keep the checked node length
      nodeList.sort(
        (
          {
            node: {
              props: { value: val1 },
            },
          },
          {
            node: {
              props: { value: val2 },
            },
          },
        ) => {
          const index1 = checkedValues.indexOf(val1);
          const index2 = checkedValues.indexOf(val2);
          return index1 - index2;
        },
      );
    }
  }

  Object.defineProperty(extra, 'triggerNode', {
    get() {
      warning(false, '`triggerNode` is deprecated. Please consider decoupling data with node.');
      generateMap();

      return triggerNode;
    },
  });
  Object.defineProperty(extra, 'allCheckedNodes', {
    get() {
      warning(false, '`allCheckedNodes` is deprecated. Please consider decoupling data with node.');
      generateMap();

      if (showPosition) {
        return nodeList;
      }

      return nodeList.map(({ node }) => node);
    },
  });
}
