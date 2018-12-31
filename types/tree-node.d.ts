// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';

export declare class TreeNode extends AntdComponent {
  /**
   * Class
   * @description className
   * @type string
   */
  class: string;

  /**
   * Style
   * @description style of tree node
   * @type string | object
   */
  style: string | object;

  /**
   * Disable Checkbox
   * @description Disables the checkbox of the treeNode
   * @default false
   * @type boolean
   */
  disableCheckbox: boolean;

  /**
   * Disabled
   * @description Disabled or not
   * @default false
   * @type boolean
   */
  disabled: boolean;

  /**
   * Icon
   * @description customize icon. When you pass component, whose render will receive full TreeNode props as component props
   * @type any (slot | slot-scope)
   */
  icon: any;

  /**
   * Is Leaf?
   * @description Leaf node or not
   * @default false
   * @type boolean
   */
  isLeaf: boolean;

  /**
   * Key
   * @description Required property, should be unique in the tree
   * (In tree: Used with (default)ExpandedKeys / (default)CheckedKeys / (default)SelectedKeys)
   * @default internal calculated position of treeNode or undefined
   * @type string | number
   */
  key: string | number;

  /**
   * Selectable
   * @description Set whether the treeNode can be selected
   * @default true
   * @type boolean
   */
  selectable: boolean;

  /**
   * Title
   * @description Content showed on the treeNodes
   * @default '---'
   * @type any (string | slot)
   */
  title: any;

  /**
   * Value
   * @description Will be treated as treeNodeFilterProp by default, should be unique in the tree
   * @default undefined
   * @type string
   */
  value: string;

  /**
   * Slots
   * @description When using treeNodes, you can use this property to configure the properties that support the slot,
   * such as slots: { title: 'XXX'}
   * @type object
   */
  slots: object;

  /**
   * Scoped Slots
   * @description When using treeNodes, you can use this property to configure the properties that support the slot,
   * such as scopedSlots: { title: 'XXX'}
   * @type object
   */
  scopedSlots: object;
}
