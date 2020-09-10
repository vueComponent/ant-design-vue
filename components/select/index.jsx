import { provide, inject } from 'vue';
import warning from '../_util/warning';
import omit from 'omit.js';
import PropTypes from '../_util/vue-types';
import { Select as VcSelect, Option, OptGroup } from '../vc-select';
import { ConfigConsumerProps } from '../config-provider';
import { getComponent, getOptionProps, isValidElement, getSlot } from '../_util/props-util';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import CheckOutlined from '@ant-design/icons-vue/CheckOutlined';
import DownOutlined from '@ant-design/icons-vue/DownOutlined';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import { cloneElement } from '../_util/vnode';

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
  tabindex: PropTypes.number,
  placeholder: PropTypes.any,
  defaultActiveFirstOption: PropTypes.bool,
  dropdownClassName: PropTypes.string,
  dropdownStyle: PropTypes.any,
  dropdownMenuStyle: PropTypes.any,
  dropdownMatchSelectWidth: PropTypes.bool,
  // onSearch: (value: string) => any,
  filterOption: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  autofocus: PropTypes.bool,
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
  key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  created() {
    provide('savePopupRef', this.savePopupRef);
    warning(
      this.$props.mode !== 'combobox',
      'Select',
      'The combobox mode of Select is deprecated,' +
        'it will be removed in next major version,' +
        'please use AutoComplete instead',
    );
  },
  methods: {
    getNotFoundContent(renderEmpty) {
      const notFoundContent = getComponent(this, 'notFoundContent');
      if (notFoundContent !== undefined) {
        return notFoundContent;
      }
      if (this.isCombobox()) {
        return null;
      }
      return renderEmpty('Select');
    },
    savePopupRef(ref) {
      this.popupRef = ref;
    },
    focus() {
      this.$refs.vcSelect.focus();
    },
    blur() {
      this.$refs.vcSelect.blur();
    },

    isCombobox() {
      const { mode } = this;
      return mode === 'combobox' || mode === SECRET_COMBOBOX_MODE_DO_NOT_USE;
    },

    renderSuffixIcon(prefixCls) {
      const { loading } = this.$props;
      let suffixIcon = getComponent(this, 'suffixIcon');
      suffixIcon = Array.isArray(suffixIcon) ? suffixIcon[0] : suffixIcon;
      if (suffixIcon) {
        return isValidElement(suffixIcon)
          ? cloneElement(suffixIcon, { class: `${prefixCls}-arrow-icon` })
          : suffixIcon;
      }
      if (loading) {
        return <LoadingOutlined />;
      }
      return <DownOutlined class={`${prefixCls}-arrow-icon`} />;
    },
  },
  render() {
    const {
      prefixCls: customizePrefixCls,
      size,
      mode,
      options,
      getPopupContainer,
      showArrow,
      ...restProps
    } = getOptionProps(this);
    const { class: className } = this.$attrs;

    const getPrefixCls = this.configProvider.getPrefixCls;
    const renderEmpty = this.configProvider.renderEmpty;
    const prefixCls = getPrefixCls('select', customizePrefixCls);

    const { getPopupContainer: getContextPopupContainer } = this.configProvider;
    let removeIcon = getComponent(this, 'removeIcon');
    removeIcon = Array.isArray(removeIcon) ? removeIcon[0] : removeIcon;
    let clearIcon = getComponent(this, 'clearIcon');
    clearIcon = Array.isArray(clearIcon) ? clearIcon[0] : clearIcon;
    let menuItemSelectedIcon = getComponent(this, 'menuItemSelectedIcon');
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
      [className]: className,
      [`${prefixCls}-lg`]: size === 'large',
      [`${prefixCls}-sm`]: size === 'small',
      [`${prefixCls}-show-arrow`]: showArrow,
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
        : removeIcon)) || <CloseOutlined class={`${prefixCls}-remove-icon`} />;

    const finalClearIcon = (clearIcon &&
      (isValidElement(clearIcon)
        ? cloneElement(clearIcon, { class: `${prefixCls}-clear-icon` })
        : clearIcon)) || <CloseCircleFilled class={`${prefixCls}-clear-icon`} />;

    const finalMenuItemSelectedIcon = (menuItemSelectedIcon &&
      (isValidElement(menuItemSelectedIcon)
        ? cloneElement(menuItemSelectedIcon, { class: `${prefixCls}-selected-icon` })
        : menuItemSelectedIcon)) || <CheckOutlined class={`${prefixCls}-selected-icon`} />;

    const selectProps = {
      inputIcon: this.renderSuffixIcon(prefixCls),
      removeIcon: finalRemoveIcon,
      clearIcon: finalClearIcon,
      menuItemSelectedIcon: finalMenuItemSelectedIcon,
      showArrow,
      ...rest,
      ...modeConfig,
      prefixCls,
      optionLabelProp: optionLabelProp || 'children',
      notFoundContent: this.getNotFoundContent(renderEmpty),
      maxTagPlaceholder: getComponent(this, 'maxTagPlaceholder'),
      placeholder: getComponent(this, 'placeholder'),
      children: options
        ? options.map(option => {
            const { key, label = option.title, class: cls, style, ...restOption } = option;
            return (
              <Option key={key} {...{ class: cls, style, ...restOption }}>
                {label}
              </Option>
            );
          })
        : getSlot(this),
      dropdownRender: getComponent(this, 'dropdownRender', {}, false),
      getPopupContainer: getPopupContainer || getContextPopupContainer,
      ...this.$attrs,
      class: cls,
      ref: 'vcSelect',
    };
    return <VcSelect {...selectProps} __propsSymbol__={[]} />;
  },
};

/* istanbul ignore next */
Select.install = function(app) {
  app.component(Select.name, Select);
  app.component(Select.Option.name, Select.Option);
  app.component(Select.OptGroup.name, Select.OptGroup);
};
export default Select;
