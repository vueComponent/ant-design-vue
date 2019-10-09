import classNames from 'classnames';
import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import { initDefaultProps, hasProp } from '../../_util/props-util';
import Track from './common/Track';
import createSlider from './common/createSlider';
import * as utils from './utils';

const rangeProps = {
  defaultValue: PropTypes.arrayOf(PropTypes.number),
  value: PropTypes.arrayOf(PropTypes.number),
  count: PropTypes.number,
  pushable: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  allowCross: PropTypes.bool,
  disabled: PropTypes.bool,
  tabIndex: PropTypes.arrayOf(PropTypes.number),
  prefixCls: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
};
const Range = {
  name: 'Range',
  displayName: 'Range',
  mixins: [BaseMixin],
  props: initDefaultProps(rangeProps, {
    count: 1,
    allowCross: true,
    pushable: false,
    tabIndex: [],
  }),
  data() {
    const { count, min, max } = this;
    const initialValue = Array(...Array(count + 1)).map(() => min);
    const defaultValue = hasProp(this, 'defaultValue') ? this.defaultValue : initialValue;
    let { value } = this;
    if (value === undefined) {
      value = defaultValue;
    }
    const bounds = value.map((v, i) => this.trimAlignValue(v, i));
    const recent = bounds[0] === max ? 0 : bounds.length - 1;
    return {
      sHandle: null,
      recent,
      bounds,
    };
  },
  watch: {
    value: {
      handler(val) {
        const { min, max } = this;
        this.setChangeValue(val, min, max);
      },
      deep: true,
    },
    min(val) {
      const { bounds, max } = this;
      this.setChangeValue(bounds, val, max);
    },
    max(val) {
      const { bounds, min } = this;
      this.setChangeValue(bounds, min, val);
    },
  },
  methods: {
    setChangeValue(value, min, max) {
      const { bounds } = this;
      const newValue = value || bounds;
      const minAmaxProps = {
        min,
        max,
      };
      const nextBounds = newValue.map((v, i) => this.trimAlignValue(v, i, minAmaxProps));
      if (nextBounds.length === bounds.length && nextBounds.every((v, i) => v === bounds[i]))
        return;

      this.setState({ bounds: nextBounds });

      if (value.some(v => utils.isValueOutOfRange(v, minAmaxProps))) {
        const newValues = value.map(v => {
          return utils.ensureValueInRange(v, minAmaxProps);
        });
        this.$emit('change', newValues);
      }
    },
    onChange(state) {
      const isNotControlled = !hasProp(this, 'value');
      if (isNotControlled) {
        this.setState(state);
      } else if (state.sHandle !== undefined) {
        this.setState({ sHandle: state.sHandle });
      }

      const data = { ...this.$data, ...state };
      const changedValue = data.bounds;
      this.$emit('change', changedValue);
    },
    onStart(position) {
      const { bounds } = this;
      this.$emit('beforeChange', bounds);

      const value = this.calcValueByPos(position);
      this.startValue = value;
      this.startPosition = position;

      const closestBound = this.getClosestBound(value);
      this.prevMovedHandleIndex = this.getBoundNeedMoving(value, closestBound);

      this.setState({
        sHandle: this.prevMovedHandleIndex,
        recent: this.prevMovedHandleIndex,
      });

      const prevValue = bounds[this.prevMovedHandleIndex];
      if (value === prevValue) return;
      const nextBounds = [...bounds];
      nextBounds[this.prevMovedHandleIndex] = value;
      this.onChange({ bounds: nextBounds });
    },
    onEnd(force) {
      const { sHandle } = this;
      this.removeDocumentEvents();
      if (sHandle || force) {
        this.$emit('afterChange', this.bounds);
      }
      this.setState({ sHandle: null });
    },
    onMove(e, position) {
      utils.pauseEvent(e);
      const { bounds, sHandle } = this;
      const value = this.calcValueByPos(position);
      const oldValue = bounds[sHandle];
      if (value === oldValue) return;

      this.moveTo(value);
    },
    onKeyboard(e) {
      const valueMutator = utils.getKeyboardValueMutator(e);

      if (valueMutator) {
        utils.pauseEvent(e);
        const { bounds, sHandle } = this;
        const oldValue = bounds[sHandle === null ? this.recent : sHandle];
        const mutatedValue = valueMutator(oldValue, this.$props);
        const value = this.trimAlignValue(mutatedValue);
        if (value === oldValue) return;
        const isFromKeyboardEvent = true;
        this.moveTo(value, isFromKeyboardEvent);
      }
    },
    getClosestBound(value) {
      const { bounds } = this;
      let closestBound = 0;
      for (let i = 1; i < bounds.length - 1; ++i) {
        if (value > bounds[i]) {
          closestBound = i;
        }
      }
      if (Math.abs(bounds[closestBound + 1] - value) < Math.abs(bounds[closestBound] - value)) {
        closestBound += 1;
      }
      return closestBound;
    },
    getBoundNeedMoving(value, closestBound) {
      const { bounds, recent } = this;
      let boundNeedMoving = closestBound;
      const isAtTheSamePoint = bounds[closestBound + 1] === bounds[closestBound];

      if (isAtTheSamePoint && bounds[recent] === bounds[closestBound]) {
        boundNeedMoving = recent;
      }

      if (isAtTheSamePoint && value !== bounds[closestBound + 1]) {
        boundNeedMoving = value < bounds[closestBound + 1] ? closestBound : closestBound + 1;
      }
      return boundNeedMoving;
    },
    getLowerBound() {
      return this.bounds[0];
    },
    getUpperBound() {
      const { bounds } = this;
      return bounds[bounds.length - 1];
    },
    /**
     * Returns an array of possible slider points, taking into account both
     * `marks` and `step`. The result is cached.
     */
    getPoints() {
      const { marks, step, min, max } = this;
      const cache = this._getPointsCache;
      if (!cache || cache.marks !== marks || cache.step !== step) {
        const pointsObject = { ...marks };
        if (step !== null) {
          for (let point = min; point <= max; point += step) {
            pointsObject[point] = point;
          }
        }
        const points = Object.keys(pointsObject).map(parseFloat);
        points.sort((a, b) => a - b);
        this._getPointsCache = { marks, step, points };
      }
      return this._getPointsCache.points;
    },

    moveTo(value, isFromKeyboardEvent) {
      const nextBounds = [...this.bounds];
      const { sHandle, recent } = this;
      const handle = sHandle === null ? recent : sHandle;
      nextBounds[handle] = value;
      let nextHandle = handle;
      if (this.$props.pushable !== false) {
        this.pushSurroundingHandles(nextBounds, nextHandle);
      } else if (this.$props.allowCross) {
        nextBounds.sort((a, b) => a - b);
        nextHandle = nextBounds.indexOf(value);
      }
      this.onChange({
        sHandle: nextHandle,
        bounds: nextBounds,
      });
      if (isFromKeyboardEvent) {
        // known problem: because setState is async,
        // so trigger focus will invoke handler's onEnd and another handler's onStart too early,
        // cause onBeforeChange and onAfterChange receive wrong value.
        // here use setState callback to hack，but not elegant
        this.setState({}, () => {
          this.handlesRefs[nextHandle].focus();
        });
      }
    },

    pushSurroundingHandles(bounds, handle) {
      const value = bounds[handle];
      let { pushable: threshold } = this;
      threshold = Number(threshold);

      let direction = 0;
      if (bounds[handle + 1] - value < threshold) {
        direction = +1; // push to right
      }
      if (value - bounds[handle - 1] < threshold) {
        direction = -1; // push to left
      }

      if (direction === 0) {
        return;
      }

      const nextHandle = handle + direction;
      const diffToNext = direction * (bounds[nextHandle] - value);
      if (!this.pushHandle(bounds, nextHandle, direction, threshold - diffToNext)) {
        // revert to original value if pushing is impossible
        bounds[handle] = bounds[nextHandle] - direction * threshold;
      }
    },
    pushHandle(bounds, handle, direction, amount) {
      const originalValue = bounds[handle];
      let currentValue = bounds[handle];
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
    pushHandleOnePoint(bounds, handle, direction) {
      const points = this.getPoints();
      const pointIndex = points.indexOf(bounds[handle]);
      const nextPointIndex = pointIndex + direction;
      if (nextPointIndex >= points.length || nextPointIndex < 0) {
        // reached the minimum or maximum available point, can't push anymore
        return false;
      }
      const nextHandle = handle + direction;
      const nextValue = points[nextPointIndex];
      const { pushable: threshold } = this;
      const diffToNext = direction * (bounds[nextHandle] - nextValue);
      if (!this.pushHandle(bounds, nextHandle, direction, threshold - diffToNext)) {
        // couldn't push next handle, so we won't push this one either
        return false;
      }
      // push the handle
      bounds[handle] = nextValue;
      return true;
    },
    trimAlignValue(v, handle, nextProps = {}) {
      const mergedProps = { ...this.$props, ...nextProps };
      const valInRange = utils.ensureValueInRange(v, mergedProps);
      const valNotConflict = this.ensureValueNotConflict(handle, valInRange, mergedProps);
      return utils.ensureValuePrecision(valNotConflict, mergedProps);
    },
    ensureValueNotConflict(handle, val, { allowCross, pushable: thershold }) {
      const state = this.$data || {};
      const { bounds } = state;
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
    getTrack({ bounds, prefixCls, vertical, included, offsets, trackStyle }) {
      return bounds.slice(0, -1).map((_, index) => {
        const i = index + 1;
        const trackClassName = classNames({
          [`${prefixCls}-track`]: true,
          [`${prefixCls}-track-${i}`]: true,
        });
        return (
          <Track
            class={trackClassName}
            vertical={vertical}
            included={included}
            offset={offsets[i - 1]}
            length={offsets[i] - offsets[i - 1]}
            style={trackStyle[index]}
            key={i}
          />
        );
      });
    },
    renderSlider() {
      const {
        sHandle,
        bounds,
        prefixCls,
        vertical,
        included,
        disabled,
        min,
        max,
        handle,
        defaultHandle,
        trackStyle,
        handleStyle,
        tabIndex,
      } = this;
      const handleGenerator = handle || defaultHandle;
      const offsets = bounds.map(v => this.calcOffset(v));

      const handleClassName = `${prefixCls}-handle`;
      const handles = bounds.map((v, i) =>
        handleGenerator({
          className: classNames({
            [handleClassName]: true,
            [`${handleClassName}-${i + 1}`]: true,
          }),
          prefixCls,
          vertical,
          offset: offsets[i],
          value: v,
          dragging: sHandle === i,
          index: i,
          tabIndex: tabIndex[i] || 0,
          min,
          max,
          disabled,
          style: handleStyle[i],
          directives: [
            {
              name: 'ant-ref',
              value: h => this.saveHandle(i, h),
            },
          ],
          on: {
            focus: this.onFocus,
            blur: this.onBlur,
          },
        }),
      );

      return {
        tracks: this.getTrack({ bounds, prefixCls, vertical, included, offsets, trackStyle }),
        handles,
      };
    },
  },
};

export default createSlider(Range);
