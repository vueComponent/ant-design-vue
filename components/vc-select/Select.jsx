
import KeyCode from '../_util/KeyCode'
import PropTypes from '../_util/vue-types'
import classnames from 'classnames'
import classes from 'component-classes'
import { Item as MenuItem, ItemGroup as MenuItemGroup } from '../vc-menu'
import warning from 'warning'
import Vue from 'vue'
import Option from './Option'
import { hasProp, getSlotOptions, getPropsData, getValueByProp as getValue, getComponentFromProp, getEvents, getClass, getStyle, getAttrs, getOptionProps } from '../_util/props-util'
import getTransitionProps from '../_util/getTransitionProps'
import { cloneElement } from '../_util/vnode'
import BaseMixin from '../_util/BaseMixin'
import proxyComponent from '../_util/proxyComponent'
import ref from 'vue-ref'

Vue.use(ref, { name: 'ant-ref' })

import {
  getPropValue,
  getValuePropValue,
  isCombobox,
  isMultipleOrTags,
  isMultipleOrTagsOrCombobox,
  isSingleMode,
  toArray,
  getMapKey,
  findIndexInValueBySingleValue,
  getLabelFromPropsValue,
  UNSELECTABLE_ATTRIBUTE,
  UNSELECTABLE_STYLE,
  preventDefaultEvent,
  findFirstMenuItem,
  includesSeparators,
  splitBySeparators,
  defaultFilterFn,
  validateOptionValue,
  saveRef,
  toTitle,
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
const Select = {
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
    autoClearSearchValue: PropTypes.bool.def(true),
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
  created () {
    this.saveInputRef = saveRef(this, 'inputRef')
    this.saveInputMirrorRef = saveRef(this, 'inputMirrorRef')
    this.saveTopCtrlRef = saveRef(this, 'topCtrlRef')
    this.saveSelectTriggerRef = saveRef(this, 'selectTriggerRef')
    this.saveRootRef = saveRef(this, 'rootRef')
    this.saveSelectionRef = saveRef(this, 'selectionRef')
  },
  data () {
    const props = getOptionProps(this)
    const optionsInfo = this.getOptionsInfoFromProps(props)
    warning(
      this.__propsSymbol__,
      'Replace slots.default with props.children and pass props.__propsSymbol__'
    )
    return {
      _value: this.getValueFromProps(props, true), // true: use default value
      _inputValue: props.combobox ? this.getInputValueForCombobox(
        props,
        optionsInfo,
        true, // use default value
      ) : '',
      _open: props.defaultOpen,
      _optionsInfo: optionsInfo,
      // a flag for aviod redundant getOptionsInfoFromProps call
      _skipBuildOptionsInfo: true,
    }
  },
  beforeMount () {
    const state = this.getDerivedStateFromProps(getOptionProps(this), this.$data)
    Object.assign(this.$data, state)
  },

  mounted () {
    this.$nextTick(() => {
      this.autoFocus && this.focus()
    })
  },
  watch: {
    __propsSymbol__ () {
      Object.assign(this.$data, this.getDerivedStateFromProps(getOptionProps(this), this.$data))
    },
    // value (val) {
    //   let sValue = toArray(val)
    //   if (this.labelInValue) {
    //     sValue.forEach(v => {
    //       v.key = v.key !== undefined ? v.key : v.value
    //     })
    //   } else {
    //     sValue = sValue.map(v => {
    //       return {
    //         key: v,
    //       }
    //     })
    //   }
    //   this.sValue = sValue
    //   this.initLabelAndTitleMap(sValue)
    //   sValue.forEach((val) => {
    //     const key = val.key
    //     let { label, title } = val
    //     label = label === undefined ? this.labelMap.get(key) : label
    //     title = title === undefined ? this.titleMap.get(key) : title
    //     this.labelMap.set(key, label === undefined ? key : label)
    //     this.titleMap.set(key, title)
    //   })

    //   if (this.combobox) {
    //     this.setState({
    //       _inputValue: sValue.length ? this.labelMap.get((sValue[0].key)) : '',
    //     })
    //   }
    // },
    // combobox (val) {
    //   if (val) {
    //     this.setState({
    //       _inputValue: this.sValue.length ? this.labelMap.get((this.sValue[0].key)) : '',
    //     })
    //   }
    // },
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
      this.forcePopupAlign()
    })
  },
  beforeDestroy () {
    this.clearFocusTime()
    this.clearBlurTime()
    if (this.dropdownContainer) {
      document.body.removeChild(this.dropdownContainer)
      this.dropdownContainer = null
    }
  },
  methods: {
    getDerivedStateFromProps (nextProps, prevState) {
      const optionsInfo = prevState._skipBuildOptionsInfo
        ? prevState._optionsInfo
        : this.getOptionsInfoFromProps(nextProps, prevState)

      const newState = {
        _optionsInfo: optionsInfo,
        _skipBuildOptionsInfo: false,
      }

      if ('open' in nextProps) {
        newState._open = nextProps.open
      }

      if ('value' in nextProps) {
        const value = this.getValueFromProps(nextProps)
        newState._value = value
        if (nextProps.combobox) {
          newState._inputValue = this.getInputValueForCombobox(
            nextProps,
            optionsInfo,
          )
        }
      }
      return newState
    },
    // initLabelAndTitleMap (sValue) {
    //   // 保留已选中的label and title
    //   const labelArr = []
    //   const titleArr = []
    //   const values = sValue || this.sValue
    //   values.forEach((val) => {
    //     const key = val.key
    //     let { label, title } = val
    //     label = label === undefined ? this.labelMap.get(key) : label
    //     title = title === undefined ? this.titleMap.get(key) : title
    //     title = typeof title === 'string' ? title.trim() : title
    //     labelArr.push([key, label === undefined ? key : label])
    //     titleArr.push([key, title])
    //   })
    //   this.labelMap = new Map(labelArr)
    //   this.titleMap = new Map(titleArr)

    //   this.updateLabelAndTitleMap(this.$props.children)
    // },
    // updateLabelAndTitleMap (children = []) {
    //   children.forEach(child => {
    //     if (!child.data || child.data.slot !== undefined) {
    //       return
    //     }
    //     if (getSlotOptions(child).isSelectOptGroup) {
    //       this.updateLabelAndTitleMap(child.componentOptions.children)
    //     } else {
    //       const key = getValuePropValue(child)
    //       this.titleMap.set(key, getValue(child, 'title'))
    //       this.labelMap.set(key, this.getLabelFromOption(child))
    //     }
    //   })
    // },
    onInputChange (event) {
      const { tokenSeparators } = this.$props
      const val = event.target.value
      if (
        isMultipleOrTags(this.$props) &&
      tokenSeparators.length &&
      includesSeparators(val, tokenSeparators)
      ) {
        const nextValue = this.getValueByInput(val)
        if (nextValue !== undefined) {
          this.fireChange(nextValue)
        }
        this.setOpenState(false, true)
        this.setInputValue('', false)
        return
      }
      this.setInputValue(val)
      this.setState({
        _open: true,
      })
      if (isCombobox(this.$props)) {
        this.fireChange([val])
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
      const props = this.$props
      if (props.disabled) {
        return
      }
      const keyCode = event.keyCode
      if (this.$data._open && !this.getInputDOMNode()) {
        this.onInputKeydown(event)
      } else if (keyCode === KeyCode.ENTER || keyCode === KeyCode.DOWN) {
        // vue state是同步更新，onKeyDown在onMenuSelect后会再次调用，单选时不在调用setOpenState
        if (keyCode === KeyCode.ENTER && !isMultipleOrTags(props)) {
          this.maybeFocus(true)
        } else {
          this.setOpenState(true)
        }
        event.preventDefault()
      }
    },

    onInputKeydown (event) {
      const props = this.$props
      if (props.disabled) {
        return
      }
      const state = this.$data
      const keyCode = event.keyCode
      if (
        isMultipleOrTags(props) &&
      !event.target.value &&
      keyCode === KeyCode.BACKSPACE
      ) {
        event.preventDefault()
        const { _value: value } = state
        if (value.length) {
          this.removeSelected(value[value.length - 1])
        }
        return
      }
      if (keyCode === KeyCode.DOWN) {
        if (!state._open) {
          this.openIfHasChildren()
          event.preventDefault()
          event.stopPropagation()
          return
        }
      } else if (keyCode === KeyCode.ENTER && state._open) {
      // Aviod trigger form submit when select item
      // https://github.com/ant-design/ant-design/issues/10861
        event.preventDefault()
      } else if (keyCode === KeyCode.ESC) {
        if (state._open) {
          this.setOpenState(false)
          event.preventDefault()
          event.stopPropagation()
        }
        return
      }

      if (state._open) {
        const menu = this.selectTriggerRef.getInnerMenu()
        if (menu && menu.onKeyDown(event, this.handleBackfill)) {
          event.preventDefault()
          event.stopPropagation()
        }
      }
    },

    onMenuSelect ({ item }) {
      if (!item) {
        return
      }
      let value = this.$data._value
      const props = this.$props
      const selectedValue = getValuePropValue(item)
      const lastValue = value[value.length - 1]
      this.fireSelect(selectedValue)
      if (isMultipleOrTags(props)) {
        if (findIndexInValueBySingleValue(value, selectedValue) !== -1) {
          return
        }
        value = value.concat([selectedValue])
      } else {
        if (lastValue && lastValue === selectedValue && selectedValue !== this.$data._backfillValue) {
          this.setOpenState(false, true)
          return
        }
        value = [selectedValue]
        this.setOpenState(false, true)
      }
      this.fireChange(value)
      let inputValue
      if (isCombobox(props)) {
        inputValue = getPropValue(item, props.optionLabelProp)
      } else {
        inputValue = ''
      }
      if (props.autoClearSearchValue) {
        this.setInputValue(inputValue, false)
      }
    },

    onMenuDeselect ({ item, domEvent }) {
      if (domEvent.type === 'click') {
        this.removeSelected(getValuePropValue(item))
      }
      if (this.autoClearSearchValue) {
        this.setInputValue('', false)
      }
    },

    onArrowClick (e) {
      e.stopPropagation()
      e.preventDefault()
      if (!this.disabled) {
        this.setOpenState(!this.$data._open, !this.$data._open)
      }
    },

    onPlaceholderClick (e) {
      // if (this.openStatus) {
      //   e.stopPropagation()
      // }
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
      const props = this.$props
      const state = this.$data
      if (props.disabled) {
        return
      }
      const { _inputValue: inputValue, _value: value } = state
      event.stopPropagation()
      if (inputValue || value.length) {
        if (value.length) {
          this.fireChange([])
        }
        this.setOpenState(false, true)
        if (inputValue) {
          this.setInputValue('')
        }
      }
    },

    onChoiceAnimationLeave () {
      this.forcePopupAlign()
    },
    getOptionsFromChildren (children = [], options = []) {
      children.forEach(child => {
        if (!child.data || child.data.slot !== undefined) {
          return
        }
        if (getSlotOptions(child).isSelectOptGroup) {
          this.getOptionsFromChildren(child.componentOptions.children, options)
        } else {
          options.push(child)
        }
      })
      return options
    },
    getInputValueForCombobox (props, optionsInfo, useDefaultValue) {
      let value = []
      if ('value' in props && !useDefaultValue) {
        value = toArray(props.value)
      }
      if ('defaultValue' in props && useDefaultValue) {
        value = toArray(props.defaultValue)
      }
      if (value.length) {
        value = value[0]
      } else {
        return ''
      }
      let label = value
      if (props.labelInValue) {
        label = value.label
      } else if (optionsInfo[getMapKey(value)]) {
        label = optionsInfo[getMapKey(value)].label
      }
      if (label === undefined) {
        label = ''
      }
      return label
    },

    getLabelFromOption (props, option) {
      return getPropValue(option, props.optionLabelProp)
    },

    getOptionsInfoFromProps (props, preState) {
      const options = this.getOptionsFromChildren(this.$props.children)
      const optionsInfo = {}
      options.forEach((option) => {
        const singleValue = getValuePropValue(option)
        optionsInfo[getMapKey(singleValue)] = {
          option,
          value: singleValue,
          label: this.getLabelFromOption(props, option),
          title: getValue(option, 'title'),
        }
      })
      if (preState) {
        // keep option info in pre state value.
        const oldOptionsInfo = preState._optionsInfo
        const value = preState._value
        value.forEach(v => {
          const key = getMapKey(v)
          if (!optionsInfo[key] && oldOptionsInfo[key] !== undefined) {
            optionsInfo[key] = oldOptionsInfo[key]
          }
        })
      }
      return optionsInfo
    },

    getValueFromProps (props, useDefaultValue) {
      let value = []
      if ('value' in props && !useDefaultValue) {
        value = toArray(props.value)
      }
      if ('defaultValue' in props && useDefaultValue) {
        value = toArray(props.defaultValue)
      }
      if (props.labelInValue) {
        value = value.map((v) => {
          return v.key
        })
      }
      return value
    },

    getOptionInfoBySingleValue  (value, optionsInfo) {
      let info
      optionsInfo = optionsInfo || this.$data._optionsInfo
      if (optionsInfo[getMapKey(value)]) {
        info = optionsInfo[getMapKey(value)]
      }
      if (info) {
        return info
      }
      let defaultLabel = value
      if (this.$props.labelInValue) {
        const label = getLabelFromPropsValue(this.$props.value, value)
        if (label !== undefined) {
          defaultLabel = label
        }
      }
      const defaultInfo = {
        option: <Option value={value} key={value}>{value}</Option>,
        value,
        label: defaultLabel,
      }
      return defaultInfo
    },

    getOptionBySingleValue  (value) {
      const { option } = this.getOptionInfoBySingleValue(value)
      return option
    },

    getOptionsBySingleValue (values) {
      return values.map(value => {
        return this.getOptionBySingleValue(value)
      })
    },
    // getSingleOptionByValueKey (key) {
    //   return this.getOptionsFromChildren({
    //     key,
    //     label: key,
    //   }, this.$props.children)
    // },

    // getOptionsByValue (value) {
    //   if (value === undefined) {
    //     return undefined
    //   }
    //   if (value.length === 0) {
    //     return []
    //   }
    //   return this.getOptionsFromChildren(value, this.$props.children)
    // },
    // getLabelBySingleValue (children = [], value) {
    //   if (value === undefined) {
    //     return null
    //   }
    //   let label = null
    //   children.forEach(child => {
    //     if (!child.data || child.data.slot !== undefined) {
    //       return
    //     }
    //     if (getSlotOptions(child).isSelectOptGroup) {
    //       const maybe = this.getLabelBySingleValue(child.componentOptions.children, value)
    //       if (maybe !== null) {
    //         label = maybe
    //       }
    //     } else if (getValuePropValue(child) === value) {
    //       label = this.getLabelFromOption(child)
    //     }
    //   })
    //   return label
    // },
    getValueByLabel  (label) {
      if (label === undefined) {
        return null
      }
      let value = null
      Object.keys(this.$data._optionsInfo).forEach(key => {
        const info = this.$data._optionsInfo[key]
        if (toArray(info.label).join('') === label) {
          value = info.value
        }
      })
      return value
    },
    // getValueByLabel (children = [], label) {
    //   if (label === undefined) {
    //     return null
    //   }
    //   let value = null
    //   children.forEach(child => {
    //     if (!child.data || child.data.slot !== undefined) {
    //       return
    //     }
    //     if (getSlotOptions(child).isSelectOptGroup) {
    //       const maybe = this.getValueByLabel(child.componentOptions.children, label)
    //       if (maybe !== null) {
    //         value = maybe
    //       }
    //     } else if (toArray(this.getLabelFromOption(child)).join('') === label) {
    //       value = getValuePropValue(child)
    //     }
    //   })
    //   return value
    // },

    // getLabelFromOption (child) {
    //   let label = getPropValue(child, this.optionLabelProp)
    //   if (Array.isArray(label) && label.length === 1 && !label[0].tag) {
    //     label = label[0].text
    //   }
    //   return label
    // },
    getVLBySingleValue  (value) {
      if (this.$props.labelInValue) {
        return {
          key: value,
          label: this.getLabelBySingleValue(value),
        }
      }
      return value
    },
    // getLabelFromProps (value) {
    //   return this.getLabelByValue(this.$props.children || [], value)
    // },

    getVLForOnChange (vls_) {
      let vls = vls_
      if (vls !== undefined) {
        if (!this.labelInValue) {
          vls = vls.map(v => v)
        } else {
          vls = vls.map(vl => ({
            key: vl,
            label: this.getLabelBySingleValue(vl),
          }))
        }
        return isMultipleOrTags(this.$props) ? vls : vls[0]
      }
      return vls
    },

    getLabelBySingleValue (value, optionsInfo) {
      const { label } = this.getOptionInfoBySingleValue(value, optionsInfo)
      return label
    },

    // getLabelByValue (children, value) {
    //   const label = this.getLabelBySingleValue(children, value)
    //   if (label === null) {
    //     return value
    //   }
    //   return label
    // },

    getDropdownContainer () {
      if (!this.dropdownContainer) {
        this.dropdownContainer = document.createElement('div')
        document.body.appendChild(this.dropdownContainer)
      }
      return this.dropdownContainer
    },

    getPlaceholderElement () {
      const { $props: props, $data: state } = this
      let hidden = false
      if (state._inputValue) {
        hidden = true
      }
      if (state._value.length) {
        hidden = true
      }
      if (isCombobox(props) && state._value.length === 1 && !state._value[0]) {
        hidden = false
      }
      const placeholder = props.placeholder
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
          class: `${props.prefixCls}-selection__placeholder`,
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
      if (this.$data._open) {
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
        let { _value: value } = this.$data
        const { _inputValue: inputValue } = this.$data
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
              value = [getValuePropValue(firstOption)]
              this.fireChange(value)
            }
          }
        } else if (isMultipleOrTags(props) && inputValue) {
          this.$data._inputValue = this.getInputDOMNode().value = ''
          value = this.getValueByInput(inputValue)
          if (value !== undefined) {
            this.fireChange(value)
          }
        }
        this.$emit('blur', this.getVLForOnChange(value))
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
      const { _inputValue: inputValue } = this.$data
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
              value: inputValue,
            },
            attrs: {
              ...(inputElement.data.attrs || {}),
              disabled: props.disabled,
              value: inputValue,
            },
            domProps: {
              value: inputValue,
            },
            class: inputCls,
            directives: [{
              name: 'ant-ref',
              value: this.saveInputRef,
            }],
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
            {...{ directives: [{
              name: 'ref',
              value: this.saveInputMirrorRef,
            }] }}
            // ref='inputMirrorRef'
            class={`${props.prefixCls}-search__field__mirror`}
          >
            {inputValue}&nbsp;
          </span>
        </div>
      )
    },

    getInputDOMNode () {
      return this.topCtrlRef
        ? this.topCtrlRef.querySelector('input,textarea,div[contentEditable]')
        : this.inputRef
    },

    getInputMirrorDOMNode () {
      return this.inputMirrorRef
    },

    getPopupDOMNode () {
      return this.selectTriggerRef.getPopupDOMNode()
    },

    getPopupMenuComponent () {
      return this.selectTriggerRef.getInnerMenu()
    },

    setOpenState (open, needFocus) {
      const { $props: props, $data: state } = this
      if (state._open === open) {
        this.maybeFocus(open, needFocus)
        return
      }
      const nextState = {
        _open: open,
        _backfillValue: undefined,
      }
      // clear search input value when open is false in singleMode.
      if (!open && isSingleMode(props) && props.showSearch) {
        this.setInputValue('', false)
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
      if (inputValue !== this.$data._inputValue) {
        this.setState({
          _inputValue: inputValue,
        }, this.forcePopupAlign)
        if (fireSearch) {
          this.$emit('search', inputValue)
        }
      }
    },
    getValueByInput  (string) {
      const { multiple, tokenSeparators } = this.$props
      let nextValue = this.$data._value
      let hasNewValue = false
      splitBySeparators(string, tokenSeparators).forEach(label => {
        const selectedValue = [label]
        if (multiple) {
          const value = this.getValueByLabel(label)
          if (value && findIndexInValueBySingleValue(nextValue, value) === -1) {
            nextValue = nextValue.concat(value)
            hasNewValue = true
            this.fireSelect(value)
          }
        } else {
          // tag
          if (findIndexInValueBySingleValue(nextValue, label) === -1) {
            nextValue = nextValue.concat(selectedValue)
            hasNewValue = true
            this.fireSelect(label)
          }
        }
      })
      return hasNewValue ? nextValue : undefined
    },

    getRealOpenState  () {
      let open = this.$data._open
      const options = this._options || []
      if (isMultipleOrTagsOrCombobox(this.$props) || !this.$props.showSearch) {
        if (open && !options.length) {
          open = false
        }
      }
      return open
    },
    // getValueByInput (string) {
    //   const { multiple, tokenSeparators, $slots } = this
    //   let nextValue = this.sValue
    //   splitBySeparators(string, tokenSeparators).forEach(label => {
    //     const selectedValue = { key: label, label }
    //     if (findIndexInValueByLabel(nextValue, label) === -1) {
    //       if (multiple) {
    //         const value = this.getValueByLabel($props.children, label)
    //         if (value) {
    //           selectedValue.key = value
    //           nextValue = nextValue.concat(selectedValue)
    //         }
    //       } else {
    //         nextValue = nextValue.concat(selectedValue)
    //       }
    //     }
    //     this.fireSelect({
    //       key: label,
    //       label,
    //     })
    //   })
    //   return nextValue
    // },

    focus () {
      if (isSingleMode(this.$props)) {
        this.selectionRef.focus()
      } else {
        this.getInputDOMNode().focus()
      }
    },

    blur () {
      if (isSingleMode(this.$props)) {
        this.selectionRef.blur()
      } else {
        this.getInputDOMNode().blur()
      }
    },

    handleBackfill (item) {
      if (!this.backfill || !(isSingleMode(this.$props) || isCombobox(this.$props))) {
        return
      }

      const key = getValuePropValue(item)

      if (isCombobox(this.$props)) {
        this.setInputValue(key, false)
      }

      this.setState({
        _value: [key],
        _backfillValue: key,
      })
    },

    _filterOption (input, child, defaultFilter = defaultFilterFn) {
      const { _value: value, _backfillValue: backfillValue } = this.$data
      const lastValue = value[value.length - 1]
      if (!input || (lastValue && lastValue === backfillValue)) {
        return true
      }
      let filterFn = this.$props.filterOption
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

    updateFocusClassName () {
      const { rootRef, prefixCls } = this
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
          if (activeElement !== this.selectionRef) {
            this.selectionRef.focus()
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

    removeSelected (selectedKey, e) {
      const props = this.$props
      if (props.disabled || this.isChildDisabled(selectedKey)) {
        return
      }
      // Do not trigger Trigger popup
      if (e && e.stopPropagation) {
        e.stopPropagation()
      }

      const value = this.$data._value.filter(singleValue => {
        return singleValue !== selectedKey
      })
      const canMultiple = isMultipleOrTags(props)

      if (canMultiple) {
        let event = selectedKey
        if (props.labelInValue) {
          event = {
            key: selectedKey,
            label: this.getLabelBySingleValue(selectedKey),
          }
        }
        this.$emit('deselect', event, this.getOptionBySingleValue(selectedKey))
      }
      this.fireChange(value)
    },

    openIfHasChildren () {
      const { $props } = this
      if (($props.children && $props.children.length) || isSingleMode($props)) {
        this.setOpenState(true)
      }
    },
    fireSelect (value) {
      this.$emit('select', this.getVLBySingleValue(value), this.getOptionBySingleValue(value))
    },
    fireChange (value) {
      if (!hasProp(this, 'value')) {
        this.setState({
          _value: value,
        }, this.forcePopupAlign)
      }
      const vls = this.getVLForOnChange(value)
      const options = this.getOptionsBySingleValue(value)
      this._valueOptions = options
      this.$emit('change', vls, isMultipleOrTags(this.$props) ? options : options[0])
    },

    isChildDisabled (key) {
      return (this.$props.children || []).some(child => {
        const childValue = getValuePropValue(child)
        return childValue === key && getValue(child, 'disabled')
      })
    },
    forcePopupAlign () {
      this.selectTriggerRef && this.selectTriggerRef.triggerRef.forcePopupAlign()
    },
    // getOptionsAndOpenStatus () {
    //   let sOpen = this.sOpen
    //   if (this.skipAdjustOpen) {
    //     this.openStatus = sOpen
    //     return {
    //       options: this._options,
    //       open: sOpen,
    //     }
    //   }
    //   const { $props, showSearch } = this
    //   let options = []
    //   // If hidden menu due to no options, then it should be calculated again
    //   if (sOpen || this.hiddenForNoOptions) {
    //     options = this.renderFilterOptions()
    //   }
    //   this._options = options

    //   if (isMultipleOrTagsOrCombobox($props) || !showSearch) {
    //     if (sOpen && !options.length) {
    //       sOpen = false
    //       this.hiddenForNoOptions = true
    //     }
    //     // Keep menu open if there are options and hidden for no options before
    //     if (this.hiddenForNoOptions && options.length) {
    //       sOpen = true
    //       this.hiddenForNoOptions = false
    //     }
    //   }
    //   this.openStatus = sOpen
    //   return {
    //     options,
    //     open: sOpen,
    //   }
    // },
    renderFilterOptions () {
      const { _inputValue: inputValue } = this.$data
      const { children, tags, filterOption, notFoundContent } = this.$props
      const menuItems = []
      const childrenKeys = []
      let options = this.renderFilterOptionsFromChildren(
        children,
        childrenKeys,
        menuItems,
      )
      if (tags) {
      // tags value must be string
        let value = this.$data._value
        value = value.filter(singleValue => {
          return (
            childrenKeys.indexOf(singleValue) === -1 &&
          (!inputValue ||
            String(singleValue).indexOf(String(inputValue)) > -1)
          )
        })
        value.forEach(singleValue => {
          const key = singleValue
          const menuItem = (
            <MenuItem
              style={UNSELECTABLE_STYLE}
              {...{ attrs: UNSELECTABLE_ATTRIBUTE }}
              value={key}
              key={key}
              role='option'
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
                role: 'option',
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
            role: 'option',
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
      const { _inputValue: inputValue } = this.$data
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
            attrs: {
              ...UNSELECTABLE_ATTRIBUTE,
              ...getAttrs(child),
            },
            key: childValue,
            props: {
              value: childValue,
              ...getPropsData(child),
              role: 'option',
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
        if (tags) {
          childrenKeys.push(childValue)
        }
      })

      return sel
    },

    renderTopControlNode () {
      const { $props: props } = this
      const { _value: value, _inputValue: inputValue, _open: open } = this.$data
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
        if (value.length) {
          let showSelectedValue = false
          let opacity = 1
          if (!showSearch) {
            showSelectedValue = true
          } else {
            if (open) {
              showSelectedValue = !inputValue
              if (showSelectedValue) {
                opacity = 0.4
              }
            } else {
              showSelectedValue = true
            }
          }
          const singleValue = value[0]
          const { label, title } = this.getOptionInfoBySingleValue(singleValue)
          selectedValue = (
            <div
              key='value'
              class={`${prefixCls}-selection-selected-value`}
              title={toTitle(title || label)}
              style={{
                display: showSelectedValue ? 'block' : 'none',
                opacity,
              }}
            >
              {label}
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
                display: open ? 'block' : 'none',
              }}
            >
              {this._getInputElement()}
            </div>,
          ]
        }
      } else {
        let selectedValueNodes = []
        let limitedCountValue = value
        let maxTagPlaceholderEl
        if (maxTagCount !== undefined && value.length > maxTagCount) {
          limitedCountValue = limitedCountValue.slice(0, maxTagCount)
          const omittedValues = this.getVLForOnChange(value.slice(maxTagCount, value.length))
          let content = `+ ${value.length - maxTagCount} ...`
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
            title={toTitle(content)}
          >
            <div class={`${prefixCls}-selection__choice__content`}>{content}</div>
          </li>)
        }
        if (isMultipleOrTags(props)) {
          selectedValueNodes = limitedCountValue.map(singleValue => {
            const info = this.getOptionInfoBySingleValue(singleValue)
            let content = info.label
            const title = info.title || content
            if (
              maxTagTextLength &&
            typeof content === 'string' &&
            content.length > maxTagTextLength
            ) {
              content = `${content.slice(0, maxTagTextLength)}...`
            }
            const disabled = this.isChildDisabled(singleValue)
            const choiceClassName = disabled
              ? `${prefixCls}-selection__choice ${prefixCls}-selection__choice__disabled`
              : `${prefixCls}-selection__choice`
            return (
              <li
                style={UNSELECTABLE_STYLE}
                unselectable='unselectable'
                onMousedown={preventDefaultEvent}
                class={choiceClassName}
                key={singleValue}
                title={toTitle(title)}
              >
                <div class={`${prefixCls}-selection__choice__content`}>
                  {content}
                </div>
                {disabled ? null : (
                  <span
                    class={`${prefixCls}-selection__choice__remove`}
                    onClick={(event) => {
                      this.removeSelected(singleValue, event)
                    }}
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
        <div
          class={className}
          {...{ directives: [{
            name: 'ref',
            value: this.saveTopCtrlRef,
          }] }}
          onClick={this.topCtrlContainerClick}
        >
          {this.getPlaceholderElement()}
          {innerNode}
        </div>
      )
    },
    topCtrlContainerClick (e) {
      if (this.$data._open && !isSingleMode(this.$props)) {
        e.stopPropagation()
      }
    },
    renderClear () {
      const { prefixCls, allowClear } = this.$props
      const { _value: value, _inputValue: inputValue } = this.$data
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
      if (inputValue || value.length) {
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
        if (this._focused && this.$data._open) {
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
    const props = this.$props
    const multiple = isMultipleOrTags(props)
    const state = this.$data
    const { disabled, prefixCls } = props
    const ctrlNode = this.renderTopControlNode()
    const { _open: open, _inputValue: inputValue, _value: value } = this.$data
    if (open) {
      this._options = this.renderFilterOptions()
    }
    const realOpen = this.getRealOpenState()
    const options = this._options || []
    const { $listeners } = this
    const { mouseenter = noop, mouseleave = noop, popupScroll = noop } = $listeners
    const selectionProps = {
      props: {},
      attrs: {
        role: 'combobox',
        'aria-autocomplete': 'list',
        'aria-haspopup': 'true',
        'aria-expanded': realOpen,
      },
      on: {
        click: this.selectionRefClick,
      },
      class: `${prefixCls}-selection ${prefixCls}-selection--${multiple ? 'multiple' : 'single'}`,
      directives: [{
        name: 'ref',
        value: this.saveSelectionRef,
      }],
      key: 'selection',

    }
    if (!isMultipleOrTagsOrCombobox(props)) {
      selectionProps.on.keydown = this.onKeyDown
      selectionProps.on.focus = this.selectionRefFocus
      selectionProps.on.blur = this.selectionRefBlur
      selectionProps.attrs.tabIndex = props.disabled ? -1 : 0
    }
    const rootCls = {
      [prefixCls]: true,
      [`${prefixCls}-open`]: open,
      [`${prefixCls}-focused`]: open || !!this._focused,
      [`${prefixCls}-combobox`]: isCombobox(props),
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-enabled`]: !disabled,
      [`${prefixCls}-allow-clear`]: !!props.allowClear,
      [`${prefixCls}-no-arrow`]: !props.showArrow,
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
        options={options}
        multiple={multiple}
        disabled={disabled}
        visible={realOpen}
        inputValue={inputValue}
        value={value}
        backfillValue={state._backfillValue}
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
        {...{ directives: [{
          name: 'ref',
          value: this.saveSelectTriggerRef,
        }] }}
      >
        <div
          {...{ directives: [{
            name: 'ref',
            value: this.saveRootRef,
          }] }}
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
export { Select }
export default proxyComponent(Select)
