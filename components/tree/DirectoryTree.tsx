import type { ExtractPropTypes, PropType, VNode } from 'vue';
import { defineComponent, inject } from 'vue';
import omit from 'omit.js';
import debounce from 'lodash-es/debounce';
import FolderOpenOutlined from '@ant-design/icons-vue/FolderOpenOutlined';
import FolderOutlined from '@ant-design/icons-vue/FolderOutlined';
import FileOutlined from '@ant-design/icons-vue/FileOutlined';
import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import { treeProps } from './Tree';
import Tree, { TreeProps } from './Tree';
import {
  calcRangeKeys,
  getFullKeyList,
  convertDirectoryKeysToNodes,
  getFullKeyListByTreeData,
} from './util';
import { getOptionProps, getComponent, getSlot } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import { defaultConfigProvider } from '../config-provider';

export type ExpandAction = false | 'click' | 'doubleClick' | 'dblclick';

function getIcon(props: { isLeaf: boolean; expanded: boolean } & VNode) {
  const { isLeaf, expanded } = props;
  if (isLeaf) {
    return <FileOutlined />;
  }
  return expanded ? <FolderOpenOutlined /> : <FolderOutlined />;
}

const directoryTreeProps = {
  ...treeProps(),
  expandAction: { type: [Boolean, String] as PropType<ExpandAction> },
};

export type DirectoryTreeProps = Partial<ExtractPropTypes<typeof directoryTreeProps>>;

export default defineComponent({
  name: 'ADirectoryTree',
  inheritAttrs: false,
  props: initDefaultProps(directoryTreeProps, {
    showIcon: true,
    expandAction: 'click',
  }),
  setup() {
    return () => {
      return null;
    };
  },
});
