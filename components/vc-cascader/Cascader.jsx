import { getComponentFromProp, getListeners } from '../_util/props-util';
import PropTypes from '../_util/vue-types';
import Trigger from '../vc-trigger';
import Menus from './Menus';
import KeyCode from '../_util/KeyCode';
import arrayTreeFilter from 'array-tree-filter';
import shallowEqualArrays from 'shallow-equal/arrays';
import { hasProp, getEvents, getSlot } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import { cloneElement } from '../_util/vnode';

const BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
  bottomRight: {
    points: ['tr', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
  topRight: {
    points: ['br', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
};

export default {
  mixins: [BaseMixin],
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: PropTypes.array,
    defaultValue: PropTypes.array,
    options: PropTypes.array,
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
    expandTrigger: PropTypes.string.def('click'),
    fieldNames: PropTypes.object.def({ label: 'label', value: 'value', children: 'children' }),
    expandIcon: PropTypes.any,
    loadingIcon: PropTypes.any,
    getPopupContainer: PropTypes.func,
  },
  data() {
    let initialValue = [];
    const { value, defaultValue, popupVisible } = this;
    if (hasProp(this, 'value')) {
      initialValue = value || [];
    } else if (hasProp(this, 'defaultValue')) {
      initialValue = defaultValue || [];
    }
    // warning(!('filedNames' in props),
    //   '`filedNames` of Cascader is a typo usage and deprecated, please use `fieldNames` instead.');

    return {
      sPopupVisible: popupVisible,
      sActiveValue: initialValue,
      sValue: initialValue,
    };
  },
  watch: {
    value(val, oldValue) {
      if (!shallowEqualArrays(val, oldValue)) {
        const newValues = {
          sValue: val || [],
        };
        // allow activeValue diff from value
        // https://github.com/ant-design/ant-design/issues/2767
        if (!hasProp(this, 'loadData')) {
          newValues.sActiveValue = val || [];
        }
        this.setState(newValues);
      }
    },
    popupVisible(val) {
      this.setState({
        sPopupVisible: val,
      });
    },
  },
  methods: {
    getPopupDOMNode() {
      return this.$refs.trigger.getPopupDomNode();
    },
    getFieldName(name) {
      const { defaultFieldNames, fieldNames } = this;
      return fieldNames[name] || defaultFieldNames[name];
    },
    getFieldNames() {
      return this.fieldNames;
    },
    getCurrentLevelOptions() {
      const { options = [], sActiveValue = [] } = this;
      const result = arrayTreeFilter(
        options,
        (o, level) => o[this.getFieldName('value')] === sActiveValue[level],
        { childrenKeyName: this.getFieldName('children') },
      );
      if (result[result.length - 2]) {
        return result[result.length - 2][this.getFieldName('children')];
      }
      return [...options].filter(o => !o.disabled);
    },
    getActiveOptions(activeValue) {
      return arrayTreeFilter(
        this.options || [],
        (o, level) => o[this.getFieldName('value')] === activeValue[level],
        { childrenKeyName: this.getFieldName('children') },
      );
    },
    setPopupVisible(popupVisible) {
      if (!hasProp(this, 'popupVisible')) {
        this.setState({ sPopupVisible: popupVisible });
      }
      // sync activeValue with value when panel open
      if (popupVisible && !this.sPopupVisible) {
        this.setState({
          sActiveValue: this.sValue,
        });
      }
      this.__emit('popupVisibleChange', popupVisible);
    },
    handleChange(options, setProps, e) {
      if (e.type !== 'keydown' || e.keyCode === KeyCode.ENTER) {
        this.__emit(
          'change',
          options.map(o => o[this.getFieldName('value')]),
          options,
        );
        this.setPopupVisible(setProps.visible);
      }
    },
    handlePopupVisibleChange(popupVisible) {
      this.setPopupVisible(popupVisible);
    },
    handleMenuSelect(targetOption, menuIndex, e) {
      // Keep focused state for keyboard support
      const triggerNode = this.$refs.trigger.getRootDomNode();
      if (triggerNode && triggerNode.focus) {
        triggerNode.focus();
      }
      const { changeOnSelect, loadData, expandTrigger } = this;
      if (!targetOption || targetOption.disabled) {
        return;
      }
      let { sActiveValue } = this;
      sActiveValue = sActiveValue.slice(0, menuIndex + 1);
      sActiveValue[menuIndex] = targetOption[this.getFieldName('value')];
      const activeOptions = this.getActiveOptions(sActiveValue);
      if (
        targetOption.isLeaf === false &&
        !targetOption[this.getFieldName('children')] &&
        loadData
      ) {
        if (changeOnSelect) {
          this.handleChange(activeOptions, { visible: true }, e);
        }
        this.setState({ sActiveValue });
        loadData(activeOptions);
        return;
      }
      const newState = {};
      if (
        !targetOption[this.getFieldName('children')] ||
        !targetOption[this.getFieldName('children')].length
      ) {
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
      if (hasProp(this, 'value') || (e.type === 'keydown' && e.keyCode !== KeyCode.ENTER)) {
        delete newState.sValue;
      }
      this.setState(newState);
    },
    handleItemDoubleClick() {
      const { changeOnSelect } = this.$props;
      if (changeOnSelect) {
        this.setPopupVisible(false);
      }
    },
    handleKeyDown(e) {
      const { $slots } = this;
      const children = $slots.default && $slots.default[0];
      // https://github.com/ant-design/ant-design/issues/6717
      // Don't bind keyboard support when children specify the onKeyDown
      if (children) {
        const keydown = getEvents(children).keydown;
        if (keydown) {
          keydown(e);
          return;
        }
      }
      const activeValue = [...this.sActiveValue];
      const currentLevel = activeValue.length - 1 < 0 ? 0 : activeValue.length - 1;
      const currentOptions = this.getCurrentLevelOptions();
      const currentIndex = currentOptions
        .map(o => o[this.getFieldName('value')])
        .indexOf(activeValue[currentLevel]);
      if (
        e.keyCode !== KeyCode.DOWN &&
        e.keyCode !== KeyCode.UP &&
        e.keyCode !== KeyCode.LEFT &&
        e.keyCode !== KeyCode.RIGHT &&
        e.keyCode !== KeyCode.ENTER &&
        e.keyCode !== KeyCode.SPACE &&
        e.keyCode !== KeyCode.BACKSPACE &&
        e.keyCode !== KeyCode.ESC &&
        e.keyCode !== KeyCode.TAB
      ) {
        return;
      }
      // Press any keys above to reopen menu
      if (
        !this.sPopupVisible &&
        e.keyCode !== KeyCode.BACKSPACE &&
        e.keyCode !== KeyCode.LEFT &&
        e.keyCode !== KeyCode.RIGHT &&
        e.keyCode !== KeyCode.ESC &&
        e.keyCode !== KeyCode.TAB
      ) {
        this.setPopupVisible(true);
        return;
      }
      if (e.keyCode === KeyCode.DOWN || e.keyCode === KeyCode.UP) {
        e.preventDefault();
        let nextIndex = currentIndex;
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
        activeValue[currentLevel] = currentOptions[nextIndex][this.getFieldName('value')];
      } else if (e.keyCode === KeyCode.LEFT || e.keyCode === KeyCode.BACKSPACE) {
        e.preventDefault();
        activeValue.splice(activeValue.length - 1, 1);
      } else if (e.keyCode === KeyCode.RIGHT) {
        e.preventDefault();
        if (
          currentOptions[currentIndex] &&
          currentOptions[currentIndex][this.getFieldName('children')]
        ) {
          activeValue.push(
            currentOptions[currentIndex][this.getFieldName('children')][0][
              this.getFieldName('value')
            ],
          );
        }
      } else if (e.keyCode === KeyCode.ESC || e.keyCode === KeyCode.TAB) {
        this.setPopupVisible(false);
        return;
      }
      if (!activeValue || activeValue.length === 0) {
        this.setPopupVisible(false);
      }
      const activeOptions = this.getActiveOptions(activeValue);
      const targetOption = activeOptions[activeOptions.length - 1];
      this.handleMenuSelect(targetOption, activeOptions.length - 1, e);
      this.__emit('keydown', e);
    },
  },

  render() {
    const {
      $props,
      sActiveValue,
      handleMenuSelect,
      sPopupVisible,
      handlePopupVisibleChange,
      handleKeyDown,
    } = this;
    const listeners = getListeners(this);
    const {
      prefixCls,
      transitionName,
      popupClassName,
      options = [],
      disabled,
      builtinPlacements,
      popupPlacement,
      ...restProps
    } = $props;
    // Did not show popup when there is no options
    let menus = <div />;
    let emptyMenuClassName = '';
    if (options && options.length > 0) {
      const loadingIcon = getComponentFromProp(this, 'loadingIcon');
      const expandIcon = getComponentFromProp(this, 'expandIcon') || '>';
      const menusProps = {
        props: {
          ...$props,
          fieldNames: this.getFieldNames(),
          defaultFieldNames: this.defaultFieldNames,
          activeValue: sActiveValue,
          visible: sPopupVisible,
          loadingIcon,
          expandIcon,
        },
        on: {
          ...listeners,
          select: handleMenuSelect,
          itemDoubleClick: this.handleItemDoubleClick,
        },
      };
      menus = <Menus {...menusProps} />;
    } else {
      emptyMenuClassName = ` ${prefixCls}-menus-empty`;
    }
    const triggerProps = {
      props: {
        ...restProps,
        disabled: disabled,
        popupPlacement: popupPlacement,
        builtinPlacements: builtinPlacements,
        popupTransitionName: transitionName,
        action: disabled ? [] : ['click'],
        popupVisible: disabled ? false : sPopupVisible,
        prefixCls: `${prefixCls}-menus`,
        popupClassName: popupClassName + emptyMenuClassName,
      },
      on: {
        ...listeners,
        popupVisibleChange: handlePopupVisibleChange,
      },
      ref: 'trigger',
    };
    const children = getSlot(this, 'default')[0];
    return (
      <Trigger {...triggerProps}>
        {children &&
          cloneElement(children, {
            on: {
              keydown: handleKeyDown,
            },
            attrs: {
              tabIndex: disabled ? undefined : 0,
            },
          })}
        <template slot="popup">{menus}</template>
      </Trigger>
    );
  },
};
