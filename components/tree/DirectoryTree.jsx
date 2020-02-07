import omit from 'omit.js';
import debounce from 'lodash/debounce';
import PropTypes from '../_util/vue-types';
import warning from '../_util/warning';
import { conductExpandParent, convertTreeToEntities } from '../vc-tree/src/util';
import Tree, { TreeProps } from './Tree';
import { calcRangeKeys, getFullKeyList } from './util';
import Icon from '../icon';
import BaseMixin from '../_util/BaseMixin';
import {
  initDefaultProps,
  getOptionProps,
  getListeners,
  getComponentFromProp,
} from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

// export type ExpandAction = false | 'click' | 'dblclick'; export interface
// DirectoryTreeProps extends TreeProps {   expandAction?: ExpandAction; }
// export interface DirectoryTreeState {   expandedKeys?: string[];
// selectedKeys?: string[]; }

function getIcon(props, h) {
  const { isLeaf, expanded } = props;
  if (isLeaf) {
    return <Icon type="file" />;
  }
  return <Icon type={expanded ? 'folder-open' : 'folder'} />;
}

export default {
  name: 'ADirectoryTree',
  mixins: [BaseMixin],
  model: {
    prop: 'checkedKeys',
    event: 'check',
  },
  props: initDefaultProps(
    {
      ...TreeProps(),
      expandAction: PropTypes.oneOf([false, 'click', 'doubleclick', 'dblclick']),
    },
    {
      showIcon: true,
      expandAction: 'click',
    },
  ),

  // state: DirectoryTreeState; onDebounceExpand: (event, node: AntTreeNode) =>
  // void; // Shift click usage lastSelectedKey?: string; cachedSelectedKeys?:
  // string[];
  inject: {
    configProvider: {
      default: () => ConfigConsumerProps,
    },
  },
  data() {
    const props = getOptionProps(this);
    const { defaultExpandAll, defaultExpandParent, expandedKeys, defaultExpandedKeys } = props;
    const { keyEntities } = convertTreeToEntities(this.$slots.default);
    const state = {};
    // Selected keys
    state._selectedKeys = props.selectedKeys || props.defaultSelectedKeys || [];

    // Expanded keys
    if (defaultExpandAll) {
      state._expandedKeys = getFullKeyList(this.$slots.default);
    } else if (defaultExpandParent) {
      state._expandedKeys = conductExpandParent(expandedKeys || defaultExpandedKeys, keyEntities);
    } else {
      state._expandedKeys = expandedKeys || defaultExpandedKeys;
    }

    this.onDebounceExpand = debounce(this.expandFolderNode, 200, { leading: true });
    return {
      _selectedKeys: [],
      _expandedKeys: [],
      ...state,
    };
  },
  watch: {
    expandedKeys(val) {
      this.setState({ _expandedKeys: val });
    },
    selectedKeys(val) {
      this.setState({ _selectedKeys: val });
    },
  },
  methods: {
    onExpand(expandedKeys, info) {
      this.setUncontrolledState({ _expandedKeys: expandedKeys });

      this.$emit('expand', expandedKeys, info);

      return undefined;
    },

    onClick(event, node) {
      const { expandAction } = this.$props;

      // Expand the tree
      if (expandAction === 'click') {
        this.onDebounceExpand(event, node);
      }
      this.$emit('click', event, node);
    },

    onDoubleClick(event, node) {
      const { expandAction } = this.$props;

      // Expand the tree
      if (expandAction === 'dblclick' || expandAction === 'doubleclick') {
        this.onDebounceExpand(event, node);
      }

      this.$emit('doubleclick', event, node);
      this.$emit('dblclick', event, node);
    },

    onSelect(keys, event) {
      const { multiple } = this.$props;
      const children = this.$slots.default || [];
      const { _expandedKeys: expandedKeys = [] } = this.$data;
      const { node, nativeEvent } = event;
      const { eventKey = '' } = node;

      const newState = {};
      // Windows / Mac single pick
      const ctrlPick = nativeEvent.ctrlKey || nativeEvent.metaKey;
      const shiftPick = nativeEvent.shiftKey;

      // Generate new selected keys
      let newSelectedKeys;
      if (multiple && ctrlPick) {
        // Control click
        newSelectedKeys = keys;
        this.lastSelectedKey = eventKey;
        this.cachedSelectedKeys = newSelectedKeys;
      } else if (multiple && shiftPick) {
        // Shift click
        newSelectedKeys = Array.from(
          new Set([
            ...(this.cachedSelectedKeys || []),
            ...calcRangeKeys(children, expandedKeys, eventKey, this.lastSelectedKey),
          ]),
        );
      } else {
        // Single click
        newSelectedKeys = [eventKey];
        this.lastSelectedKey = eventKey;
        this.cachedSelectedKeys = newSelectedKeys;
      }
      newState._selectedKeys = newSelectedKeys;

      this.$emit('update:selectedKeys', newSelectedKeys);
      this.$emit('select', newSelectedKeys, event);

      this.setUncontrolledState(newState);
    },

    expandFolderNode(event, node) {
      const { isLeaf } = node;

      if (isLeaf || event.shiftKey || event.metaKey || event.ctrlKey) {
        return;
      }

      if (this.$refs.tree.$refs.tree) {
        // Get internal vc-tree
        const internalTree = this.$refs.tree.$refs.tree;

        // Call internal rc-tree expand function
        // https://github.com/ant-design/ant-design/issues/12567
        internalTree.onNodeExpand(event, node);
      }
    },

    setUncontrolledState(state) {
      const newState = omit(
        state,
        Object.keys(getOptionProps(this)).map(p => `_${p}`),
      );
      if (Object.keys(newState).length) {
        this.setState(newState);
      }
    },
  },

  render() {
    const { prefixCls: customizePrefixCls, ...props } = getOptionProps(this);
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('tree', customizePrefixCls);
    const { _expandedKeys: expandedKeys, _selectedKeys: selectedKeys } = this.$data;
    const listeners = getListeners(this);
    warning(!listeners.doubleclick, '`doubleclick` is deprecated. please use `dblclick` instead.');
    const treeProps = {
      props: {
        icon: getIcon,
        ...props,
        prefixCls,
        expandedKeys,
        selectedKeys,
        switcherIcon: getComponentFromProp(this, 'switcherIcon'),
      },
      ref: 'tree',
      class: `${prefixCls}-directory`,
      on: {
        ...omit(listeners, ['update:selectedKeys']),
        select: this.onSelect,
        click: this.onClick,
        dblclick: this.onDoubleClick,
        expand: this.onExpand,
      },
    };
    return <Tree {...treeProps}>{this.$slots.default}</Tree>;
  },
};
