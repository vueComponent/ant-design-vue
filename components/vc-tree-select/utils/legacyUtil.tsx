import { filterEmpty } from '../../_util/props-util';
import type { VNodeChild } from 'vue';
import { camelize } from 'vue';
import { warning } from '../../vc-util/warning';
import type {
  DataNode,
  LegacyDataNode,
  ChangeEventExtra,
  InternalDataEntity,
  RawValueType,
  LegacyCheckedNode,
} from '../interface';
import TreeNode from '../TreeNode';

function isTreeSelectNode(node: any) {
  return node && node.type && (node.type as any).isTreeSelectNode;
}
export function convertChildrenToData(rootNodes: VNodeChild): DataNode[] {
  function dig(treeNodes: any[] = []): DataNode[] {
    return filterEmpty(treeNodes).map(treeNode => {
      // Filter invalidate node
      if (!isTreeSelectNode(treeNode)) {
        warning(!treeNode, 'TreeSelect/TreeSelectNode can only accept TreeSelectNode as children.');
        return null;
      }
      const slots = (treeNode.children as any) || {};
      const key = treeNode.key as string | number;
      const props: any = {};
      for (const [k, v] of Object.entries(treeNode.props)) {
        props[camelize(k)] = v;
      }
      const { isLeaf, checkable, selectable, disabled, disableCheckbox } = props;
      // 默认值为 undefined
      const newProps = {
        isLeaf: isLeaf || isLeaf === '' || undefined,
        checkable: checkable || checkable === '' || undefined,
        selectable: selectable || selectable === '' || undefined,
        disabled: disabled || disabled === '' || undefined,
        disableCheckbox: disableCheckbox || disableCheckbox === '' || undefined,
      };
      const slotsProps = { ...props, ...newProps };
      const {
        title = slots.title?.(slotsProps),
        switcherIcon = slots.switcherIcon?.(slotsProps),
        ...rest
      } = props;
      const children = slots.default?.();
      const dataNode: DataNode = {
        ...rest,
        title,
        switcherIcon,
        key,
        isLeaf,
        ...newProps,
      };

      const parsedChildren = dig(children);
      if (parsedChildren.length) {
        dataNode.children = parsedChildren;
      }

      return dataNode;
    });
  }

  return dig(rootNodes as any[]);
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
