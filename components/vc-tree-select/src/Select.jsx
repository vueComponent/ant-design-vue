import PropTypes from '../../_util/vue-types'
import KeyCode from '../../_util/KeyCode'
import classnames from 'classnames'
import pick from 'lodash/pick'
import omit from 'omit.js'
import {
  getPropValue, getValuePropValue,
  isMultiple, toArray,
  UNSELECTABLE_ATTRIBUTE, UNSELECTABLE_STYLE,
  preventDefaultEvent,
  getTreeNodesStates, flatToHierarchy, filterParentPosition,
  isPositionPrefix, labelCompatible, loopAllChildren, filterAllCheckedData,
  processSimpleTreeData, toTitle,
} from './util'
import SelectTrigger from './SelectTrigger'
import _TreeNode from './TreeNode'
import { SHOW_ALL, SHOW_PARENT, SHOW_CHILD } from './strategies'
import { SelectPropTypes } from './PropTypes'
import { initDefaultProps, getOptionProps, hasProp, getAllProps, getComponentFromProp } from '../../_util/props-util'
import BaseMixin from '../../_util/BaseMixin'
import getTransitionProps from '../../_util/getTransitionProps'

function noop () {
}

function filterFn (input, child) {
  return String(getPropValue(child, labelCompatible(this.$props.treeNodeFilterProp)))
    .indexOf(input) > -1
}

const defaultProps = {
  prefixCls: 'rc-tree-select',
  // filterTreeNode: filterFn, // [Legacy] TODO: Set false and filter not hide?
  showSearch: true,
  allowClear: false,
  // placeholder: '',
  // searchPlaceholder: '',
  labelInValue: false,
  // onClick: noop,
  // onChange: noop,
  // onSelect: noop,
  // onDeselect: noop,
  // onSearch: noop,
  showArrow: true,
  dropdownMatchSelectWidth: true,
  dropdownStyle: {},
  dropdownVisibleChange: () => { return true },
  notFoundContent: 'Not Found',
  showCheckedStrategy: SHOW_CHILD,
  // skipHandleInitValue: false, // Deprecated (use treeCheckStrictly)
  treeCheckStrictly: false,
  treeIcon: false,
  treeLine: false,
  treeDataSimpleMode: false,
  treeDefaultExpandAll: false,
  treeCheckable: false,
  treeNodeFilterProp: 'value',
  treeNodeLabelProp: 'title',
}

