'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports['default'] = createSlider;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _vueTypes = require('../../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _addEventListener = require('../../../_util/Dom/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

var _warning = require('../../../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

var _propsUtil = require('../../../_util/props-util');

var _Steps = require('./Steps');

var _Steps2 = _interopRequireDefault(_Steps);

var _Marks = require('./Marks');

var _Marks2 = _interopRequireDefault(_Marks);

var _Handle = require('../Handle');

var _Handle2 = _interopRequireDefault(_Handle);

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

function createSlider(Component) {
  // const displayName = `ComponentEnhancer(${Component.displayName})`
  var propTypes = {
    min: _vueTypes2['default'].number,
    max: _vueTypes2['default'].number,
    step: _vueTypes2['default'].number,
    marks: _vueTypes2['default'].object,
    included: _vueTypes2['default'].bool,
    prefixCls: _vueTypes2['default'].string,
    disabled: _vueTypes2['default'].bool,
    handle: _vueTypes2['default'].func,
    dots: _vueTypes2['default'].bool,
    vertical: _vueTypes2['default'].bool,
    minimumTrackStyle: _vueTypes2['default'].object, // just for compatibility, will be deperecate
    maximumTrackStyle: _vueTypes2['default'].object, // just for compatibility, will be deperecate
    handleStyle: _vueTypes2['default'].oneOfType([_vueTypes2['default'].object, _vueTypes2['default'].arrayOf(_vueTypes2['default'].object)]),
    trackStyle: _vueTypes2['default'].oneOfType([_vueTypes2['default'].object, _vueTypes2['default'].arrayOf(_vueTypes2['default'].object)]),
    railStyle: _vueTypes2['default'].object,
    dotStyle: _vueTypes2['default'].object,
    activeDotStyle: _vueTypes2['default'].object,
    autoFocus: _vueTypes2['default'].bool
  };
  return {
    name: 'createSlider',
    mixins: [Component],
    model: {
      prop: 'value',
      event: 'change'
    },
    props: (0, _propsUtil.initDefaultProps)(propTypes, {
      prefixCls: 'rc-slider',
      min: 0,
      max: 100,
      step: 1,
      marks: {},
      handle: function handle(h, _ref) {
        var index = _ref.index,
            ref = _ref.ref,
            className = _ref.className,
            style = _ref.style,
            restProps = (0, _objectWithoutProperties3['default'])(_ref, ['index', 'ref', 'className', 'style']);

        delete restProps.dragging;
        var handleProps = {
          props: (0, _extends3['default'])({}, restProps),
          'class': className,
          style: style,
          key: index,
          ref: ref
        };
        return h(_Handle2['default'], handleProps);
      },

      included: true,
      disabled: false,
      dots: false,
      vertical: false,
      trackStyle: [{}],
      handleStyle: [{}],
      railStyle: {},
      dotStyle: {},
      activeDotStyle: {}
    }),
    data: function data() {
      if (process.env.NODE_ENV !== 'production') {
        var step = this.step,
            max = this.max,
            min = this.min;

        (0, _warning2['default'])(step && Math.floor(step) === step ? (max - min) % step === 0 : true, 'Slider[max] - Slider[min] (%s) should be a multiple of Slider[step] (%s)', max - min, step);
      }
      return {};
    },
    beforeDestroy: function beforeDestroy() {
      var _this = this;

      this.$nextTick(function () {
        // if (super.componentWillUnmount) super.componentWillUnmount()
        _this.removeDocumentEvents();
      });
    },
    mounted: function mounted() {
      var _this2 = this;

      this.$nextTick(function () {
        // Snapshot testing cannot handle refs, so be sure to null-check this.
        _this2.document = _this2.$refs.sliderRef && _this2.$refs.sliderRef.ownerDocument;
        // this.setHandleRefs()
      });
    },

    computed: {
      handlesRefs: function handlesRefs() {
        var handlesRefs = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.entries(this.$refs)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _ref2 = _step.value;

            var _ref3 = (0, _slicedToArray3['default'])(_ref2, 2);

            var k = _ref3[0];
            var v = _ref3[1];

            var matchs = k.match(/handleRefs_(\d+$)/);
            if (matchs) {
              handlesRefs[+matchs[1]] = v;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return handlesRefs;
      }
    },
    methods: {
      onMouseDown: function onMouseDown(e) {
        if (e.button !== 0) {
          return;
        }
        var isVertical = this.vertical;
        var position = utils.getMousePosition(isVertical, e);
        if (!utils.isEventFromHandle(e, this.handlesRefs)) {
          this.dragOffset = 0;
        } else {
          var handlePosition = utils.getHandleCenterPosition(isVertical, e.target);
          this.dragOffset = position - handlePosition;
          position = handlePosition;
        }
        this.removeDocumentEvents();
        this.onStart(position);
        this.addDocumentMouseEvents();
      },
      onTouchStart: function onTouchStart(e) {
        if (utils.isNotTouchEvent(e)) return;

        var isVertical = this.vertical;
        var position = utils.getTouchPosition(isVertical, e);
        if (!utils.isEventFromHandle(e, this.handlesRefs)) {
          this.dragOffset = 0;
        } else {
          var handlePosition = utils.getHandleCenterPosition(isVertical, e.target);
          this.dragOffset = position - handlePosition;
          position = handlePosition;
        }
        this.onStart(position);
        this.addDocumentTouchEvents();
        utils.pauseEvent(e);
      },
      onFocus: function onFocus(e) {
        var vertical = this.vertical;

        if (utils.isEventFromHandle(e, this.handlesRefs)) {
          var handlePosition = utils.getHandleCenterPosition(vertical, e.target);
          this.dragOffset = 0;
          this.onStart(handlePosition);
          utils.pauseEvent(e);
          this.$emit('focus', e);
        }
      },
      onBlur: function onBlur(e) {
        this.onEnd(e);
        this.$emit('blur', e);
      },
      addDocumentTouchEvents: function addDocumentTouchEvents() {
        // just work for Chrome iOS Safari and Android Browser
        this.onTouchMoveListener = (0, _addEventListener2['default'])(this.document, 'touchmove', this.onTouchMove);
        this.onTouchUpListener = (0, _addEventListener2['default'])(this.document, 'touchend', this.onEnd);
      },
      addDocumentMouseEvents: function addDocumentMouseEvents() {
        this.onMouseMoveListener = (0, _addEventListener2['default'])(this.document, 'mousemove', this.onMouseMove);
        this.onMouseUpListener = (0, _addEventListener2['default'])(this.document, 'mouseup', this.onEnd);
      },
      removeDocumentEvents: function removeDocumentEvents() {
        /* eslint-disable no-unused-expressions */
        this.onTouchMoveListener && this.onTouchMoveListener.remove();
        this.onTouchUpListener && this.onTouchUpListener.remove();

        this.onMouseMoveListener && this.onMouseMoveListener.remove();
        this.onMouseUpListener && this.onMouseUpListener.remove();
        /* eslint-enable no-unused-expressions */
      },
      onMouseUp: function onMouseUp() {
        // if (this.$children && this.$children[this.prevMovedHandleIndex]) {
        //   const handleCom = utils.getComponentProps(this.$children[this.prevMovedHandleIndex], 'clickFocus')
        //   console.log('handleCom', handleCom)
        //   if (handleCom) {
        //     // handleCom.clickFocus()
        //   }

        // }
        if (this.handlesRefs[this.prevMovedHandleIndex]) {
          this.handlesRefs[this.prevMovedHandleIndex].clickFocus();
        }
      },
      onMouseMove: function onMouseMove(e) {
        if (!this.$refs.sliderRef) {
          this.onEnd();
          return;
        }
        var position = utils.getMousePosition(this.vertical, e);
        this.onMove(e, position - this.dragOffset);
      },
      onTouchMove: function onTouchMove(e) {
        if (utils.isNotTouchEvent(e) || !this.$refs.sliderRef) {
          this.onEnd();
          return;
        }

        var position = utils.getTouchPosition(this.vertical, e);
        this.onMove(e, position - this.dragOffset);
      },
      onKeyDown: function onKeyDown(e) {
        if (this.$refs.sliderRef && utils.isEventFromHandle(e, this.handlesRefs)) {
          this.onKeyboard(e);
        }
      },
      focus: function focus() {
        if (!this.disabled) {
          this.handlesRefs[0].focus();
        }
      },
      blur: function blur() {
        if (!this.disabled) {
          this.handlesRefs[0].blur();
        }
      },
      getSliderStart: function getSliderStart() {
        var slider = this.$refs.sliderRef;
        var rect = slider.getBoundingClientRect();

        return this.vertical ? rect.top : rect.left;
      },
      getSliderLength: function getSliderLength() {
        var slider = this.$refs.sliderRef;
        if (!slider) {
          return 0;
        }

        var coords = slider.getBoundingClientRect();
        return this.vertical ? coords.height : coords.width;
      },
      calcValue: function calcValue(offset) {
        var vertical = this.vertical,
            min = this.min,
            max = this.max;

        var ratio = Math.abs(Math.max(offset, 0) / this.getSliderLength());
        var value = vertical ? (1 - ratio) * (max - min) + min : ratio * (max - min) + min;
        return value;
      },
      calcValueByPos: function calcValueByPos(position) {
        var pixelOffset = position - this.getSliderStart();
        var nextValue = this.trimAlignValue(this.calcValue(pixelOffset));
        return nextValue;
      },
      calcOffset: function calcOffset(value) {
        var min = this.min,
            max = this.max;

        var ratio = (value - min) / (max - min);
        return ratio * 100;
      },
      onClickMarkLabel: function onClickMarkLabel(e, value) {
        e.stopPropagation();
        this.onChange({ value: value });
        // this.$emit('change', value)
      }
    },
    render: function render(h) {
      var _classNames;

      var prefixCls = this.prefixCls,
          marks = this.marks,
          dots = this.dots,
          step = this.step,
          included = this.included,
          disabled = this.disabled,
          vertical = this.vertical,
          min = this.min,
          max = this.max,
          maximumTrackStyle = this.maximumTrackStyle,
          railStyle = this.railStyle,
          dotStyle = this.dotStyle,
          activeDotStyle = this.activeDotStyle;

      var _renderSlider = this.renderSlider(h),
          tracks = _renderSlider.tracks,
          handles = _renderSlider.handles;

      var sliderClassName = (0, _classnames2['default'])(prefixCls, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-with-marks', Object.keys(marks).length), (0, _defineProperty3['default'])(_classNames, prefixCls + '-disabled', disabled), (0, _defineProperty3['default'])(_classNames, prefixCls + '-vertical', vertical), _classNames));
      var markProps = {
        props: {
          vertical: vertical,
          marks: marks,
          included: included,
          lowerBound: this.getLowerBound(),
          upperBound: this.getUpperBound(),
          max: max,
          min: min,
          className: prefixCls + '-mark'
        },
        on: {
          clickLabel: disabled ? noop : this.onClickMarkLabel
        }
      };
      return h(
        'div',
        {
          ref: 'sliderRef',
          'class': sliderClassName,
          on: {
            'touchstart': disabled ? noop : this.onTouchStart,
            'mousedown': disabled ? noop : this.onMouseDown,
            'mouseup': disabled ? noop : this.onMouseUp,
            'keydown': disabled ? noop : this.onKeyDown,
            'focus': disabled ? noop : this.onFocus,
            'blur': disabled ? noop : this.onBlur
          }
        },
        [h('div', {
          'class': prefixCls + '-rail',
          style: (0, _extends3['default'])({}, maximumTrackStyle, railStyle)
        }), tracks, h(_Steps2['default'], {
          attrs: {
            prefixCls: prefixCls,
            vertical: vertical,
            marks: marks,
            dots: dots,
            step: step,
            included: included,
            lowerBound: this.getLowerBound(),
            upperBound: this.getUpperBound(),
            max: max,
            min: min,
            dotStyle: dotStyle,
            activeDotStyle: activeDotStyle
          }
        }), handles, h(_Marks2['default'], markProps), this.$slots['default']]
      );
    }
  };
}
module.exports = exports['default'];