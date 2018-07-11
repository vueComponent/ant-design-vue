import PropTypes from '../../_util/vue-types'
import classnames from 'classnames'
import omit from 'omit.js'
import Trigger from '../../trigger'
import Tree, { TreeNode } from '../../vc-tree'
import { SelectPropTypes } from './PropTypes'
import BaseMixin from '../../_util/BaseMixin'
import {
  loopAllChildren,
  flatToHierarchy,
  getValuePropValue,
  labelCompatible,
  saveRef,
} from './util'

import { cloneElement } from '../../_util/vnode'
import { isEmptyElement, getSlotOptions, getKey, getAllProps, getComponentFromProp } from '../../_util/props-util'
import { noop } from '../../_util/vue-types/utils'

const BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
}

const SelectTrigger = {
  mixins: [BaseMixin],
  name: 'SelectTrigger',
  props: {
    ...SelectPropTypes,
    dropdownMatchSelectWidth: PropTypes.bool,
    dropdownPopupAlign: PropTypes.object,
    visible: PropTypes.bool,
    filterTreeNode: PropTypes.any,
    treeNodes: PropTypes.any,
    inputValue: PropTypes.string,
    prefixCls: PropTypes.string,
    popupClassName: PropTypes.string,
    _cachetreeData: PropTypes.any,
    _treeNodesStates: PropTypes.any,
    halfCheckedValues: PropTypes.any,
    inputElement: PropTypes.any,
  },
  data () {
    return {
      sExpandedKeys: [],
      fireOnExpand: false,
      dropdownWidth: null,
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.setDropdownWidth()
    })
  },
  watch: {
    inputValue (val) {
      // set autoExpandParent to true
      this.setState({
        sExpandedKeys: [],
        fireOnExpand: false,
      })
    },
  },

  updated () {
    this.$nextTick(() => {
      this.setDropdownWidth()
    })
  },
  methods: {
    onExpand (expandedKeys) {
      // rerender
      this.setState({
        sExpandedKeys: expandedKeys,
        fireOnExpand: true,
      }, () => {
        // Fix https://github.com/ant-design/ant-design/issues/5689
        if (this.$refs.trigger && this.$refs.trigger.forcePopupAlign) {
          this.$refs.trigger.forcePopupAlign()
        }
      })
    },

    setDropdownWidth () {
      const width = this.$el.offsetWidth
      if (width !== this.dropdownWidth) {
        this.setState({ dropdownWidth: width })
      }
    },

    getPopupEleRefs () {
      return this.$refs.popupEle
    },

    getPopupDOMNode () {
      return this.$refs.trigger.getPopupDomNode()
    },

    getDropdownTransitionName () {
      const props = this.$props
      let transitionName = props.transitionName
      if (!transitionName && props.animation) {
        transitionName = `${this.getDropdownPrefixCls()}-${props.animation}`
      }
      return transitionName
    },

    getDropdownPrefixCls () {
      return `${this.prefixCls}-dropdown`
    },

    highlightTreeNode (treeNode) {
      const props = this.$props
      const filterVal = treeNode.$props[labelCompatible(props.treeNodeFilterProp)]
      if (typeof filterVal === 'string') {
        return props.inputValue && filterVal.indexOf(props.inputValue) > -1
      }
      return false
    },

    filterTreeNode_  (input, child) {
      if (!input) {
        return true
      }
      const filterTreeNode = this.filterTreeNode
      if (!filterTreeNode) {
        return true
      }
      const props = getAllProps(child)
      if (props && props.disabled) {
        return false
      }
      return filterTreeNode.call(this, input, child)
    },

    processTreeNode (treeNodes) {
      const filterPoss = []
      this._expandedKeys = []
      loopAllChildren(treeNodes, (child, index, pos) => {
        if (this.filterTreeNode_(this.inputValue, child)) {
          filterPoss.push(pos)
          this._expandedKeys.push(String(getKey(child)))
        }
      })

      // Include the filtered nodes's ancestral nodes.
      const processedPoss = []
      filterPoss.forEach(pos => {
        const arr = pos.split('-')
        arr.reduce((pre, cur) => {
          const res = `${pre}-${cur}`
          if (processedPoss.indexOf(res) < 0) {
            processedPoss.push(res)
          }
          return res
        })
      })
      const filterNodesPositions = []
      loopAllChildren(treeNodes, (child, index, pos) => {
        if (processedPoss.indexOf(pos) > -1) {
          filterNodesPositions.push({ node: child, pos })
        }
      })

      const hierarchyNodes = flatToHierarchy(filterNodesPositions)

      const recursive = children => {
        return children.map(child => {
          if (child.children) {
            return cloneElement(child.node, {
              children: recursive(child.children),
            })
          }
          return child.node
        })
      }
      return recursive(hierarchyNodes)
    },
    onSelect () {
      this.__emit('select', ...arguments)
    },

    renderTree (keys, halfCheckedKeys, newTreeNodes, multiple) {
      const props = this.$props

      const trProps = {
        multiple,
        prefixCls: `${props.prefixCls}-tree`,
        showIcon: props.treeIcon,
        showLine: props.treeLine,
        defaultExpandAll: props.treeDefaultExpandAll,
        defaultExpandedKeys: props.treeDefaultExpandedKeys,
        filterTreeNode: this.highlightTreeNode,
      }
      const trListeners = {}

      if (props.treeCheckable) {
        trProps.selectable = false
        trProps.checkable = props.treeCheckable
        trListeners.check = this.onSelect
        trProps.checkStrictly = props.treeCheckStrictly
        if (props.inputValue) {
          // enable checkStrictly when search tree.
          trProps.checkStrictly = true
        } else {
          trProps._treeNodesStates = props._treeNodesStates
        }
        if (trProps.treeCheckStrictly && halfCheckedKeys.length) {
          trProps.checkedKeys = { checked: keys, halfChecked: halfCheckedKeys }
        } else {
          trProps.checkedKeys = keys
        }
      } else {
        trProps.selectedKeys = keys
        trListeners.select = this.onSelect
      }

      // expand keys
      if (!trProps.defaultExpandAll && !trProps.defaultExpandedKeys && !props.loadData) {
        trProps.expandedKeys = keys
      }
      trProps.autoExpandParent = true
      trListeners.expand = this.onExpand
      if (this._expandedKeys && this._expandedKeys.length) {
        trProps.expandedKeys = this._expandedKeys
      }
      if (this.fireOnExpand) {
        trProps.expandedKeys = this.sExpandedKeys
        trProps.autoExpandParent = false
      }

      // async loadData
      if (props.loadData) {
        trProps.loadData = props.loadData
      }
      return (
        <Tree ref='popupEle' {...{ props: trProps, on: trListeners }}>
          {newTreeNodes}
        </Tree>
      )
    },
  },

  render () {
    const props = this.$props
    const multiple = props.multiple
    const dropdownPrefixCls = this.getDropdownPrefixCls()
    const popupClassName = {
      [props.dropdownClassName]: !!props.dropdownClassName,
      [`${dropdownPrefixCls}--${multiple ? 'multiple' : 'single'}`]: 1,
    }
    let visible = props.visible
    const search = multiple || !props.showSearch ? null : (
      <span class={`${dropdownPrefixCls}-search`}>{props.inputElement}</span>
    )
    const recursive = children => {
      return children.map(function handler(child) { // eslint-disable-line
        // if (isEmptyElement(child) || (child.data && child.data.slot)) {
        //   return null
        // }
        if (!getSlotOptions(child).__ANT_TREE_SELECT_NODE) {
          return null
        }
        const treeNodeProps = {
          ...child.data,
          props: {
            ...getAllProps(child),
            title: getComponentFromProp(child, 'title') || getComponentFromProp(child, 'label'),
          },
          key: String(child.key),
        }
        if (child && child.componentOptions.children) {
          // null or String has no Prop
          return (
            <TreeNode {...treeNodeProps}>
              {recursive(child.componentOptions.children) }
            </TreeNode>
          )
        }
        return <TreeNode {...treeNodeProps} />
      })
    }
    // const s = Date.now();
    let treeNodes
    if (props._cachetreeData && this.cacheTreeNodes) {
      treeNodes = this.cacheTreeNodes
    } else {
      treeNodes = recursive(props.treeData || props.treeNodes)
      this.cacheTreeNodes = treeNodes
    }
    // console.log(Date.now()-s);

    if (props.inputValue) {
      treeNodes = this.processTreeNode(treeNodes)
    }

    const keys = []
    const halfCheckedKeys = []
    loopAllChildren(treeNodes, (child) => {
      if (props.value.some(item => item.value === getValuePropValue(child))) {
        keys.push(String(getKey(child)))
      }
      if (props.halfCheckedValues &&
        props.halfCheckedValues.some(item => item.value === getValuePropValue(child))) {
        halfCheckedKeys.push(String(getKey(child)))
      }
    })

    let notFoundContent
    if (!treeNodes.length) {
      if (props.notFoundContent) {
        notFoundContent = (
          <span class={`${props.prefixCls}-not-found`}>
            {props.notFoundContent}
          </span>
        )
      } else if (!search) {
        visible = false
      }
    }
    const popupElement = (
      <div>
        {search}
        {notFoundContent || this.renderTree(keys, halfCheckedKeys, treeNodes, multiple)}
      </div>
    )

    const popupStyle = { ...props.dropdownStyle }
    const widthProp = props.dropdownMatchSelectWidth ? 'width' : 'minWidth'
    if (this.dropdownWidth) {
      popupStyle[widthProp] = `${this.dropdownWidth}px`
    }

    return (
      <Trigger
        action={props.disabled ? [] : ['click']}
        ref='trigger'
        popupPlacement='bottomLeft'
        builtinPlacements={BUILT_IN_PLACEMENTS}
        popupAlign={props.dropdownPopupAlign}
        prefixCls={dropdownPrefixCls}
        popupTransitionName={this.getDropdownTransitionName()}
        onPopupVisibleChange={props.dropdownVisibleChange}
        popup={popupElement}
        popupVisible={visible}
        getPopupContainer={props.getPopupContainer}
        popupClassName={classnames(popupClassName)}
        popupStyle={popupStyle}
      >
        {this.$slots.default}
      </Trigger>
    )
  },
}

export default SelectTrigger
