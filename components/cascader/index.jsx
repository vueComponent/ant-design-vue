
import PropTypes from '../_util/vue-types'
import VcCascader from '../vc-cascader'
import arrayTreeFilter from 'array-tree-filter'
import classNames from 'classnames'
import omit from 'omit.js'
import KeyCode from '../_util/KeyCode'
import Input from '../input'
import Icon from '../icon'
import { hasProp, filterEmpty, getOptionProps, getStyle, getClass, getAttrs } from '../_util/props-util'
import BaseMixin from '../_util/BaseMixin'

const CascaderOptionType = PropTypes.shape({
  value: PropTypes.string.isRequired,
  label: PropTypes.any.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.array,
  __IS_FILTERED_OPTION: PropTypes.bool,
}).loose

const CascaderExpandTrigger = PropTypes.oneOf(['click', 'hover'])

const ShowSearchType = PropTypes.shape({
  filter: PropTypes.func,
  render: PropTypes.func,
  sort: PropTypes.func,
  matchInputWidth: PropTypes.bool,
}).loose
function noop () {}

const CascaderProps = {
  /** 可选项数据源 */
  options: PropTypes.arrayOf(CascaderOptionType).def([]),
  /** 默认的选中项 */
  defaultValue: PropTypes.arrayOf(PropTypes.string),
  /** 指定选中项 */
  value: PropTypes.arrayOf(PropTypes.string),
  /** 选择完成后的回调 */
  // onChange?: (value: string[], selectedOptions?: CascaderOptionType[]) => void;
  /** 选择后展示的渲染函数 */
  displayRender: PropTypes.func,
  transitionName: PropTypes.string.def('slide-up'),
  popupStyle: PropTypes.object.def({}),
  /** 自定义浮层类名 */
  popupClassName: PropTypes.string,
  /** 浮层预设位置：`bottomLeft` `bottomRight` `topLeft` `topRight` */
  popupPlacement: PropTypes.oneOf(['bottomLeft', 'bottomRight', 'topLeft', 'topRight']).def('bottomLeft'),
  /** 输入框占位文本*/
  placeholder: PropTypes.string.def('Please select'),
  /** 输入框大小，可选 `large` `default` `small` */
  size: PropTypes.oneOf(['large', 'default', 'small']),
  /** 禁用*/
  disabled: PropTypes.bool.def(false),
  /** 是否支持清除*/
  allowClear: PropTypes.bool.def(true),
  showSearch: PropTypes.oneOfType([Boolean, ShowSearchType]),
  notFoundContent: PropTypes.any.def('Not Found'),
  loadData: PropTypes.func,
  /** 次级菜单的展开方式，可选 'click' 和 'hover' */
  expandTrigger: CascaderExpandTrigger,
  /** 当此项为 true 时，点选每级菜单选项值都会发生变化 */
  changeOnSelect: PropTypes.bool,
  /** 浮层可见变化时回调 */
  // onPopupVisibleChange?: (popupVisible: boolean) => void;
  prefixCls: PropTypes.string.def('ant-cascader'),
  inputPrefixCls: PropTypes.string.def('ant-input'),
  getPopupContainer: PropTypes.func,
  popupVisible: PropTypes.bool,
  autoFocus: PropTypes.bool,
}

function defaultFilterOption (inputValue, path) {
  return path.some(option => option.label.indexOf(inputValue) > -1)
}

function defaultSortFilteredOption (a, b, inputValue) {
  function callback (elem) {
    return elem.label.indexOf(inputValue) > -1
  }

  return a.findIndex(callback) - b.findIndex(callback)
}

const defaultDisplayRender = ({ labels }) => labels.join(' / ')

