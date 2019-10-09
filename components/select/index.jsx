import warning from '../_util/warning';
import omit from 'omit.js';
import PropTypes from '../_util/vue-types';
import { Select as VcSelect, Option, OptGroup } from '../vc-select';
import { ConfigConsumerProps } from '../config-provider';
import {
  getComponentFromProp,
  getOptionProps,
  filterEmpty,
  isValidElement,
} from '../_util/props-util';
import Icon from '../icon';
import { cloneElement } from '../_util/vnode';
import Base from '../base';

const AbstractSelectProps = () => ({
  prefixCls: PropTypes.string,
  size: PropTypes.oneOf(['small', 'large', 'default']),
  showAction: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(String)]),
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
  dropdownMatchSelectWidth: PropTypes.bool,
  // onSearch: (value: string) => any,
  filterOption: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  autoFocus: PropTypes.bool,
  backfill: PropTypes.bool,
  showArrow: PropTypes.bool,
  getPopupContainer: PropTypes.func,
  open: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  autoClearSearchValue: PropTypes.bool,
  dropdownRender: PropTypes.func,
  loading: PropTypes.bool,
});
const Value = PropTypes.shape({
  key: PropTypes.string,
}).loose;

const SelectValue = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.arrayOf(PropTypes.oneOfType([Value, PropTypes.string, PropTypes.number])),
  Value,
]);

const SelectProps = {
  ...AbstractSelectProps(),
  value: SelectValue,
  defaultValue: SelectValue,
  // mode: PropTypes.oneOf(['default', 'multiple', 'tags', 'combobox']),
  mode: PropTypes.string,
  optionLabelProp: PropTypes.string,
  firstActiveValue: PropTypes.oneOfType([String, PropTypes.arrayOf(String)]),
  maxTagCount: PropTypes.number,
  maxTagPlaceholder: PropTypes.any,
  maxTagTextLength: PropTypes.number,
  dropdownMatchSelectWidth: PropTypes.bool,
  optionFilterProp: PropTypes.string,
  labelInValue: PropTypes.boolean,
  getPopupContainer: PropTypes.func,
  tokenSeparators: PropTypes.arrayOf(PropTypes.string),
  getInputElement: PropTypes.func,
  options: PropTypes.array,
  suffixIcon: PropTypes.any,
  removeIcon: PropTypes.any,
  clearIcon: PropTypes.any,
  menuItemSelectedIcon: PropTypes.any,
};

const SelectPropTypes = {
  prefixCls: PropTypes.string,
  size: PropTypes.oneOf(['default', 'large', 'small']),
  // combobox: PropTypes.bool,
  notFoundContent: PropTypes.any,
  showSearch: PropTypes.bool,
  optionLabelProp: PropTypes.string,
  transitionName: PropTypes.string,
  choiceTransitionName: PropTypes.string,
};

