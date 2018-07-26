'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _isFlexSupported = require('../_util/isFlexSupported');

var _isFlexSupported2 = _interopRequireDefault(_isFlexSupported);

var _propsUtil = require('../_util/props-util');

var _vnode = require('../_util/vnode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'Steps',
  mixins: [_BaseMixin2['default']],
  props: {
    prefixCls: _vueTypes2['default'].string.def('rc-steps'),
    iconPrefix: _vueTypes2['default'].string.def('rc'),
    direction: _vueTypes2['default'].string.def('horizontal'),
    labelPlacement: _vueTypes2['default'].string.def('horizontal'),
    status: _vueTypes2['default'].string.def('process'),
    size: _vueTypes2['default'].string.def(''),
    progressDot: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].func]),
    current: _vueTypes2['default'].number.def(0)
  },
  data: function data() {
    this.calcStepOffsetWidth = (0, _debounce2['default'])(this.calcStepOffsetWidth, 150);
    return {
      flexSupported: true,
      lastStepOffsetWidth: 0
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.calcStepOffsetWidth();
      if (!(0, _isFlexSupported2['default'])()) {
        _this.setState({
          flexSupported: false
        });
      }
    });
  },
  updated: function updated() {
    var _this2 = this;

    this.$nextTick(function () {
      _this2.calcStepOffsetWidth();
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this.calcTimeout) {
      clearTimeout(this.calcTimeout);
    }
    if (this.calcStepOffsetWidth && this.calcStepOffsetWidth.cancel) {
      this.calcStepOffsetWidth.cancel();
    }
  },

  methods: {
    calcStepOffsetWidth: function calcStepOffsetWidth() {
      var _this3 = this;

      if ((0, _isFlexSupported2['default'])()) {
        return;
      }
      // Just for IE9
      var domNode = this.$refs.vcStepsRef;
      if (domNode.children.length > 0) {
        if (this.calcTimeout) {
          clearTimeout(this.calcTimeout);
        }
        this.calcTimeout = setTimeout(function () {
          // +1 for fit edge bug of digit width, like 35.4px
          var lastStepOffsetWidth = (domNode.lastChild.offsetWidth || 0) + 1;
          // Reduce shake bug
          if (_this3.lastStepOffsetWidth === lastStepOffsetWidth || Math.abs(_this3.lastStepOffsetWidth - lastStepOffsetWidth) <= 3) {
            return;
          }
          _this3.setState({ lastStepOffsetWidth: lastStepOffsetWidth });
        });
      }
    }
  },
  render: function render() {
    var _classString,
        _this4 = this;

    var h = arguments[0];
    var prefixCls = this.prefixCls,
        direction = this.direction,
        labelPlacement = this.labelPlacement,
        iconPrefix = this.iconPrefix,
        status = this.status,
        size = this.size,
        current = this.current,
        $scopedSlots = this.$scopedSlots;

    var progressDot = this.progressDot;
    if (progressDot === undefined) {
      progressDot = $scopedSlots.progressDot;
    }
    var lastStepOffsetWidth = this.lastStepOffsetWidth,
        flexSupported = this.flexSupported;

    var filteredChildren = (0, _propsUtil.filterEmpty)(this.$slots['default']);
    var lastIndex = filteredChildren.length - 1;
    var adjustedlabelPlacement = progressDot ? 'vertical' : labelPlacement;
    var classString = (_classString = {}, (0, _defineProperty3['default'])(_classString, prefixCls, true), (0, _defineProperty3['default'])(_classString, prefixCls + '-' + direction, true), (0, _defineProperty3['default'])(_classString, prefixCls + '-' + size, size), (0, _defineProperty3['default'])(_classString, prefixCls + '-label-' + adjustedlabelPlacement, direction === 'horizontal'), (0, _defineProperty3['default'])(_classString, prefixCls + '-dot', !!progressDot), _classString);
    var stepsProps = {
      'class': classString,
      ref: 'vcStepsRef',
      on: this.$listeners
    };
    return h(
      'div',
      stepsProps,
      [filteredChildren.map(function (child, index) {
        var childProps = (0, _propsUtil.getPropsData)(child);
        var stepProps = {
          props: (0, _extends3['default'])({
            stepNumber: '' + (index + 1),
            prefixCls: prefixCls,
            iconPrefix: iconPrefix,
            progressDot: _this4.progressDot
          }, childProps),
          on: (0, _propsUtil.getEvents)(child),
          scopedSlots: $scopedSlots
        };
        if (!flexSupported && direction !== 'vertical' && index !== lastIndex) {
          stepProps.props.itemWidth = 100 / lastIndex + '%';
          stepProps.props.adjustMarginRight = -Math.round(lastStepOffsetWidth / lastIndex + 1) + 'px';
        }
        // fix tail color
        if (status === 'error' && index === current - 1) {
          stepProps['class'] = prefixCls + '-next-error';
        }
        if (!childProps.status) {
          if (index === current) {
            stepProps.props.status = status;
          } else if (index < current) {
            stepProps.props.status = 'finish';
          } else {
            stepProps.props.status = 'wait';
          }
        }
        return (0, _vnode.cloneElement)(child, stepProps);
      })]
    );
  }
};
module.exports = exports['default'];