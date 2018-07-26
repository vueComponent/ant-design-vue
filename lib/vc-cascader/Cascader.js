'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _trigger = require('../trigger');

var _trigger2 = _interopRequireDefault(_trigger);

var _Menus = require('./Menus');

var _Menus2 = _interopRequireDefault(_Menus);

var _KeyCode = require('../_util/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _arrayTreeFilter = require('array-tree-filter');

var _arrayTreeFilter2 = _interopRequireDefault(_arrayTreeFilter);

var _arrays = require('shallow-equal/arrays');

var _arrays2 = _interopRequireDefault(_arrays);

var _propsUtil = require('../_util/props-util');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _vnode = require('../_util/vnode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

exports['default'] = {
  props: {
    value: _vueTypes2['default'].array,
    defaultValue: _vueTypes2['default'].array,
    options: _vueTypes2['default'].array.def([]).isRequired,
    // onChange: PropTypes.func,
    // onPopupVisibleChange: PropTypes.func,
    popupVisible: _vueTypes2['default'].bool,
    disabled: _vueTypes2['default'].bool.def(false),
    transitionName: _vueTypes2['default'].string.def(''),
    popupClassName: _vueTypes2['default'].string.def(''),
    popupStyle: _vueTypes2['default'].object.def({}),
    popupPlacement: _vueTypes2['default'].string.def('bottomLeft'),
    prefixCls: _vueTypes2['default'].string.def('rc-cascader'),
    dropdownMenuColumnStyle: _vueTypes2['default'].object,
    builtinPlacements: _vueTypes2['default'].object.def(BUILT_IN_PLACEMENTS),
    loadData: _vueTypes2['default'].func,
    changeOnSelect: _vueTypes2['default'].bool,
    // onKeyDown: PropTypes.func,
    expandTrigger: _vueTypes2['default'].string.def('click')
  },
  mixins: [_BaseMixin2['default']],
  model: {
    prop: 'value',
    event: 'change'
  },
  data: function data() {
    var initialValue = [];
    var value = this.value,
        defaultValue = this.defaultValue,
        popupVisible = this.popupVisible;

    if ((0, _propsUtil.hasProp)(this, 'value')) {
      initialValue = value || [];
    } else if ((0, _propsUtil.hasProp)(this, 'defaultValue')) {
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
      if (!(0, _arrays2['default'])(val, oldValue)) {
        var newValues = {
          value: oldValue || [],
          activeValue: oldValue || []
          // allow activeValue diff from value
          // https://github.com/ant-design/ant-design/issues/2767
        };if ((0, _propsUtil.hasProp)(this, 'loadData')) {
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

      var result = (0, _arrayTreeFilter2['default'])(options, function (o, level) {
        return o.value === sActiveValue[level];
      });
      if (result[result.length - 2]) {
        return result[result.length - 2].children;
      }
      return [].concat((0, _toConsumableArray3['default'])(options)).filter(function (o) {
        return !o.disabled;
      });
    },
    getActiveOptions: function getActiveOptions(activeValue) {
      return (0, _arrayTreeFilter2['default'])(this.options, function (o, level) {
        return o.value === activeValue[level];
      });
    },
    setPopupVisible: function setPopupVisible(popupVisible) {
      if (!(0, _propsUtil.hasProp)(this, 'popupVisible')) {
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
      if (e.type !== 'keydown' || e.keyCode === _KeyCode2['default'].ENTER) {
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
      if ((0, _propsUtil.hasProp)(this, 'value') || e.type === 'keydown' && e.keyCode !== _KeyCode2['default'].ENTER) {
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
        var keydown = (0, _propsUtil.getEvents)(children).keydown;
        if (keydown) {
          keydown(e);
          return;
        }
      }
      var activeValue = [].concat((0, _toConsumableArray3['default'])(this.sActiveValue));
      var currentLevel = activeValue.length - 1 < 0 ? 0 : activeValue.length - 1;
      var currentOptions = this.getCurrentLevelOptions();
      var currentIndex = currentOptions.map(function (o) {
        return o.value;
      }).indexOf(activeValue[currentLevel]);
      if (e.keyCode !== _KeyCode2['default'].DOWN && e.keyCode !== _KeyCode2['default'].UP && e.keyCode !== _KeyCode2['default'].LEFT && e.keyCode !== _KeyCode2['default'].RIGHT && e.keyCode !== _KeyCode2['default'].ENTER && e.keyCode !== _KeyCode2['default'].BACKSPACE && e.keyCode !== _KeyCode2['default'].ESC) {
        return;
      }
      // Press any keys above to reopen menu
      if (!this.sPopupVisible && e.keyCode !== _KeyCode2['default'].BACKSPACE && e.keyCode !== _KeyCode2['default'].LEFT && e.keyCode !== _KeyCode2['default'].RIGHT && e.keyCode !== _KeyCode2['default'].ESC) {
        this.setPopupVisible(true);
        return;
      }
      if (e.keyCode === _KeyCode2['default'].DOWN || e.keyCode === _KeyCode2['default'].UP) {
        var nextIndex = currentIndex;
        if (nextIndex !== -1) {
          if (e.keyCode === _KeyCode2['default'].DOWN) {
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
      } else if (e.keyCode === _KeyCode2['default'].LEFT || e.keyCode === _KeyCode2['default'].BACKSPACE) {
        activeValue.splice(activeValue.length - 1, 1);
      } else if (e.keyCode === _KeyCode2['default'].RIGHT) {
        if (currentOptions[currentIndex] && currentOptions[currentIndex].children) {
          activeValue.push(currentOptions[currentIndex].children[0].value);
        }
      } else if (e.keyCode === _KeyCode2['default'].ESC) {
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
        restProps = (0, _objectWithoutProperties3['default'])($props, ['prefixCls', 'transitionName', 'popupClassName', 'options', 'disabled', 'builtinPlacements', 'popupPlacement']);
    // Did not show popup when there is no options

    var menus = h('div');
    var emptyMenuClassName = '';
    if (options && options.length > 0) {
      var menusProps = {
        props: (0, _extends3['default'])({}, $props, {
          value: sValue,
          activeValue: sActiveValue,
          visible: sPopupVisible
        }),
        on: (0, _extends3['default'])({}, $listeners, {
          select: handleMenuSelect
        })
      };
      menus = h(_Menus2['default'], menusProps);
    } else {
      emptyMenuClassName = ' ' + prefixCls + '-menus-empty';
    }
    var triggerProps = {
      props: (0, _extends3['default'])({}, restProps, {
        disabled: disabled,
        popupPlacement: popupPlacement,
        builtinPlacements: builtinPlacements,
        popupTransitionName: transitionName,
        action: disabled ? [] : ['click'],
        popupVisible: disabled ? false : sPopupVisible,
        prefixCls: prefixCls + '-menus',
        popupClassName: popupClassName + emptyMenuClassName
      }),
      on: (0, _extends3['default'])({}, $listeners, {
        popupVisibleChange: handlePopupVisibleChange
      }),
      ref: 'trigger'
    };
    return h(
      _trigger2['default'],
      triggerProps,
      [$slots['default'] && (0, _vnode.cloneElement)($slots['default'][0], {
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
module.exports = exports['default'];