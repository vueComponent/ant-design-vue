import PropTypes from '../../_util/vue-types';
import classNames from 'classnames';
import KeyCode from '../../_util/KeyCode';
import { initDefaultProps, hasProp, getOptionProps } from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';
import { getOffsetLeft } from './util';
import Star from './Star';

var rateProps = {
  disabled: PropTypes.bool,
  value: PropTypes.number,
  defaultValue: PropTypes.number,
  count: PropTypes.number,
  allowHalf: PropTypes.bool,
  allowClear: PropTypes.bool,
  prefixCls: PropTypes.string,
  character: PropTypes.any,
  tabIndex: PropTypes.number,
  autoFocus: PropTypes.bool
};

function noop() {}

export default {
  name: 'Rate',
  mixins: [BaseMixin],
  props: initDefaultProps(rateProps, {
    defaultValue: 0,
    count: 5,
    allowHalf: false,
    allowClear: true,
    prefixCls: 'rc-rate',
    tabIndex: 0,
    character: '★'
  }),
  model: {
    prop: 'value',
    event: 'change'
  },
  data: function data() {
    var value = this.value;
    if (!hasProp(this, 'value')) {
      value = this.defaultValue;
    }
    return {
      sValue: value,
      focused: false,
      cleanedValue: null,
      hoverValue: undefined
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      if (_this.autoFocus && !_this.disabled) {
        _this.focus();
      }
    });
  },

  watch: {
    value: function value(val) {
      this.setState({
        sValue: val
      });
    }
  },
  methods: {
    onHover: function onHover(event, index) {
      var hoverValue = this.getStarValue(index, event.pageX);
      var cleanedValue = this.cleanedValue;

      if (hoverValue !== cleanedValue) {
        this.setState({
          hoverValue: hoverValue,
          cleanedValue: null
        });
      }
      this.$emit('hoverChange', hoverValue);
    },
    onMouseLeave: function onMouseLeave() {
      this.setState({
        hoverValue: undefined,
        cleanedValue: null
      });
      this.$emit('hoverChange', undefined);
    },
    onClick: function onClick(event, index) {
      var value = this.getStarValue(index, event.pageX);
      var isReset = false;
      if (this.allowClear) {
        isReset = value === this.sValue;
      }
      this.onMouseLeave(true);
      this.changeValue(isReset ? 0 : value);
      this.setState({
        cleanedValue: isReset ? value : null
      });
    },
    onFocus: function onFocus() {
      this.setState({
        focused: true
      });
      this.$emit('focus');
    },
    onBlur: function onBlur() {
      this.setState({
        focused: false
      });
      this.$emit('blur');
    },
    onKeyDown: function onKeyDown(event) {
      var keyCode = event.keyCode;
      var count = this.count,
          allowHalf = this.allowHalf;
      var sValue = this.sValue;

      if (keyCode === KeyCode.RIGHT && sValue < count) {
        if (allowHalf) {
          sValue += 0.5;
        } else {
          sValue += 1;
        }
        this.changeValue(sValue);
        event.preventDefault();
      } else if (keyCode === KeyCode.LEFT && sValue > 0) {
        if (allowHalf) {
          sValue -= 0.5;
        } else {
          sValue -= 1;
        }
        this.changeValue(sValue);
        event.preventDefault();
      }
      this.$emit('keydown', event);
    },
    getStarDOM: function getStarDOM(index) {
      return this.$refs['stars' + index].$el;
    },
    getStarValue: function getStarValue(index, x) {
      var value = index + 1;
      if (this.allowHalf) {
        var starEle = this.getStarDOM(index);
        var leftDis = getOffsetLeft(starEle);
        var width = starEle.clientWidth;
        if (x - leftDis < width / 2) {
          value -= 0.5;
        }
      }
      return value;
    },
    focus: function focus() {
      if (!this.disabled) {
        this.$refs.rateRef.focus();
      }
    },
    blur: function blur() {
      if (!this.disabled) {
        this.$refs.rateRef.blur();
      }
    },
    changeValue: function changeValue(value) {
      if (!hasProp(this, 'value')) {
        this.setState({
          sValue: value
        });
      }
      this.$emit('change', value);
    }
  },
  render: function render() {
    var h = arguments[0];

    var _getOptionProps = getOptionProps(this),
        count = _getOptionProps.count,
        allowHalf = _getOptionProps.allowHalf,
        prefixCls = _getOptionProps.prefixCls,
        disabled = _getOptionProps.disabled,
        character = _getOptionProps.character,
        tabIndex = _getOptionProps.tabIndex;

    var sValue = this.sValue,
        hoverValue = this.hoverValue,
        focused = this.focused;

    var stars = [];
    var disabledClass = disabled ? prefixCls + '-disabled' : '';
    var slotCharacter = this.$slots.character;
    for (var index = 0; index < count; index++) {
      var starProps = {
        props: {
          index: index,
          disabled: disabled,
          prefixCls: prefixCls + '-star',
          allowHalf: allowHalf,
          value: hoverValue === undefined ? sValue : hoverValue,
          character: slotCharacter === undefined ? character : undefined,
          focused: focused
        },
        on: {
          click: this.onClick,
          hover: this.onHover
        },
        key: index,
        ref: 'stars' + index
      };
      stars.push(h(
        Star,
        starProps,
        [slotCharacter !== undefined ? h(
          'template',
          { slot: 'character' },
          [slotCharacter]
        ) : null]
      ));
    }
    return h(
      'ul',
      {
        'class': classNames(prefixCls, disabledClass),
        on: {
          'mouseleave': disabled ? noop : this.onMouseLeave,
          'focus': disabled ? noop : this.onFocus,
          'blur': disabled ? noop : this.onBlur,
          'keydown': disabled ? noop : this.onKeyDown
        },
        attrs: {
          tabIndex: disabled ? -1 : tabIndex
        },

        ref: 'rateRef'
      },
      [stars]
    );
  }
};