export default {
  inheritAttrs: false,
  name: 'ACascader',
  mixins: [BaseMixin],
  props: CascaderProps,
  model: {
    prop: 'value',
    event: 'change',
  },
  data () {
    this.cachedOptions = []
    const { value, defaultValue, popupVisible, showSearch, options, changeOnSelect, flattenTree } = this
    return {
      sValue: value || defaultValue || [],
      inputValue: '',
      inputFocused: false,
      sPopupVisible: popupVisible,
      flattenOptions: showSearch && flattenTree(options, changeOnSelect),
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.autoFocus && !this.showSearch && !this.disabled) {
        this.$refs.picker.focus()
      }
    })
  },
  watch: {
    value (val) {
      this.setState({ sValue: val || [] })
    },
    popupVisible (val) {
      this.setState({ sPopupVisible: val })
    },
    options (val) {
      if (this.showSearch) {
        this.setState({ flattenOptions: this.flattenTree(this.options, this.changeOnSelect) })
      }
    },
  },
  methods: {
    highlightKeyword (str, keyword, prefixCls) {
      return str.split(keyword)
        .map((node, index) => index === 0 ? node : [
          <span class={`${prefixCls}-menu-item-keyword`}>{keyword}</span>,
          node,
        ])
    },

    defaultRenderFilteredOption ({ inputValue, path, prefixCls }) {
      return path.map(({ label }, index) => {
        const node = label.indexOf(inputValue) > -1
          ? this.highlightKeyword(label, inputValue, prefixCls) : label
        return index === 0 ? node : [' / ', node]
      })
    },
    handleChange (value, selectedOptions) {
      this.setState({ inputValue: '' })
      if (selectedOptions[0].__IS_FILTERED_OPTION) {
        const unwrappedValue = value[0]
        const unwrappedSelectedOptions = selectedOptions[0].path
        this.setValue(unwrappedValue, unwrappedSelectedOptions)
        return
      }
      this.setValue(value, selectedOptions)
    },

    handlePopupVisibleChange (popupVisible) {
      if (!hasProp(this, 'popupVisible')) {
        this.setState({
          sPopupVisible: popupVisible,
          inputFocused: popupVisible,
          inputValue: popupVisible ? this.inputValue : '',
        })
      }
      this.$emit('popupVisibleChange', popupVisible)
    },
    handleInputFocus (e) {
      this.$emit('focus', e)
    },

    handleInputBlur (e) {
      this.setState({
        inputFocused: false,
      })
      this.$emit('blur', e)
    },

    handleInputClick (e) {
      const { inputFocused, sPopupVisible } = this
      // Prevent `Trigger` behaviour.
      if (inputFocused || sPopupVisible) {
        e.stopPropagation()
        e.nativeEvent && e.nativeEvent.stopImmediatePropagation()
      }
    },

    handleKeyDown (e) {
      if (e.keyCode === KeyCode.BACKSPACE) {
        e.stopPropagation()
      }
    },

    handleInputChange (e) {
      const inputValue = e.target.value
      this.setState({ inputValue })
    },

    setValue (value, selectedOptions) {
      if (!hasProp(this, 'value')) {
        this.setState({ sValue: value })
      }
      this.$emit('change', value, selectedOptions)
    },

    getLabel () {
      const { options, $scopedSlots } = this
      const displayRender = this.displayRender || $scopedSlots.displayRender || defaultDisplayRender
      const value = this.sValue
      const unwrappedValue = Array.isArray(value[0]) ? value[0] : value
      const selectedOptions = arrayTreeFilter(options,
        (o, level) => o.value === unwrappedValue[level],
      )
      const labels = selectedOptions.map(o => o.label)
      return displayRender({ labels, selectedOptions })
    },

    clearSelection (e) {
      e.preventDefault()
      e.stopPropagation()
      if (!this.inputValue) {
        this.setValue([])
        this.handlePopupVisibleChange(false)
      } else {
        this.setState({ inputValue: '' })
      }
    },

    flattenTree (options, changeOnSelect, ancestor = []) {
      let flattenOptions = []
      options.forEach((option) => {
        const path = ancestor.concat(option)
        if (changeOnSelect || !option.children || !option.children.length) {
          flattenOptions.push(path)
        }
        if (option.children) {
          flattenOptions = flattenOptions.concat(this.flattenTree(option.children, changeOnSelect, path))
        }
      })
      return flattenOptions
    },

    generateFilteredOptions (prefixCls) {
      const { showSearch, notFoundContent, flattenOptions, inputValue, $scopedSlots } = this
      const {
        filter = defaultFilterOption,
        // render = this.defaultRenderFilteredOption,
        sort = defaultSortFilteredOption,
      } = showSearch
      const render = showSearch.render || $scopedSlots.showSearchRender || this.defaultRenderFilteredOption
      const filtered = flattenOptions.filter((path) => filter(inputValue, path))
        .sort((a, b) => sort(a, b, inputValue))

      if (filtered.length > 0) {
        return filtered.map((path) => {
          return {
            __IS_FILTERED_OPTION: true,
            path,
            label: render({ inputValue, path, prefixCls }),
            value: path.map((o) => o.value),
            disabled: path.some((o) => o.disabled),
          }
        })
      }
      return [{ label: notFoundContent, value: 'ANT_CASCADER_NOT_FOUND', disabled: true }]
    },

    focus () {
      if (this.showSearch) {
        this.$refs.input.focus()
      } else {
        this.$refs.picker.focus()
      }
    },

    blur () {
      if (this.showSearch) {
        this.$refs.input.blur()
      } else {
        this.$refs.picker.blur()
      }
    },
  },

  render () {
    const { $slots, sValue: value, sPopupVisible, inputValue, $listeners } = this
    const props = getOptionProps(this)
    const {
      prefixCls, inputPrefixCls, placeholder, size, disabled,
      allowClear, showSearch = false, ...otherProps } = props

    const sizeCls = classNames({
      [`${inputPrefixCls}-lg`]: size === 'large',
      [`${inputPrefixCls}-sm`]: size === 'small',
    })
    const clearIcon = (allowClear && !disabled && value.length > 0) || inputValue ? (
      <Icon
        type='cross-circle'
        class={`${prefixCls}-picker-clear`}
        onClick={this.clearSelection}
        key='clear-icon'
      />
    ) : null
    const arrowCls = classNames({
      [`${prefixCls}-picker-arrow`]: true,
      [`${prefixCls}-picker-arrow-expand`]: sPopupVisible,
    })
    const pickerCls = classNames(
      getClass(this),
      `${prefixCls}-picker`, {
        [`${prefixCls}-picker-with-value`]: inputValue,
        [`${prefixCls}-picker-disabled`]: disabled,
        [`${prefixCls}-picker-${size}`]: !!size,
      })

    // Fix bug of https://github.com/facebook/react/pull/5004
    // and https://fb.me/react-unknown-prop
    const tempInputProps = omit(otherProps, [
      'options',
      'popupPlacement',
      'transitionName',
      'displayRender',
      'changeOnSelect',
      'expandTrigger',
      'popupVisible',
      'getPopupContainer',
      'loadData',
      'popupClassName',
      'filterOption',
      'renderFilteredOption',
      'sortFilteredOption',
      'notFoundContent',
      'defaultValue',
    ])

    let options = this.options
    if (inputValue) {
      options = this.generateFilteredOptions(prefixCls)
    }
    // Dropdown menu should keep previous status until it is fully closed.
    if (!sPopupVisible) {
      options = this.cachedOptions
    } else {
      this.cachedOptions = options
    }

    const dropdownMenuColumnStyle = {}
    const isNotFound = (options || []).length === 1 && options[0].value === 'ANT_CASCADER_NOT_FOUND'
    if (isNotFound) {
      dropdownMenuColumnStyle.height = 'auto' // Height of one row.
    }
    // The default value of `matchInputWidth` is `true`
    const resultListMatchInputWidth = showSearch.matchInputWidth !== false
    if (resultListMatchInputWidth && inputValue && this.input) {
      dropdownMenuColumnStyle.width = this.input.input.offsetWidth
    }
    // showSearch时，focus、blur在input上触发，反之在ref='picker'上触发
    const inputProps = {
      props: {
        ...tempInputProps,
        prefixCls: inputPrefixCls,
        placeholder: value && value.length > 0 ? undefined : placeholder,
        value: inputValue,
        disabled: disabled,
        readOnly: !showSearch,
        autoComplete: 'off',
      },
      class: `${prefixCls}-input ${sizeCls}`,
      ref: 'input',
      on: {
        focus: showSearch ? this.handleInputFocus : noop,
        click: showSearch ? this.handleInputClick : noop,
        blur: showSearch ? this.handleInputBlur : noop,
        keydown: this.handleKeyDown,
        change: showSearch ? this.handleInputChange : noop,
      },
      attrs: getAttrs(this),
    }
    const children = filterEmpty($slots.default)
    const input = children.length ? children : (
      <span
        class={pickerCls}
        style={getStyle(this)}
        ref='picker'
      >
        { showSearch ? <span class={`${prefixCls}-picker-label`}>
          {this.getLabel()}
        </span> : null}
        <Input {...inputProps}/>
        { !showSearch ? <span class={`${prefixCls}-picker-label`}>
          {this.getLabel()}
        </span> : null}
        {clearIcon}
        <Icon type='down' key='down-icon' class={arrowCls} />
      </span>
    )
    const cascaderProps = {
      props: {
        ...props,
        options: options,
        value: value,
        popupVisible: sPopupVisible,
        dropdownMenuColumnStyle: dropdownMenuColumnStyle,
      },
      on: {
        ...$listeners,
        popupVisibleChange: this.handlePopupVisibleChange,
        change: this.handleChange,
      },
    }
    return (
      <VcCascader {...cascaderProps}>
        {input}
      </VcCascader>
    )
  },
}

