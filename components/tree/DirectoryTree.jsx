import omit from 'omit.js'
import debounce from 'lodash/debounce'
import PropTypes from '../_util/vue-types'
import { conductExpandParent, convertTreeToEntities } from '../vc-tree/src/util'
import Tree, { TreeProps } from './Tree'
import { calcRangeKeys, getFullKeyList } from './util'
import Icon from '../icon'
import { initDefaultProps, getOptionProps } from '../_util/props-util'

// export type ExpandAction = false | 'click' | 'doubleClick';

// export interface DirectoryTreeProps extends TreeProps {
//   expandAction?: ExpandAction;
// }

// export interface DirectoryTreeState {
//   expandedKeys?: string[];
//   selectedKeys?: string[];
// }

function getIcon (h, props) {
  const { isLeaf, expanded } = props
  if (isLeaf) {
    return <Icon type='file' />
  }
  return <Icon type={expanded ? 'folder-open' : 'folder'} />
}

export default {
  name: 'ADirectoryTree',
  model: {
    prop: 'checkedKeys',
    event: 'check',
  },
  props: initDefaultProps({ ...TreeProps(), expandAction: PropTypes.oneOf([false, 'click', 'doubleClick']) }, {
    prefixCls: 'ant-tree',
    showIcon: true,
    expandAction: 'click',
  }),

  // state: DirectoryTreeState;
  // onDebounceExpand: (event, node: AntTreeNode) => void;

  // // Shift click usage
  // lastSelectedKey?: string;
  // cachedSelectedKeys?: string[];

  data () {
    const props = getOptionProps(this)
    const { defaultExpandAll, defaultExpandParent, expandedKeys, defaultExpandedKeys } = props
    const { keyEntities } = convertTreeToEntities(this.$slots.default)
    const state = {}
    // Selected keys
    state._selectedKeys = props.selectedKeys || props.defaultSelectedKeys || []

    // Expanded keys
    if (defaultExpandAll) {
      state._expandedKeys = getFullKeyList(props.children)
    } else if (defaultExpandParent) {
      state._expandedKeys = conductExpandParent(expandedKeys || defaultExpandedKeys, keyEntities)
    } else {
      state._expandedKeys = defaultExpandedKeys
    }

    this.onDebounceExpand = debounce(this.expandFolderNode, 200, {
      leading: true,
    })
    return {
      _selectedKeys: [],
      _expandedKeys: [],
      ...state,
    }
  },
  watch: {
    expandedKeys (val) {
      this.setState({ _expandedKeys: val })
    },
    selectedKeys (val) {
      this.setState({ _selectedKeys: val })
    },
  },
  methods: {
    onExpand (expandedKeys, info) {
      this.setUncontrolledState({ _expandedKeys: expandedKeys })

      this.$emit('expand', expandedKeys, info)

      return undefined
    },

    onClick (event, node) {
      const { expandAction } = this.$props

      // Expand the tree
      if (expandAction === 'click') {
        this.onDebounceExpand(event, node)
      }
      this.$emit('click', event, node)
    },

    onDoubleClick (event, node) {
      const { expandAction } = this.$props

      // Expand the tree
      if (expandAction === 'doubleClick') {
        this.onDebounceExpand(event, node)
      }

      this.$emit('doubleclick', event, node)
    },

    onSelect (keys, event) {
      const { multiple } = this.$props
      const children = this.$slots.default || []
      const { _expandedKeys: expandedKeys = [], _selectedKeys: selectedKeys = [] } = this.$data
      const { node, nativeEvent } = event
      const { eventKey = '' } = node

      const newState = {}

      // Windows / Mac single pick
      const ctrlPick = nativeEvent.ctrlKey || nativeEvent.metaKey
      const shiftPick = nativeEvent.shiftKey

      // Generate new selected keys
      let newSelectedKeys = selectedKeys.slice()
      if (multiple && ctrlPick) {
      // Control click
        newSelectedKeys = keys
        this.lastSelectedKey = eventKey
        this.cachedSelectedKeys = newSelectedKeys
      } else if (multiple && shiftPick) {
      // Shift click
        newSelectedKeys = Array.from(new Set([
          ...this.cachedSelectedKeys || [],
          ...calcRangeKeys(children, expandedKeys, eventKey, this.lastSelectedKey),
        ]))
      } else {
      // Single click
        newSelectedKeys = [eventKey]
        this.lastSelectedKey = eventKey
        this.cachedSelectedKeys = newSelectedKeys
      }
      newState._selectedKeys = newSelectedKeys

      this.$emit('select', newSelectedKeys, event)

      this.setUncontrolledState(newState)
    },

    expandFolderNode  (event, node) {
      const { _expandedKeys: expandedKeys = [] } = this.$data
      const { eventKey = '', expanded, isLeaf } = node

      if (isLeaf || event.shiftKey || event.metaKey || event.ctrlKey) {
        return
      }

      const newExpandedKeys = expandedKeys.slice()
      const index = newExpandedKeys.indexOf(eventKey)

      if (expanded && index >= 0) {
        newExpandedKeys.splice(index, 1)
      } else if (!expanded && index === -1) {
        newExpandedKeys.push(eventKey)
      }

      this.setUncontrolledState({
        _expandedKeys: newExpandedKeys,
      })
      this.$emit('expand', newExpandedKeys, {
        expanded: !expanded,
        node,
        nativeEvent: event.nativeEvent,
      })
    },

    setUncontrolledState (state) {
      const newState = omit(state, Object.keys(getOptionProps(this)).map(p => `_${p}`))
      if (Object.keys(newState).length) {
        this.setState(newState)
      }
    },
  },

  render () {
    const { prefixCls, ...props } = getOptionProps(this)
    const { _expandedKeys: expandedKeys, _selectedKeys: selectedKeys } = this.$data
    const treeProps = {
      props: {
        icon: getIcon,
        ...props,
        prefixCls,
        expandedKeys,
        selectedKeys,
      },
      class: `${prefixCls}-directory`,
      select: this.onSelect,
      click: this.onClick,
      doubleclick: this.onDoubleClick,
      expand: this.onExpand,
    }
    return (
      <Tree {...treeProps}>{this.$slots.default}</Tree>
    )
  },
}