export { AbstractSelectProps, SelectValue, SelectProps };
const SECRET_COMBOBOX_MODE_DO_NOT_USE = 'SECRET_COMBOBOX_MODE_DO_NOT_USE';
const Select = {
  SECRET_COMBOBOX_MODE_DO_NOT_USE,
  Option: { ...Option, name: 'ASelectOption' },
  OptGroup: { ...OptGroup, name: 'ASelectOptGroup' },
  name: 'ASelect',
  props: {
    ...SelectProps,
    showSearch: PropTypes.bool.def(false),
    transitionName: PropTypes.string.def('slide-up'),
    choiceTransitionName: PropTypes.string.def('zoom'),
  },
  propTypes: SelectPropTypes,
  model: {
    prop: 'value',
    event: 'change',
  },
  provide() {
    return {
      savePopupRef: this.savePopupRef,
    };
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  created() {
    warning(
      this.$props.mode !== 'combobox',
      'The combobox mode of Select is deprecated,' +
        'it will be removed in next major version,' +
        'please use AutoComplete instead',
    );
  },
  methods: {
    savePopupRef(ref) {
      this.popupRef = ref;
    },
    focus() {
      this.$refs.vcSelect.focus();
    },
    blur() {
      this.$refs.vcSelect.blur();
    },
    getNotFoundContent(renderEmpty) {
      const h = this.$createElement;
      const notFoundContent = getComponentFromProp(this, 'notFoundContent');
      if (notFoundContent !== undefined) {
        return notFoundContent;
      }
      if (this.isCombobox()) {
        return null;
      }
      return renderEmpty(h, 'Select');
    },
    isCombobox() {
      const { mode } = this;
      return mode === 'combobox' || mode === SECRET_COMBOBOX_MODE_DO_NOT_USE;
    },

    renderSuffixIcon(prefixCls) {
      const { loading } = this.$props;
      let suffixIcon = getComponentFromProp(this, 'suffixIcon');
      suffixIcon = Array.isArray(suffixIcon) ? suffixIcon[0] : suffixIcon;
      if (suffixIcon) {
        return isValidElement(suffixIcon)
          ? cloneElement(suffixIcon, { class: `${prefixCls}-arrow-icon` })
          : suffixIcon;
      }
      if (loading) {
        return <Icon type="loading" />;
      }
      return <Icon type="down" class={`${prefixCls}-arrow-icon`} />;
    },
  },
  render() {
    const {
      prefixCls: customizePrefixCls,
      size,
      mode,
      options,
      getPopupContainer,
      ...restProps
    } = getOptionProps(this);

    const getPrefixCls = this.configProvider.getPrefixCls;
    const renderEmpty = this.configProvider.renderEmpty;
    const prefixCls = getPrefixCls('select', customizePrefixCls);

    const { getPopupContainer: getContextPopupContainer } = this.configProvider;
    let removeIcon = getComponentFromProp(this, 'removeIcon');
    removeIcon = Array.isArray(removeIcon) ? removeIcon[0] : removeIcon;
    let clearIcon = getComponentFromProp(this, 'clearIcon');
    clearIcon = Array.isArray(clearIcon) ? clearIcon[0] : clearIcon;
    let menuItemSelectedIcon = getComponentFromProp(this, 'menuItemSelectedIcon');
    menuItemSelectedIcon = Array.isArray(menuItemSelectedIcon)
      ? menuItemSelectedIcon[0]
      : menuItemSelectedIcon;
    const rest = omit(restProps, [
      'inputIcon',
      'removeIcon',
      'clearIcon',
      'suffixIcon',
      'menuItemSelectedIcon',
    ]);

    const cls = {
      [`${prefixCls}-lg`]: size === 'large',
      [`${prefixCls}-sm`]: size === 'small',
    };

    let { optionLabelProp } = this.$props;
    if (this.isCombobox()) {
      // children 带 dom 结构时，无法填入输入框
      optionLabelProp = optionLabelProp || 'value';
    }

    const modeConfig = {
      multiple: mode === 'multiple',
      tags: mode === 'tags',
      combobox: this.isCombobox(),
    };
    const finalRemoveIcon = (removeIcon &&
      (isValidElement(removeIcon)
        ? cloneElement(removeIcon, { class: `${prefixCls}-remove-icon` })
        : removeIcon)) || <Icon type="close" class={`${prefixCls}-remove-icon`} />;

    const finalClearIcon = (clearIcon &&
      (isValidElement(clearIcon)
        ? cloneElement(clearIcon, { class: `${prefixCls}-clear-icon` })
        : clearIcon)) || (
      <Icon type="close-circle" theme="filled" class={`${prefixCls}-clear-icon`} />
    );

    const finalMenuItemSelectedIcon = (menuItemSelectedIcon &&
      (isValidElement(menuItemSelectedIcon)
        ? cloneElement(menuItemSelectedIcon, { class: `${prefixCls}-selected-icon` })
        : menuItemSelectedIcon)) || <Icon type="check" class={`${prefixCls}-selected-icon`} />;

    const selectProps = {
      props: {
        inputIcon: this.renderSuffixIcon(prefixCls),
        removeIcon: finalRemoveIcon,
        clearIcon: finalClearIcon,
        menuItemSelectedIcon: finalMenuItemSelectedIcon,
        ...rest,
        ...modeConfig,
        prefixCls,
        optionLabelProp: optionLabelProp || 'children',
        notFoundContent: this.getNotFoundContent(renderEmpty),
        maxTagPlaceholder: getComponentFromProp(this, 'maxTagPlaceholder'),
        placeholder: getComponentFromProp(this, 'placeholder'),
        children: options
          ? options.map(option => {
              const { key, label = option.title, on, class: cls, style, ...restOption } = option;
              return (
                <Option key={key} {...{ props: restOption, on, class: cls, style }}>
                  {label}
                </Option>
              );
            })
          : filterEmpty(this.$slots.default),
        __propsSymbol__: Symbol(),
        dropdownRender: getComponentFromProp(this, 'dropdownRender', {}, false),
        getPopupContainer: getPopupContainer || getContextPopupContainer,
      },
      on: this.$listeners,
      class: cls,
      ref: 'vcSelect',
    };
    return <VcSelect {...selectProps} />;
  },
};

/* istanbul ignore next */
Select.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Select.name, Select);
  Vue.component(Select.Option.name, Select.Option);
  Vue.component(Select.OptGroup.name, Select.OptGroup);
};

export default Select;
