import PropTypes from '../_util/vue-types';
import VcCascader from '../vc-cascader';
import arrayTreeFilter from 'array-tree-filter';
import classNames from 'classnames';
import omit from 'omit.js';
import KeyCode from '../_util/KeyCode';
import Input from '../input';
import Icon from '../icon';
import {
  hasProp,
  filterEmpty,
  getOptionProps,
  getStyle,
  getClass,
  getAttrs,
  getComponentFromProp,
  isValidElement,
} from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import { cloneElement } from '../_util/vnode';
import warning from '../_util/warning';
import { ConfigConsumerProps } from '../config-provider';
import Base from '../base';

const CascaderOptionType = PropTypes.shape({
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.any,
  disabled: PropTypes.bool,
  children: PropTypes.array,
  key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}).loose;

const FieldNamesType = PropTypes.shape({
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.string,
}).loose;

const CascaderExpandTrigger = PropTypes.oneOf(['click', 'hover']);

const ShowSearchType = PropTypes.shape({
  filter: PropTypes.func,
  render: PropTypes.func,
  sort: PropTypes.func,
  matchInputWidth: PropTypes.bool,
  limit: PropTypes.oneOfType([Boolean, Number]),
}).loose;
function noop() {}

const CascaderProps = {
  /** 可选项数据源 */
  options: PropTypes.arrayOf(CascaderOptionType).def([]),
  /** 默认的选中项 */
  defaultValue: PropTypes.array,
  /** 指定选中项 */
  value: PropTypes.array,
  /** 选择完成后的回调 */
  // onChange?: (value: string[], selectedOptions?: CascaderOptionType[]) => void;
  /** 选择后展示的渲染函数 */
  displayRender: PropTypes.func,
  transitionName: PropTypes.string.def('slide-up'),
  popupStyle: PropTypes.object.def({}),
  /** 自定义浮层类名 */
  popupClassName: PropTypes.string,
  /** 浮层预设位置：`bottomLeft` `bottomRight` `topLeft` `topRight` */
  popupPlacement: PropTypes.oneOf(['bottomLeft', 'bottomRight', 'topLeft', 'topRight']).def(
    'bottomLeft',
  ),
  /** 输入框占位文本*/
  placeholder: PropTypes.string.def('Please select'),
  /** 输入框大小，可选 `large` `default` `small` */
  size: PropTypes.oneOf(['large', 'default', 'small']),
  /** 禁用*/
  disabled: PropTypes.bool.def(false),
  /** 是否支持清除*/
  allowClear: PropTypes.bool.def(true),
  showSearch: PropTypes.oneOfType([Boolean, ShowSearchType]),
  notFoundContent: PropTypes.any,
  loadData: PropTypes.func,
  /** 次级菜单的展开方式，可选 'click' 和 'hover' */
  expandTrigger: CascaderExpandTrigger,
  /** 当此项为 true 时，点选每级菜单选项值都会发生变化 */
  changeOnSelect: PropTypes.bool,
  /** 浮层可见变化时回调 */
  // onPopupVisibleChange?: (popupVisible: boolean) => void;
  prefixCls: PropTypes.string,
  inputPrefixCls: PropTypes.string,
  getPopupContainer: PropTypes.func,
  popupVisible: PropTypes.bool,
  fieldNames: FieldNamesType,
  autoFocus: PropTypes.bool,
  suffixIcon: PropTypes.any,
};

// We limit the filtered item count by default
const defaultLimit = 50;

function defaultFilterOption(inputValue, path, names) {
  return path.some(option => option[names.label].indexOf(inputValue) > -1);
}

function defaultSortFilteredOption(a, b, inputValue, names) {
  function callback(elem) {
    return elem[names.label].indexOf(inputValue) > -1;
  }

  return a.findIndex(callback) - b.findIndex(callback);
}

