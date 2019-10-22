import KeyCode from '../_util/KeyCode';
import PropTypes from '../_util/vue-types';
import classnames from 'classnames';
import classes from 'component-classes';
import { Item as MenuItem, ItemGroup as MenuItemGroup } from '../vc-menu';
import warning from 'warning';
import Vue from 'vue';
import Option from './Option';
import OptGroup from './OptGroup';
import {
  hasProp,
  getSlotOptions,
  getPropsData,
  getValueByProp as getValue,
  getComponentFromProp,
  getEvents,
  getClass,
  getStyle,
  getAttrs,
  getOptionProps,
  getSlots,
} from '../_util/props-util';
import getTransitionProps from '../_util/getTransitionProps';
import { cloneElement } from '../_util/vnode';
import BaseMixin from '../_util/BaseMixin';
import proxyComponent from '../_util/proxyComponent';
import ref from 'vue-ref';
import SelectTrigger from './SelectTrigger';
import {
  defaultFilterFn,
  findFirstMenuItem,
  findIndexInValueBySingleValue,
  generateUUID,
  getLabelFromPropsValue,
  getMapKey,
  getPropValue,
  getValuePropValue,
  includesSeparators,
  isCombobox,
  isMultipleOrTags,
  isMultipleOrTagsOrCombobox,
  isSingleMode,
  preventDefaultEvent,
  saveRef,
  splitBySeparators,
  toArray,
  toTitle,
  UNSELECTABLE_ATTRIBUTE,
  UNSELECTABLE_STYLE,
  validateOptionValue,
} from './util';
import { SelectPropTypes } from './PropTypes';
import contains from '../_util/Dom/contains';
import { isIE, isEdge } from '../_util/env';

Vue.use(ref, { name: 'ant-ref' });
const SELECT_EMPTY_VALUE_KEY = 'RC_SELECT_EMPTY_VALUE_KEY';

const noop = () => null;

