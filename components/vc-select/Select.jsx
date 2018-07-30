
import KeyCode from '../_util/KeyCode'
import PropTypes from '../_util/vue-types'
import classnames from 'classnames'
import classes from 'component-classes'
import { Item as MenuItem, ItemGroup as MenuItemGroup } from '../vc-menu'
import warning from 'warning'
import Option from './Option'
import { hasProp, getSlotOptions, getPropsData, getValueByProp as getValue, getComponentFromProp, getEvents, getClass, getStyle, getAttrs } from '../_util/props-util'
import getTransitionProps from '../_util/getTransitionProps'
import { cloneElement } from '../_util/vnode'
import BaseMixin from '../_util/BaseMixin'
import {
  getPropValue,
  getValuePropValue,
  isCombobox,
  isMultipleOrTags,
  isMultipleOrTagsOrCombobox,
  isSingleMode,
  toArray,
  findIndexInValueByKey,
  UNSELECTABLE_ATTRIBUTE,
  UNSELECTABLE_STYLE,
  preventDefaultEvent,
  findFirstMenuItem,
  includesSeparators,
  splitBySeparators,
  findIndexInValueByLabel,
  defaultFilterFn,
  validateOptionValue,
} from './util'
import SelectTrigger from './SelectTrigger'
import { SelectPropTypes } from './PropTypes'

function noop () {}

