import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../../_util/vue-types';
import KeyCode from '../../_util/KeyCode';
import classnames from 'classnames';
import pick from 'lodash/pick';
import omit from 'omit.js';
import { getPropValue, getValuePropValue, isMultiple, toArray, UNSELECTABLE_ATTRIBUTE, UNSELECTABLE_STYLE, preventDefaultEvent, getTreeNodesStates, flatToHierarchy, filterParentPosition, isPositionPrefix, labelCompatible, loopAllChildren, filterAllCheckedData, processSimpleTreeData, toTitle } from './util';
import SelectTrigger from './SelectTrigger';
import _TreeNode from './TreeNode';
import { SHOW_ALL, SHOW_PARENT, SHOW_CHILD } from './strategies';
import { SelectPropTypes } from './PropTypes';
import { initDefaultProps, getOptionProps, hasProp, getAllProps, getComponentFromProp } from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';
import getTransitionProps from '../../_util/getTransitionProps';

function noop() {}

function filterFn(input, child) {
  return String(getPropValue(child, labelCompatible(this.$props.treeNodeFilterProp))).indexOf(input) > -1;
}

var defaultProps = {
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
  dropdownVisibleChange: function dropdownVisibleChange() {
    return true;
  },
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
  treeNodeLabelProp: 'title'
};

