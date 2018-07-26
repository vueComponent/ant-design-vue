import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';

import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import isCssAnimationSupported from '../_util/isCssAnimationSupported';
import { filterEmpty, initDefaultProps, isValidElement, getComponentFromProp } from '../_util/props-util';
import getTransitionProps from '../_util/getTransitionProps';
import { cloneElement } from '../_util/vnode';

export var SpinProps = function SpinProps() {
  return {
    prefixCls: PropTypes.string,
    spinning: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    wrapperClassName: PropTypes.string,
    tip: PropTypes.string,
    delay: PropTypes.number,
    indicator: PropTypes.any
  };
};

export default {
  name: 'ASpin',
  mixins: [BaseMixin],
  props: initDefaultProps(SpinProps(), {
    prefixCls: 'ant-spin',
    size: 'default',
    spinning: true,
    wrapperClassName: ''
  }),
  data: function data() {
    var spinning = this.spinning;

    return {
      stateSpinning: spinning,
      debounceTimeout: null,
      delayTimeout: null,
      notCssAnimationSupported: false
    };
  },

  methods: {
    getChildren: function getChildren() {
      if (this.$slots && this.$slots['default']) {
        return filterEmpty(this.$slots['default']);
      }
      return null;
    }
  },
  mounted: function mounted() {
    if (!isCssAnimationSupported()) {
      // Show text in IE9
      this.setState({
        notCssAnimationSupported: true
      });
    }
  },
  beforeDestroy: function beforeDestroy() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout);
    }
  },

  watch: {
    spinning: function spinning() {
      var _this = this;

      var delay = this.delay,
          spinning = this.spinning;


      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }
      if (!spinning) {
        this.debounceTimeout = window.setTimeout(function () {
          return _this.setState({ stateSpinning: spinning });
        }, 200);
        if (this.delayTimeout) {
          clearTimeout(this.delayTimeout);
        }
      } else {
        if (spinning && delay && !isNaN(Number(delay))) {
          if (this.delayTimeout) {
            clearTimeout(this.delayTimeout);
          }
          this.delayTimeout = window.setTimeout(function () {
            return _this.setState({ stateSpinning: spinning });
          }, delay);
        } else {
          this.setState({ stateSpinning: spinning });
        }
      }
    }
  },
  render: function render() {
    var _spinClassName;

    var h = arguments[0];

    var _$props = this.$props,
        size = _$props.size,
        prefixCls = _$props.prefixCls,
        tip = _$props.tip,
        wrapperClassName = _$props.wrapperClassName,
        restProps = _objectWithoutProperties(_$props, ['size', 'prefixCls', 'tip', 'wrapperClassName']);

    var notCssAnimationSupported = this.notCssAnimationSupported,
        stateSpinning = this.stateSpinning;

    var dotClassName = prefixCls + '-dot';
    var spinClassName = (_spinClassName = {}, _defineProperty(_spinClassName, prefixCls, true), _defineProperty(_spinClassName, prefixCls + '-sm', size === 'small'), _defineProperty(_spinClassName, prefixCls + '-lg', size === 'large'), _defineProperty(_spinClassName, prefixCls + '-spinning', stateSpinning), _defineProperty(_spinClassName, prefixCls + '-show-text', !!tip || notCssAnimationSupported), _spinClassName);
    var indicator = getComponentFromProp(this, 'indicator');
    if (Array.isArray(indicator)) {
      indicator = filterEmpty(indicator);
      indicator = indicator.length === 1 ? indicator[0] : indicator;
    }
    var spinIndicator = null;
    if (isValidElement(indicator)) {
      spinIndicator = cloneElement(indicator, { 'class': dotClassName });
    }
    spinIndicator = spinIndicator || h(
      'span',
      { 'class': dotClassName + ' ' + prefixCls + '-dot-spin' },
      [h('i'), h('i'), h('i'), h('i')]
    );

    var spinElement = h(
      'div',
      _mergeJSXProps([restProps, { 'class': spinClassName }]),
      [spinIndicator, tip ? h(
        'div',
        { 'class': prefixCls + '-text' },
        [tip]
      ) : null]
    );
    var children = this.getChildren();
    if (children) {
      var _containerClassName;

      var animateClassName = prefixCls + '-nested-loading';
      if (wrapperClassName) {
        animateClassName += ' ' + wrapperClassName;
      }
      var containerClassName = (_containerClassName = {}, _defineProperty(_containerClassName, prefixCls + '-container', true), _defineProperty(_containerClassName, prefixCls + '-blur', stateSpinning), _containerClassName);

      return h(
        'transition-group',
        _mergeJSXProps([getTransitionProps('fade'), {
          attrs: {
            tag: 'div'
          },
          'class': animateClassName
        }]),
        [stateSpinning && h(
          'div',
          { key: 'loading' },
          [spinElement]
        ), h(
          'div',
          { 'class': containerClassName, key: 'container' },
          [children]
        )]
      );
    }
    return spinElement;
  }
};