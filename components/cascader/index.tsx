import type { PropType, CSSProperties, ExtractPropTypes } from 'vue';
import { inject, provide, defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import VcCascader from '../vc-cascader';
import arrayTreeFilter from 'array-tree-filter';
import classNames from '../_util/classNames';
import KeyCode from '../_util/KeyCode';
import Input from '../input';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import DownOutlined from '@ant-design/icons-vue/DownOutlined';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import RedoOutlined from '@ant-design/icons-vue/RedoOutlined';
import {
  hasProp,
  getOptionProps,
  isValidElement,
  getComponent,
  splitAttrs,
  findDOMNode,
  getSlot,
} from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import { cloneElement } from '../_util/vnode';
import warning from '../_util/warning';
import { defaultConfigProvider } from '../config-provider';
import type { VueNode } from '../_util/type';
import { tuple, withInstall } from '../_util/type';
import type { RenderEmptyHandler } from '../config-provider/renderEmpty';
import { useInjectFormItemContext } from '../form/FormItemContext';
import omit from '../_util/omit';

export interface CascaderOptionType {
  value?: string | number;
  label?: VueNode;
  disabled?: boolean;
  isLeaf?: boolean;
  loading?: boolean;
  children?: CascaderOptionType[];
  [key: string]: any;
}

export interface FieldNamesType {
  value?: string;
  label?: string;
  children?: string;
}

export interface FilledFieldNamesType {
  value: string;
  label: string;
  children: string;
}

// const CascaderOptionType = PropTypes.shape({
//   value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   label: PropTypes.any,
//   disabled: PropTypes.looseBool,
//   children: PropTypes.array,
//   key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
// }).loose;

// const FieldNamesType = PropTypes.shape({
//   value: PropTypes.string.isRequired,
//   label: PropTypes.string.isRequired,
//   children: PropTypes.string,
// }).loose;

export interface ShowSearchType {
  filter?: (inputValue: string, path: CascaderOptionType[], names: FilledFieldNamesType) => boolean;
  render?: (
    inputValue: string,
    path: CascaderOptionType[],
    prefixCls: string | undefined,
    names: FilledFieldNamesType,
  ) => VueNode;
  sort?: (
    a: CascaderOptionType[],
    b: CascaderOptionType[],
    inputValue: string,
    names: FilledFieldNamesType,
  ) => number;
  matchInputWidth?: boolean;
  limit?: number | false;
}

export interface EmptyFilteredOptionsType {
  disabled: boolean;
  [key: string]: any;
}

export interface FilteredOptionsType extends EmptyFilteredOptionsType {
  __IS_FILTERED_OPTION: boolean;
  path: CascaderOptionType[];
}

// const ShowSearchType = PropTypes.shape({
//   filter: PropTypes.func,
//   render: PropTypes.func,
//   sort: PropTypes.func,
//   matchInputWidth: PropTypes.looseBool,
//   limit: withUndefined(PropTypes.oneOfType([Boolean, Number])),
// }).loose;
function noop() {}

const cascaderProps = {
  /** 可选项数据源 */
  options: { type: Array as PropType<CascaderOptionType[]>, default: [] },
  /** 默认的选中项 */
  defaultValue: PropTypes.array,
  /** 指定选中项 */
  value: PropTypes.array,
  /** 选择完成后的回调 */
  // onChange?: (value: string[], selectedOptions?: CascaderOptionType[]) => void;
  /** 选择后展示的渲染函数 */
  displayRender: PropTypes.func,
  transitionName: PropTypes.string.def('slide-up'),
  popupStyle: PropTypes.object.def(() => ({})),
  /** 自定义浮层类名 */
  popupClassName: PropTypes.string,
  /** 浮层预设位置：`bottomLeft` `bottomRight` `topLeft` `topRight` */
  popupPlacement: PropTypes.oneOf(tuple('bottomLeft', 'bottomRight', 'topLeft', 'topRight')).def(
    'bottomLeft',
  ),
  /** 输入框占位文本*/
  placeholder: PropTypes.string.def('Please select'),
  /** 输入框大小，可选 `large` `default` `small` */
  size: PropTypes.oneOf(tuple('large', 'default', 'small')),
  /** 禁用*/
  disabled: PropTypes.looseBool.def(false),
  /** 是否支持清除*/
  allowClear: PropTypes.looseBool.def(true),
  showSearch: {
    type: [Boolean, Object] as PropType<boolean | ShowSearchType | undefined>,
    default: undefined as PropType<boolean | ShowSearchType | undefined>,
  },
  notFoundContent: PropTypes.VNodeChild,
  loadData: PropTypes.func,
  /** 次级菜单的展开方式，可选 'click' 和 'hover' */
  expandTrigger: PropTypes.oneOf(tuple('click', 'hover')),
  /** 当此项为 true 时，点选每级菜单选项值都会发生变化 */
  changeOnSelect: PropTypes.looseBool,
  /** 浮层可见变化时回调 */
  // onPopupVisibleChange?: (popupVisible: boolean) => void;
  prefixCls: PropTypes.string,
  inputPrefixCls: PropTypes.string,
  getPopupContainer: PropTypes.func,
  popupVisible: PropTypes.looseBool,
  fieldNames: { type: Object as PropType<FieldNamesType> },
  autofocus: PropTypes.looseBool,
  suffixIcon: PropTypes.VNodeChild,
  showSearchRender: PropTypes.any,
  onChange: PropTypes.func,
  onPopupVisibleChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onSearch: PropTypes.func,
  'onUpdate:value': PropTypes.func,
};

export type CascaderProps = Partial<ExtractPropTypes<typeof cascaderProps>>;

// We limit the filtered item count by default
const defaultLimit = 50;

function defaultFilterOption(
  inputValue: string,
  path: CascaderOptionType[],
  names: FilledFieldNamesType,
) {
  return path.some(option => option[names.label].indexOf(inputValue) > -1);
}

function defaultSortFilteredOption(
  a: CascaderOptionType[],
  b: CascaderOptionType[],
  inputValue: string,
  names: FilledFieldNamesType,
) {
  function callback(elem: CascaderOptionType) {
    return elem[names.label].indexOf(inputValue) > -1;
  }

  return a.findIndex(callback) - b.findIndex(callback);
}

function getFilledFieldNames(props: any) {
  const fieldNames = (props.fieldNames || {}) as FieldNamesType;
  const names: FilledFieldNamesType = {
    children: fieldNames.children || 'children',
    label: fieldNames.label || 'label',
    value: fieldNames.value || 'value',
  };
  return names;
}

function flattenTree(
  options: CascaderOptionType[],
  props: any,
  ancestor: CascaderOptionType[] = [],
) {
  const names: FilledFieldNamesType = getFilledFieldNames(props);
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

const Cascader = defineComponent({
  name: 'ACascader',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: cascaderProps,
  setup() {
    const formItemContext = useInjectFormItemContext();
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
      localeData: inject('localeData', {} as any),
      cachedOptions: [],
      popupRef: undefined,
      input: undefined,
      formItemContext,
    };
  },
  data() {
    const { value, defaultValue, popupVisible, showSearch, options } = this.$props;
    return {
      sValue: (value || defaultValue || []) as any[],
      inputValue: '',
      inputFocused: false,
      sPopupVisible: popupVisible as boolean,
      flattenOptions: showSearch
        ? flattenTree(options as CascaderOptionType[], this.$props)
        : undefined,
    };
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
        this.setState({ flattenOptions: flattenTree(val, this.$props as any) });
      }
    },
  },
  // model: {
  //   prop: 'value',
  //   event: 'change',
  // },
  created() {
    provide('savePopupRef', this.savePopupRef);
  },
  methods: {
    savePopupRef(ref: any) {
      this.popupRef = ref;
    },
    highlightKeyword(str: string, keyword: string, prefixCls: string | undefined) {
      return str
        .split(keyword)
        .map((node, index) =>
          index === 0
            ? node
            : [<span class={`${prefixCls}-menu-item-keyword`}>{keyword}</span>, node],
        );
    },

    defaultRenderFilteredOption(opt: {
      inputValue: string;
      path: CascaderOptionType[];
      prefixCls: string | undefined;
      names: FilledFieldNamesType;
    }) {
      const { inputValue, path, prefixCls, names } = opt;
      return path.map((option, index) => {
        const label = option[names.label];
        const node =
          label.indexOf(inputValue) > -1
            ? this.highlightKeyword(label, inputValue, prefixCls)
            : label;
        return index === 0 ? node : [' / ', node];
      });
    },
    saveInput(node: any) {
      this.input = node;
    },
    handleChange(value: any, selectedOptions: CascaderOptionType[]) {
      this.setState({ inputValue: '' });
      if (selectedOptions[0].__IS_FILTERED_OPTION) {
        const unwrappedValue = value[0];
        const unwrappedSelectedOptions = selectedOptions[0].path;
        this.setValue(unwrappedValue, unwrappedSelectedOptions);
        return;
      }
      this.setValue(value, selectedOptions);
    },

    handlePopupVisibleChange(popupVisible: boolean) {
      if (!hasProp(this, 'popupVisible')) {
        this.setState((state: any) => ({
          sPopupVisible: popupVisible,
          inputFocused: popupVisible,
          inputValue: popupVisible ? state.inputValue : '',
        }));
      }
      this.$emit('popupVisibleChange', popupVisible);
    },
    handleInputFocus(e: InputEvent) {
      this.$emit('focus', e);
    },

    handleInputBlur(e: InputEvent) {
      this.setState({
        inputFocused: false,
      });
      this.$emit('blur', e);
      this.formItemContext.onFieldBlur();
    },

    handleInputClick(e: MouseEvent & { nativeEvent?: any }) {
      const { inputFocused, sPopupVisible } = this;
      // Prevent `Trigger` behavior.
      if (inputFocused || sPopupVisible) {
        e.stopPropagation();
        if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
          e.nativeEvent.stopImmediatePropagation();
        }
      }
    },

    handleKeyDown(e: KeyboardEvent) {
      if (e.keyCode === KeyCode.BACKSPACE || e.keyCode === KeyCode.SPACE) {
        e.stopPropagation();
      }
    },

    handleInputChange(e: Event) {
      const inputValue = (e.target as HTMLInputElement).value;
      this.setState({ inputValue });
      this.$emit('search', inputValue);
    },

    setValue(value: string[] | number[], selectedOptions: CascaderOptionType[] = []) {
      if (!hasProp(this, 'value')) {
        this.setState({ sValue: value });
      }
      this.$emit('update:value', value);
      this.$emit('change', value, selectedOptions);
      this.formItemContext.onFieldChange();
    },

    getLabel() {
      const { options } = this;
      const names = getFilledFieldNames(this.$props);
      const displayRender = getComponent(this, 'displayRender', {}, false) || defaultDisplayRender;
      const value = this.sValue;
      const unwrappedValue = Array.isArray(value[0]) ? value[0] : value;
      const selectedOptions = arrayTreeFilter<CascaderOptionType>(
        options as CascaderOptionType[],
        (o, level) => o[names.value] === unwrappedValue[level],
        { childrenKeyName: names.children },
      );
      const labels = selectedOptions.map(o => o[names.label]);
      return displayRender({ labels, selectedOptions });
    },

    clearSelection(e: MouseEvent) {
      e.preventDefault();
      e.stopPropagation();
      if (!this.inputValue) {
        this.setValue([]);
        this.handlePopupVisibleChange(false);
      } else {
        this.setState({ inputValue: '' });
      }
    },

    generateFilteredOptions(
      prefixCls: string | undefined,
      renderEmpty: RenderEmptyHandler,
    ): EmptyFilteredOptionsType[] | FilteredOptionsType[] {
      const { showSearch, notFoundContent } = this;
      const names: FilledFieldNamesType = getFilledFieldNames(this.$props);
      const {
        filter = defaultFilterOption,
        // render = this.defaultRenderFilteredOption,
        sort = defaultSortFilteredOption,
        limit = defaultLimit,
      } = showSearch as ShowSearchType;
      const render =
        (showSearch as ShowSearchType).render ||
        getComponent(this, 'showSearchRender') ||
        this.defaultRenderFilteredOption;
      const { flattenOptions = [], inputValue } = this.$data;

      // Limit the filter if needed
      let filtered: Array<CascaderOptionType[]>;
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
          'Cascader',
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
          [names.label]: notFoundContent || renderEmpty('Cascader'),
          [names.value]: 'ANT_CASCADER_NOT_FOUND',
          disabled: true,
        },
      ];
    },

    focus() {
      this.input && this.input.focus();
    },

    blur() {
      this.input && this.input.blur();
    },
  },

  render() {
    const { sPopupVisible, inputValue, configProvider, localeData } = this;
    const { sValue: value, inputFocused } = this.$data;
    const props = getOptionProps(this);
    let suffixIcon = getComponent(this, 'suffixIcon');
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
      notFoundContent,
      ...otherProps
    } = props as any;
    const { onEvents, extraAttrs } = splitAttrs(this.$attrs);
    const {
      class: className,
      style,
      id = this.formItemContext.id.value,
      ...restAttrs
    } = extraAttrs;
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
        <CloseCircleFilled
          class={`${prefixCls}-picker-clear`}
          onClick={this.clearSelection}
          key="clear-icon"
        />
      ) : null;
    const arrowCls = classNames({
      [`${prefixCls}-picker-arrow`]: true,
      [`${prefixCls}-picker-arrow-expand`]: sPopupVisible,
    });
    const pickerCls = classNames(className, `${prefixCls}-picker`, {
      [`${prefixCls}-picker-with-value`]: inputValue,
      [`${prefixCls}-picker-disabled`]: disabled,
      [`${prefixCls}-picker-${size}`]: !!size,
      [`${prefixCls}-picker-show-search`]: !!showSearch,
      [`${prefixCls}-picker-focused`]: inputFocused,
    });

    // Fix bug of https://github.com/facebook/react/pull/5004
    // and https://fb.me/react-unknown-prop
    const tempInputProps = omit(otherProps, [
      'popupStyle',
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
      'onChange',
      'onPopupVisibleChange',
      'onFocus',
      'onBlur',
      'onSearch',
      'onUpdate:value',
    ]);

    let options = props.options;
    const names = getFilledFieldNames(this.$props);
    if (options && options.length > 0) {
      if (inputValue) {
        options = this.generateFilteredOptions(prefixCls, renderEmpty);
      }
    } else {
      options = [
        {
          [names.label]: notFoundContent || renderEmpty('Cascader'),
          [names.value]: 'ANT_CASCADER_NOT_FOUND',
          disabled: true,
        },
      ];
    }

    // Dropdown menu should keep previous status until it is fully closed.
    if (!sPopupVisible) {
      options = this.cachedOptions;
    } else {
      this.cachedOptions = options;
    }

    const dropdownMenuColumnStyle: CSSProperties = {};
    const isNotFound =
      (options || []).length === 1 && options[0].value === 'ANT_CASCADER_NOT_FOUND';
    if (isNotFound) {
      dropdownMenuColumnStyle.height = 'auto'; // Height of one row.
    }
    // The default value of `matchInputWidth` is `true`
    const resultListMatchInputWidth = showSearch.matchInputWidth !== false;
    if (resultListMatchInputWidth && (inputValue || isNotFound) && this.input) {
      dropdownMenuColumnStyle.width = findDOMNode(this.input.input).offsetWidth + 'px';
    }
    // showSearch时，focus、blur在input上触发，反之在ref='picker'上触发
    const inputProps = {
      ...restAttrs,
      ...tempInputProps,
      id,
      prefixCls: inputPrefixCls,
      placeholder: value && value.length > 0 ? undefined : placeholder,
      value: inputValue,
      disabled,
      readonly: !showSearch,
      autocomplete: 'off',
      class: `${prefixCls}-input ${sizeCls}`,
      onFocus: this.handleInputFocus,
      onClick: showSearch ? this.handleInputClick : noop,
      onBlur: showSearch ? this.handleInputBlur : props.onBlur,
      onKeydown: this.handleKeyDown,
      onChange: showSearch ? this.handleInputChange : noop,
    };
    const children = getSlot(this);
    const inputIcon = (suffixIcon &&
      (isValidElement(suffixIcon) ? (
        cloneElement(suffixIcon, {
          class: `${prefixCls}-picker-arrow`,
        })
      ) : (
        <span class={`${prefixCls}-picker-arrow`}>{suffixIcon}</span>
      ))) || <DownOutlined class={arrowCls} />;

    const input = children.length ? (
      children
    ) : (
      <span class={pickerCls} style={style}>
        <span class={`${prefixCls}-picker-label`}>{this.getLabel()}</span>
        <Input {...inputProps} ref={this.saveInput} />
        {clearIcon}
        {inputIcon}
      </span>
    );

    const expandIcon = <RightOutlined />;

    const loadingIcon = (
      <span class={`${prefixCls}-menu-item-loading-icon`}>
        <RedoOutlined spin />
      </span>
    );
    const getPopupContainer = props.getPopupContainer || getContextPopupContainer;
    const cascaderProps = {
      ...props,
      getPopupContainer,
      options,
      prefixCls,
      value,
      popupVisible: sPopupVisible,
      dropdownMenuColumnStyle,
      expandIcon,
      loadingIcon,
      ...onEvents,
      onPopupVisibleChange: this.handlePopupVisibleChange,
      onChange: this.handleChange,
    };
    return <VcCascader {...cascaderProps}>{input}</VcCascader>;
  },
});

export default withInstall(Cascader);