const Select = {
  mixins: [BaseMixin],
  name: 'VCTreeSelect',
  props: initDefaultProps({ ...SelectPropTypes, __propsSymbol__: PropTypes.any }, defaultProps),
  data () {
    let value = []
    const props = getOptionProps(this)
    this.preProps = { ...props }
    if ('value' in props) {
      value = toArray(props.value)
    } else {
      value = toArray(props.defaultValue)
    }
    // save parsed treeData, for performance (treeData may be very big)
    this.renderedTreeData = this.renderTreeData()
    value = this.addLabelToValue(props, value)
    value = this.getValue(props, value, props.inputValue ? '__strict' : true)
    const inputValue = props.inputValue || ''
    // if (props.combobox) {
    //   inputValue = value.length ? String(value[0].value) : '';
    // }
    return {
      sValue: value,
      sInputValue: inputValue,
      sOpen: props.open || props.defaultOpen,
      sFocused: false,
    }
  },

  mounted () {
    this.$nextTick(() => {
      const { autoFocus, disabled } = this
      if (isMultiple(this.$props)) {
        const inputNode = this.getInputDOMNode()
        if (inputNode.value) {
          inputNode.style.width = ''
          inputNode.style.width = `${this.$refs.inputMirrorInstance.clientWidth || this.$refs.inputMirrorInstance.offsetWidth}px`
        } else {
          inputNode.style.width = ''
        }
      }
      if (autoFocus && !disabled) {
        this.focus()
      }
    })
  },
  watch: {
    // for performance (use __propsSymbol__ avoid deep watch)
    __propsSymbol__ () {
      const nextProps = getOptionProps(this)
      // save parsed treeData, for performance (treeData may be very big)
      this.renderedTreeData = this.renderTreeData(nextProps)
      // Detecting whether the object of `onChange`'s argument  is old ref.
      // Better to do a deep equal later.
      this._cacheTreeNodesStates = this._cacheTreeNodesStates !== 'no' &&
                                 this._savedValue &&
                                 nextProps.value === this._savedValue
      if (this.preProps.treeData !== nextProps.treeData ||
      this.preProps.children !== nextProps.children) {
      // refresh this._treeNodesStates cache
        this._treeNodesStates = getTreeNodesStates(
          this.renderedTreeData || nextProps.children,
          this.sValue.map(item => item.value)
        )
      }
      if ('value' in nextProps) {
        let value = toArray(nextProps.value)
        value = this.addLabelToValue(nextProps, value)
        value = this.getValue(nextProps, value)
        this.setState({
          sValue: value,
        }, this.forcePopupAlign)
      // if (nextProps.combobox) {
      //   this.setState({
      //     inputValue: value.length ? String(value[0].key) : '',
      //   });
      // }
      }
      if (nextProps.inputValue !== this.preProps.inputValue) {
        this.setState({
          sInputValue: nextProps.inputValue,
        })
      }
      if ('open' in nextProps) {
        this.setState({
          sOpen: nextProps.open,
        })
      }
      this.preProps = { ...nextProps }
    },
  },

  beforeUpdate () {
    if (this._savedValue && this.$props.value &&
      this.$props.value !== this._savedValue &&
      this.$props.value === this.preProps.value) {
      this._cacheTreeNodesStates = false
      this.getValue(this.$props, this.addLabelToValue(this.$props, toArray(this.$props.value)))
    }
  },

  updated () {
    const state = this.$data
    const props = this.$props
    if (state.sOpen && isMultiple(props)) {
      this.$nextTick(() => {
        const inputNode = this.getInputDOMNode()
        if (inputNode.value) {
          inputNode.style.width = ''
          inputNode.style.width = `${this.$refs.inputMirrorInstance.clientWidth}px`
        } else {
          inputNode.style.width = ''
        }
      })
    }
  },

  beforeDestroy () {
    this.clearDelayTimer()
    if (this.dropdownContainer) {
      document.body.removeChild(this.dropdownContainer)
      this.dropdownContainer = null
    }
  },
  methods: {
    loopTreeData (data, level = 0, treeCheckable) {
      return data.map((item, index) => {
        const pos = `${level}-${index}`
        const {
          label,
          value,
          disabled,
          key,
          selectable,
          children,
          isLeaf,
          ...otherProps
        } = item
        const tnProps = {
          ...pick(item, ['on', 'class', 'style']),
          props: {
            value,
            title: label,
            disabled: disabled || false,
            selectable: selectable === false ? selectable : !treeCheckable,
            ...omit(otherProps, ['on', 'class', 'style']),
          },
          key: key || value || pos,
        }
        let ret
        if (children && children.length) {
          ret = (<_TreeNode {...tnProps}>{this.loopTreeData(children, pos, treeCheckable)}</_TreeNode>)
        } else {
          ret = (<_TreeNode {...tnProps} isLeaf={isLeaf}/>)
        }
        return ret
      })
    },
    onInputChange (event) {
      const val = event.target.value
      const { $props: props } = this
      this.setState({
        sInputValue: val,
        sOpen: true,
      }, this.forcePopupAlign)
      if (props.treeCheckable && !val) {
        this.setState({
          sValue: this.getValue(props, [...this.sValue], false),
        })
      }
      this.__emit('search', val)
    },

    onDropdownVisibleChange (open) {
      // selection inside combobox cause click
      if (!open && document.activeElement === this.getInputDOMNode()) {
        // return;
      }
      this.setOpenState(open, undefined, !open)
    },

    // combobox ignore
    onKeyDown (event) {
      const props = this.$props
      if (props.disabled) {
        return
      }
      const keyCode = event.keyCode
      if (this.sOpen && !this.getInputDOMNode()) {
        this.onInputKeyDown(event)
      } else if (keyCode === KeyCode.ENTER || keyCode === KeyCode.DOWN) {
        this.setOpenState(true)
        event.preventDefault()
      }
    },

    onInputKeyDown (event) {
      const props = this.$props
      if (props.disabled) {
        return
      }
      const state = this.$data
      const keyCode = event.keyCode
      if (isMultiple(props) && !event.target.value && keyCode === KeyCode.BACKSPACE) {
        const value = state.sValue.concat()
        if (value.length) {
          const popValue = value.pop()
          this.removeSelected(this.isLabelInValue() ? popValue : popValue.value)
        }
        return
      }
      if (keyCode === KeyCode.DOWN) {
        if (!state.sOpen) {
          this.openIfHasChildren()
          event.preventDefault()
          event.stopPropagation()
          return
        }
      } else if (keyCode === KeyCode.ESC) {
        if (state.sOpen) {
          this.setOpenState(false)
          event.preventDefault()
          event.stopPropagation()
        }
        return
      }
    },

    onSelect (selectedKeys, info) {
      const item = info.node
      let value = this.sValue
      const props = this.$props
      const selectedValue = getValuePropValue(item)
      const selectedLabel = this.getLabelFromNode(item)
      const checkableSelect = props.treeCheckable && info.event === 'select'
      let event = selectedValue
      if (this.isLabelInValue()) {
        event = {
          value: event,
          label: selectedLabel,
        }
      }
      if (info.selected === false) {
        this.onDeselect(info)
        if (!checkableSelect) return
      }
      this.__emit('select', event, item, info)

      const checkEvt = info.event === 'check'
      if (isMultiple(props)) {
        this.$nextTick(() => { // clearSearchInput will change sInputValue
          this.clearSearchInput()
        })
        if (checkEvt) {
          value = this.getCheckedNodes(info, props).map(n => {
            return {
              value: getValuePropValue(n),
              label: this.getLabelFromNode(n),
            }
          })
        } else {
          if (value.some(i => i.value === selectedValue)) {
            return
          }
          value = value.concat([{
            value: selectedValue,
            label: selectedLabel,
          }])
        }
      } else {
        if (value.length && value[0].value === selectedValue) {
          this.setOpenState(false)
          return
        }
        value = [{
          value: selectedValue,
          label: selectedLabel,
        }]
        this.setOpenState(false)
      }

      const extraInfo = {
        triggerValue: selectedValue,
        triggerNode: item,
      }
      if (checkEvt) {
        extraInfo.checked = info.checked
        // if inputValue existing, tree is checkStrictly
        extraInfo.allCheckedNodes = props.treeCheckStrictly || this.sInputValue
          ? info.checkedNodes : flatToHierarchy(info.checkedNodesPositions)
        this._checkedNodes = info.checkedNodesPositions
        const _tree = this.getPopupComponentRefs()
        this._treeNodesStates = _tree.checkKeys
      } else {
        extraInfo.selected = info.selected
      }

      this.fireChange(value, extraInfo)
      if (props.inputValue === null) {
        this.setState({
          sInputValue: '',
        })
      }
    },

    onDeselect (info) {
      this.removeSelected(getValuePropValue(info.node))
      if (!isMultiple(this.$props)) {
        this.setOpenState(false)
      } else {
        this.clearSearchInput()
      }
    },

    onPlaceholderClick () {
      this.getInputDOMNode().focus()
    },

    onClearSelection (event) {
      const props = this.$props
      const state = this.$data
      if (props.disabled) {
        return
      }
      event.stopPropagation()
      this._cacheTreeNodesStates = 'no'
      this._checkedNodes = []
      if (state.sInputValue || state.sValue.length) {
        this.setOpenState(false)
        if (typeof props.inputValue === 'undefined') {
          this.setState({
            sInputValue: '',
          }, () => {
            this.fireChange([])
          })
        } else {
          this.fireChange([])
        }
      }
    },

    onChoiceAnimationLeave () {
      this.forcePopupAlign()
    },

    getLabelFromNode (child) {
      return getPropValue(child, this.$props.treeNodeLabelProp)
    },

    getLabelFromProps (props, value) {
      if (value === undefined) {
        return null
      }
      let label = null
      loopAllChildren(this.renderedTreeData || props.children, item => {
        if (getValuePropValue(item) === value) {
          label = this.getLabelFromNode(item)
        }
      })
      if (label === null) {
        return value
      }
      return label
    },

    getDropdownContainer () {
      if (!this.dropdownContainer) {
        this.dropdownContainer = document.createElement('div')
        document.body.appendChild(this.dropdownContainer)
      }
      return this.dropdownContainer
    },

    getSearchPlaceholderElement (hidden) {
      const props = this.$props
      let placeholder
      if (isMultiple(props)) {
        placeholder = getComponentFromProp(this, 'placeholder') || getComponentFromProp(this, 'searchPlaceholder')
      } else {
        placeholder = getComponentFromProp(this, 'searchPlaceholder')
      }
      if (placeholder) {
        return (
          <span
            style={{ display: hidden ? 'none' : 'block' }}
            onClick={this.onPlaceholderClick}
            class={`${props.prefixCls}-search__field__placeholder`}
          >
            {placeholder}
          </span>
        )
      }
      return null
    },

    getInputElement () {
      const { sInputValue } = this.$data
      const { prefixCls, disabled } = this.$props
      const multiple = isMultiple(this.$props)
      const inputListeners = {
        input: this.onInputChange,
        keydown: this.onInputKeyDown,
      }
      if (multiple) {
        inputListeners.blur = this.onBlur
        inputListeners.focus = this.onFocus
      }
      return (
        <span class={`${prefixCls}-search__field__wrap`}>
          <input
            ref='inputInstance'
            {...{ on: inputListeners }}
            value={sInputValue}
            disabled={disabled}
            class={`${prefixCls}-search__field`}
            role='textbox'
          />
          <span
            ref='inputMirrorInstance'
            class={`${prefixCls}-search__field__mirror`}
          >
            {sInputValue}&nbsp;
          </span>
          {isMultiple(this.$props) ? null : this.getSearchPlaceholderElement(!!sInputValue)}
        </span>
      )
    },

    getInputDOMNode () {
      return this.$refs.inputInstance
    },

    getPopupDOMNode () {
      return this.$refs.trigger.getPopupDOMNode()
    },

    getPopupComponentRefs () {
      return this.$refs.trigger.getPopupEleRefs()
    },

    getValue (_props, val, init = true) {
      let value = val
      // if inputValue existing, tree is checkStrictly
      const _strict = init === '__strict' ||
        init && (this.sInputValue ||
        this.inputValue !== _props.inputValue)
      if (_props.treeCheckable &&
        (_props.treeCheckStrictly || _strict)) {
        this.halfCheckedValues = []
        value = []
        val.forEach(i => {
          if (!i.halfChecked) {
            value.push(i)
          } else {
            this.halfCheckedValues.push(i)
          }
        })
      }
      // if (!(_props.treeCheckable && !_props.treeCheckStrictly)) {
      if (!_props.treeCheckable || _props.treeCheckable &&
        (_props.treeCheckStrictly || _strict)) {
        return value
      }
      let checkedTreeNodes
      if (this._cachetreeData && this._cacheTreeNodesStates && this._checkedNodes &&
         !this.sInputValue) {
        this.checkedTreeNodes = checkedTreeNodes = this._checkedNodes
      } else {
        /**
         * Note: `this._treeNodesStates`'s treeNodesStates must correspond to nodes of the
         * final tree (`processTreeNode` function from SelectTrigger.jsx produce the final tree).
         *
         * And, `this._treeNodesStates` from `onSelect` is previous value,
         * so it perhaps only have a few nodes, but the newly filtered tree can have many nodes,
         * thus, you cannot use previous _treeNodesStates.
         */
        // getTreeNodesStates is not effective.
        this._treeNodesStates = getTreeNodesStates(
          this.renderedTreeData || _props.children,
          value.map(item => item.value)
        )
        this.checkedTreeNodes = checkedTreeNodes = this._treeNodesStates.checkedNodes
      }
      const mapLabVal = arr => arr.map(itemObj => {
        return {
          value: getValuePropValue(itemObj.node),
          label: getPropValue(itemObj.node, _props.treeNodeLabelProp),
        }
      })
      const props = this.$props
      let checkedValues = []
      if (props.showCheckedStrategy === SHOW_ALL) {
        checkedValues = mapLabVal(checkedTreeNodes)
      } else if (props.showCheckedStrategy === SHOW_PARENT) {
        const posArr = filterParentPosition(checkedTreeNodes.map(itemObj => itemObj.pos))
        checkedValues = mapLabVal(checkedTreeNodes.filter(
          itemObj => posArr.indexOf(itemObj.pos) !== -1
        ))
      } else {
        checkedValues = mapLabVal(checkedTreeNodes.filter(itemObj => {
          return !itemObj.node.componentOptions.children
        }))
      }
      return checkedValues
    },

    getCheckedNodes (info, props) {
      // TODO treeCheckable does not support tags/dynamic
      let { checkedNodes } = info
      // if inputValue existing, tree is checkStrictly
      if (props.treeCheckStrictly || this.sInputValue) {
        return checkedNodes
      }
      const checkedNodesPositions = info.checkedNodesPositions
      if (props.showCheckedStrategy === SHOW_ALL) {
        // checkedNodes = checkedNodes
      } else if (props.showCheckedStrategy === SHOW_PARENT) {
        const posArr = filterParentPosition(checkedNodesPositions.map(itemObj => itemObj.pos))
        checkedNodes = checkedNodesPositions.filter(itemObj => posArr.indexOf(itemObj.pos) !== -1)
          .map(itemObj => itemObj.node)
      } else {
        checkedNodes = checkedNodes.filter(n => {
          return !n.componentOptions.children
        })
      }
      return checkedNodes
    },

    getDeselectedValue (selectedValue) {
      const checkedTreeNodes = this.checkedTreeNodes
      let unCheckPos
      checkedTreeNodes.forEach(itemObj => {
        const nodeProps = getAllProps(itemObj.node)
        if (nodeProps.value === selectedValue) {
          unCheckPos = itemObj.pos
        }
      })
      const newVals = []
      const newCkTns = []
      checkedTreeNodes.forEach(itemObj => {
        if (isPositionPrefix(itemObj.pos, unCheckPos) || isPositionPrefix(unCheckPos, itemObj.pos)) {
          // Filter ancestral and children nodes when uncheck a node.
          return
        }
        const nodeProps = getAllProps(itemObj.node)
        newCkTns.push(itemObj)
        newVals.push(nodeProps.value)
      })
      this.checkedTreeNodes = this._checkedNodes = newCkTns
      const nv = this.sValue.filter(val => newVals.indexOf(val.value) !== -1)
      this.fireChange(nv, { triggerValue: selectedValue, clear: true })
    },

    setOpenState (open, needFocus, documentClickClose = false) {
      this.clearDelayTimer()
      const { $props: props } = this
      // can not optimize, if children is empty
      // if (this.sOpen === open) {
      //   return;
      // }
      if (!this.$props.dropdownVisibleChange(open, { documentClickClose })) {
        return
      }
      this.setState({
        sOpen: open,
      }, () => {
        if (needFocus || open) {
          // Input dom init after first time component render
          // Add delay for this to get focus
          setTimeout(() => {
            if (open || isMultiple(props)) {
              const input = this.getInputDOMNode()
              if (input && document.activeElement !== input) {
                input.focus()
              }
            } else if (this.$refs.selection) {
              this.$refs.selection.focus()
            }
          }, 0)
        }
      })
    },

    clearSearchInput () {
      this.getInputDOMNode().focus()
      if (!hasProp(this, 'inputValue')) {
        this.setState({ sInputValue: '' })
      }
    },

    addLabelToValue (props, value_) {
      let value = value_
      if (this.isLabelInValue()) {
        value.forEach((v, i) => {
          if (Object.prototype.toString.call(value[i]) !== '[object Object]') {
            value[i] = {
              value: '',
              label: '',
            }
            return
          }
          v.label = v.label || this.getLabelFromProps(props, v.value)
        })
      } else {
        value = value.map(v => {
          return {
            value: v,
            label: this.getLabelFromProps(props, v),
          }
        })
      }
      return value
    },

    clearDelayTimer () {
      if (this.delayTimer) {
        clearTimeout(this.delayTimer)
        this.delayTimer = null
      }
    },

    removeSelected (selectedVal, e) {
      const props = this.$props
      if (props.disabled) {
        return
      }

      // Do not trigger Trigger popup
      if (e && e.stopPropagation) {
        e.stopPropagation()
      }

      this._cacheTreeNodesStates = 'no'
      if (props.treeCheckable &&
        (props.showCheckedStrategy === SHOW_ALL || props.showCheckedStrategy === SHOW_PARENT) &&
        !(props.treeCheckStrictly || this.sInputValue)) {
        this.getDeselectedValue(selectedVal)
        return
      }
      // click the node's `x`(in select box), likely trigger the TreeNode's `unCheck` event,
      // cautiously, they are completely different, think about it, the tree may not render at first,
      // but the nodes in select box are ready.
      let label
      const value = this.sValue.filter((singleValue) => {
        if (singleValue.value === selectedVal) {
          label = singleValue.label
        }
        return (singleValue.value !== selectedVal)
      })
      const canMultiple = isMultiple(props)

      if (canMultiple) {
        let event = selectedVal
        if (this.isLabelInValue()) {
          event = {
            value: selectedVal,
            label,
          }
        }
        this.__emit('deselect', event)
      }
      if (props.treeCheckable) {
        if (this.checkedTreeNodes && this.checkedTreeNodes.length) {
          this.checkedTreeNodes = this._checkedNodes = this.checkedTreeNodes.filter(item => {
            const nodeProps = getAllProps(item.node)
            return value.some(i => i.value === nodeProps.value)
          })
        }
      }

      this.fireChange(value, { triggerValue: selectedVal, clear: true })
    },

    openIfHasChildren () {
      const props = this.$props
      if (props.children.length || (props.treeData && props.treeData.length) || !isMultiple(props)) {
        this.setOpenState(true)
      }
    },

    fireChange (value, extraInfo = {}) {
      const props = getOptionProps(this)
      const vals = value.map(i => i.value)
      const sv = this.sValue.map(i => i.value)
      if (vals.length !== sv.length || !vals.every((val, index) => sv[index] === val)) {
        const ex = {
          preValue: [...this.sValue],
          ...extraInfo,
        }
        let labs = null
        let vls = value
        if (!this.isLabelInValue()) {
          labs = value.map(i => i.label)
          vls = vls.map(v => v.value)
        } else if (this.halfCheckedValues && this.halfCheckedValues.length) {
          this.halfCheckedValues.forEach(i => {
            if (!vls.some(v => v.value === i.value)) {
              vls.push(i)
            }
          })
        }
        if (props.treeCheckable && ex.clear) {
          const treeData = this.renderedTreeData || props.children
          ex.allCheckedNodes = flatToHierarchy(filterAllCheckedData(vals, treeData))
        }
        if (props.treeCheckable && this.sInputValue) {
          const _vls = [...this.sValue]
          if (ex.checked) {
            value.forEach(i => {
              if (_vls.every(ii => ii.value !== i.value)) {
                _vls.push({ ...i })
              }
            })
          } else {
            let index
            const includeVal = _vls.some((i, ind) => {
              if (i.value === ex.triggerValue) {
                index = ind
                return true
              }
            })
            if (includeVal) {
              _vls.splice(index, 1)
            }
          }
          vls = _vls
          if (!this.isLabelInValue()) {
            labs = _vls.map(v => v.label)
            vls = _vls.map(v => v.value)
          }
        }
        this._savedValue = isMultiple(props) ? vls : vls[0]
        this.__emit('change', this._savedValue, labs, ex)
        if (!('value' in props)) {
          this._cacheTreeNodesStates = false
          this.setState({
            sValue: this.getValue(props, toArray(this._savedValue).map((v, i) => {
              return this.isLabelInValue() ? v : {
                value: v,
                label: labs && labs[i],
              }
            })),
          }, this.forcePopupAlign)
        }
      }
    },

    isLabelInValue () {
      const { treeCheckable, treeCheckStrictly, labelInValue } = this.$props
      if (treeCheckable && treeCheckStrictly) {
        return true
      }
      return labelInValue || false
    },
    onFocus (e) {
      this.__emit('focus', e)
    },
    onBlur (e) {
      this.__emit('blur', e)
    },

    focus () {
      if (!isMultiple(this.$props)) {
        this.$refs.selection.focus()
      } else {
        this.getInputDOMNode().focus()
      }
    },

    blur () {
      if (!isMultiple(this.$props)) {
        this.$refs.selection.blur()
      } else {
        this.getInputDOMNode().blur()
      }
    },

    forcePopupAlign () {
      this.$refs.trigger.$refs.trigger.forcePopupAlign()
    },

    renderTopControlNode () {
      const { sValue: value } = this.$data
      const props = this.$props
      const { choiceTransitionName, prefixCls, maxTagTextLength } = props
      const multiple = isMultiple(props)

      // single and not combobox, input is inside dropdown
      if (!multiple) {
        let innerNode = (<span
          key='placeholder'
          class={`${prefixCls}-selection__placeholder`}
        >
          {getComponentFromProp(this, 'placeholder') || ''}
        </span>)
        if (value.length) {
          innerNode = (<span
            key='value'
            title={toTitle(value[0].label)}
            class={`${prefixCls}-selection-selected-value`}
          >
            {value[0].label}
          </span>)
        }
        return (<span class={`${prefixCls}-selection__rendered`}>
          {innerNode}
        </span>)
      }

      const selectedValueNodes = value.map((singleValue) => {
        let content = singleValue.label
        const title = content
        if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
          content = `${content.slice(0, maxTagTextLength)}...`
        }
        return (
          <li
            style={UNSELECTABLE_STYLE}
            onMousedown={preventDefaultEvent}
            class={`${prefixCls}-selection__choice`}
            key={singleValue.value}
            title={toTitle(title)}
            {...{ attrs: UNSELECTABLE_ATTRIBUTE }}
          >
            <span
              class={`${prefixCls}-selection__choice__remove`}
              onClick={(event) => {
                this.removeSelected(singleValue.value, event)
              }}
            />
            <span class={`${prefixCls}-selection__choice__content`}>{content}</span>
          </li>
        )
      })

      selectedValueNodes.push(<li
        class={`${prefixCls}-search ${prefixCls}-search--inline`}
        key='__input'
      >
        {this.getInputElement()}
      </li>)
      const className = `${prefixCls}-selection__rendered`
      if (choiceTransitionName) {
        const transitionProps = getTransitionProps(choiceTransitionName, {
          tag: 'ul',
          afterLeave: this.onChoiceAnimationLeave,
        })
        return (<transition-group
          class={className}
          {...transitionProps}
        >
          {selectedValueNodes}
        </transition-group>)
      }
      return (<ul class={className}>{selectedValueNodes}</ul>)
    },

    renderTreeData (props) {
      const validProps = props || this.$props
      if (validProps.treeData) {
        if (props && props.treeData === this.preProps.treeData && this.renderedTreeData) {
          // cache and use pre data.
          this._cachetreeData = true
          return this.renderedTreeData
        }
        this._cachetreeData = false
        let treeData = [...validProps.treeData]
        // process treeDataSimpleMode
        if (validProps.treeDataSimpleMode) {
          let simpleFormat = {
            id: 'id',
            pId: 'pId',
            rootPId: null,
          }
          if (Object.prototype.toString.call(validProps.treeDataSimpleMode) === '[object Object]') {
            simpleFormat = { ...simpleFormat, ...validProps.treeDataSimpleMode }
          }
          treeData = processSimpleTreeData(treeData, simpleFormat)
        }
        return this.loopTreeData(treeData, undefined, this.preProps.treeCheckable)
      }
    },
  },

  render () {
    const props = this.$props
    const multiple = isMultiple(props)
    const state = this.$data
    const { disabled, allowClear, prefixCls } = props
    const ctrlNode = this.renderTopControlNode()
    let extraSelectionProps = {}
    if (!multiple) {
      extraSelectionProps = {
        on: {
          keydown: this.onKeyDown,
          blur: this.onBlur,
          focus: this.onFocus,
        },
        attrs: {
          tabIndex: 0,
        },
      }
    }
    const rootCls = {
      [prefixCls]: 1,
      [`${prefixCls}-open`]: state.sOpen,
      [`${prefixCls}-focused`]: state.sOpen || state.sFocused,
      // [`${prefixCls}-combobox`]: isCombobox(props),
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-enabled`]: !disabled,
      [`${prefixCls}-allow-clear`]: !!props.allowClear,
    }

    const clear = (<span
      key='clear'
      class={`${prefixCls}-selection__clear`}
      onClick={this.onClearSelection}
    />)
    const selectTriggerProps = {
      props: {
        ...props,
        treeNodes: props.children,
        treeData: this.renderedTreeData,
        _cachetreeData: this._cachetreeData,
        _treeNodesStates: this._treeNodesStates,
        halfCheckedValues: this.halfCheckedValues,
        multiple: multiple,
        disabled: disabled,
        visible: state.sOpen,
        inputValue: state.sInputValue,
        inputElement: this.getInputElement(),
        value: state.sValue,
        dropdownVisibleChange: this.onDropdownVisibleChange,
        getPopupContainer: props.getPopupContainer,
        filterTreeNode: this.filterTreeNode === undefined ? filterFn : this.filterTreeNode,
      },
      on: {
        ...this.$listeners,
        select: this.onSelect,
      },
      ref: 'trigger',
    }
    return (
      <SelectTrigger {...selectTriggerProps}>
        <span
          onClick={props.onClick}
          class={classnames(rootCls)}
        >
          <span
            ref='selection'
            key='selection'
            class={`${prefixCls}-selection
            ${prefixCls}-selection--${multiple ? 'multiple' : 'single'}`}
            role='combobox'
            aria-autocomplete='list'
            aria-haspopup='true'
            aria-expanded={state.sOpen}
            {...extraSelectionProps}
          >
            {ctrlNode}
            {allowClear && state.sValue.length &&
          state.sValue[0].value ? clear : null}
            {multiple || !props.showArrow ? null
              : (<span
                key='arrow'
                class={`${prefixCls}-arrow`}
                style={{ outline: 'none' }}
              >
                <b/>
              </span>)}
            {multiple
              ? this.getSearchPlaceholderElement(!!state.sInputValue || state.sValue.length)
              : null}
          </span>
        </span>
      </SelectTrigger>
    )
  },
}

Select.SHOW_ALL = SHOW_ALL
Select.SHOW_PARENT = SHOW_PARENT
Select.SHOW_CHILD = SHOW_CHILD

export default Select
