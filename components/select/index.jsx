
import PropTypes from '../_util/vue-types'
import VcSelect, { Option, OptGroup } from '../vc-select'
import LocaleReceiver from '../locale-provider/LocaleReceiver'
import defaultLocale from '../locale-provider/default'
import { getComponentFromProp, getOptionProps, filterEmpty } from '../_util/props-util'

const AbstractSelectProps = {
  prefixCls: PropTypes.string,
  size: PropTypes.oneOf(['small', 'large', 'default']),
  notFoundContent: PropTypes.any,
  transitionName: PropTypes.string,
  choiceTransitionName: PropTypes.string,
  showSearch: PropTypes.bool,
  allowClear: PropTypes.bool,
  disabled: PropTypes.bool,
  tabIndex: PropTypes.number,
  placeholder: PropTypes.any,
  defaultActiveFirstOption: PropTypes.bool,
  dropdownClassName: PropTypes.string,
  dropdownStyle: PropTypes.any,
  dropdownMenuStyle: PropTypes.any,
  // onSearch: (value: string) => any,
  filterOption: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
  autoFocus: PropTypes.bool,
  backfill: PropTypes.bool,
}
const Value = PropTypes.shape({
  key: String,
}).loose

const SelectValue = PropTypes.oneOfType([
  PropTypes.string,

  PropTypes.arrayOf(PropTypes.oneOfType([
    Value,
    String,
  ])),
  Value,
])

const SelectProps = {
  ...AbstractSelectProps,
  value: SelectValue,
  defaultValue: SelectValue,
  mode: PropTypes.oneOf(['default', 'multiple', 'tags', 'combobox']),
  optionLabelProp: PropTypes.string,
  // onChange?: (value: SelectValue, option: React.ReactElement<any> | React.ReactElement<any>[]) => void;
  // onSelect?: (value: SelectValue, option: React.ReactElement<any>) => any;
  // onDeselect?: (value: SelectValue) => any;
  // onBlur?: () => any;
  // onFocus?: () => any;
  // onInputKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  maxTagCount: PropTypes.number,
  maxTagPlaceholder: PropTypes.any,
  dropdownMatchSelectWidth: PropTypes.bool,
  optionFilterProp: PropTypes.string,
  labelInValue: PropTypes.boolean,
  getPopupContainer: PropTypes.func,
  tokenSeparators: PropTypes.arrayOf(PropTypes.string),
  getInputElement: PropTypes.func,
}

const SelectPropTypes = {
  prefixCls: PropTypes.string,
  size: PropTypes.oneOf(['default', 'large', 'small']),
  combobox: PropTypes.bool,
  notFoundContent: PropTypes.any,
  showSearch: PropTypes.bool,
  optionLabelProp: PropTypes.string,
  transitionName: PropTypes.string,
  choiceTransitionName: PropTypes.string,
}

export {
  AbstractSelectProps,
  SelectValue,
  SelectProps,
}

export default {
  Option,
  OptGroup,
  name: 'Select',
  props: {
    ...SelectProps,
    prefixCls: PropTypes.string.def('ant-select'),
    showSearch: PropTypes.bool.def(false),
    transitionName: PropTypes.string.def('slide-up'),
    choiceTransitionName: PropTypes.string.def('zoom'),
  },
  propTypes: SelectPropTypes,
  model: {
    prop: 'value',
    event: 'change',
  },
  methods: {
    focus () {
      this.$refs.vcSelect.focus()
    },
    blur () {
      this.$refs.vcSelect.blur()
    },
    getNotFoundContent (locale) {
      const { mode } = this.$props
      const notFoundContent = getComponentFromProp(this, 'notFoundContent')
      const isCombobox = mode === 'combobox'
      if (isCombobox) {
      // AutoComplete don't have notFoundContent defaultly
        return notFoundContent === undefined ? null : notFoundContent
      }
      return notFoundContent === undefined ? locale.notFoundContent : notFoundContent
    },
    renderSelect (locale) {
      const {
        prefixCls,
        size,
        mode,
        ...restProps
      } = getOptionProps(this)
      const cls = {
        [`${prefixCls}-lg`]: size === 'large',
        [`${prefixCls}-sm`]: size === 'small',
      }

      let { optionLabelProp } = this.$props
      const isCombobox = mode === 'combobox'
      if (isCombobox) {
      // children 带 dom 结构时，无法填入输入框
        optionLabelProp = optionLabelProp || 'value'
      }

      const modeConfig = {
        multiple: mode === 'multiple',
        tags: mode === 'tags',
        combobox: isCombobox,
      }
      const selectProps = {
        props: {
          ...restProps,
          ...modeConfig,
          prefixCls,
          optionLabelProp: optionLabelProp || 'children',
          notFoundContent: this.getNotFoundContent(locale),
          maxTagPlaceholder: getComponentFromProp(this, 'maxTagPlaceholder'),
          placeholder: getComponentFromProp(this, 'placeholder'),
        },
        on: this.$listeners,
        class: cls,
        ref: 'vcSelect',
      }

      return (
        <VcSelect {...selectProps}>
          {filterEmpty(this.$slots.default)}
        </VcSelect>
      )
    },
  },
  render () {
    return (
      <LocaleReceiver
        componentName='Select'
        defaultLocale={defaultLocale.Select}
        children={this.renderSelect}
      />
    )
  },
}