function chaining(...fns) {
  return function(...args) {
    // eslint-disable-line
    // eslint-disable-line
    for (let i = 0; i < fns.length; i++) {
      if (fns[i] && typeof fns[i] === 'function') {
        fns[i].apply(chaining, args);
      }
    }
  };
}
const Select = {
  inheritAttrs: false,
  Option,
  OptGroup,
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
    // showArrow: SelectPropTypes.showArrow.def(true),
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
    tabIndex: PropTypes.any.def(0),
    dropdownRender: PropTypes.func.def(menu => menu),
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
  created() {
    this.saveInputRef = saveRef(this, 'inputRef');
    this.saveInputMirrorRef = saveRef(this, 'inputMirrorRef');
    this.saveTopCtrlRef = saveRef(this, 'topCtrlRef');
    this.saveSelectTriggerRef = saveRef(this, 'selectTriggerRef');
    this.saveRootRef = saveRef(this, 'rootRef');
    this.saveSelectionRef = saveRef(this, 'selectionRef');
    this._focused = false;
    this._mouseDown = false;
    this._options = [];
    this._empty = false;
  },
  data() {
    const props = getOptionProps(this);
    const optionsInfo = this.getOptionsInfoFromProps(props);
    warning(
      this.__propsSymbol__,
      'Replace slots.default with props.children and pass props.__propsSymbol__',
    );
    const state = {
      _value: this.getValueFromProps(props, true), // true: use default value
      _inputValue: props.combobox
        ? this.getInputValueForCombobox(
            props,
            optionsInfo,
            true, // use default value
          )
        : '',
      _open: props.defaultOpen,
      _optionsInfo: optionsInfo,
      _backfillValue: '',
      // a flag for aviod redundant getOptionsInfoFromProps call
      _skipBuildOptionsInfo: true,
      _ariaId: generateUUID(),
    };
    return {
      ...state,
      ...this.getDerivedStateFromProps(props, state),
    };
  },

  mounted() {
    this.$nextTick(() => {
      // when defaultOpen is true, we should auto focus search input
      // https://github.com/ant-design/ant-design/issues/14254
      if (this.autoFocus || this._open) {
        this.focus();
      }
      // this.setState({
      //   _ariaId: generateUUID(),
      // });
    });
  },
  watch: {
    __propsSymbol__() {
      Object.assign(this.$data, this.getDerivedStateFromProps(getOptionProps(this), this.$data));
    },
  },
  updated() {
    this.$nextTick(() => {
      if (isMultipleOrTags(this.$props)) {
        const inputNode = this.getInputDOMNode();
        const mirrorNode = this.getInputMirrorDOMNode();
        if (inputNode && inputNode.value && mirrorNode) {
          inputNode.style.width = '';
          inputNode.style.width = `${mirrorNode.clientWidth + 10}px`;
        } else if (inputNode) {
          inputNode.style.width = '';
        }
      }
      this.forcePopupAlign();
    });
  },
  beforeDestroy() {
    this.clearFocusTime();
    this.clearBlurTime();
    if (this.dropdownContainer) {
      document.body.removeChild(this.dropdownContainer);
      this.dropdownContainer = null;
    }
  },
  methods: {
    getDerivedStateFromProps(nextProps, prevState) {
      const optionsInfo = prevState._skipBuildOptionsInfo
        ? prevState._optionsInfo
        : this.getOptionsInfoFromProps(nextProps, prevState);

      const newState = {
        _optionsInfo: optionsInfo,
        _skipBuildOptionsInfo: false,
      };

      if ('open' in nextProps) {
        newState._open = nextProps.open;
      }

      if ('value' in nextProps) {
        const value = this.getValueFromProps(nextProps);
        newState._value = value;
        if (nextProps.combobox) {
          newState._inputValue = this.getInputValueForCombobox(nextProps, optionsInfo);
        }
      }
      return newState;
    },
    getOptionsFromChildren(children = [], options = []) {
      children.forEach(child => {
        if (!child.data || child.data.slot !== undefined) {
          return;
        }
        if (getSlotOptions(child).isSelectOptGroup) {
          this.getOptionsFromChildren(child.componentOptions.children, options);
        } else {
          options.push(child);
        }
      });
      return options;
    },
    getInputValueForCombobox(props, optionsInfo, useDefaultValue) {
      let value = [];
      if ('value' in props && !useDefaultValue) {
        value = toArray(props.value);
      }
      if ('defaultValue' in props && useDefaultValue) {
        value = toArray(props.defaultValue);
      }
      if (value.length) {
        value = value[0];
      } else {
        return '';
      }
      let label = value;
      if (props.labelInValue) {
        label = value.label;
      } else if (optionsInfo[getMapKey(value)]) {
        label = optionsInfo[getMapKey(value)].label;
      }
      if (label === undefined) {
        label = '';
      }
      return label;
    },

    getLabelFromOption(props, option) {
      return getPropValue(option, props.optionLabelProp);
    },

    getOptionsInfoFromProps(props, preState) {
      const options = this.getOptionsFromChildren(this.$props.children);
      const optionsInfo = {};
      options.forEach(option => {
        const singleValue = getValuePropValue(option);
        optionsInfo[getMapKey(singleValue)] = {
          option,
          value: singleValue,
          label: this.getLabelFromOption(props, option),
          title: getValue(option, 'title'),
          disabled: getValue(option, 'disabled'),
        };
      });
      if (preState) {
        // keep option info in pre state value.
        const oldOptionsInfo = preState._optionsInfo;
        const value = preState._value;
        if (value) {
          value.forEach(v => {
            const key = getMapKey(v);
            if (!optionsInfo[key] && oldOptionsInfo[key] !== undefined) {
              optionsInfo[key] = oldOptionsInfo[key];
            }
          });
        }
      }
      return optionsInfo;
    },

    getValueFromProps(props, useDefaultValue) {
      let value = [];
      if ('value' in props && !useDefaultValue) {
        value = toArray(props.value);
      }
      if ('defaultValue' in props && useDefaultValue) {
        value = toArray(props.defaultValue);
      }
      if (props.labelInValue) {
        value = value.map(v => {
          return v.key;
        });
      }
      return value;
    },

    onInputChange(event) {
      const { tokenSeparators } = this.$props;
      const val = event.target.value;
      if (
        isMultipleOrTags(this.$props) &&
        tokenSeparators.length &&
        includesSeparators(val, tokenSeparators)
      ) {
        const nextValue = this.getValueByInput(val);
        if (nextValue !== undefined) {
          this.fireChange(nextValue);
        }
        this.setOpenState(false, true);
        this.setInputValue('', false);
        return;
      }
      this.setInputValue(val);
      this.setState({
        _open: true,
      });
      if (isCombobox(this.$props)) {
        this.fireChange([val]);
      }
    },

    onDropdownVisibleChange(open) {
      if (open && !this._focused) {
        this.clearBlurTime();
        this.timeoutFocus();
        this._focused = true;
        this.updateFocusClassName();
      }
      this.setOpenState(open);
    },

    // combobox ignore
    onKeyDown(event) {
      const { _open: open } = this.$data;
      const { disabled } = this.$props;
      if (disabled) {
        return;
      }
      const keyCode = event.keyCode;
      if (open && !this.getInputDOMNode()) {
        this.onInputKeydown(event);
      } else if (keyCode === KeyCode.ENTER || keyCode === KeyCode.DOWN) {
        // vue state是同步更新，onKeyDown在onMenuSelect后会再次调用，单选时不在调用setOpenState
        // https://github.com/vueComponent/ant-design-vue/issues/1142
        if (keyCode === KeyCode.ENTER && !isMultipleOrTags(this.$props)) {
          this.maybeFocus(true);
        } else if (!open) {
          this.setOpenState(true);
        }
        event.preventDefault();
      } else if (keyCode === KeyCode.SPACE) {
        // Not block space if popup is shown
        if (!open) {
          this.setOpenState(true);
          event.preventDefault();
        }
      }
    },

    onInputKeydown(event) {
      const props = this.$props;
      if (props.disabled) {
        return;
      }
      const state = this.$data;
      const isRealOpen = this.getRealOpenState(state);
      const keyCode = event.keyCode;
      if (isMultipleOrTags(props) && !event.target.value && keyCode === KeyCode.BACKSPACE) {
        event.preventDefault();
        const { _value: value } = state;
        if (value.length) {
          this.removeSelected(value[value.length - 1]);
        }
        return;
      }
      if (keyCode === KeyCode.DOWN) {
        if (!state._open) {
          this.openIfHasChildren();
          event.preventDefault();
          event.stopPropagation();
          return;
        }
      } else if (keyCode === KeyCode.ENTER && state._open) {
        // Aviod trigger form submit when select item
        // https://github.com/ant-design/ant-design/issues/10861
        // https://github.com/ant-design/ant-design/issues/14544
        if (isRealOpen || !props.combobox) {
          event.preventDefault();
        }
      } else if (keyCode === KeyCode.ESC) {
        if (state._open) {
          this.setOpenState(false);
          event.preventDefault();
          event.stopPropagation();
        }
        return;
      }

      if (isRealOpen && this.selectTriggerRef) {
        const menu = this.selectTriggerRef.getInnerMenu();
        if (menu && menu.onKeyDown(event, this.handleBackfill)) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    },

    onMenuSelect({ item }) {
      if (!item) {
        return;
      }
      let value = this.$data._value;
      const props = this.$props;
      const selectedValue = getValuePropValue(item);
      const lastValue = value[value.length - 1];
      this.fireSelect(selectedValue);
      if (isMultipleOrTags(props)) {
        if (findIndexInValueBySingleValue(value, selectedValue) !== -1) {
          return;
        }
        value = value.concat([selectedValue]);
      } else {
        if (
          !isCombobox(props) &&
          lastValue !== undefined &&
          lastValue === selectedValue &&
          selectedValue !== this.$data._backfillValue
        ) {
          this.setOpenState(false, true);
          return;
        }
        value = [selectedValue];
        this.setOpenState(false, true);
      }
      this.fireChange(value);
      const inputValue = isCombobox(props) ? getPropValue(item, props.optionLabelProp) : '';

      if (props.autoClearSearchValue) {
        this.setInputValue(inputValue, false);
      }
    },

    onMenuDeselect({ item, domEvent }) {
      if (domEvent.type === 'keydown' && domEvent.keyCode === KeyCode.ENTER) {
        this.removeSelected(getValuePropValue(item));
        return;
      }
      if (domEvent.type === 'click') {
        this.removeSelected(getValuePropValue(item));
      }
      if (this.autoClearSearchValue) {
        this.setInputValue('', false);
      }
    },

    onArrowClick(e) {
      e.stopPropagation();
      e.preventDefault();
      this.clearBlurTime();
      if (!this.disabled) {
        this.setOpenState(!this.$data._open, !this.$data._open);
      }
    },

    onPlaceholderClick() {
      if (this.getInputDOMNode() && this.getInputDOMNode()) {
        this.getInputDOMNode().focus();
      }
    },

    onPopupFocus() {
      // fix ie scrollbar, focus element again
      this.maybeFocus(true, true);
    },

    onClearSelection(event) {
      const props = this.$props;
      const state = this.$data;
      if (props.disabled) {
        return;
      }
      const { _inputValue: inputValue, _value: value } = state;
      event.stopPropagation();
      if (inputValue || value.length) {
        if (value.length) {
          this.fireChange([]);
        }
        this.setOpenState(false, true);
        if (inputValue) {
          this.setInputValue('');
        }
      }
    },

    onChoiceAnimationLeave() {
      this.forcePopupAlign();
    },

    getOptionInfoBySingleValue(value, optionsInfo) {
      let info;
      optionsInfo = optionsInfo || this.$data._optionsInfo;
      if (optionsInfo[getMapKey(value)]) {
        info = optionsInfo[getMapKey(value)];
      }
      if (info) {
        return info;
      }
      let defaultLabel = value;
      if (this.$props.labelInValue) {
        const label = getLabelFromPropsValue(this.$props.value, value);
        if (label !== undefined) {
          defaultLabel = label;
        }
      }
      const defaultInfo = {
        option: (
          <Option value={value} key={value}>
            {value}
          </Option>
        ),
        value,
        label: defaultLabel,
      };
      return defaultInfo;
    },

    getOptionBySingleValue(value) {
      const { option } = this.getOptionInfoBySingleValue(value);
      return option;
    },

    getOptionsBySingleValue(values) {
      return values.map(value => {
        return this.getOptionBySingleValue(value);
      });
    },

    getValueByLabel(label) {
      if (label === undefined) {
        return null;
      }
      let value = null;
      Object.keys(this.$data._optionsInfo).forEach(key => {
        const info = this.$data._optionsInfo[key];
        const { disabled } = info;
        if (disabled) {
          return;
        }
        const oldLable = toArray(info.label);
        if (oldLable && oldLable.join('') === label) {
          value = info.value;
        }
      });
      return value;
    },

    getVLBySingleValue(value) {
      if (this.$props.labelInValue) {
        return {
          key: value,
          label: this.getLabelBySingleValue(value),
        };
      }
      return value;
    },

    getVLForOnChange(vlsS) {
      let vls = vlsS;
      if (vls !== undefined) {
        if (!this.labelInValue) {
          vls = vls.map(v => v);
        } else {
          vls = vls.map(vl => ({
            key: vl,
            label: this.getLabelBySingleValue(vl),
          }));
        }
        return isMultipleOrTags(this.$props) ? vls : vls[0];
      }
      return vls;
    },

    getLabelBySingleValue(value, optionsInfo) {
      const { label } = this.getOptionInfoBySingleValue(value, optionsInfo);
      return label;
    },

    getDropdownContainer() {
      if (!this.dropdownContainer) {
        this.dropdownContainer = document.createElement('div');
        document.body.appendChild(this.dropdownContainer);
      }
      return this.dropdownContainer;
    },

    getPlaceholderElement() {
      const { $props: props, $data: state } = this;
      let hidden = false;
      if (state._inputValue) {
        hidden = true;
      }
      const value = state._value;
      if (value.length) {
        hidden = true;
      }
      if (isCombobox(props) && value.length === 1 && (state._value && !state._value[0])) {
        hidden = false;
      }
      const placeholder = props.placeholder;
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
        };
        return <div {...p}>{placeholder}</div>;
      }
      return null;
    },
    inputClick(e) {
      if (this.$data._open) {
        this.clearBlurTime();
        e.stopPropagation();
      } else {
        this._focused = false;
      }
    },
    inputBlur(e) {
      const target = e.relatedTarget || document.activeElement;

      // https://github.com/vueComponent/ant-design-vue/issues/999
      // https://github.com/vueComponent/ant-design-vue/issues/1223
      if (
        (isIE || isEdge) &&
        (e.relatedTarget === this.$refs.arrow ||
          (target &&
            this.selectTriggerRef &&
            this.selectTriggerRef.getInnerMenu() &&
            this.selectTriggerRef.getInnerMenu().$el === target) ||
          contains(e.target, target))
      ) {
        e.target.focus();
        e.preventDefault();
        return;
      }
      this.clearBlurTime();
      if (this.disabled) {
        e.preventDefault();
        return;
      }
      this.blurTimer = setTimeout(() => {
        this._focused = false;
        this.updateFocusClassName();
        const props = this.$props;
        let { _value: value } = this.$data;
        const { _inputValue: inputValue } = this.$data;
        if (
          isSingleMode(props) &&
          props.showSearch &&
          inputValue &&
          props.defaultActiveFirstOption
        ) {
          const options = this._options || [];
          if (options.length) {
            const firstOption = findFirstMenuItem(options);
            if (firstOption) {
              value = [getValuePropValue(firstOption)];
              this.fireChange(value);
            }
          }
        } else if (isMultipleOrTags(props) && inputValue) {
          if (this._mouseDown) {
            // need update dropmenu when not blur
            this.setInputValue('');
          } else {
            // why not use setState?
            this.$data._inputValue = '';
            if (this.getInputDOMNode && this.getInputDOMNode()) {
              this.getInputDOMNode().value = '';
            }
          }
          const tmpValue = this.getValueByInput(inputValue);
          if (tmpValue !== undefined) {
            value = tmpValue;
            this.fireChange(value);
          }
        }
        // if click the rest space of Select in multiple mode
        if (isMultipleOrTags(props) && this._mouseDown) {
          this.maybeFocus(true, true);
          this._mouseDown = false;
          return;
        }
        this.setOpenState(false);
        this.$emit('blur', this.getVLForOnChange(value));
      }, 200);
    },
    inputFocus(e) {
      if (this.$props.disabled) {
        e.preventDefault();
        return;
      }
      this.clearBlurTime();
      if (!isMultipleOrTagsOrCombobox(this.$props) && e.target === this.getInputDOMNode()) {
        return;
      }
      if (this._focused) {
        return;
      }
      this._focused = true;
      this.updateFocusClassName();
      // only effect multiple or tag mode
      if (!isMultipleOrTags(this.$props) || !this._mouseDown) {
        this.timeoutFocus();
      }
    },
    _getInputElement() {
      const props = this.$props;
      const { _inputValue: inputValue } = this.$data;
      const attrs = getAttrs(this);
      const defaultInput = <input id={attrs.id} autoComplete="off" />;

      const inputElement = props.getInputElement ? props.getInputElement() : defaultInput;
      const inputCls = classnames(getClass(inputElement), {
        [`${props.prefixCls}-search__field`]: true,
      });
      const inputEvents = getEvents(inputElement);
      // https://github.com/ant-design/ant-design/issues/4992#issuecomment-281542159
      // Add space to the end of the inputValue as the width measurement tolerance
      inputElement.data = inputElement.data || {};
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
            directives: [
              {
                name: 'ant-ref',
                value: this.saveInputRef,
              },
            ],
            on: {
              input: this.onInputChange,
              keydown: chaining(
                this.onInputKeydown,
                inputEvents.keydown,
                this.$listeners.inputKeydown,
              ),
              focus: chaining(this.inputFocus, inputEvents.focus),
              blur: chaining(this.inputBlur, inputEvents.blur),
            },
          })}
          <span
            {...{
              directives: [
                {
                  name: 'ant-ref',
                  value: this.saveInputMirrorRef,
                },
              ],
            }}
            // ref='inputMirrorRef'
            class={`${props.prefixCls}-search__field__mirror`}
          >
            {inputValue}&nbsp;
          </span>
        </div>
      );
    },

    getInputDOMNode() {
      return this.topCtrlRef
        ? this.topCtrlRef.querySelector('input,textarea,div[contentEditable]')
        : this.inputRef;
    },

    getInputMirrorDOMNode() {
      return this.inputMirrorRef;
    },

    getPopupDOMNode() {
      if (this.selectTriggerRef) {
        return this.selectTriggerRef.getPopupDOMNode();
      }
    },

    getPopupMenuComponent() {
      if (this.selectTriggerRef) {
        return this.selectTriggerRef.getInnerMenu();
      }
    },

    setOpenState(open, needFocus) {
      const { $props: props, $data: state } = this;
      if (state._open === open) {
        this.maybeFocus(open, !!needFocus);
        return;
      }
      this.__emit('dropdownVisibleChange', open);
      const nextState = {
        _open: open,
        _backfillValue: '',
      };
      // clear search input value when open is false in singleMode.
      if (!open && isSingleMode(props) && props.showSearch) {
        this.setInputValue('', false);
      }
      if (!open) {
        this.maybeFocus(open, !!needFocus);
      }
      this.setState(nextState, () => {
        if (open) {
          this.maybeFocus(open, !!needFocus);
        }
      });
    },

    setInputValue(inputValue, fireSearch = true) {
      if (inputValue !== this.$data._inputValue) {
        this.setState(
          {
            _inputValue: inputValue,
          },
          this.forcePopupAlign,
        );
        if (fireSearch) {
          this.$emit('search', inputValue);
        }
      }
    },
    getValueByInput(str) {
      const { multiple, tokenSeparators } = this.$props;
      let nextValue = this.$data._value;
      let hasNewValue = false;
      splitBySeparators(str, tokenSeparators).forEach(label => {
        const selectedValue = [label];
        if (multiple) {
          const value = this.getValueByLabel(label);
          if (value && findIndexInValueBySingleValue(nextValue, value) === -1) {
            nextValue = nextValue.concat(value);
            hasNewValue = true;
            this.fireSelect(value);
          }
        } else if (findIndexInValueBySingleValue(nextValue, label) === -1) {
          nextValue = nextValue.concat(selectedValue);
          hasNewValue = true;
          this.fireSelect(label);
        }
      });
      return hasNewValue ? nextValue : undefined;
    },

    getRealOpenState(state) {
      const { open: _open } = this.$props;
      if (typeof _open === 'boolean') {
        return _open;
      }

      let open = (state || this.$data)._open;
      const options = this._options || [];
      if (isMultipleOrTagsOrCombobox(this.$props) || !this.$props.showSearch) {
        if (open && !options.length) {
          open = false;
        }
      }
      return open;
    },

    focus() {
      if (isSingleMode(this.$props) && this.selectionRef) {
        this.selectionRef.focus();
      } else if (this.getInputDOMNode()) {
        this.getInputDOMNode().focus();
      }
    },

    blur() {
      if (isSingleMode(this.$props) && this.selectionRef) {
        this.selectionRef.blur();
      } else if (this.getInputDOMNode()) {
        this.getInputDOMNode().blur();
      }
    },
    markMouseDown() {
      this._mouseDown = true;
    },

    markMouseLeave() {
      this._mouseDown = false;
    },

    handleBackfill(item) {
      if (!this.backfill || !(isSingleMode(this.$props) || isCombobox(this.$props))) {
        return;
      }

      const key = getValuePropValue(item);

      if (isCombobox(this.$props)) {
        this.setInputValue(key, false);
      }

      this.setState({
        _value: [key],
        _backfillValue: key,
      });
    },

    _filterOption(input, child, defaultFilter = defaultFilterFn) {
      const { _value: value, _backfillValue: backfillValue } = this.$data;
      const lastValue = value[value.length - 1];
      if (!input || (lastValue && lastValue === backfillValue)) {
        return true;
      }
      let filterFn = this.$props.filterOption;
      if (hasProp(this, 'filterOption')) {
        if (filterFn === true) {
          filterFn = defaultFilter.bind(this);
        }
      } else {
        filterFn = defaultFilter.bind(this);
      }
      if (!filterFn) {
        return true;
      } else if (typeof filterFn === 'function') {
        return filterFn.call(this, input, child);
      } else if (getValue(child, 'disabled')) {
        return false;
      }
      return true;
    },

    timeoutFocus() {
      if (this.focusTimer) {
        this.clearFocusTime();
      }
      this.focusTimer = window.setTimeout(() => {
        // this._focused = true
        // this.updateFocusClassName()
        this.$emit('focus');
      }, 10);
    },

    clearFocusTime() {
      if (this.focusTimer) {
        clearTimeout(this.focusTimer);
        this.focusTimer = null;
      }
    },

    clearBlurTime() {
      if (this.blurTimer) {
        clearTimeout(this.blurTimer);
        this.blurTimer = null;
      }
    },

    updateFocusClassName() {
      const { rootRef, prefixCls } = this;
      // avoid setState and its side effect
      if (this._focused) {
        classes(rootRef).add(`${prefixCls}-focused`);
      } else {
        classes(rootRef).remove(`${prefixCls}-focused`);
      }
    },

    maybeFocus(open, needFocus) {
      if (needFocus || open) {
        const input = this.getInputDOMNode();
        const { activeElement } = document;
        if (input && (open || isMultipleOrTagsOrCombobox(this.$props))) {
          if (activeElement !== input) {
            input.focus();
            this._focused = true;
          }
        } else if (activeElement !== this.selectionRef && this.selectionRef) {
          this.selectionRef.focus();
          this._focused = true;
        }
      }
    },

    removeSelected(selectedKey, e) {
      const props = this.$props;
      if (props.disabled || this.isChildDisabled(selectedKey)) {
        return;
      }
      // Do not trigger Trigger popup
      if (e && e.stopPropagation) {
        e.stopPropagation();
      }
      const oldValue = this.$data._value;
      const value = oldValue.filter(singleValue => {
        return singleValue !== selectedKey;
      });
      const canMultiple = isMultipleOrTags(props);

      if (canMultiple) {
        let event = selectedKey;
        if (props.labelInValue) {
          event = {
            key: selectedKey,
            label: this.getLabelBySingleValue(selectedKey),
          };
        }
        this.$emit('deselect', event, this.getOptionBySingleValue(selectedKey));
      }
      this.fireChange(value);
    },

    openIfHasChildren() {
      const { $props } = this;
      if (($props.children && $props.children.length) || isSingleMode($props)) {
        this.setOpenState(true);
      }
    },
    fireSelect(value) {
      this.$emit('select', this.getVLBySingleValue(value), this.getOptionBySingleValue(value));
    },
    fireChange(value) {
      if (!hasProp(this, 'value')) {
        this.setState(
          {
            _value: value,
          },
          this.forcePopupAlign,
        );
      }
      const vls = this.getVLForOnChange(value);
      const options = this.getOptionsBySingleValue(value);
      this._valueOptions = options;
      this.$emit('change', vls, isMultipleOrTags(this.$props) ? options : options[0]);
    },

    isChildDisabled(key) {
      return (this.$props.children || []).some(child => {
        const childValue = getValuePropValue(child);
        return childValue === key && getValue(child, 'disabled');
      });
    },
    forcePopupAlign() {
      if (!this.$data._open) {
        return;
      }
      if (this.selectTriggerRef && this.selectTriggerRef.triggerRef) {
        this.selectTriggerRef.triggerRef.forcePopupAlign();
      }
    },
    renderFilterOptions() {
      const { _inputValue: inputValue } = this.$data;
      const { children, tags, filterOption, notFoundContent } = this.$props;
      const menuItems = [];
      const childrenKeys = [];
      let empty = false;
      let options = this.renderFilterOptionsFromChildren(children, childrenKeys, menuItems);
      if (tags) {
        // tags value must be string
        let value = this.$data._value;
        value = value.filter(singleValue => {
          return (
            childrenKeys.indexOf(singleValue) === -1 &&
            (!inputValue || String(singleValue).indexOf(String(inputValue)) > -1)
          );
        });

        // sort by length
        value.sort((val1, val2) => {
          return val1.length - val2.length;
        });

        value.forEach(singleValue => {
          const key = singleValue;
          const attrs = {
            ...UNSELECTABLE_ATTRIBUTE,
            role: 'option',
          };
          const menuItem = (
            <MenuItem style={UNSELECTABLE_STYLE} {...{ attrs }} value={key} key={key}>
              {key}
            </MenuItem>
          );
          options.push(menuItem);
          menuItems.push(menuItem);
        });
        if (inputValue) {
          const notFindInputItem = menuItems.every(option => {
            // this.filterOption return true has two meaning,
            // 1, some one exists after filtering
            // 2, filterOption is set to false
            // condition 2 does not mean the option has same value with inputValue
            const filterFn = () => getValuePropValue(option) === inputValue;
            if (filterOption !== false) {
              return !this._filterOption(inputValue, option, filterFn);
            }
            return !filterFn();
          });
          if (notFindInputItem) {
            const p = {
              attrs: UNSELECTABLE_ATTRIBUTE,
              key: inputValue,
              props: {
                value: inputValue,
                role: 'option',
              },
              style: UNSELECTABLE_STYLE,
            };
            options.unshift(<MenuItem {...p}>{inputValue}</MenuItem>);
          }
        }
      }

      if (!options.length && notFoundContent) {
        empty = true;
        const p = {
          attrs: UNSELECTABLE_ATTRIBUTE,
          key: 'NOT_FOUND',
          props: {
            value: 'NOT_FOUND',
            disabled: true,
            role: 'option',
          },
          style: UNSELECTABLE_STYLE,
        };
        options = [<MenuItem {...p}>{notFoundContent}</MenuItem>];
      }
      return { empty, options };
    },

    renderFilterOptionsFromChildren(children = [], childrenKeys, menuItems) {
      const sel = [];
      const props = this.$props;
      const { _inputValue: inputValue } = this.$data;
      const tags = props.tags;
      children.forEach(child => {
        if (!child.data || child.data.slot !== undefined) {
          return;
        }
        if (getSlotOptions(child).isSelectOptGroup) {
          let label = getComponentFromProp(child, 'label');
          let key = child.key;
          if (!key && typeof label === 'string') {
            key = label;
          } else if (!label && key) {
            label = key;
          }
          let childChildren = getSlots(child).default;
          childChildren = typeof childChildren === 'function' ? childChildren() : childChildren;
          // Match option group label
          if (inputValue && this._filterOption(inputValue, child)) {
            const innerItems = childChildren.map(subChild => {
              const childValueSub = getValuePropValue(subChild) || subChild.key;
              return (
                <MenuItem key={childValueSub} value={childValueSub} {...subChild.data}>
                  {subChild.componentOptions.children}
                </MenuItem>
              );
            });

            sel.push(
              <MenuItemGroup key={key} title={label} class={getClass(child)}>
                {innerItems}
              </MenuItemGroup>,
            );

            // Not match
          } else {
            const innerItems = this.renderFilterOptionsFromChildren(
              childChildren,
              childrenKeys,
              menuItems,
            );
            if (innerItems.length) {
              sel.push(
                <MenuItemGroup key={key} title={label} {...child.data}>
                  {innerItems}
                </MenuItemGroup>,
              );
            }
          }

          return;
        }
        warning(
          getSlotOptions(child).isSelectOption,
          'the children of `Select` should be `Select.Option` or `Select.OptGroup`, ' +
            `instead of \`${getSlotOptions(child).name || getSlotOptions(child)}\`.`,
        );

        const childValue = getValuePropValue(child);

        validateOptionValue(childValue, this.$props);
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
          };
          const menuItem = <MenuItem {...p}>{child.componentOptions.children}</MenuItem>;
          sel.push(menuItem);
          menuItems.push(menuItem);
        }
        if (tags) {
          childrenKeys.push(childValue);
        }
      });

      return sel;
    },

    renderTopControlNode() {
      const { $props: props } = this;
      const { _value: value, _inputValue: inputValue, _open: open } = this.$data;
      const {
        choiceTransitionName,
        prefixCls,
        maxTagTextLength,
        maxTagCount,
        maxTagPlaceholder,
        showSearch,
      } = props;
      const removeIcon = getComponentFromProp(this, 'removeIcon');
      const className = `${prefixCls}-selection__rendered`;
      // search input is inside topControlNode in single, multiple & combobox. 2016/04/13
      let innerNode = null;
      if (isSingleMode(props)) {
        let selectedValue = null;
        if (value.length) {
          let showSelectedValue = false;
          let opacity = 1;
          if (!showSearch) {
            showSelectedValue = true;
          } else if (open) {
            showSelectedValue = !inputValue;
            if (showSelectedValue) {
              opacity = 0.4;
            }
          } else {
            showSelectedValue = true;
          }
          const singleValue = value[0];
          const { label, title } = this.getOptionInfoBySingleValue(singleValue);
          selectedValue = (
            <div
              key="value"
              class={`${prefixCls}-selection-selected-value`}
              title={toTitle(title || label)}
              style={{
                display: showSelectedValue ? 'block' : 'none',
                opacity,
              }}
            >
              {label}
            </div>
          );
        }
        if (!showSearch) {
          innerNode = [selectedValue];
        } else {
          innerNode = [
            selectedValue,
            <div
              class={`${prefixCls}-search ${prefixCls}-search--inline`}
              key="input"
              style={{
                display: open ? 'block' : 'none',
              }}
            >
              {this._getInputElement()}
            </div>,
          ];
        }
      } else {
        let selectedValueNodes = [];
        let limitedCountValue = value;
        let maxTagPlaceholderEl;
        if (maxTagCount !== undefined && value.length > maxTagCount) {
          limitedCountValue = limitedCountValue.slice(0, maxTagCount);
          const omittedValues = this.getVLForOnChange(value.slice(maxTagCount, value.length));
          let content = `+ ${value.length - maxTagCount} ...`;
          if (maxTagPlaceholder) {
            content =
              typeof maxTagPlaceholder === 'function'
                ? maxTagPlaceholder(omittedValues)
                : maxTagPlaceholder;
          }
          const attrs = {
            ...UNSELECTABLE_ATTRIBUTE,
            role: 'presentation',
            title: toTitle(content),
          };
          maxTagPlaceholderEl = (
            <li
              style={UNSELECTABLE_STYLE}
              {...{ attrs }}
              onMousedown={preventDefaultEvent}
              class={`${prefixCls}-selection__choice ${prefixCls}-selection__choice__disabled`}
              key="maxTagPlaceholder"
            >
              <div class={`${prefixCls}-selection__choice__content`}>{content}</div>
            </li>
          );
        }
        if (isMultipleOrTags(props)) {
          selectedValueNodes = limitedCountValue.map(singleValue => {
            const info = this.getOptionInfoBySingleValue(singleValue);
            let content = info.label;
            const title = info.title || content;
            if (
              maxTagTextLength &&
              typeof content === 'string' &&
              content.length > maxTagTextLength
            ) {
              content = `${content.slice(0, maxTagTextLength)}...`;
            }
            const disabled = this.isChildDisabled(singleValue);
            const choiceClassName = disabled
              ? `${prefixCls}-selection__choice ${prefixCls}-selection__choice__disabled`
              : `${prefixCls}-selection__choice`;
            // attrs 放在一起，避免动态title混乱问题，很奇怪的问题 https://github.com/vueComponent/ant-design-vue/issues/588
            const attrs = {
              ...UNSELECTABLE_ATTRIBUTE,
              role: 'presentation',
              title: toTitle(title),
            };
            return (
              <li
                style={UNSELECTABLE_STYLE}
                {...{ attrs }}
                onMousedown={preventDefaultEvent}
                class={choiceClassName}
                key={singleValue || SELECT_EMPTY_VALUE_KEY}
              >
                <div class={`${prefixCls}-selection__choice__content`}>{content}</div>
                {disabled ? null : (
                  <span
                    onClick={event => {
                      this.removeSelected(singleValue, event);
                    }}
                    class={`${prefixCls}-selection__choice__remove`}
                  >
                    {removeIcon || <i class={`${prefixCls}-selection__choice__remove-icon`}>×</i>}
                  </span>
                )}
              </li>
            );
          });
        }
        if (maxTagPlaceholderEl) {
          selectedValueNodes.push(maxTagPlaceholderEl);
        }
        selectedValueNodes.push(
          <li class={`${prefixCls}-search ${prefixCls}-search--inline`} key="__input">
            {this._getInputElement()}
          </li>,
        );

        if (isMultipleOrTags(props) && choiceTransitionName) {
          const transitionProps = getTransitionProps(choiceTransitionName, {
            tag: 'ul',
            afterLeave: this.onChoiceAnimationLeave,
          });
          innerNode = (
            <transition-group {...transitionProps}>{selectedValueNodes}</transition-group>
          );
        } else {
          innerNode = <ul>{selectedValueNodes}</ul>;
        }
      }
      return (
        <div
          class={className}
          {...{
            directives: [
              {
                name: 'ant-ref',
                value: this.saveTopCtrlRef,
              },
            ],
          }}
          onClick={this.topCtrlContainerClick}
        >
          {this.getPlaceholderElement()}
          {innerNode}
        </div>
      );
    },
    renderArrow(multiple) {
      // showArrow : Set to true if not multiple by default but keep set value.
      const { showArrow = !multiple, loading, prefixCls } = this.$props;
      const inputIcon = getComponentFromProp(this, 'inputIcon');
      if (!showArrow && !loading) {
        return null;
      }
      // if loading  have loading icon
      const defaultIcon = loading ? (
        <i class={`${prefixCls}-arrow-loading`} />
      ) : (
        <i class={`${prefixCls}-arrow-icon`} />
      );
      return (
        <span
          key="arrow"
          class={`${prefixCls}-arrow`}
          style={UNSELECTABLE_STYLE}
          {...{ attrs: UNSELECTABLE_ATTRIBUTE }}
          onClick={this.onArrowClick}
          ref="arrow"
        >
          {inputIcon || defaultIcon}
        </span>
      );
    },
    topCtrlContainerClick(e) {
      if (this.$data._open && !isSingleMode(this.$props)) {
        e.stopPropagation();
      }
    },
    renderClear() {
      const { prefixCls, allowClear } = this.$props;
      const { _value: value, _inputValue: inputValue } = this.$data;
      const clearIcon = getComponentFromProp(this, 'clearIcon');
      const clear = (
        <span
          key="clear"
          class={`${prefixCls}-selection__clear`}
          onMousedown={preventDefaultEvent}
          style={UNSELECTABLE_STYLE}
          {...{ attrs: UNSELECTABLE_ATTRIBUTE }}
          onClick={this.onClearSelection}
        >
          {clearIcon || <i class={`${prefixCls}-selection__clear-icon`}>×</i>}
        </span>
      );
      if (!allowClear) {
        return null;
      }
      if (isCombobox(this.$props)) {
        if (inputValue) {
          return clear;
        }
        return null;
      }
      if (inputValue || value.length) {
        return clear;
      }
      return null;
    },

    selectionRefClick(e) {
      //e.stopPropagation();
      if (!this.disabled) {
        const input = this.getInputDOMNode();
        if (this._focused && this.$data._open) {
          // this._focused = false;
          this.setOpenState(false, false);
          input && input.blur();
        } else {
          this.clearBlurTime();
          //this._focused = true;
          this.setOpenState(true, true);
          input && input.focus();
        }
      }
    },
    selectionRefFocus(e) {
      if (this._focused || this.disabled || isMultipleOrTagsOrCombobox(this.$props)) {
        e.preventDefault();
        return;
      }
      this._focused = true;
      this.updateFocusClassName();
      this.$emit('focus');
    },
    selectionRefBlur(e) {
      if (isMultipleOrTagsOrCombobox(this.$props)) {
        e.preventDefault();
        return;
      }
      this.inputBlur(e);
    },
  },

  render() {
    const props = this.$props;
    const multiple = isMultipleOrTags(props);
    // Default set showArrow to true if not set (not set directly in defaultProps to handle multiple case)
    const { showArrow = true } = props;
    const state = this.$data;
    const { disabled, prefixCls, loading } = props;
    const ctrlNode = this.renderTopControlNode();
    const { _open: open, _inputValue: inputValue, _value: value } = this.$data;
    if (open) {
      const filterOptions = this.renderFilterOptions();
      this._empty = filterOptions.empty;
      this._options = filterOptions.options;
    }
    const realOpen = this.getRealOpenState();
    const empty = this._empty;
    const options = this._options || [];
    const { $listeners } = this;
    const { mouseenter = noop, mouseleave = noop, popupScroll = noop } = $listeners;
    const selectionProps = {
      props: {},
      attrs: {
        role: 'combobox',
        'aria-autocomplete': 'list',
        'aria-haspopup': 'true',
        'aria-expanded': realOpen,
        'aria-controls': this.$data._ariaId,
      },
      on: {
        // click: this.selectionRefClick,
      },
      class: `${prefixCls}-selection ${prefixCls}-selection--${multiple ? 'multiple' : 'single'}`,
      // directives: [
      //   {
      //     name: 'ant-ref',
      //     value: this.saveSelectionRef,
      //   },
      // ],
      key: 'selection',
    };
    //if (!isMultipleOrTagsOrCombobox(props)) {
    // selectionProps.on.keydown = this.onKeyDown;
    // selectionProps.on.focus = this.selectionRefFocus;
    // selectionProps.on.blur = this.selectionRefBlur;
    // selectionProps.attrs.tabIndex = props.disabled ? -1 : props.tabIndex;
    //}
    const rootCls = {
      [prefixCls]: true,
      [`${prefixCls}-open`]: open,
      [`${prefixCls}-focused`]: open || !!this._focused,
      [`${prefixCls}-combobox`]: isCombobox(props),
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-enabled`]: !disabled,
      [`${prefixCls}-allow-clear`]: !!props.allowClear,
      [`${prefixCls}-no-arrow`]: !showArrow,
      [`${prefixCls}-loading`]: !!loading,
    };
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
        empty={empty}
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
        menuItemSelectedIcon={getComponentFromProp(this, 'menuItemSelectedIcon')}
        {...{
          directives: [
            {
              name: 'ant-ref',
              value: this.saveSelectTriggerRef,
            },
          ],
        }}
        dropdownRender={props.dropdownRender}
        ariaId={this.$data._ariaId}
      >
        <div
          {...{
            directives: [
              {
                name: 'ant-ref',
                value: chaining(this.saveRootRef, this.saveSelectionRef),
              },
            ],
          }}
          style={getStyle(this)}
          class={classnames(rootCls)}
          onMousedown={this.markMouseDown}
          onMouseup={this.markMouseLeave}
          onMouseout={this.markMouseLeave}
          tabIndex={props.disabled ? -1 : props.tabIndex}
          onBlur={this.selectionRefBlur}
          onFocus={this.selectionRefFocus}
          onClick={this.selectionRefClick}
          onKeydown={isMultipleOrTagsOrCombobox(props) ? noop : this.onKeyDown}
        >
          <div {...selectionProps}>
            {ctrlNode}
            {this.renderClear()}
            {this.renderArrow(!!multiple)}
          </div>
        </div>
      </SelectTrigger>
    );
  },
};
export { Select };
export default proxyComponent(Select);
