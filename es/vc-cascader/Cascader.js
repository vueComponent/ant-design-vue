import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';

import PropTypes from '../_util/vue-types';
import Trigger from '../trigger';
import Menus from './Menus';
import KeyCode from '../_util/KeyCode';
import arrayTreeFilter from 'array-tree-filter';
import shallowEqualArrays from 'shallow-equal/arrays';
import { hasProp, getEvents } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import { cloneElement } from '../_util/vnode';

var BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  },
  bottomRight: {
    points: ['tr', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  },
  topRight: {
    points: ['br', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  }
};

export default {
  props: {
    value: PropTypes.array,
    defaultValue: PropTypes.array,
    options: PropTypes.array.def([]).isRequired,
    // onChange: PropTypes.func,
    // onPopupVisibleChange: PropTypes.func,
    popupVisible: PropTypes.bool,
    disabled: PropTypes.bool.def(false),
    transitionName: PropTypes.string.def(''),
    popupClassName: PropTypes.string.def(''),
    popupStyle: PropTypes.object.def({}),
    popupPlacement: PropTypes.string.def('bottomLeft'),
    prefixCls: PropTypes.string.def('rc-cascader'),
    dropdownMenuColumnStyle: PropTypes.object,
    builtinPlacements: PropTypes.object.def(BUILT_IN_PLACEMENTS),
    loadData: PropTypes.func,
    changeOnSelect: PropTypes.bool,
    // onKeyDown: PropTypes.func,
    expandTrigger: PropTypes.string.def('click')
  },
  mixins: [BaseMixin],
  model: {
    prop: 'value',
    event: 'change'
  },
  data: function data() {
    var initialValue = [];
    var value = this.value,
        defaultValue = this.defaultValue,
        popupVisible = this.popupVisible;

    if (hasProp(this, 'value')) {
      initialValue = value || [];
    } else if (hasProp(this, 'defaultValue')) {
      initialValue = defaultValue || [];
    }
    return {
      sPopupVisible: popupVisible,
      sActiveValue: initialValue,
      sValue: initialValue
    };
  },

  watch: {
    value: function value(val, oldValue) {
      if (!shallowEqualArrays(val, oldValue)) {
        var newValues = {
          value: oldValue || [],
          activeValue: oldValue || []
          // allow activeValue diff from value
          // https://github.com/ant-design/ant-design/issues/2767
        };if (hasProp(this, 'loadData')) {
          delete newValues.activeValue;
        }
        this.setState(newValues);
      }
    },
    popupVisible: function popupVisible(val) {
      this.setState({
        sPopupVisible: val
      });
    }
  },
  methods: {
    getPopupDOMNode: function getPopupDOMNode() {
      return this.$refs.trigger.getPopupDomNode();
    },
    getCurrentLevelOptions: function getCurrentLevelOptions() {
      var options = this.options,
          _sActiveValue = this.sActiveValue,
          sActiveValue = _sActiveValue === undefined ? [] : _sActiveValue;

      var result = arrayTreeFilter(options, function (o, level) {
        return o.value === sActiveValue[level];
      });
      if (result[result.length - 2]) {
        return result[result.length - 2].children;
      }
      return [].concat(_toConsumableArray(options)).filter(function (o) {
        return !o.disabled;
      });
    },
    getActiveOptions: function getActiveOptions(activeValue) {
      return arrayTreeFilter(this.options, function (o, level) {
        return o.value === activeValue[level];
      });
    },
    setPopupVisible: function setPopupVisible(popupVisible) {
      if (!hasProp(this, 'popupVisible')) {
        this.setState({ sPopupVisible: popupVisible });
      }
      // sync activeValue with value when panel open
      if (popupVisible && !this.sVisible) {
        this.setState({
          sActiveValue: this.sValue
        });
      }
      this.__emit('popupVisibleChange', popupVisible);
    },
    handleChange: function handleChange(options, setProps, e) {
      if (e.type !== 'keydown' || e.keyCode === KeyCode.ENTER) {
        this.__emit('change', options.map(function (o) {
          return o.value;
        }), options);
        this.setPopupVisible(setProps.visible);
      }
    },
    handlePopupVisibleChange: function handlePopupVisibleChange(popupVisible) {
      this.setPopupVisible(popupVisible);
    },
    handleMenuSelect: function handleMenuSelect(targetOption, menuIndex, e) {
      // Keep focused state for keyboard support
      var triggerNode = this.$refs.trigger.getRootDomNode();
      if (triggerNode && triggerNode.focus) {
        triggerNode.focus();
      }
      var changeOnSelect = this.changeOnSelect,
          loadData = this.loadData,
          expandTrigger = this.expandTrigger;

      if (!targetOption || targetOption.disabled) {
        return;
      }
      var sActiveValue = this.sActiveValue;

      sActiveValue = sActiveValue.slice(0, menuIndex + 1);
      sActiveValue[menuIndex] = targetOption.value;
      var activeOptions = this.getActiveOptions(sActiveValue);
      if (targetOption.isLeaf === false && !targetOption.children && loadData) {
        if (changeOnSelect) {
          this.handleChange(activeOptions, { visible: true }, e);
        }
        this.setState({ sActiveValue: sActiveValue });
        loadData(activeOptions);
        return;
      }
      var newState = {};
      if (!targetOption.children || !targetOption.children.length) {
        this.handleChange(activeOptions, { visible: false }, e);
        // set value to activeValue when select leaf option
        newState.sValue = sActiveValue;
        // add e.type judgement to prevent `onChange` being triggered by mouseEnter
      } else if (changeOnSelect && (e.type === 'click' || e.type === 'keydown')) {
        if (expandTrigger === 'hover') {
          this.handleChange(activeOptions, { visible: false }, e);
        } else {
          this.handleChange(activeOptions, { visible: true }, e);
        }
        // set value to activeValue on every select
        newState.sValue = sActiveValue;
      }
      newState.sActiveValue = sActiveValue;
      //  not change the value by keyboard
      if (hasProp(this, 'value') || e.type === 'keydown' && e.keyCode !== KeyCode.ENTER) {
        delete newState.sValue;
      }
      this.setState(newState);
    },
    handleKeyDown: function handleKeyDown(e) {
      var $slots = this.$slots;

      var children = $slots['default'] && $slots['default'][0];
      // https://github.com/ant-design/ant-design/issues/6717
      // Don't bind keyboard support when children specify the onKeyDown
      if (children) {
        var keydown = getEvents(children).keydown;
        if (keydown) {
          keydown(e);
          return;
        }
      }
      var activeValue = [].concat(_toConsumableArray(this.sActiveValue));
      var currentLevel = activeValue.length - 1 < 0 ? 0 : activeValue.length - 1;
      var currentOptions = this.getCurrentLevelOptions();
      var currentIndex = currentOptions.map(function (o) {
        return o.value;
      }).indexOf(activeValue[currentLevel]);
      if (e.keyCode !== KeyCode.DOWN && e.keyCode !== KeyCode.UP && e.keyCode !== KeyCode.LEFT && e.keyCode !== KeyCode.RIGHT && e.keyCode !== KeyCode.ENTER && e.keyCode !== KeyCode.BACKSPACE && e.keyCode !== KeyCode.ESC) {
        return;
      }
      // Press any keys above to reopen menu
      if (!this.sPopupVisible && e.keyCode !== KeyCode.BACKSPACE && e.keyCode !== KeyCode.LEFT && e.keyCode !== KeyCode.RIGHT && e.keyCode !== KeyCode.ESC) {
        this.setPopupVisible(true);
        return;
      }
      if (e.keyCode === KeyCode.DOWN || e.keyCode === KeyCode.UP) {
        var nextIndex = currentIndex;
        if (nextIndex !== -1) {
          if (e.keyCode === KeyCode.DOWN) {
            nextIndex += 1;
            nextIndex = nextIndex >= currentOptions.length ? 0 : nextIndex;
          } else {
            nextIndex -= 1;
            nextIndex = nextIndex < 0 ? currentOptions.length - 1 : nextIndex;
          }
        } else {
          nextIndex = 0;
        }
        activeValue[currentLevel] = currentOptions[nextIndex].value;
      } else if (e.keyCode === KeyCode.LEFT || e.keyCode === KeyCode.BACKSPACE) {
        activeValue.splice(activeValue.length - 1, 1);
      } else if (e.keyCode === KeyCode.RIGHT) {
        if (currentOptions[currentIndex] && currentOptions[currentIndex].children) {
          activeValue.push(currentOptions[currentIndex].children[0].value);
        }
      } else if (e.keyCode === KeyCode.ESC) {
        this.setPopupVisible(false);
        return;
      }
      if (!activeValue || activeValue.length === 0) {
        this.setPopupVisible(false);
      }
      var activeOptions = this.getActiveOptions(activeValue);
      var targetOption = activeOptions[activeOptions.length - 1];
      this.handleMenuSelect(targetOption, activeOptions.length - 1, e);
      this.__emit('keydown', e);
    }
  },

  render: function render() {
    var h = arguments[0];
    var $props = this.$props,
        $slots = this.$slots,
        sValue = this.sValue,
        sActiveValue = this.sActiveValue,
        handleMenuSelect = this.handleMenuSelect,
        sPopupVisible = this.sPopupVisible,
        handlePopupVisibleChange = this.handlePopupVisibleChange,
        handleKeyDown = this.handleKeyDown,
        $listeners = this.$listeners;

    var prefixCls = $props.prefixCls,
        transitionName = $props.transitionName,
        popupClassName = $props.popupClassName,
        options = $props.options,
        disabled = $props.disabled,
        builtinPlacements = $props.builtinPlacements,
        popupPlacement = $props.popupPlacement,
        restProps = _objectWithoutProperties($props, ['prefixCls', 'transitionName', 'popupClassName', 'options', 'disabled', 'builtinPlacements', 'popupPlacement']);
    // Did not show popup when there is no options


    var menus = h('div');
    var emptyMenuClassName = '';
    if (options && options.length > 0) {
      var menusProps = {
        props: _extends({}, $props, {
          value: sValue,
          activeValue: sActiveValue,
          visible: sPopupVisible
        }),
        on: _extends({}, $listeners, {
          select: handleMenuSelect
        })
      };
      menus = h(Menus, menusProps);
    } else {
      emptyMenuClassName = ' ' + prefixCls + '-menus-empty';
    }
    var triggerProps = {
      props: _extends({}, restProps, {
        disabled: disabled,
        popupPlacement: popupPlacement,
        builtinPlacements: builtinPlacements,
        popupTransitionName: transitionName,
        action: disabled ? [] : ['click'],
        popupVisible: disabled ? false : sPopupVisible,
        prefixCls: prefixCls + '-menus',
        popupClassName: popupClassName + emptyMenuClassName
      }),
      on: _extends({}, $listeners, {
        popupVisibleChange: handlePopupVisibleChange
      }),
      ref: 'trigger'
    };
    return h(
      Trigger,
      triggerProps,
      [$slots['default'] && cloneElement($slots['default'][0], {
        on: {
          keydown: handleKeyDown
        },
        attrs: {
          tabIndex: disabled ? undefined : 0
        }
      }), h(
        'template',
        { slot: 'popup' },
        [menus]
      )]
    );
  }
};