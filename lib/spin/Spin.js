'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpinProps = undefined;

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _isCssAnimationSupported = require('../_util/isCssAnimationSupported');

var _isCssAnimationSupported2 = _interopRequireDefault(_isCssAnimationSupported);

var _propsUtil = require('../_util/props-util');

var _getTransitionProps = require('../_util/getTransitionProps');

var _getTransitionProps2 = _interopRequireDefault(_getTransitionProps);

var _vnode = require('../_util/vnode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var SpinProps = exports.SpinProps = function SpinProps() {
  return {
    prefixCls: _vueTypes2['default'].string,
    spinning: _vueTypes2['default'].bool,
    size: _vueTypes2['default'].oneOf(['small', 'default', 'large']),
    wrapperClassName: _vueTypes2['default'].string,
    tip: _vueTypes2['default'].string,
    delay: _vueTypes2['default'].number,
    indicator: _vueTypes2['default'].any
  };
};

exports['default'] = {
  name: 'ASpin',
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)(SpinProps(), {
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
        return (0, _propsUtil.filterEmpty)(this.$slots['default']);
      }
      return null;
    }
  },
  mounted: function mounted() {
    if (!(0, _isCssAnimationSupported2['default'])()) {
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
        restProps = (0, _objectWithoutProperties3['default'])(_$props, ['size', 'prefixCls', 'tip', 'wrapperClassName']);
    var notCssAnimationSupported = this.notCssAnimationSupported,
        stateSpinning = this.stateSpinning;

    var dotClassName = prefixCls + '-dot';
    var spinClassName = (_spinClassName = {}, (0, _defineProperty3['default'])(_spinClassName, prefixCls, true), (0, _defineProperty3['default'])(_spinClassName, prefixCls + '-sm', size === 'small'), (0, _defineProperty3['default'])(_spinClassName, prefixCls + '-lg', size === 'large'), (0, _defineProperty3['default'])(_spinClassName, prefixCls + '-spinning', stateSpinning), (0, _defineProperty3['default'])(_spinClassName, prefixCls + '-show-text', !!tip || notCssAnimationSupported), _spinClassName);
    var indicator = (0, _propsUtil.getComponentFromProp)(this, 'indicator');
    if (Array.isArray(indicator)) {
      indicator = (0, _propsUtil.filterEmpty)(indicator);
      indicator = indicator.length === 1 ? indicator[0] : indicator;
    }
    var spinIndicator = null;
    if ((0, _propsUtil.isValidElement)(indicator)) {
      spinIndicator = (0, _vnode.cloneElement)(indicator, { 'class': dotClassName });
    }
    spinIndicator = spinIndicator || h(
      'span',
      { 'class': dotClassName + ' ' + prefixCls + '-dot-spin' },
      [h('i'), h('i'), h('i'), h('i')]
    );

    var spinElement = h(
      'div',
      (0, _babelHelperVueJsxMergeProps2['default'])([restProps, { 'class': spinClassName }]),
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
      var containerClassName = (_containerClassName = {}, (0, _defineProperty3['default'])(_containerClassName, prefixCls + '-container', true), (0, _defineProperty3['default'])(_containerClassName, prefixCls + '-blur', stateSpinning), _containerClassName);

      return h(
        'transition-group',
        (0, _babelHelperVueJsxMergeProps2['default'])([(0, _getTransitionProps2['default'])('fade'), {
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