function chaining (...fns) {
  return function (...args) { // eslint-disable-line
    // eslint-disable-line
    for (let i = 0; i < fns.length; i++) {
      if (fns[i] && typeof fns[i] === 'function') {
        fns[i].apply(this, args)
      }
    }
  }
}
export default {
  inheritAttrs: false,
  name: 'Select',
  mixins: [BaseMixin],
  props: {
    ...SelectPropTypes,
    prefixCls: SelectPropTypes.prefixCls.def('rc-select'),
    defaultOpen: PropTypes.bool.def(false),
    labelInValue: SelectPropTypes.labelInValue.def(false),
    defaultActiveFirstOption: SelectPropTypes.defaultActiveFirstOption.def(true),
    showSearch: SelectPropTypes.showSearch.def(true),
    allowClear: SelectPropTypes.allowClear.def(false),
    placeholder: SelectPropTypes.placeholder.def(''),
    showArrow: SelectPropTypes.showArrow.def(true),
    dropdownMatchSelectWidth: PropTypes.bool.def(true),
    dropdownStyle: SelectPropTypes.dropdownStyle.def({}),
    dropdownMenuStyle: PropTypes.object.def({}),
    optionFilterProp: SelectPropTypes.optionFilterProp.def('value'),
    optionLabelProp: SelectPropTypes.optionLabelProp.def('value'),
    notFoundContent: PropTypes.any.def('Not Found'),
    backfill: PropTypes.bool.def(false),
    showAction: SelectPropTypes.showAction.def(['click']),
    combobox: PropTypes.bool.def(false),
    tokenSeparators: PropTypes.arrayOf(PropTypes.string).def([]),
    // onChange: noop,
    // onFocus: noop,
    // onBlur: noop,
    // onSelect: noop,
    // onSearch: noop,
    // onDeselect: noop,
    // onInputKeydown: noop,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  data () {
    this.labelMap = new Map()
    this.titleMap = new Map()
    let sValue = []
    const { value, defaultValue, combobox, open, defaultOpen } = this
    if (hasProp(this, 'value')) {
      sValue = toArray(value)
    } else {
      sValue = toArray(defaultValue)
    }
    if (this.labelInValue) {
      sValue.forEach(v => {
        v.key = v.key !== undefined ? v.key : v.value
      })
    } else {
      sValue = sValue.map(v => {
        return {
          key: v,
        }
      })
    }
    this.initLabelAndTitleMap(sValue)
    let inputValue = ''
    if (combobox) {
      inputValue = sValue.length
        ? this.labelMap.get((sValue[0].key))
        : ''
    }
    let sOpen = open
    if (sOpen === undefined) {
      sOpen = defaultOpen
    }
    this._valueOptions = []
    if (sValue.length > 0) {
      this._valueOptions = this.getOptionsByValue(sValue)
    }
    return {
      sValue,
      inputValue,
      sOpen,
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.autoFocus && this.focus()
    })
  },
  watch: {
    value (val) {
      let sValue = toArray(val)
      if (this.labelInValue) {
        sValue.forEach(v => {
          v.key = v.key !== undefined ? v.key : v.value
        })
      } else {
        sValue = sValue.map(v => {
          return {
            key: v,
          }
        })
      }
      this.sValue = sValue
      this.initLabelAndTitleMap(sValue)
      sValue.forEach((val) => {
        const key = val.key
        let { label, title } = val
        label = label === undefined ? this.labelMap.get(key) : label
        title = title === undefined ? this.titleMap.get(key) : title
        this.labelMap.set(key, label === undefined ? key : label)
        this.titleMap.set(key, title)
      })

      if (this.combobox) {
        this.setState({
          inputValue: sValue.length ? this.labelMap.get((sValue[0].key)) : '',
        })
      }
    },
    combobox (val) {
      if (val) {
        this.setState({
          inputValue: this.sValue.length ? this.labelMap.get((this.sValue[0].key)) : '',
        })
      }
    },
  },
  updated () {
    this.$nextTick(() => {
      if (isMultipleOrTags(this.$props)) {
        const inputNode = this.getInputDOMNode()
        const mirrorNode = this.getInputMirrorDOMNode()
        if (inputNode.value) {
          inputNode.style.width = ''
          inputNode.style.width = `${mirrorNode.clientWidth + 10}px`
        } else {
          inputNode.style.width = ''
        }
      }
    })
  },
  beforeDestroy () {
    this.clearFocusTime()
    this.clearBlurTime()
    this.clearAdjustTimer()
    if (this.dropdownContainer) {
      document.body.removeChild(this.dropdownContainer)
      this.dropdownContainer = null
    }
  },
  methods: {
    initLabelAndTitleMap (sValue) {
      // 保留已选中的label and title
      const labelArr = []
      const titleArr = []
      const values = sValue || this.sValue
      values.forEach((val) => {
        const key = val.key
        let { label, title } = val
        label = label === undefined ? this.labelMap.get(key) : label
        title = title === undefined ? this.titleMap.get(key) : title
        title = typeof title === 'string' ? title.trim() : title
        labelArr.push([key, label === undefined ? key : label])
        titleArr.push([key, title])
      })
      this.labelMap = new Map(labelArr)
      this.titleMap = new Map(titleArr)

      this.updateLabelAndTitleMap(this.$slots.default)
    },
    updateLabelAndTitleMap (children = []) {
      children.forEach(child => {
        if (!child.data || child.data.slot !== undefined) {
          return
        }
        if (getSlotOptions(child).isSelectOptGroup) {
          this.updateLabelAndTitleMap(child.componentOptions.children)
        } else {
          const key = getValuePropValue(child)
          this.titleMap.set(key, getValue(child, 'title'))
          this.labelMap.set(key, this.getLabelFromOption(child))
        }
      })
    },
    onInputChange (event) {
      const { tokenSeparators } = this
      const val = event.target.value
      if (
        isMultipleOrTags(this.$props) &&
      tokenSeparators.length &&
      includesSeparators(val, tokenSeparators)
      ) {
        const nextValue = this.getValueByInput(val)
        this.fireChange(nextValue)
        this.setOpenState(false, true)
        this.setInputValue('', false)
        return
      }
      this.setInputValue(val)
      this.setState({
        sOpen: true,
      })
      if (isCombobox(this.$props)) {
        this.fireChange([
          {
            key: val,
          },
        ])
      }
    },

    onDropdownVisibleChange (open) {
      if (open && !this._focused) {
        this.clearBlurTime()
        this.timeoutFocus()
        this._focused = true
        this.updateFocusClassName()
      }
      this.setOpenState(open)
    },

    // combobox ignore
    onKeyDown (event) {
      const { disabled, openStatus } = this
      if (disabled) {
        return
      }
      const keyCode = event.keyCode
      if (openStatus && !this.getInputDOMNode()) {
        this.onInputKeydown(event)
      } else if (keyCode === KeyCode.ENTER || keyCode === KeyCode.DOWN) {
        this.setOpenState(true)
        event.preventDefault()
      }
    },

    onInputKeydown (event) {
      const { disabled, openStatus, sValue, $props } = this
      if (disabled) {
        return
      }
      const keyCode = event.keyCode
      if (
        isMultipleOrTags($props) &&
      !event.target.value &&
      keyCode === KeyCode.BACKSPACE
      ) {
        event.preventDefault()
        if (sValue.length) {
          this.removeSelected(sValue[sValue.length - 1].key)
        }
        return
      }
      if (keyCode === KeyCode.DOWN) {
        if (!openStatus) {
          this.openIfHasChildren()
          event.preventDefault()
          event.stopPropagation()
          return
        }
      } else if (keyCode === KeyCode.ESC) {
        if (openStatus) {
          this.setOpenState(false)
          event.preventDefault()
          event.stopPropagation()
        }
        return
      }

      if (openStatus) {
        const menu = this.$refs.selectTriggerRef.getInnerMenu()
        if (menu && menu.onKeyDown(event, this.handleBackfill)) {
          event.preventDefault()
          event.stopPropagation()
        }
      }
    },

    onMenuSelect ({ item }) {
      let sValue = this.sValue
      const props = this.$props
      const selectedValue = getValuePropValue(item)
      const selectedLabel = this.labelMap.get(selectedValue)
      const lastValue = sValue[sValue.length - 1]
      this.fireSelect({
        key: selectedValue,
        label: selectedLabel,
      })
      const selectedTitle = this.titleMap.get(selectedValue)
      if (isMultipleOrTags(props)) {
        if (findIndexInValueByKey(sValue, selectedValue) !== -1) {
          return
        }
        sValue = sValue.concat([
          {
            key: selectedValue,
            label: selectedLabel,
            title: selectedTitle,
          },
        ])
      } else {
        if (isCombobox(props)) {
          this.skipAdjustOpen = true
          this.clearAdjustTimer()
          this.skipAdjustOpenTimer = setTimeout(() => {
            this.skipAdjustOpen = false
          }, 0)
        }
        if (lastValue && lastValue.key === selectedValue && !lastValue.backfill) {
          this.setOpenState(false, true)
          return
        }
        sValue = [
          {
            key: selectedValue,
            label: selectedLabel,
            title: selectedTitle,
          },
        ]
        this.setOpenState(false, true)
      }
      this.fireChange(sValue)
      let inputValue
      if (isCombobox(props)) {
        inputValue = selectedValue
      } else {
        inputValue = ''
      }
      this.setInputValue(inputValue, false)
    },

    onMenuDeselect ({ item, domEvent }) {
      if (domEvent.type === 'click') {
        this.removeSelected(getValuePropValue(item))
      }
      this.setInputValue('', false)
    },

    onArrowClick (e) {
      e.stopPropagation()
      e.preventDefault()
      if (!this.disabled) {
        this.setOpenState(!this.openStatus, !this.openStatus)
      }
    },

    onPlaceholderClick (e) {
      if (this.openStatus) {
        e.stopPropagation()
      }
      if (this.getInputDOMNode()) {
        this.getInputDOMNode().focus()
      }
    },

    // onOuterFocus (e) {
    //   if (this.disabled) {
    //     e.preventDefault()
    //     return
    //   }
    //   this.clearBlurTime()
    //   if (
    //     !isMultipleOrTagsOrCombobox(this.$props) &&
    //   e.target === this.getInputDOMNode()
    //   ) {
    //     return
    //   }
    //   if (this._focused) {
    //     return
    //   }
    //   this._focused = true
    //   this.updateFocusClassName()
    //   this.timeoutFocus()
    // },

    onPopupFocus () {
    // fix ie scrollbar, focus element again
      this.maybeFocus(true, true)
    },

    // onOuterBlur (e) {
    //   if (this.disabled) {
    //     e.preventDefault()
    //     return
    //   }
    //   this.blurTimer = setTimeout(() => {
    //     this._focused = false
    //     this.updateFocusClassName()
    //     const props = this.$props
    //     let { sValue } = this
    //     const { inputValue } = this
    //     if (
    //       isSingleMode(props) &&
    //     props.showSearch &&
    //     inputValue &&
    //     props.defaultActiveFirstOption
    //     ) {
    //       const options = this._options || []
    //       if (options.length) {
    //         const firstOption = findFirstMenuItem(options)
    //         if (firstOption) {
    //           sValue = [
    //             {
    //               key: firstOption.key,
    //               label: this.getLabelFromOption(firstOption),
    //             },
    //           ]
    //           this.fireChange(sValue)
    //         }
    //       }
    //     } else if (isMultipleOrTags(props) && inputValue) {
    //       this.inputValue = this.getInputDOMNode().value = ''
    //     }
    //     this.$emit('blur', this.getVLForOnChange(sValue))
    //     this.setOpenState(false)
    //   }, 10)
    // },

    onClearSelection (event) {
      const { inputValue, sValue, disabled } = this
      if (disabled) {
        return
      }
      if (inputValue || sValue.length) {
        if (sValue.length) {
          this.fireChange([])
        }
        this.setOpenState(false, true)
        if (inputValue) {
          this.setInputValue('')
        }
        if (this._focused) {
          this._focused = false
        } else {
          event.stopPropagation()
        }
      } else {
        event.stopPropagation()
      }
    },

    onChoiceAnimationLeave () {
      this.$refs.selectTriggerRef.$refs.triggerRef.forcePopupAlign()
    },
    getOptionsFromChildren (value, children = [], options = []) {
      let values = value
      if (!Array.isArray(value)) {
        values = [value]
      }
      children.forEach(child => {
        if (!child.data || child.data.slot !== undefined) {
          return
        }
        if (getSlotOptions(child).isSelectOptGroup) {
          this.getOptionsFromChildren(child.componentOptions.children, options)
        } else {
          const index = findIndexInValueByKey(values, getValuePropValue(child))
          if (index !== -1) {
            options[index] = child
          }
        }
      })
      values.forEach((v, i) => {
        if (!options[i]) {
          for (let j = 0; j < this._valueOptions.length; j++) {
            const item = this._valueOptions[j]
            if (getValuePropValue(item) === v.key) {
              options[i] = item
              break
            }
          }
          if (!options[i]) {
            options[i] = <Option value={v.key} key={v.key}>{this.labelMap.get(v.key)}</Option>
          }
        }
      })
      if (!Array.isArray(value)) {
        return options[0]
      }
      return options
    },
    getSingleOptionByValueKey (key) {
      return this.getOptionsFromChildren({
        key,
        label: key,
      }, this.$slots.default)
    },

    getOptionsByValue (value) {
      if (value === undefined) {
        return undefined
      }
      if (value.length === 0) {
        return []
      }
      return this.getOptionsFromChildren(value, this.$slots.default)
    },
    getLabelBySingleValue (children = [], value) {
      if (value === undefined) {
        return null
      }
      let label = null
      children.forEach(child => {
        if (!child.data || child.data.slot !== undefined) {
          return
        }
        if (getSlotOptions(child).isSelectOptGroup) {
          const maybe = this.getLabelBySingleValue(child.componentOptions.children, value)
          if (maybe !== null) {
            label = maybe
          }
        } else if (getValuePropValue(child) === value) {
          label = this.getLabelFromOption(child)
        }
      })
      return label
    },

    getValueByLabel (children = [], label) {
      if (label === undefined) {
        return null
      }
      let value = null
      children.forEach(child => {
        if (!child.data || child.data.slot !== undefined) {
          return
        }
        if (getSlotOptions(child).isSelectOptGroup) {
          const maybe = this.getValueByLabel(child.componentOptions.children, label)
          if (maybe !== null) {
            value = maybe
          }
        } else if (toArray(this.getLabelFromOption(child)).join('') === label) {
          value = getValuePropValue(child)
        }
      })
      return value
    },

    getLabelFromOption (child) {
      let label = getPropValue(child, this.optionLabelProp)
      if (Array.isArray(label) && label.length === 1 && !label[0].tag) {
        label = label[0].text
      }
      return label
    },

    getLabelFromProps (value) {
      return this.getLabelByValue(this.$slots.default || [], value)
    },

    getVLForOnChange (vls_) {
      let vls = vls_
      if (vls !== undefined) {
        if (!this.labelInValue) {
          vls = vls.map(v => v.key)
        } else {
          vls = vls.map(vl => ({ key: vl.key, label: this.labelMap.get(vl.key) }))
        }
        return isMultipleOrTags(this.$props) ? vls : vls[0]
      }
      return vls
    },

    getLabelByValue (children, value) {
      const label = this.getLabelBySingleValue(children, value)
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

    getPlaceholderElement () {
      // const { props, state } = this
      const { inputValue, sValue, placeholder, prefixCls, $props } = this
      let hidden = false
      if (inputValue) {
        hidden = true
      }
      if (sValue.length) {
        hidden = true
      }
      if (isCombobox($props) && sValue.length === 1 && !sValue[0].key) {
        hidden = false
      }
      if (placeholder) {
        const p = {
          on: {
            mousedown: preventDefaultEvent,
            click: this.onPlaceholderClick,
          },
          attrs: UNSELECTABLE_ATTRIBUTE,
          style: {
            display: hidden ? 'none' : 'block',
            ...UNSELECTABLE_STYLE,
          },
          class: `${prefixCls}-selection__placeholder`,
        }
        return (
          <div {...p}>
            {placeholder}
          </div>
        )
      }
      return null
    },
    inputClick (e) {
      if (this.openStatus) {
        this.clearBlurTime()
        e.stopPropagation()
      } else {
        this._focused = false
      }
    },
    inputBlur (e) {
      this.clearBlurTime()
      if (this.disabled) {
        return
      }
      this.blurTimer = setTimeout(() => {
        this._focused = false
        this.updateFocusClassName()
        const props = this.$props
        let { sValue } = this
        const { inputValue } = this
        if (
          isSingleMode(props) &&
        props.showSearch &&
        inputValue &&
        props.defaultActiveFirstOption
        ) {
          const options = this._options || []
          if (options.length) {
            const firstOption = findFirstMenuItem(options)
            if (firstOption) {
              sValue = [
                {
                  key: firstOption.key,
                  label: this.labelMap.get(firstOption.key),
                },
              ]
              this.fireChange(sValue)
            }
          }
        } else if (isMultipleOrTags(props) && inputValue) {
          this.inputValue = this.getInputDOMNode().value = ''
          sValue = this.getValueByInput(inputValue)
          this.fireChange(sValue)
        }
        this.$emit('blur', this.getVLForOnChange(sValue))
        this.setOpenState(false)
      }, 10)
    },
    inputFocus (e) {
      this.clearBlurTime()
      this.clearFocusTime()
      this.timeoutFocus()
    },
    _getInputElement () {
      const props = this.$props
      const attrs = getAttrs(this)
      const inputElement = props.getInputElement
        ? props.getInputElement()
        : <input id={attrs.id} autoComplete='off'/>
      const inputCls = classnames(getClass(inputElement), {
        [`${props.prefixCls}-search__field`]: true,
      })
      const inputEvents = getEvents(inputElement)
      // https://github.com/ant-design/ant-design/issues/4992#issuecomment-281542159
      // Add space to the end of the inputValue as the width measurement tolerance
      inputElement.data = inputElement.data || {}
      return (
        <div class={`${props.prefixCls}-search__field__wrap`} onClick={this.inputClick}>
          {cloneElement(inputElement, {
            props: {
              disabled: props.disabled,
              value: this.inputValue,
            },
            attrs: {
              ...(inputElement.data.attrs || {}),
              disabled: props.disabled,
              value: this.inputValue,
            },
            domProps: {
              value: this.inputValue,
            },
            class: inputCls,
            ref: 'inputRef',
            on: {
              input: this.onInputChange,
              keydown: chaining(
                this.onInputKeydown,
                inputEvents.keydown,
                this.$listeners.inputKeydown
              ),
              focus: chaining(
                this.inputFocus,
                inputEvents.focus,
              ),
              blur: chaining(
                this.inputBlur,
                inputEvents.blur,
              ),
            },
          })}
          <span
            ref='inputMirrorRef'
            class={`${props.prefixCls}-search__field__mirror`}
          >
            {this.inputValue}&nbsp;
          </span>
        </div>
      )
    },

    getInputDOMNode () {
      return this.$refs.topCtrlRef
        ? this.$refs.topCtrlRef.querySelector('input,textarea,div[contentEditable]')
        : this.$refs.inputRef
    },

    getInputMirrorDOMNode () {
      return this.$refs.inputMirrorRef
    },

    getPopupDOMNode () {
      return this.$refs.selectTriggerRef.getPopupDOMNode()
    },

    getPopupMenuComponent () {
      return this.$refs.selectTriggerRef.getInnerMenu()
    },

    setOpenState (open, needFocus) {
      const { $props: props, openStatus } = this
      if (openStatus === open) {
        this.maybeFocus(open, needFocus)
        return
      }
      const nextState = {
        sOpen: open,
      }
      // clear search input value when open is false in singleMode.
      if (!open && isSingleMode(props) && props.showSearch) {
        this.setInputValue('')
      }
      if (!open) {
        this.maybeFocus(open, needFocus)
      }
      this.setState(nextState, () => {
        if (open) {
          this.maybeFocus(open, needFocus)
        }
      })
    },

    setInputValue (inputValue, fireSearch = true) {
      if (inputValue !== this.inputValue) {
        this.setState({
          inputValue,
        })
        if (fireSearch) {
          this.$emit('search', inputValue)
        }
      }
    },
    getValueByInput (string) {
      const { multiple, tokenSeparators, $slots } = this
      let nextValue = this.sValue
      splitBySeparators(string, tokenSeparators).forEach(label => {
        const selectedValue = { key: label, label }
        if (findIndexInValueByLabel(nextValue, label) === -1) {
          if (multiple) {
            const value = this.getValueByLabel($slots.default, label)
            if (value) {
              selectedValue.key = value
              nextValue = nextValue.concat(selectedValue)
            }
          } else {
            nextValue = nextValue.concat(selectedValue)
          }
        }
        this.fireSelect({
          key: label,
          label,
        })
      })
      return nextValue
    },

    focus () {
      if (isSingleMode(this.$props)) {
        this.$refs.selectionRef.focus()
      } else {
        this.getInputDOMNode().focus()
      }
    },

    blur () {
      if (isSingleMode(this.$props)) {
        this.$refs.selectionRef.blur()
      } else {
        this.getInputDOMNode().blur()
      }
    },

    handleBackfill (item) {
      if (!this.backfill || !(isSingleMode(this.$props) || isCombobox(this.$props))) {
        return
      }

      const key = getValuePropValue(item)
      const label = this.labelMap.get(key)
      const backfillValue = {
        key,
        label,
        backfill: true,
      }

      if (isCombobox(this.$props)) {
        this.setInputValue(key, false)
      }

      this.setState({
        sValue: [backfillValue],
      })
    },

    _filterOption (input, child, defaultFilter = defaultFilterFn) {
      const { sValue } = this
      const lastValue = sValue[sValue.length - 1]
      if (!input || (lastValue && lastValue.backfill)) {
        return true
      }
      let filterFn = this.filterOption
      if (hasProp(this, 'filterOption')) {
        if (this.filterOption === true) {
          filterFn = defaultFilter
        }
      } else {
        filterFn = defaultFilter
      }
      if (!filterFn) {
        return true
      } else if (typeof filterFn === 'function') {
        return filterFn.call(this, input, child)
      } else if (getValue(child, 'disabled')) {
        return false
      }
      return true
    },

    timeoutFocus () {
      if (this.focusTimer) {
        this.clearFocusTime()
      }
      this.focusTimer = setTimeout(() => {
        this._focused = true
        this.updateFocusClassName()
        this.$emit('focus')
      }, 10)
    },

    clearFocusTime () {
      if (this.focusTimer) {
        clearTimeout(this.focusTimer)
        this.focusTimer = null
      }
    },

    clearBlurTime () {
      if (this.blurTimer) {
        clearTimeout(this.blurTimer)
        this.blurTimer = null
      }
    },

    clearAdjustTimer () {
      if (this.skipAdjustOpenTimer) {
        clearTimeout(this.skipAdjustOpenTimer)
        this.skipAdjustOpenTimer = null
      }
    },

    updateFocusClassName () {
      const { $refs: { rootRef }, prefixCls } = this
      // avoid setState and its side effect
      if (this._focused) {
        classes(rootRef).add(`${prefixCls}-focused`)
      } else {
        classes(rootRef).remove(`${prefixCls}-focused`)
      }
    },

    maybeFocus (open, needFocus) {
      if (needFocus || open) {
        const input = this.getInputDOMNode()
        const { activeElement } = document
        if (input && (open || isMultipleOrTagsOrCombobox(this.$props))) {
          if (activeElement !== input) {
            input.focus()
            this._focused = true
          }
        } else {
          if (activeElement !== this.$refs.selectionRef) {
            this.$refs.selectionRef.focus()
            this._focused = true
          }
        }
      }
    },

    // addLabelToValue (value_) {
    //   let value = value_
    //   if (this.labelInValue) {
    //     value.forEach(v => {
    //       v.label = v.label || this.getLabelFromProps(v.key)
    //     })
    //   } else {
    //     value = value.map(v => {
    //       return {
    //         key: v,
    //         label: this.getLabelFromProps(v),
    //       }
    //     })
    //   }
    //   return value
    // },

    // addTitleToValue (children = [], values) {
    //   let nextValues = values
    //   const keys = values.map(v => v.key)
    //   children.forEach(child => {
    //     if (!child) {
    //       return
    //     }
    //     if (getSlotOptions(child).isSelectOptGroup) {
    //       nextValues = this.addTitleToValue(child.componentOptions.children, nextValues)
    //     } else {
    //       const value = getValuePropValue(child)
    //       const valueIndex = keys.indexOf(value)
    //       if (valueIndex > -1) {
    //         nextValues[valueIndex].title = getValue(child, 'title')
    //       }
    //     }
    //   })
    //   return nextValues
    // },

    removeSelected (selectedKey) {
      const props = this.$props
      if (props.disabled || this.isChildDisabled(selectedKey)) {
        return
      }
      let label
      const value = this.sValue.filter(singleValue => {
        if (singleValue.key === selectedKey) {
          label = this.labelMap.get(selectedKey)
        }
        return singleValue.key !== selectedKey
      })
      const canMultiple = isMultipleOrTags(props)

      if (canMultiple) {
        let event = selectedKey
        if (props.labelInValue) {
          event = {
            key: selectedKey,
            label,
          }
        }
        this.$emit('deselect', event, this.getSingleOptionByValueKey(selectedKey))
      }
      this.fireChange(value)
    },

    openIfHasChildren () {
      const { $props, $slots } = this
      if (($slots.default && $slots.default.length) || isSingleMode($props)) {
        this.setOpenState(true)
      }
    },
    fireSelect (value) {
      const { labelInValue } = this
      this.$emit('select', labelInValue ? value : value.key, this.getSingleOptionByValueKey(value.key))
    },
    fireChange (value) {
      if (!hasProp(this, 'value')) {
        this.setState({
          sValue: value,
        })
      }
      const vls = this.getVLForOnChange(value)
      const options = this.getOptionsByValue(value)
      this._valueOptions = options
      this.$emit('change', vls, isMultipleOrTags(this.$props) ? options : options[0])
    },

    isChildDisabled (key) {
      return (this.$slots.default || []).some(child => {
        const childValue = getValuePropValue(child)
        return childValue === key && getValue(child, 'disabled')
      })
    },

    getOptionsAndOpenStatus () {
      let sOpen = this.sOpen
      if (this.skipAdjustOpen) {
        this.openStatus = sOpen
        return {
          options: this._options,
          open: sOpen,
        }
      }
      const { $props, showSearch } = this
      let options = []
      // If hidden menu due to no options, then it should be calculated again
      if (sOpen || this.hiddenForNoOptions) {
        options = this.renderFilterOptions()
      }
      this._options = options

      if (isMultipleOrTagsOrCombobox($props) || !showSearch) {
        if (sOpen && !options.length) {
          sOpen = false
          this.hiddenForNoOptions = true
        }
        // Keep menu open if there are options and hidden for no options before
        if (this.hiddenForNoOptions && options.length) {
          sOpen = true
          this.hiddenForNoOptions = false
        }
      }
      this.openStatus = sOpen
      return {
        options,
        open: sOpen,
      }
    },
    renderFilterOptions () {
      const { inputValue } = this
      const { $slots, tags, filterOption, notFoundContent } = this
      const menuItems = []
      const childrenKeys = []
      let options = this.renderFilterOptionsFromChildren(
        $slots.default,
        childrenKeys,
        menuItems,
      )
      if (tags) {
      // tags value must be string
        let value = this.sValue || []
        value = value.filter(singleValue => {
          return (
            childrenKeys.indexOf(singleValue.key) === -1 &&
          (!inputValue ||
            String(singleValue.key).indexOf(String(inputValue)) > -1)
          )
        })
        value.forEach(singleValue => {
          const key = singleValue.key
          const menuItem = (
            <MenuItem
              style={UNSELECTABLE_STYLE}
              {...{ attrs: UNSELECTABLE_ATTRIBUTE }}
              value={key}
              key={key}
            >
              {key}
            </MenuItem>
          )
          options.push(menuItem)
          menuItems.push(menuItem)
        })
        if (inputValue) {
          const notFindInputItem = menuItems.every(option => {
          // this.filterOption return true has two meaning,
          // 1, some one exists after filtering
          // 2, filterOption is set to false
          // condition 2 does not mean the option has same value with inputValue
            const filterFn = () => getValuePropValue(option) === inputValue
            if (filterOption !== false) {
              return !this._filterOption(
                inputValue,
                option,
                filterFn
              )
            }
            return !filterFn()
          })
          if (notFindInputItem) {
            const p = {
              attrs: UNSELECTABLE_ATTRIBUTE,
              key: inputValue,
              props: {
                value: inputValue,
              },
              style: UNSELECTABLE_STYLE,
            }
            options.unshift(
              <MenuItem {...p}>
                {inputValue}
              </MenuItem>
            )
          }
        }
      }

      if (!options.length && notFoundContent) {
        const p = {
          attrs: UNSELECTABLE_ATTRIBUTE,
          key: 'NOT_FOUND',
          props: {
            value: 'NOT_FOUND',
            disabled: true,
          },
          style: UNSELECTABLE_STYLE,
        }
        options = [
          <MenuItem {...p}>
            {notFoundContent}
          </MenuItem>,
        ]
      }
      return options
    },

    renderFilterOptionsFromChildren (children = [], childrenKeys, menuItems) {
      const sel = []
      const props = this.$props
      const { inputValue } = this
      const tags = props.tags
      children.forEach(child => {
        if (!child.data || child.data.slot !== undefined) {
          return
        }
        if (getSlotOptions(child).isSelectOptGroup) {
          const innerItems = this.renderFilterOptionsFromChildren(
            child.componentOptions.children,
            childrenKeys,
            menuItems,
          )
          if (innerItems.length) {
            let label = getComponentFromProp(child, 'label')
            let key = child.key
            if (!key && typeof label === 'string') {
              key = label
            } else if (!label && key) {
              label = key
            }
            sel.push(
              <MenuItemGroup key={key} title={label} class ={getClass(child)}>
                {innerItems}
              </MenuItemGroup>
            )
          }
          return
        }
        warning(
          getSlotOptions(child).isSelectOption,
          'the children of `Select` should be `Select.Option` or `Select.OptGroup`, ' +
          `instead of \`${getSlotOptions(child).name ||
            getSlotOptions(child)}\`.`
        )

        const childValue = getValuePropValue(child)

        validateOptionValue(childValue, this.$props)
        if (this._filterOption(inputValue, child)) {
          const p = {
            attrs: UNSELECTABLE_ATTRIBUTE,
            key: childValue,
            props: {
              value: childValue,
              ...getPropsData(child),
            },
            style: UNSELECTABLE_STYLE,
            on: getEvents(child),
            class: getClass(child),
          }
          const menuItem = (
            <MenuItem {...p}>{child.componentOptions.children}</MenuItem>
          )
          sel.push(menuItem)
          menuItems.push(menuItem)
        }
        if (tags && !getValue(child, 'disabled')) {
          childrenKeys.push(childValue)
        }
      })

      return sel
    },

    renderTopControlNode (openStatus) {
      const { sValue, inputValue, $props: props } = this
      const {
        choiceTransitionName,
        prefixCls,
        maxTagTextLength,
        maxTagCount,
        maxTagPlaceholder,
        showSearch,
      } = props
      const className = `${prefixCls}-selection__rendered`
      // search input is inside topControlNode in single, multiple & combobox. 2016/04/13
      let innerNode = null
      if (isSingleMode(props)) {
        let selectedValue = null
        if (sValue.length) {
          let showSelectedValue = false
          let opacity = 1
          if (!showSearch) {
            showSelectedValue = true
          } else {
            if (openStatus) {
              showSelectedValue = !inputValue
              if (showSelectedValue) {
                opacity = 0.4
              }
            } else {
              showSelectedValue = true
            }
          }
          const singleValue = sValue[0]
          const key = singleValue.key
          let title = this.titleMap.get(key) || this.labelMap.get(key)
          if (Array.isArray(title)) {
            title = ''
          }
          selectedValue = (
            <div
              key='value'
              class={`${prefixCls}-selection-selected-value`}
              title={title}
              style={{
                display: showSelectedValue ? 'block' : 'none',
                opacity,
              }}
            >
              {this.labelMap.get(key)}
            </div>
          )
        }
        if (!showSearch) {
          innerNode = [selectedValue]
        } else {
          innerNode = [
            selectedValue,
            <div
              class={`${prefixCls}-search ${prefixCls}-search--inline`}
              key='input'
              style={{
                display: openStatus ? 'block' : 'none',
              }}
            >
              {this._getInputElement()}
            </div>,
          ]
        }
      } else {
        let selectedValueNodes = []
        let limitedCountValue = sValue
        let maxTagPlaceholderEl
        if (maxTagCount !== undefined && sValue.length > maxTagCount) {
          limitedCountValue = limitedCountValue.slice(0, maxTagCount)
          const omittedValues = this.getVLForOnChange(sValue.slice(maxTagCount, sValue.length))
          let content = `+ ${sValue.length - maxTagCount} ...`
          if (maxTagPlaceholder) {
            content = typeof maxTagPlaceholder === 'function'
              ? maxTagPlaceholder(omittedValues) : maxTagPlaceholder
          }
          maxTagPlaceholderEl = (<li
            style={UNSELECTABLE_STYLE}
            unselectable='unselectable'
            onMousedown={preventDefaultEvent}
            class={`${prefixCls}-selection__choice ${prefixCls}-selection__choice__disabled`}
            key={'maxTagPlaceholder'}
            title={content}
          >
            <div class={`${prefixCls}-selection__choice__content`}>{content}</div>
          </li>)
        }
        if (isMultipleOrTags(props)) {
          selectedValueNodes = limitedCountValue.map(singleValue => {
            let content = this.labelMap.get(singleValue.key)
            const title = this.titleMap.get(singleValue.key) || content
            if (
              maxTagTextLength &&
            typeof content === 'string' &&
            content.length > maxTagTextLength
            ) {
              content = `${content.slice(0, maxTagTextLength)}...`
            }
            const disabled = this.isChildDisabled(singleValue.key)
            const choiceClassName = disabled
              ? `${prefixCls}-selection__choice ${prefixCls}-selection__choice__disabled`
              : `${prefixCls}-selection__choice`
            return (
              <li
                style={UNSELECTABLE_STYLE}
                unselectable='unselectable'
                onMousedown={preventDefaultEvent}
                class={choiceClassName}
                key={singleValue.key}
                title={title}
              >
                <div class={`${prefixCls}-selection__choice__content`}>
                  {content}
                </div>
                {disabled ? null : (
                  <span
                    class={`${prefixCls}-selection__choice__remove`}
                    onClick={this.removeSelected.bind(this, singleValue.key)}
                  />)}
              </li>
            )
          })
        }
        if (maxTagPlaceholderEl) {
          selectedValueNodes.push(maxTagPlaceholderEl)
        }
        selectedValueNodes.push(
          <li
            class={`${prefixCls}-search ${prefixCls}-search--inline`}
            key='__input'
          >
            {this._getInputElement()}
          </li>
        )

        if (isMultipleOrTags(props) && choiceTransitionName) {
          const transitionProps = getTransitionProps(choiceTransitionName, {
            tag: 'ul',
            afterLeave: this.onChoiceAnimationLeave,
          })
          innerNode = (
            <transition-group
              {...transitionProps}
            >
              {selectedValueNodes}
            </transition-group>
          )
        } else {
          innerNode = (
            <ul>
              {selectedValueNodes}
            </ul>
          )
        }
      }
      return (
        <div class={className} ref='topCtrlRef' onClick={this.topCtrlContainerClick}>
          {this.getPlaceholderElement()}
          {innerNode}
        </div>
      )
    },
    topCtrlContainerClick (e) {
      if (this.openStatus && !isSingleMode(this.$props)) {
        e.stopPropagation()
      }
    },
    renderClear () {
      const { prefixCls, allowClear, sValue, inputValue } = this
      const clear = (
        <span
          key='clear'
          onMousedown={preventDefaultEvent}
          style={UNSELECTABLE_STYLE}
          unselectable='unselectable'
          class={`${prefixCls}-selection__clear`}
          onClick={this.onClearSelection}
        />
      )
      if (!allowClear) {
        return null
      }
      if (isCombobox(this.$props)) {
        if (inputValue) {
          return clear
        }
        return null
      }
      if (inputValue || sValue.length) {
        return clear
      }
      return null
    },
    // rootRefClick (e) {
    //   // e.stopPropagation()
    //   if (this._focused) {
    //     // this.getInputDOMNode().blur()
    //     this.onOuterBlur()
    //   } else {
    //     this.onOuterFocus()
    //     // this.getInputDOMNode().focus()
    //   }
    // },
    selectionRefClick (e) {
      e.stopPropagation()
      if (!this.disabled) {
        const input = this.getInputDOMNode()
        if (this._focused && this.openStatus) {
          this._focused = false
          this.setOpenState(false, false)
          input && input.blur()
        } else {
          this.clearBlurTime()
          this._focused = true
          this.setOpenState(true, true)
          input && input.focus()
        }
      }
    },
    selectionRefFocus (e) {
      if (this._focused || this.disabled) {
        return
      }
      this._focused = true
      this.updateFocusClassName()
      this.$emit('focus')
    },
    selectionRefBlur (e) {
      this._focused = false
      this.updateFocusClassName()
      this.$emit('blur')
    },
  },

  render () {
    this.initLabelAndTitleMap()
    const props = this.$props
    const multiple = isMultipleOrTags(props)
    const preOptions = this._options || []
    const { options, open: openStatus } = this.getOptionsAndOpenStatus()
    const { disabled, prefixCls, inputValue, sValue, $listeners } = this
    const { mouseenter = noop, mouseleave = noop, popupScroll = noop } = $listeners
    const ctrlNode = this.renderTopControlNode(openStatus)
    const selectionProps = {
      props: {},
      attrs: {
        role: 'combobox',
        'aria-autocomplete': 'list',
        'aria-haspopup': 'true',
        'aria-expanded': openStatus.toString(),
      },
      on: {
        click: this.selectionRefClick,
      },
      class: `${prefixCls}-selection ${prefixCls}-selection--${multiple ? 'multiple' : 'single'}`,
      ref: 'selectionRef',
      key: 'selection',

    }
    if (!isMultipleOrTagsOrCombobox(props)) {
      selectionProps.on.keydown = this.onKeyDown
      selectionProps.on.focus = this.selectionRefFocus
      selectionProps.on.blur = this.selectionRefBlur
      selectionProps.attrs.tabIndex = props.disabled ? -1 : 0
    }
    const rootCls = {
      ...getClass(this),
      [prefixCls]: true,
      [`${prefixCls}-open`]: openStatus,
      [`${prefixCls}-focused`]: openStatus || !!this._focused,
      [`${prefixCls}-combobox`]: isCombobox(props),
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-enabled`]: !disabled,
      [`${prefixCls}-allow-clear`]: !!props.allowClear,
    }
    return (
      <SelectTrigger
        dropdownAlign={props.dropdownAlign}
        dropdownClassName={props.dropdownClassName}
        dropdownMatchSelectWidth={props.dropdownMatchSelectWidth}
        defaultActiveFirstOption={props.defaultActiveFirstOption}
        dropdownMenuStyle={props.dropdownMenuStyle}
        transitionName={props.transitionName}
        animation={props.animation}
        prefixCls={props.prefixCls}
        dropdownStyle={props.dropdownStyle}
        combobox={props.combobox}
        showSearch={props.showSearch}
        options={options.length || openStatus ? options : preOptions}
        multiple={multiple}
        disabled={disabled}
        visible={openStatus}
        inputValue={inputValue}
        value={sValue}
        firstActiveValue={props.firstActiveValue}
        onDropdownVisibleChange={this.onDropdownVisibleChange}
        getPopupContainer={props.getPopupContainer}
        onMenuSelect={this.onMenuSelect}
        onMenuDeselect={this.onMenuDeselect}
        onPopupScroll={popupScroll}
        onPopupFocus={this.onPopupFocus}
        onMouseenter={mouseenter}
        onMouseleave={mouseleave}
        showAction={props.showAction}
        ref='selectTriggerRef'
      >
        <div
          ref='rootRef'
          style={getStyle(this)}
          class={classnames(rootCls)}
          // tabindex='-1'
          // onBlur={this.onOuterBlur}
          // onFocus={this.onOuterFocus}
        >
          <div {...selectionProps}>
            {ctrlNode}
            {this.renderClear()}
            {multiple || !props.showArrow ? null : (
              <span
                key='arrow'
                class={`${prefixCls}-arrow`}
                style={UNSELECTABLE_STYLE}
                unselectable='unselectable'
                // onClick={this.onArrowClick}
              >
                <b />
              </span>)}
          </div>
        </div>
      </SelectTrigger>
    )
  },
}

