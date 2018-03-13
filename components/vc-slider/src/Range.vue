/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import shallowEqual from 'shallowequal';
import Track from './common/Track';
import createSlider from './common/createSlider';
import * as utils from './utils';

class Range extends React.Component {
  static displayName = 'Range';
  static propTypes = {
    defaultValue: PropTypes.arrayOf(PropTypes.number),
    value: PropTypes.arrayOf(PropTypes.number),
    count: PropTypes.number,
    pushable: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
    ]),
    allowCross: PropTypes.bool,
    disabled: PropTypes.bool,
    tabIndex: PropTypes.arrayOf(PropTypes.number),
  };

  static defaultProps = {
    count: 1,
    allowCross: true,
    pushable: false,
    tabIndex: [],
  };

  constructor(props) {
    super(props);

    const { count, min, max } = props;
    const initialValue = Array.apply(null, Array(count + 1))
            .map(() => min);
    const defaultValue = 'defaultValue' in props ?
            props.defaultValue : initialValue;
    const value = props.value !== undefined ?
            props.value : defaultValue;
    const bounds = value.map((v, i) => this.trimAlignValue(v, i));
    const recent = bounds[0] === max ? 0 : bounds.length - 1;

    this.state = {
      handle: null,
      recent,
      bounds,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!('value' in nextProps || 'min' in nextProps || 'max' in nextProps)) return;
    if (this.props.min === nextProps.min &&
        this.props.max === nextProps.max &&
        shallowEqual(this.props.value, nextProps.value)) {
      return;
    }

    const { bounds } = this.state;
    const value = nextProps.value || bounds;
    const nextBounds = value.map((v, i) => this.trimAlignValue(v, i, nextProps));
    if (nextBounds.length === bounds.length && nextBounds.every((v, i) => v === bounds[i])) return;

    this.setState({ bounds: nextBounds });

    if (bounds.some(v => utils.isValueOutOfRange(v, nextProps))) {
      const newValues = value.map((v) => {
        return utils.ensureValueInRange(v, nextProps);
      });
      this.props.onChange(newValues);
    }
  }

  onChange(state) {
    const props = this.props;
    const isNotControlled = !('value' in props);
    if (isNotControlled) {
      this.setState(state);
    } else if (state.handle !== undefined) {
      this.setState({ handle: state.handle });
    }

    const data = { ...this.state, ...state };
    const changedValue = data.bounds;
    props.onChange(changedValue);
  }

  onStart(position) {
    const props = this.props;
    const state = this.state;
    const bounds = this.getValue();
    props.onBeforeChange(bounds);

    const value = this.calcValueByPos(position);
    this.startValue = value;
    this.startPosition = position;

    const closestBound = this.getClosestBound(value);
    this.prevMovedHandleIndex = this.getBoundNeedMoving(value, closestBound);

    this.setState({
      handle: this.prevMovedHandleIndex,
      recent: this.prevMovedHandleIndex,
    });

    const prevValue = bounds[this.prevMovedHandleIndex];
    if (value === prevValue) return;

    const nextBounds = [...state.bounds];
    nextBounds[this.prevMovedHandleIndex] = value;
    this.onChange({ bounds: nextBounds });
  }

  onEnd = () => {
    this.removeDocumentEvents();
    this.props.onAfterChange(this.getValue());
  }

  onMove(e, position) {
    utils.pauseEvent(e);
    const state = this.state;

    const value = this.calcValueByPos(position);
    const oldValue = state.bounds[state.handle];
    if (value === oldValue) return;

    this.moveTo(value);
  }

  onKeyboard(e) {
    const valueMutator = utils.getKeyboardValueMutator(e);

    if (valueMutator) {
      utils.pauseEvent(e);
      const { state, props } = this;
      const { bounds, handle } = state;
      const oldValue = bounds[handle];
      const mutatedValue = valueMutator(oldValue, props);
      const value = this.trimAlignValue(mutatedValue);
      if (value === oldValue) return;
      const isFromKeyboardEvent = true;
      this.moveTo(value, isFromKeyboardEvent);
    }
  }

  getValue() {
    return this.state.bounds;
  }

  getClosestBound(value) {
    const { bounds } = this.state;
    let closestBound = 0;
    for (let i = 1; i < bounds.length - 1; ++i) {
      if (value > bounds[i]) { closestBound = i; }
    }
    if (Math.abs(bounds[closestBound + 1] - value) < Math.abs(bounds[closestBound] - value)) {
      closestBound = closestBound + 1;
    }
    return closestBound;
  }

  getBoundNeedMoving(value, closestBound) {
    const { bounds, recent } = this.state;
    let boundNeedMoving = closestBound;
    const isAtTheSamePoint = (bounds[closestBound + 1] === bounds[closestBound]);

    if (isAtTheSamePoint && bounds[recent] === bounds[closestBound]) {
      boundNeedMoving = recent;
    }

    if (isAtTheSamePoint && (value !== bounds[closestBound + 1])) {
      boundNeedMoving = value < bounds[closestBound + 1] ? closestBound : closestBound + 1;
    }
    return boundNeedMoving;
  }

  getLowerBound() {
    return this.state.bounds[0];
  }

  getUpperBound() {
    const { bounds } = this.state;
    return bounds[bounds.length - 1];
  }

  /**
   * Returns an array of possible slider points, taking into account both
   * `marks` and `step`. The result is cached.
   */
  getPoints() {
    const { marks, step, min, max } = this.props;
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
  }

  moveTo(value, isFromKeyboardEvent) {
    const { state, props } = this;
    const nextBounds = [...state.bounds];
    nextBounds[state.handle] = value;
    let nextHandle = state.handle;
    if (props.pushable !== false) {
      this.pushSurroundingHandles(nextBounds, nextHandle);
    } else if (props.allowCross) {
      nextBounds.sort((a, b) => a - b);
      nextHandle = nextBounds.indexOf(value);
    }
    this.onChange({
      handle: nextHandle,
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
  }

  pushSurroundingHandles(bounds, handle) {
    const value = bounds[handle];
    let { pushable: threshold } = this.props;
    threshold = Number(threshold);

    let direction = 0;
    if (bounds[handle + 1] - value < threshold) {
      direction = +1; // push to right
    }
    if (value - bounds[handle - 1] < threshold) {
      direction = -1; // push to left
    }

    if (direction === 0) { return; }

    const nextHandle = handle + direction;
    const diffToNext = direction * (bounds[nextHandle] - value);
    if (!this.pushHandle(bounds, nextHandle, direction, threshold - diffToNext)) {
      // revert to original value if pushing is impossible
      bounds[handle] = bounds[nextHandle] - (direction * threshold);
    }
  }

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
  }

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
    const { pushable: threshold } = this.props;
    const diffToNext = direction * (bounds[nextHandle] - nextValue);
    if (!this.pushHandle(bounds, nextHandle, direction, threshold - diffToNext)) {
      // couldn't push next handle, so we won't push this one either
      return false;
    }
    // push the handle
    bounds[handle] = nextValue;
    return true;
  }

  trimAlignValue(v, handle, nextProps = {}) {
    const mergedProps = { ...this.props, ...nextProps };
    const valInRange = utils.ensureValueInRange(v, mergedProps);
    const valNotConflict = this.ensureValueNotConflict(handle, valInRange, mergedProps);
    return utils.ensureValuePrecision(valNotConflict, mergedProps);
  }

  ensureValueNotConflict(handle, val, { allowCross, pushable: thershold }) {
    const state = this.state || {};
    const { bounds } = state;
    handle = handle === undefined ? state.handle : handle;
    thershold = Number(thershold);
    /* eslint-disable eqeqeq */
    if (!allowCross && handle != null && bounds !== undefined) {
      if (handle > 0 && val <= (bounds[handle - 1] + thershold)) {
        return bounds[handle - 1] + thershold;
      }
      if (handle < bounds.length - 1 && val >= (bounds[handle + 1] - thershold)) {
        return bounds[handle + 1] - thershold;
      }
    }
    /* eslint-enable eqeqeq */
    return val;
  }

  render() {
    const {
      handle,
      bounds,
    } = this.state;
    const {
      prefixCls,
      vertical,
      included,
      disabled,
      min,
      max,
      handle: handleGenerator,
      trackStyle,
      handleStyle,
      tabIndex,
    } = this.props;

    const offsets = bounds.map(v => this.calcOffset(v));

    const handleClassName = `${prefixCls}-handle`;
    const handles = bounds.map((v, i) => handleGenerator({
      className: classNames({
        [handleClassName]: true,
        [`${handleClassName}-${i + 1}`]: true,
      }),
      prefixCls,
      vertical,
      offset: offsets[i],
      value: v,
      dragging: handle === i,
      index: i,
      tabIndex: tabIndex[i] || 0,
      min,
      max,
      disabled,
      style: handleStyle[i],
      ref: h => this.saveHandle(i, h),
    }));

    const tracks = bounds.slice(0, -1).map((_, index) => {
      const i = index + 1;
      const trackClassName = classNames({
        [`${prefixCls}-track`]: true,
        [`${prefixCls}-track-${i}`]: true,
      });
      return (
        <Track
          className={trackClassName}
          vertical={vertical}
          included={included}
          offset={offsets[i - 1]}
          length={offsets[i] - offsets[i - 1]}
          style={trackStyle[index]}
          key={i}
        />
      );
    });

    return { tracks, handles };
  }
}

export default createSlider(Range);