function getFilledFieldNames({ fieldNames = {} }) {
  const names = {
    children: fieldNames.children || 'children',
    label: fieldNames.label || 'label',
    value: fieldNames.value || 'value',
  };
  return names;
}

function flattenTree(options = [], props, ancestor = []) {
  const names = getFilledFieldNames(props);
  let flattenOptions = [];
  const childrenName = names.children;
  options.forEach(option => {
    const path = ancestor.concat(option);
    if (props.changeOnSelect || !option[childrenName] || !option[childrenName].length) {
      flattenOptions.push(path);
    }
    if (option[childrenName]) {
      flattenOptions = flattenOptions.concat(flattenTree(option[childrenName], props, path));
    }
  });
  return flattenOptions;
}

const defaultDisplayRender = ({ labels }) => labels.join(' / ');

const Cascader = {
  inheritAttrs: false,
  name: 'ACascader',
  mixins: [BaseMixin],
  props: CascaderProps,
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
    localeData: { default: () => ({}) },
  },
  data() {
    this.cachedOptions = [];
    const { value, defaultValue, popupVisible, showSearch, options } = this;
    return {
      sValue: value || defaultValue || [],
      inputValue: '',
      inputFocused: false,
      sPopupVisible: popupVisible,
      flattenOptions: showSearch ? flattenTree(options, this.$props) : undefined,
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.autoFocus && !this.showSearch && !this.disabled) {
        this.$refs.picker.focus();
      }
    });
  },
  watch: {
    value(val) {
      this.setState({ sValue: val || [] });
    },
    popupVisible(val) {
      this.setState({ sPopupVisible: val });
    },
    options(val) {
      if (this.showSearch) {
        this.setState({ flattenOptions: flattenTree(val, this.$props) });
      }
    },
  },
  methods: {
    savePopupRef(ref) {
      this.popupRef = ref;
    },
    highlightKeyword(str, keyword, prefixCls) {
      return str
        .split(keyword)
        .map((node, index) =>
          index === 0
            ? node
            : [<span class={`${prefixCls}-menu-item-keyword`}>{keyword}</span>, node],
        );
    },

    defaultRenderFilteredOption({ inputValue, path, prefixCls, names }) {
      return path.map((option, index) => {
        const label = option[names.label];
        const node =
          label.indexOf(inputValue) > -1
            ? this.highlightKeyword(label, inputValue, prefixCls)
            : label;
        return index === 0 ? node : [' / ', node];
      });
    },
    handleChange(value, selectedOptions) {
      this.setState({ inputValue: '' });
      if (selectedOptions[0].__IS_FILTERED_OPTION) {
        const unwrappedValue = value[0];
        const unwrappedSelectedOptions = selectedOptions[0].path;
        this.setValue(unwrappedValue, unwrappedSelectedOptions);
        return;
      }
      this.setValue(value, selectedOptions);
    },

    handlePopupVisibleChange(popupVisible) {
      if (!hasProp(this, 'popupVisible')) {
        this.setState(state => ({
          sPopupVisible: popupVisible,
          inputFocused: popupVisible,
          inputValue: popupVisible ? state.inputValue : '',
        }));
      }
      this.$emit('popupVisibleChange', popupVisible);
    },
    handleInputFocus(e) {
      this.$emit('focus', e);
    },

    handleInputBlur(e) {
      this.setState({
        inputFocused: false,
      });
      this.$emit('blur', e);
    },

    handleInputClick(e) {
      const { inputFocused, sPopupVisible } = this;
      // Prevent `Trigger` behaviour.
      if (inputFocused || sPopupVisible) {
        e.stopPropagation();
        if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
          e.nativeEvent.stopImmediatePropagation();
        }
      }
    },

    handleKeyDown(e) {
      if (e.keyCode === KeyCode.BACKSPACE) {
        e.stopPropagation();
      }
    },

    handleInputChange(e) {
      const inputValue = e.target.value;
      this.setState({ inputValue });
    },

    setValue(value, selectedOptions) {
      if (!hasProp(this, 'value')) {
        this.setState({ sValue: value });
      }
      this.$emit('change', value, selectedOptions);
    },

    getLabel() {
      const { options, $scopedSlots } = this;
      const names = getFilledFieldNames(this.$props);
      const displayRender =
        this.displayRender || $scopedSlots.displayRender || defaultDisplayRender;
      const value = this.sValue;
      const unwrappedValue = Array.isArray(value[0]) ? value[0] : value;
      const selectedOptions = arrayTreeFilter(
        options,
        (o, level) => o[names.value] === unwrappedValue[level],
        { childrenKeyName: names.children },
      );
      const labels = selectedOptions.map(o => o[names.label]);
      return displayRender({ labels, selectedOptions });
    },

    clearSelection(e) {
      e.preventDefault();
      e.stopPropagation();
      if (!this.inputValue) {
        this.setValue([]);
        this.handlePopupVisibleChange(false);
      } else {
        this.setState({ inputValue: '' });
      }
    },

    generateFilteredOptions(prefixCls, renderEmpty) {
      const h = this.$createElement;
      const { showSearch, notFoundContent, $scopedSlots } = this;
      const names = getFilledFieldNames(this.$props);
      const {
        filter = defaultFilterOption,
        // render = this.defaultRenderFilteredOption,
        sort = defaultSortFilteredOption,
        limit = defaultLimit,
      } = showSearch;
      const render =
        showSearch.render || $scopedSlots.showSearchRender || this.defaultRenderFilteredOption;
      const { flattenOptions = [], inputValue } = this.$data;

      // Limit the filter if needed
      let filtered;
      if (limit > 0) {
        filtered = [];
        let matchCount = 0;

        // Perf optimization to filter items only below the limit
        flattenOptions.some(path => {
          const match = filter(inputValue, path, names);
          if (match) {
            filtered.push(path);
            matchCount += 1;
          }
          return matchCount >= limit;
        });
      } else {
        warning(
          typeof limit !== 'number',
          "'limit' of showSearch in Cascader should be positive number or false.",
        );
        filtered = flattenOptions.filter(path => filter(inputValue, path, names));
      }

      filtered.sort((a, b) => sort(a, b, inputValue, names));

      if (filtered.length > 0) {
        return filtered.map(path => {
          return {
            __IS_FILTERED_OPTION: true,
            path,
            [names.label]: render({ inputValue, path, prefixCls, names }),
            [names.value]: path.map(o => o[names.value]),
            disabled: path.some(o => !!o.disabled),
          };
        });
      }
      return [
        {
          [names.label]: notFoundContent || renderEmpty(h, 'Cascader'),
          [names.value]: 'ANT_CASCADER_NOT_FOUND',
          disabled: true,
        },
      ];
    },

    focus() {
      if (this.showSearch) {
        this.$refs.input.focus();
      } else {
        this.$refs.picker.focus();
      }
    },

    blur() {
      if (this.showSearch) {
        this.$refs.input.blur();
      } else {
        this.$refs.picker.blur();
      }
    },
  },

  render() {
    const { $slots, sPopupVisible, inputValue, $listeners, configProvider, localeData } = this;
    const { sValue: value, inputFocused } = this.$data;
    const props = getOptionProps(this);
    let suffixIcon = getComponentFromProp(this, 'suffixIcon');
    suffixIcon = Array.isArray(suffixIcon) ? suffixIcon[0] : suffixIcon;
    const { getPopupContainer: getContextPopupContainer } = configProvider;
    const {
      prefixCls: customizePrefixCls,
      inputPrefixCls: customizeInputPrefixCls,
      placeholder = localeData.placeholder,
      size,
      disabled,
      allowClear,
      showSearch = false,
      ...otherProps
    } = props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const renderEmpty = this.configProvider.renderEmpty;
    const prefixCls = getPrefixCls('cascader', customizePrefixCls);
    const inputPrefixCls = getPrefixCls('input', customizeInputPrefixCls);

    const sizeCls = classNames({
      [`${inputPrefixCls}-lg`]: size === 'large',
      [`${inputPrefixCls}-sm`]: size === 'small',
    });
    const clearIcon =
      (allowClear && !disabled && value.length > 0) || inputValue ? (
        <Icon
          type="close-circle"
          theme="filled"
          class={`${prefixCls}-picker-clear`}
          onClick={this.clearSelection}
          key="clear-icon"
        />
      ) : null;
    const arrowCls = classNames({
      [`${prefixCls}-picker-arrow`]: true,
      [`${prefixCls}-picker-arrow-expand`]: sPopupVisible,
    });
    const pickerCls = classNames(getClass(this), `${prefixCls}-picker`, {
      [`${prefixCls}-picker-with-value`]: inputValue,
      [`${prefixCls}-picker-disabled`]: disabled,
      [`${prefixCls}-picker-${size}`]: !!size,
      [`${prefixCls}-picker-show-search`]: !!showSearch,
      [`${prefixCls}-picker-focused`]: inputFocused,
    });

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
      'fieldNames',
    ]);

    let options = props.options;
    if (inputValue) {
      options = this.generateFilteredOptions(prefixCls, renderEmpty);
    }
    // Dropdown menu should keep previous status until it is fully closed.
    if (!sPopupVisible) {
      options = this.cachedOptions;
    } else {
      this.cachedOptions = options;
    }

    const dropdownMenuColumnStyle = {};
    const isNotFound =
      (options || []).length === 1 && options[0].value === 'ANT_CASCADER_NOT_FOUND';
    if (isNotFound) {
      dropdownMenuColumnStyle.height = 'auto'; // Height of one row.
    }
    // The default value of `matchInputWidth` is `true`
    const resultListMatchInputWidth = showSearch.matchInputWidth !== false;
    if (resultListMatchInputWidth && inputValue && this.$refs.input) {
      dropdownMenuColumnStyle.width = this.$refs.input.$el.offsetWidth + 'px';
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
    };
    const children = filterEmpty($slots.default);
    const inputIcon = (suffixIcon &&
      (isValidElement(suffixIcon) ? (
        cloneElement(suffixIcon, {
          class: {
            [`${prefixCls}-picker-arrow`]: true,
          },
        })
      ) : (
        <span class={`${prefixCls}-picker-arrow`}>{suffixIcon}</span>
      ))) || <Icon type="down" class={arrowCls} />;

    const input = children.length ? (
      children
    ) : (
      <span class={pickerCls} style={getStyle(this)} ref="picker">
        {showSearch ? <span class={`${prefixCls}-picker-label`}>{this.getLabel()}</span> : null}
        <Input {...inputProps} />
        {!showSearch ? <span class={`${prefixCls}-picker-label`}>{this.getLabel()}</span> : null}
        {clearIcon}
        {inputIcon}
      </span>
    );

    const expandIcon = <Icon type="right" />;

    const loadingIcon = (
      <span class={`${prefixCls}-menu-item-loading-icon`}>
        <Icon type="redo" spin />
      </span>
    );
    const getPopupContainer = props.getPopupContainer || getContextPopupContainer;
    const cascaderProps = {
      props: {
        ...props,
        getPopupContainer,
        options: options,
        prefixCls,
        value: value,
        popupVisible: sPopupVisible,
        dropdownMenuColumnStyle: dropdownMenuColumnStyle,
        expandIcon,
        loadingIcon,
      },
      on: {
        ...$listeners,
        popupVisibleChange: this.handlePopupVisibleChange,
        change: this.handleChange,
      },
    };
    return <VcCascader {...cascaderProps}>{input}</VcCascader>;
  },
};

/* istanbul ignore next */
Cascader.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Cascader.name, Cascader);
};

export default Cascader;
