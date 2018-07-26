'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../../_util/props-util');

var _Track = require('./common/Track');

var _Track2 = _interopRequireDefault(_Track);

var _createSlider = require('./common/createSlider');

var _createSlider2 = _interopRequireDefault(_createSlider);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var rangeProps = {
  defaultValue: _vueTypes2['default'].arrayOf(_vueTypes2['default'].number),
  value: _vueTypes2['default'].arrayOf(_vueTypes2['default'].number),
  count: _vueTypes2['default'].number,
  pushable: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].number]),
  allowCross: _vueTypes2['default'].bool,
  disabled: _vueTypes2['default'].bool,
  tabIndex: _vueTypes2['default'].arrayOf(_vueTypes2['default'].number)
};
var Range = {
  name: 'Range',
  displayName: 'Range',
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)(rangeProps, {
    count: 1,
    allowCross: true,
    pushable: false,
    tabIndex: []
  }),
  data: function data() {
    var _this = this;

    var count = this.count,
        min = this.min,
        max = this.max;

    var initialValue = Array.apply(null, Array(count + 1)).map(function () {
      return min;
    });
    var defaultValue = (0, _propsUtil.hasProp)(this, 'defaultValue') ? this.defaultValue : initialValue;
    var value = this.value;

    if (value === undefined) {
      value = defaultValue;
    }
    var bounds = value.map(function (v, i) {
      return _this.trimAlignValue(v, i);
    });
    var recent = bounds[0] === max ? 0 : bounds.length - 1;
    return {
      sHandle: null,
      recent: recent,
      bounds: bounds
    };
  },

  watch: {
    value: {
      handler: function handler(val) {
        var min = this.min,
            max = this.max;

        this.setChangeValue(val, min, max);
      },

      deep: true
    },
    min: function min(val) {
      var bounds = this.bounds,
          max = this.max;

      this.setChangeValue(bounds, val, max);
    },
    max: function max(val) {
      var bounds = this.bounds,
          min = this.min;

      this.setChangeValue(bounds, min, val);
    }
  },
  methods: {
    setChangeValue: function setChangeValue(value, min, max) {
      var _this2 = this;

      var bounds = this.bounds;

      var newValue = value || bounds;
      var minAmaxProps = {
        min: min,
        max: max
      };
      var nextBounds = newValue.map(function (v, i) {
        return _this2.trimAlignValue(v, i, minAmaxProps);
      });
      if (nextBounds.length === bounds.length && nextBounds.every(function (v, i) {
        return v === bounds[i];
      })) return;

      this.setState({ bounds: nextBounds });

      if (bounds.some(function (v) {
        return utils.isValueOutOfRange(v, minAmaxProps);
      })) {
        var newValues = newValue.map(function (v) {
          return utils.ensureValueInRange(v, minAmaxProps);
        });
        this.$emit('change', newValues);
      }
    },
    onChange: function onChange(state) {
      var isNotControlled = !(0, _propsUtil.hasProp)(this, 'value');
      if (isNotControlled) {
        this.setState(state);
      } else if (state.sHandle !== undefined) {
        this.setState({ sHandle: state.sHandle });
      }

      var data = (0, _extends3['default'])({}, this.$data, state);
      var changedValue = data.bounds;
      this.$emit('change', changedValue);
    },
    onStart: function onStart(position) {
      var bounds = this.bounds;

      this.$emit('beforeChange', bounds);

      var value = this.calcValueByPos(position);
      this.startValue = value;
      this.startPosition = position;

      var closestBound = this.getClosestBound(value);
      this.prevMovedHandleIndex = this.getBoundNeedMoving(value, closestBound);

      this.setState({
        sHandle: this.prevMovedHandleIndex,
        recent: this.prevMovedHandleIndex
      });

      var prevValue = bounds[this.prevMovedHandleIndex];
      if (value === prevValue) return;
      var nextBounds = [].concat((0, _toConsumableArray3['default'])(bounds));
      nextBounds[this.prevMovedHandleIndex] = value;
      this.onChange({ bounds: nextBounds });
    },
    onEnd: function onEnd() {
      this.setState({ sHandle: null });
      this.removeDocumentEvents();
      this.$emit('afterChange', this.bounds);
    },
    onMove: function onMove(e, position) {
      utils.pauseEvent(e);
      var bounds = this.bounds,
          sHandle = this.sHandle;

      var value = this.calcValueByPos(position);
      var oldValue = bounds[sHandle];
      if (value === oldValue) return;

      this.moveTo(value);
    },
    onKeyboard: function onKeyboard(e) {
      var valueMutator = utils.getKeyboardValueMutator(e);

      if (valueMutator) {
        utils.pauseEvent(e);
        var bounds = this.bounds,
            sHandle = this.sHandle;

        var oldValue = bounds[sHandle];
        var mutatedValue = valueMutator(oldValue, this.$props);
        var value = this.trimAlignValue(mutatedValue);
        if (value === oldValue) return;
        var isFromKeyboardEvent = true;
        this.moveTo(value, isFromKeyboardEvent);
      }
    },
    getClosestBound: function getClosestBound(value) {
      var bounds = this.bounds;

      var closestBound = 0;
      for (var i = 1; i < bounds.length - 1; ++i) {
        if (value > bounds[i]) {
          closestBound = i;
        }
      }
      if (Math.abs(bounds[closestBound + 1] - value) < Math.abs(bounds[closestBound] - value)) {
        closestBound = closestBound + 1;
      }
      return closestBound;
    },
    getBoundNeedMoving: function getBoundNeedMoving(value, closestBound) {
      var bounds = this.bounds,
          recent = this.recent;

      var boundNeedMoving = closestBound;
      var isAtTheSamePoint = bounds[closestBound + 1] === bounds[closestBound];

      if (isAtTheSamePoint && bounds[recent] === bounds[closestBound]) {
        boundNeedMoving = recent;
      }

      if (isAtTheSamePoint && value !== bounds[closestBound + 1]) {
        boundNeedMoving = value < bounds[closestBound + 1] ? closestBound : closestBound + 1;
      }
      return boundNeedMoving;
    },
    getLowerBound: function getLowerBound() {
      return this.bounds[0];
    },
    getUpperBound: function getUpperBound() {
      var bounds = this.bounds;

      return bounds[bounds.length - 1];
    },

    /**
     * Returns an array of possible slider points, taking into account both
     * `marks` and `step`. The result is cached.
     */
    getPoints: function getPoints() {
      var marks = this.marks,
          step = this.step,
          min = this.min,
          max = this.max;

      var cache = this._getPointsCache;
      if (!cache || cache.marks !== marks || cache.step !== step) {
        var pointsObject = (0, _extends3['default'])({}, marks);
        if (step !== null) {
          for (var point = min; point <= max; point += step) {
            pointsObject[point] = point;
          }
        }
        var points = Object.keys(pointsObject).map(parseFloat);
        points.sort(function (a, b) {
          return a - b;
        });
        this._getPointsCache = { marks: marks, step: step, points: points };
      }
      return this._getPointsCache.points;
    },
    moveTo: function moveTo(value, isFromKeyboardEvent) {
      var _this3 = this;

      var bounds = this.bounds,
          sHandle = this.sHandle;

      var nextBounds = [].concat((0, _toConsumableArray3['default'])(bounds));
      nextBounds[sHandle] = value;
      var nextHandle = sHandle;
      if (this.pushable !== false) {
        this.pushSurroundingHandles(nextBounds, nextHandle);
      } else if (this.allowCross) {
        nextBounds.sort(function (a, b) {
          return a - b;
        });
        nextHandle = nextBounds.indexOf(value);
      }
      this.onChange({
        sHandle: nextHandle,
        bounds: nextBounds
      });
      if (isFromKeyboardEvent) {
        // known problem: because setState is async,
        // so trigger focus will invoke handler's onEnd and another handler's onStart too early,
        // cause onBeforeChange and onAfterChange receive wrong value.
        // here use setState callback to hack，but not elegant
        this.setState({}, function () {
          _this3.handlesRefs[nextHandle].focus();
        });
      }
    },
    pushSurroundingHandles: function pushSurroundingHandles(bounds, handle) {
      var value = bounds[handle];
      var threshold = this.pushable;

      threshold = Number(threshold);

      var direction = 0;
      if (bounds[handle + 1] - value < threshold) {
        direction = +1; // push to right
      }
      if (value - bounds[handle - 1] < threshold) {
        direction = -1; // push to left
      }

      if (direction === 0) {
        return;
      }

      var nextHandle = handle + direction;
      var diffToNext = direction * (bounds[nextHandle] - value);
      if (!this.pushHandle(bounds, nextHandle, direction, threshold - diffToNext)) {
        // revert to original value if pushing is impossible
        bounds[handle] = bounds[nextHandle] - direction * threshold;
      }
    },
    pushHandle: function pushHandle(bounds, handle, direction, amount) {
      var originalValue = bounds[handle];
      var currentValue = bounds[handle];
      while (direction * (currentValue - originalValue) < amount) {
        if (!this.pushHandleOnePoint(bounds, handle, direction)) {
          // can't push handle enough to create the needed `amount` gap, so we
          // revert its position to the original value
          bounds[handle] = originalValue;
          return false;
        }
        currentValue = bounds[handle];
      }
      // the handle was pushed enough to create the needed `amount` gap
      return true;
    },
    pushHandleOnePoint: function pushHandleOnePoint(bounds, handle, direction) {
      var points = this.getPoints();
      var pointIndex = points.indexOf(bounds[handle]);
      var nextPointIndex = pointIndex + direction;
      if (nextPointIndex >= points.length || nextPointIndex < 0) {
        // reached the minimum or maximum available point, can't push anymore
        return false;
      }
      var nextHandle = handle + direction;
      var nextValue = points[nextPointIndex];
      var threshold = this.pushable;

      var diffToNext = direction * (bounds[nextHandle] - nextValue);
      if (!this.pushHandle(bounds, nextHandle, direction, threshold - diffToNext)) {
        // couldn't push next handle, so we won't push this one either
        return false;
      }
      // push the handle
      bounds[handle] = nextValue;
      return true;
    },
    trimAlignValue: function trimAlignValue(v, handle) {
      var nextProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var mergedProps = (0, _extends3['default'])({}, this.$props, nextProps);
      var valInRange = utils.ensureValueInRange(v, mergedProps);
      var valNotConflict = this.ensureValueNotConflict(handle, valInRange, mergedProps);
      return utils.ensureValuePrecision(valNotConflict, mergedProps);
    },
    ensureValueNotConflict: function ensureValueNotConflict(handle, val, _ref) {
      var allowCross = _ref.allowCross,
          thershold = _ref.pushable;

      var state = this.$data || {};
      var bounds = state.bounds;

      handle = handle === undefined ? state.sHandle : handle;
      thershold = Number(thershold);
      /* eslint-disable eqeqeq */
      if (!allowCross && handle != null && bounds !== undefined) {
        if (handle > 0 && val <= bounds[handle - 1] + thershold) {
          return bounds[handle - 1] + thershold;
        }
        if (handle < bounds.length - 1 && val >= bounds[handle + 1] - thershold) {
          return bounds[handle + 1] - thershold;
        }
      }
      /* eslint-enable eqeqeq */
      return val;
    },
    getTrack: function getTrack(_ref2) {
      var bounds = _ref2.bounds,
          prefixCls = _ref2.prefixCls,
          vertical = _ref2.vertical,
          included = _ref2.included,
          offsets = _ref2.offsets,
          trackStyle = _ref2.trackStyle;
      var h = this.$createElement;

      return bounds.slice(0, -1).map(function (_, index) {
        var _classNames;

        var i = index + 1;
        var trackClassName = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-track', true), (0, _defineProperty3['default'])(_classNames, prefixCls + '-track-' + i, true), _classNames));
        return h(_Track2['default'], {
          'class': trackClassName,
          attrs: { vertical: vertical,
            included: included,
            offset: offsets[i - 1],
            length: offsets[i] - offsets[i - 1]
          },
          style: trackStyle[index],
          key: i
        });
      });
    },
    renderSlider: function renderSlider() {
      var _this4 = this;

      var sHandle = this.sHandle,
          bounds = this.bounds,
          prefixCls = this.prefixCls,
          vertical = this.vertical,
          included = this.included,
          disabled = this.disabled,
          min = this.min,
          max = this.max,
          handleGenerator = this.handle,
          trackStyle = this.trackStyle,
          handleStyle = this.handleStyle,
          tabIndex = this.tabIndex,
          $createElement = this.$createElement;


      var offsets = bounds.map(function (v) {
        return _this4.calcOffset(v);
      });

      var handleClassName = prefixCls + '-handle';
      var handles = bounds.map(function (v, i) {
        var _classNames2;

        return handleGenerator($createElement, {
          className: (0, _classnames2['default'])((_classNames2 = {}, (0, _defineProperty3['default'])(_classNames2, handleClassName, true), (0, _defineProperty3['default'])(_classNames2, handleClassName + '-' + (i + 1), true), _classNames2)),
          prefixCls: prefixCls,
          vertical: vertical,
          offset: offsets[i],
          value: v,
          dragging: sHandle === i,
          index: i,
          tabIndex: tabIndex[i] || 0,
          min: min,
          max: max,
          disabled: disabled,
          style: handleStyle[i],
          ref: 'handleRefs_' + i,
          handleFocus: _this4.onFocus,
          handleBlur: _this4.onBlur
        });
      });

      return {
        tracks: this.getTrack({ bounds: bounds, prefixCls: prefixCls, vertical: vertical, included: included, offsets: offsets, trackStyle: trackStyle }),
        handles: handles
      };
    }
  }
};

exports['default'] = (0, _createSlider2['default'])(Range);
module.exports = exports['default'];