var Select = {
  mixins: [BaseMixin],
  name: 'VCTreeSelect',
  props: initDefaultProps(_extends({}, SelectPropTypes, { __propsSymbol__: PropTypes.any }), defaultProps),
  data: function data() {
    var value = [];
    var props = getOptionProps(this);
    this.preProps = _extends({}, props);
    if ('value' in props) {
      value = toArray(props.value);
    } else {
      value = toArray(props.defaultValue);
    }
    // save parsed treeData, for performance (treeData may be very big)
    this.renderedTreeData = this.renderTreeData();
    value = this.addLabelToValue(props, value);
    value = this.getValue(props, value, props.inputValue ? '__strict' : true);
    var inputValue = props.inputValue || '';
    // if (props.combobox) {
    //   inputValue = value.length ? String(value[0].value) : '';
    // }
    return {
      sValue: value,
      sInputValue: inputValue,
      sOpen: props.open || props.defaultOpen,
      sFocused: false
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      var autoFocus = _this.autoFocus,
          disabled = _this.disabled;

      if (isMultiple(_this.$props)) {
        var inputNode = _this.getInputDOMNode();
        if (inputNode.value) {
          inputNode.style.width = '';
          inputNode.style.width = (_this.$refs.inputMirrorInstance.clientWidth || _this.$refs.inputMirrorInstance.offsetWidth) + 'px';
        } else {
          inputNode.style.width = '';
        }
      }
      if (autoFocus && !disabled) {
        _this.focus();
      }
    });
  },

  watch: {
    // for performance (use __propsSymbol__ avoid deep watch)
    __propsSymbol__: function __propsSymbol__() {
      var nextProps = getOptionProps(this);
      // save parsed treeData, for performance (treeData may be very big)
      this.renderedTreeData = this.renderTreeData(nextProps);
      // Detecting whether the object of `onChange`'s argument  is old ref.
      // Better to do a deep equal later.
      this._cacheTreeNodesStates = this._cacheTreeNodesStates !== 'no' && this._savedValue && nextProps.value === this._savedValue;
      if (this.preProps.treeData !== nextProps.treeData || this.preProps.children !== nextProps.children) {
        // refresh this._treeNodesStates cache
        this._treeNodesStates = getTreeNodesStates(this.renderedTreeData || nextProps.children, this.sValue.map(function (item) {
          return item.value;
        }));
      }
      if ('value' in nextProps) {
        var value = toArray(nextProps.value);
        value = this.addLabelToValue(nextProps, value);
        value = this.getValue(nextProps, value);
        this.setState({
          sValue: value
        }, this.forcePopupAlign);
        // if (nextProps.combobox) {
        //   this.setState({
        //     inputValue: value.length ? String(value[0].key) : '',
        //   });
        // }
      }
      if (nextProps.inputValue !== this.preProps.inputValue) {
        this.setState({
          sInputValue: nextProps.inputValue
        });
      }
      if ('open' in nextProps) {
        this.setState({
          sOpen: nextProps.open
        });
      }
      this.preProps = _extends({}, nextProps);
    }
  },

  beforeUpdate: function beforeUpdate() {
    if (this._savedValue && this.$props.value && this.$props.value !== this._savedValue && this.$props.value === this.preProps.value) {
      this._cacheTreeNodesStates = false;
      this.getValue(this.$props, this.addLabelToValue(this.$props, toArray(this.$props.value)));
    }
  },
  updated: function updated() {
    var _this2 = this;

    var state = this.$data;
    var props = this.$props;
    if (state.sOpen && isMultiple(props)) {
      this.$nextTick(function () {
        var inputNode = _this2.getInputDOMNode();
        if (inputNode.value) {
          inputNode.style.width = '';
          inputNode.style.width = _this2.$refs.inputMirrorInstance.clientWidth + 'px';
        } else {
          inputNode.style.width = '';
        }
      });
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.clearDelayTimer();
    if (this.dropdownContainer) {
      document.body.removeChild(this.dropdownContainer);
      this.dropdownContainer = null;
    }
  },

  methods: {
    loopTreeData: function loopTreeData(data) {
      var _this3 = this;

      var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var treeCheckable = arguments[2];
      var h = this.$createElement;

      return data.map(function (item, index) {
        var pos = level + '-' + index;

        var label = item.label,
            value = item.value,
            disabled = item.disabled,
            key = item.key,
            selectable = item.selectable,
            children = item.children,
            isLeaf = item.isLeaf,
            otherProps = _objectWithoutProperties(item, ['label', 'value', 'disabled', 'key', 'selectable', 'children', 'isLeaf']);

        var tnProps = _extends({}, pick(item, ['on', 'class', 'style']), {
          props: _extends({
            value: value,
            title: label,
            disabled: disabled || false,
            selectable: selectable === false ? selectable : !treeCheckable
          }, omit(otherProps, ['on', 'class', 'style'])),
          key: key || value || pos
        });
        var ret = void 0;
        if (children && children.length) {
          ret = h(
            _TreeNode,
            tnProps,
            [_this3.loopTreeData(children, pos, treeCheckable)]
          );
        } else {
          ret = h(_TreeNode, _mergeJSXProps([tnProps, {
            attrs: { isLeaf: isLeaf }
          }]));
        }
        return ret;
      });
    },
    onInputChange: function onInputChange(event) {
      var val = event.target.value;
      var props = this.$props;

      this.setState({
        sInputValue: val,
        sOpen: true
      }, this.forcePopupAlign);
      if (props.treeCheckable && !val) {
        this.setState({
          sValue: this.getValue(props, [].concat(_toConsumableArray(this.sValue)), false)
        });
      }
      this.__emit('search', val);
    },
    onDropdownVisibleChange: function onDropdownVisibleChange(open) {
      // selection inside combobox cause click
      if (!open && document.activeElement === this.getInputDOMNode()) {
        // return;
      }
      this.setOpenState(open, undefined, !open);
    },


    // combobox ignore
    onKeyDown: function onKeyDown(event) {
      var props = this.$props;
      if (props.disabled) {
        return;
      }
      var keyCode = event.keyCode;
      if (this.sOpen && !this.getInputDOMNode()) {
        this.onInputKeyDown(event);
      } else if (keyCode === KeyCode.ENTER || keyCode === KeyCode.DOWN) {
        this.setOpenState(true);
        event.preventDefault();
      }
    },
    onInputKeyDown: function onInputKeyDown(event) {
      var props = this.$props;
      if (props.disabled) {
        return;
      }
      var state = this.$data;
      var keyCode = event.keyCode;
      if (isMultiple(props) && !event.target.value && keyCode === KeyCode.BACKSPACE) {
        var value = state.sValue.concat();
        if (value.length) {
          var popValue = value.pop();
          this.removeSelected(this.isLabelInValue() ? popValue : popValue.value);
        }
        return;
      }
      if (keyCode === KeyCode.DOWN) {
        if (!state.sOpen) {
          this.openIfHasChildren();
          event.preventDefault();
          event.stopPropagation();
          return;
        }
      } else if (keyCode === KeyCode.ESC) {
        if (state.sOpen) {
          this.setOpenState(false);
          event.preventDefault();
          event.stopPropagation();
        }
        return;
      }
    },
    onSelect: function onSelect(selectedKeys, info) {
      var _this4 = this;

      var item = info.node;
      var value = this.sValue;
      var props = this.$props;
      var selectedValue = getValuePropValue(item);
      var selectedLabel = this.getLabelFromNode(item);
      var checkableSelect = props.treeCheckable && info.event === 'select';
      var event = selectedValue;
      if (this.isLabelInValue()) {
        event = {
          value: event,
          label: selectedLabel
        };
      }
      if (info.selected === false) {
        this.onDeselect(info);
        if (!checkableSelect) return;
      }
      this.__emit('select', event, item, info);

      var checkEvt = info.event === 'check';
      if (isMultiple(props)) {
        this.$nextTick(function () {
          // clearSearchInput will change sInputValue
          _this4.clearSearchInput();
        });
        if (checkEvt) {
          value = this.getCheckedNodes(info, props).map(function (n) {
            return {
              value: getValuePropValue(n),
              label: _this4.getLabelFromNode(n)
            };
          });
        } else {
          if (value.some(function (i) {
            return i.value === selectedValue;
          })) {
            return;
          }
          value = value.concat([{
            value: selectedValue,
            label: selectedLabel
          }]);
        }
      } else {
        if (value.length && value[0].value === selectedValue) {
          this.setOpenState(false);
          return;
        }
        value = [{
          value: selectedValue,
          label: selectedLabel
        }];
        this.setOpenState(false);
      }

      var extraInfo = {
        triggerValue: selectedValue,
        triggerNode: item
      };
      if (checkEvt) {
        extraInfo.checked = info.checked;
        // if inputValue existing, tree is checkStrictly
        extraInfo.allCheckedNodes = props.treeCheckStrictly || this.sInputValue ? info.checkedNodes : flatToHierarchy(info.checkedNodesPositions);
        this._checkedNodes = info.checkedNodesPositions;
        var _tree = this.getPopupComponentRefs();
        this._treeNodesStates = _tree.checkKeys;
      } else {
        extraInfo.selected = info.selected;
      }

      this.fireChange(value, extraInfo);
      if (props.inputValue === null) {
        this.setState({
          sInputValue: ''
        });
      }
    },
    onDeselect: function onDeselect(info) {
      this.removeSelected(getValuePropValue(info.node));
      if (!isMultiple(this.$props)) {
        this.setOpenState(false);
      } else {
        this.clearSearchInput();
      }
    },
    onPlaceholderClick: function onPlaceholderClick() {
      this.getInputDOMNode().focus();
    },
    onClearSelection: function onClearSelection(event) {
      var _this5 = this;

      var props = this.$props;
      var state = this.$data;
      if (props.disabled) {
        return;
      }
      event.stopPropagation();
      this._cacheTreeNodesStates = 'no';
      this._checkedNodes = [];
      if (state.sInputValue || state.sValue.length) {
        this.setOpenState(false);
        if (typeof props.inputValue === 'undefined') {
          this.setState({
            sInputValue: ''
          }, function () {
            _this5.fireChange([]);
          });
        } else {
          this.fireChange([]);
        }
      }
    },
    onChoiceAnimationLeave: function onChoiceAnimationLeave() {
      this.forcePopupAlign();
    },
    getLabelFromNode: function getLabelFromNode(child) {
      return getPropValue(child, this.$props.treeNodeLabelProp);
    },
    getLabelFromProps: function getLabelFromProps(props, value) {
      var _this6 = this;

      if (value === undefined) {
        return null;
      }
      var label = null;
      loopAllChildren(this.renderedTreeData || props.children, function (item) {
        if (getValuePropValue(item) === value) {
          label = _this6.getLabelFromNode(item);
        }
      });
      if (label === null) {
        return value;
      }
      return label;
    },
    getDropdownContainer: function getDropdownContainer() {
      if (!this.dropdownContainer) {
        this.dropdownContainer = document.createElement('div');
        document.body.appendChild(this.dropdownContainer);
      }
      return this.dropdownContainer;
    },
    getSearchPlaceholderElement: function getSearchPlaceholderElement(hidden) {
      var h = this.$createElement;

      var props = this.$props;
      var placeholder = void 0;
      if (isMultiple(props)) {
        placeholder = getComponentFromProp(this, 'placeholder') || getComponentFromProp(this, 'searchPlaceholder');
      } else {
        placeholder = getComponentFromProp(this, 'placeholder');
      }
      if (placeholder) {
        return h(
          'span',
          {
            style: { display: hidden ? 'none' : 'block' },
            on: {
              'click': this.onPlaceholderClick
            },

            'class': props.prefixCls + '-search__field__placeholder'
          },
          [placeholder]
        );
      }
      return null;
    },
    getInputElement: function getInputElement() {
      var h = this.$createElement;
      var sInputValue = this.$data.sInputValue;
      var _$props = this.$props,
          prefixCls = _$props.prefixCls,
          disabled = _$props.disabled;

      var multiple = isMultiple(this.$props);
      var inputListeners = {
        input: this.onInputChange,
        keydown: this.onInputKeyDown
      };
      if (multiple) {
        inputListeners.blur = this.onBlur;
        inputListeners.focus = this.onFocus;
      }
      return h(
        'span',
        { 'class': prefixCls + '-search__field__wrap' },
        [h('input', _mergeJSXProps([{
          ref: 'inputInstance'
        }, { on: inputListeners }, {
          domProps: {
            'value': sInputValue
          },
          attrs: {
            disabled: disabled,

            role: 'textbox'
          },
          'class': prefixCls + '-search__field' }])), h(
          'span',
          {
            ref: 'inputMirrorInstance',
            'class': prefixCls + '-search__field__mirror'
          },
          [sInputValue, '\xA0']
        ), isMultiple(this.$props) ? null : this.getSearchPlaceholderElement(!!sInputValue)]
      );
    },
    getInputDOMNode: function getInputDOMNode() {
      return this.$refs.inputInstance;
    },
    getPopupDOMNode: function getPopupDOMNode() {
      return this.$refs.trigger.getPopupDOMNode();
    },
    getPopupComponentRefs: function getPopupComponentRefs() {
      return this.$refs.trigger.getPopupEleRefs();
    },
    getValue: function getValue(_props, val) {
      var _this7 = this;

      var init = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      var value = val;
      // if inputValue existing, tree is checkStrictly
      var _strict = init === '__strict' || init && (this.sInputValue || this.inputValue !== _props.inputValue);
      if (_props.treeCheckable && (_props.treeCheckStrictly || _strict)) {
        this.halfCheckedValues = [];
        value = [];
        val.forEach(function (i) {
          if (!i.halfChecked) {
            value.push(i);
          } else {
            _this7.halfCheckedValues.push(i);
          }
        });
      }
      // if (!(_props.treeCheckable && !_props.treeCheckStrictly)) {
      if (!_props.treeCheckable || _props.treeCheckable && (_props.treeCheckStrictly || _strict)) {
        return value;
      }
      var checkedTreeNodes = void 0;
      if (this._cachetreeData && this._cacheTreeNodesStates && this._checkedNodes && !this.sInputValue) {
        this.checkedTreeNodes = checkedTreeNodes = this._checkedNodes;
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
        this._treeNodesStates = getTreeNodesStates(this.renderedTreeData || _props.children, value.map(function (item) {
          return item.value;
        }));
        this.checkedTreeNodes = checkedTreeNodes = this._treeNodesStates.checkedNodes;
      }
      var mapLabVal = function mapLabVal(arr) {
        return arr.map(function (itemObj) {
          return {
            value: getValuePropValue(itemObj.node),
            label: getPropValue(itemObj.node, _props.treeNodeLabelProp)
          };
        });
      };
      var props = this.$props;
      var checkedValues = [];
      if (props.showCheckedStrategy === SHOW_ALL) {
        checkedValues = mapLabVal(checkedTreeNodes);
      } else if (props.showCheckedStrategy === SHOW_PARENT) {
        var posArr = filterParentPosition(checkedTreeNodes.map(function (itemObj) {
          return itemObj.pos;
        }));
        checkedValues = mapLabVal(checkedTreeNodes.filter(function (itemObj) {
          return posArr.indexOf(itemObj.pos) !== -1;
        }));
      } else {
        checkedValues = mapLabVal(checkedTreeNodes.filter(function (itemObj) {
          return !itemObj.node.componentOptions.children;
        }));
      }
      return checkedValues;
    },
    getCheckedNodes: function getCheckedNodes(info, props) {
      // TODO treeCheckable does not support tags/dynamic
      var checkedNodes = info.checkedNodes;
      // if inputValue existing, tree is checkStrictly

      if (props.treeCheckStrictly || this.sInputValue) {
        return checkedNodes;
      }
      var checkedNodesPositions = info.checkedNodesPositions;
      if (props.showCheckedStrategy === SHOW_ALL) {
        // checkedNodes = checkedNodes
      } else if (props.showCheckedStrategy === SHOW_PARENT) {
        var posArr = filterParentPosition(checkedNodesPositions.map(function (itemObj) {
          return itemObj.pos;
        }));
        checkedNodes = checkedNodesPositions.filter(function (itemObj) {
          return posArr.indexOf(itemObj.pos) !== -1;
        }).map(function (itemObj) {
          return itemObj.node;
        });
      } else {
        checkedNodes = checkedNodes.filter(function (n) {
          return !n.componentOptions.children;
        });
      }
      return checkedNodes;
    },
    getDeselectedValue: function getDeselectedValue(selectedValue) {
      var checkedTreeNodes = this.checkedTreeNodes;
      var unCheckPos = void 0;
      checkedTreeNodes.forEach(function (itemObj) {
        var nodeProps = getAllProps(itemObj.node);
        if (nodeProps.value === selectedValue) {
          unCheckPos = itemObj.pos;
        }
      });
      var newVals = [];
      var newCkTns = [];
      checkedTreeNodes.forEach(function (itemObj) {
        if (isPositionPrefix(itemObj.pos, unCheckPos) || isPositionPrefix(unCheckPos, itemObj.pos)) {
          // Filter ancestral and children nodes when uncheck a node.
          return;
        }
        var nodeProps = getAllProps(itemObj.node);
        newCkTns.push(itemObj);
        newVals.push(nodeProps.value);
      });
      this.checkedTreeNodes = this._checkedNodes = newCkTns;
      var nv = this.sValue.filter(function (val) {
        return newVals.indexOf(val.value) !== -1;
      });
      this.fireChange(nv, { triggerValue: selectedValue, clear: true });
    },
    setOpenState: function setOpenState(open, needFocus) {
      var _this8 = this;

      var documentClickClose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      this.clearDelayTimer();
      var props = this.$props;
      // can not optimize, if children is empty
      // if (this.sOpen === open) {
      //   return;
      // }

      if (!this.$props.dropdownVisibleChange(open, { documentClickClose: documentClickClose })) {
        return;
      }
      this.setState({
        sOpen: open
      }, function () {
        if (needFocus || open) {
          // Input dom init after first time component render
          // Add delay for this to get focus
          setTimeout(function () {
            if (open || isMultiple(props)) {
              var input = _this8.getInputDOMNode();
              if (input && document.activeElement !== input) {
                input.focus();
              }
            } else if (_this8.$refs.selection) {
              _this8.$refs.selection.focus();
            }
          }, 0);
        }
      });
    },
    clearSearchInput: function clearSearchInput() {
      this.getInputDOMNode().focus();
      if (!hasProp(this, 'inputValue')) {
        this.setState({ sInputValue: '' });
      }
    },
    addLabelToValue: function addLabelToValue(props, value_) {
      var _this9 = this;

      var value = value_;
      if (this.isLabelInValue()) {
        value.forEach(function (v, i) {
          if (Object.prototype.toString.call(value[i]) !== '[object Object]') {
            value[i] = {
              value: '',
              label: ''
            };
            return;
          }
          v.label = v.label || _this9.getLabelFromProps(props, v.value);
        });
      } else {
        value = value.map(function (v) {
          return {
            value: v,
            label: _this9.getLabelFromProps(props, v)
          };
        });
      }
      return value;
    },
    clearDelayTimer: function clearDelayTimer() {
      if (this.delayTimer) {
        clearTimeout(this.delayTimer);
        this.delayTimer = null;
      }
    },
    removeSelected: function removeSelected(selectedVal, e) {
      var props = this.$props;
      if (props.disabled) {
        return;
      }

      // Do not trigger Trigger popup
      if (e && e.stopPropagation) {
        e.stopPropagation();
      }

      this._cacheTreeNodesStates = 'no';
      if (props.treeCheckable && (props.showCheckedStrategy === SHOW_ALL || props.showCheckedStrategy === SHOW_PARENT) && !(props.treeCheckStrictly || this.sInputValue)) {
        this.getDeselectedValue(selectedVal);
        return;
      }
      // click the node's `x`(in select box), likely trigger the TreeNode's `unCheck` event,
      // cautiously, they are completely different, think about it, the tree may not render at first,
      // but the nodes in select box are ready.
      var label = void 0;
      var value = this.sValue.filter(function (singleValue) {
        if (singleValue.value === selectedVal) {
          label = singleValue.label;
        }
        return singleValue.value !== selectedVal;
      });
      var canMultiple = isMultiple(props);

      if (canMultiple) {
        var event = selectedVal;
        if (this.isLabelInValue()) {
          event = {
            value: selectedVal,
            label: label
          };
        }
        this.__emit('deselect', event);
      }
      if (props.treeCheckable) {
        if (this.checkedTreeNodes && this.checkedTreeNodes.length) {
          this.checkedTreeNodes = this._checkedNodes = this.checkedTreeNodes.filter(function (item) {
            var nodeProps = getAllProps(item.node);
            return value.some(function (i) {
              return i.value === nodeProps.value;
            });
          });
        }
      }

      this.fireChange(value, { triggerValue: selectedVal, clear: true });
    },
    openIfHasChildren: function openIfHasChildren() {
      var props = this.$props;
      if (props.children.length || props.treeData && props.treeData.length || !isMultiple(props)) {
        this.setOpenState(true);
      }
    },
    fireChange: function fireChange(value) {
      var _this10 = this;

      var extraInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var props = getOptionProps(this);
      var vals = value.map(function (i) {
        return i.value;
      });
      var sv = this.sValue.map(function (i) {
        return i.value;
      });
      if (vals.length !== sv.length || !vals.every(function (val, index) {
        return sv[index] === val;
      })) {
        var ex = _extends({
          preValue: [].concat(_toConsumableArray(this.sValue))
        }, extraInfo);
        var labs = null;
        var vls = value;
        if (!this.isLabelInValue()) {
          labs = value.map(function (i) {
            return i.label;
          });
          vls = vls.map(function (v) {
            return v.value;
          });
        } else if (this.halfCheckedValues && this.halfCheckedValues.length) {
          this.halfCheckedValues.forEach(function (i) {
            if (!vls.some(function (v) {
              return v.value === i.value;
            })) {
              vls.push(i);
            }
          });
        }
        if (props.treeCheckable && ex.clear) {
          var treeData = this.renderedTreeData || props.children;
          ex.allCheckedNodes = flatToHierarchy(filterAllCheckedData(vals, treeData));
        }
        if (props.treeCheckable && this.sInputValue) {
          var _vls = [].concat(_toConsumableArray(this.sValue));
          if (ex.checked) {
            value.forEach(function (i) {
              if (_vls.every(function (ii) {
                return ii.value !== i.value;
              })) {
                _vls.push(_extends({}, i));
              }
            });
          } else {
            var index = void 0;
            var includeVal = _vls.some(function (i, ind) {
              if (i.value === ex.triggerValue) {
                index = ind;
                return true;
              }
            });
            if (includeVal) {
              _vls.splice(index, 1);
            }
          }
          vls = _vls;
          if (!this.isLabelInValue()) {
            labs = _vls.map(function (v) {
              return v.label;
            });
            vls = _vls.map(function (v) {
              return v.value;
            });
          }
        }
        this._savedValue = isMultiple(props) ? vls : vls[0];
        this.__emit('change', this._savedValue, labs, ex);
        if (!('value' in props)) {
          this._cacheTreeNodesStates = false;
          this.setState({
            sValue: this.getValue(props, toArray(this._savedValue).map(function (v, i) {
              return _this10.isLabelInValue() ? v : {
                value: v,
                label: labs && labs[i]
              };
            }))
          }, this.forcePopupAlign);
        }
      }
    },
    isLabelInValue: function isLabelInValue() {
      var _$props2 = this.$props,
          treeCheckable = _$props2.treeCheckable,
          treeCheckStrictly = _$props2.treeCheckStrictly,
          labelInValue = _$props2.labelInValue;

      if (treeCheckable && treeCheckStrictly) {
        return true;
      }
      return labelInValue || false;
    },
    onFocus: function onFocus(e) {
      this.__emit('focus', e);
    },
    onBlur: function onBlur(e) {
      this.__emit('blur', e);
    },
    focus: function focus() {
      if (!isMultiple(this.$props)) {
        this.$refs.selection.focus();
      } else {
        this.getInputDOMNode().focus();
      }
    },
    blur: function blur() {
      if (!isMultiple(this.$props)) {
        this.$refs.selection.blur();
      } else {
        this.getInputDOMNode().blur();
      }
    },
    forcePopupAlign: function forcePopupAlign() {
      this.$refs.trigger.$refs.trigger.forcePopupAlign();
    },
    renderTopControlNode: function renderTopControlNode() {
      var _this11 = this;

      var h = this.$createElement;
      var value = this.$data.sValue;

      var props = this.$props;
      var choiceTransitionName = props.choiceTransitionName,
          prefixCls = props.prefixCls,
          maxTagTextLength = props.maxTagTextLength;

      var multiple = isMultiple(props);

      // single and not combobox, input is inside dropdown
      if (!multiple) {
        var innerNode = h(
          'span',
          {
            key: 'placeholder',
            'class': prefixCls + '-selection__placeholder'
          },
          [getComponentFromProp(this, 'placeholder') || '']
        );
        if (value.length) {
          innerNode = h(
            'span',
            {
              key: 'value',
              attrs: { title: toTitle(value[0].label)
              },
              'class': prefixCls + '-selection-selected-value'
            },
            [value[0].label]
          );
        }
        return h(
          'span',
          { 'class': prefixCls + '-selection__rendered' },
          [innerNode]
        );
      }

      var selectedValueNodes = value.map(function (singleValue) {
        var content = singleValue.label;
        var title = content;
        if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
          content = content.slice(0, maxTagTextLength) + '...';
        }
        return h(
          'li',
          _mergeJSXProps([{
            style: UNSELECTABLE_STYLE,
            on: {
              'mousedown': preventDefaultEvent
            },

            'class': prefixCls + '-selection__choice',
            key: singleValue.value,
            attrs: { title: toTitle(title)
            }
          }, { attrs: UNSELECTABLE_ATTRIBUTE }]),
          [h('span', {
            'class': prefixCls + '-selection__choice__remove',
            on: {
              'click': function click(event) {
                _this11.removeSelected(singleValue.value, event);
              }
            }
          }), h(
            'span',
            { 'class': prefixCls + '-selection__choice__content' },
            [content]
          )]
        );
      });

      selectedValueNodes.push(h(
        'li',
        {
          'class': prefixCls + '-search ' + prefixCls + '-search--inline',
          key: '__input'
        },
        [this.getInputElement()]
      ));
      var className = prefixCls + '-selection__rendered';
      if (choiceTransitionName) {
        var transitionProps = getTransitionProps(choiceTransitionName, {
          tag: 'ul',
          afterLeave: this.onChoiceAnimationLeave
        });
        return h(
          'transition-group',
          _mergeJSXProps([{
            'class': className
          }, transitionProps]),
          [selectedValueNodes]
        );
      }
      return h(
        'ul',
        { 'class': className },
        [selectedValueNodes]
      );
    },
    renderTreeData: function renderTreeData(props) {
      var validProps = props || this.$props;
      if (validProps.treeData) {
        if (props && props.treeData === this.preProps.treeData && this.renderedTreeData) {
          // cache and use pre data.
          this._cachetreeData = true;
          return this.renderedTreeData;
        }
        this._cachetreeData = false;
        var treeData = [].concat(_toConsumableArray(validProps.treeData));
        // process treeDataSimpleMode
        if (validProps.treeDataSimpleMode) {
          var simpleFormat = {
            id: 'id',
            pId: 'pId',
            rootPId: null
          };
          if (Object.prototype.toString.call(validProps.treeDataSimpleMode) === '[object Object]') {
            simpleFormat = _extends({}, simpleFormat, validProps.treeDataSimpleMode);
          }
          treeData = processSimpleTreeData(treeData, simpleFormat);
        }
        return this.loopTreeData(treeData, undefined, this.preProps.treeCheckable);
      }
    }
  },

  render: function render() {
    var _rootCls;

    var h = arguments[0];

    var props = this.$props;
    var multiple = isMultiple(props);
    var state = this.$data;
    var disabled = props.disabled,
        allowClear = props.allowClear,
        prefixCls = props.prefixCls;

    var ctrlNode = this.renderTopControlNode();
    var extraSelectionProps = {};
    if (!multiple) {
      extraSelectionProps = {
        on: {
          keydown: this.onKeyDown,
          blur: this.onBlur,
          focus: this.onFocus
        },
        attrs: {
          tabIndex: 0
        }
      };
    }
    var rootCls = (_rootCls = {}, _defineProperty(_rootCls, prefixCls, 1), _defineProperty(_rootCls, prefixCls + '-open', state.sOpen), _defineProperty(_rootCls, prefixCls + '-focused', state.sOpen || state.sFocused), _defineProperty(_rootCls, prefixCls + '-disabled', disabled), _defineProperty(_rootCls, prefixCls + '-enabled', !disabled), _defineProperty(_rootCls, prefixCls + '-allow-clear', !!props.allowClear), _rootCls);

    var clear = h('span', {
      key: 'clear',
      'class': prefixCls + '-selection__clear',
      on: {
        'click': this.onClearSelection
      }
    });
    var selectTriggerProps = {
      props: _extends({}, props, {
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
        filterTreeNode: this.filterTreeNode === undefined ? filterFn : this.filterTreeNode
      }),
      on: _extends({}, this.$listeners, {
        select: this.onSelect
      }),
      ref: 'trigger'
    };
    return h(
      SelectTrigger,
      selectTriggerProps,
      [h(
        'span',
        {
          on: {
            'click': props.onClick
          },

          'class': classnames(rootCls)
        },
        [h(
          'span',
          _mergeJSXProps([{
            ref: 'selection',
            key: 'selection',
            'class': prefixCls + '-selection\n            ' + prefixCls + '-selection--' + (multiple ? 'multiple' : 'single'),
            attrs: { role: 'combobox',
              'aria-autocomplete': 'list',
              'aria-haspopup': 'true',
              'aria-expanded': state.sOpen
            }
          }, extraSelectionProps]),
          [ctrlNode, allowClear && state.sValue.length && state.sValue[0].value ? clear : null, multiple || !props.showArrow ? null : h(
            'span',
            {
              key: 'arrow',
              'class': prefixCls + '-arrow',
              style: { outline: 'none' }
            },
            [h('b')]
          ), multiple ? this.getSearchPlaceholderElement(!!state.sInputValue || state.sValue.length) : null]
        )]
      )]
    );
  }
};

Select.SHOW_ALL = SHOW_ALL;
Select.SHOW_PARENT = SHOW_PARENT;
Select.SHOW_CHILD = SHOW_CHILD;

export default Select;