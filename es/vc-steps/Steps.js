import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';

import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import debounce from 'lodash/debounce';
import isFlexSupported from '../_util/isFlexSupported';
import { filterEmpty, getEvents, getPropsData } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';

export default {
  name: 'Steps',
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string.def('rc-steps'),
    iconPrefix: PropTypes.string.def('rc'),
    direction: PropTypes.string.def('horizontal'),
    labelPlacement: PropTypes.string.def('horizontal'),
    status: PropTypes.string.def('process'),
    size: PropTypes.string.def(''),
    progressDot: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    current: PropTypes.number.def(0)
  },
  data: function data() {
    this.calcStepOffsetWidth = debounce(this.calcStepOffsetWidth, 150);
    return {
      flexSupported: true,
      lastStepOffsetWidth: 0
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.calcStepOffsetWidth();
      if (!isFlexSupported()) {
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

      if (isFlexSupported()) {
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

    var filteredChildren = filterEmpty(this.$slots['default']);
    var lastIndex = filteredChildren.length - 1;
    var adjustedlabelPlacement = progressDot ? 'vertical' : labelPlacement;
    var classString = (_classString = {}, _defineProperty(_classString, prefixCls, true), _defineProperty(_classString, prefixCls + '-' + direction, true), _defineProperty(_classString, prefixCls + '-' + size, size), _defineProperty(_classString, prefixCls + '-label-' + adjustedlabelPlacement, direction === 'horizontal'), _defineProperty(_classString, prefixCls + '-dot', !!progressDot), _classString);
    var stepsProps = {
      'class': classString,
      ref: 'vcStepsRef',
      on: this.$listeners
    };
    return h(
      'div',
      stepsProps,
      [filteredChildren.map(function (child, index) {
        var childProps = getPropsData(child);
        var stepProps = {
          props: _extends({
            stepNumber: '' + (index + 1),
            prefixCls: prefixCls,
            iconPrefix: iconPrefix,
            progressDot: _this4.progressDot
          }, childProps),
          on: getEvents(child),
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
        return cloneElement(child, stepProps);
      })]
    );
  }
};