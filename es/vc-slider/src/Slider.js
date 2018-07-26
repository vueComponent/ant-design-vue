import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../../_util/vue-types';
import warning from '../../_util/warning';
import BaseMixin from '../../_util/BaseMixin';
import { hasProp } from '../../_util/props-util';
import Track from './common/Track';
import createSlider from './common/createSlider';
import * as utils from './utils';

var Slider = {
  name: 'Slider',
  mixins: [BaseMixin],
  props: {
    defaultValue: PropTypes.number,
    value: PropTypes.number,
    disabled: PropTypes.bool,
    autoFocus: PropTypes.bool,
    tabIndex: PropTypes.number
  },
  data: function data() {
    var defaultValue = this.defaultValue !== undefined ? this.defaultValue : this.min;
    var value = this.value !== undefined ? this.value : defaultValue;

    if (process.env.NODE_ENV !== 'production') {
      warning(!hasProp(this, 'minimumTrackStyle'), 'minimumTrackStyle will be deprecate, please use trackStyle instead.');
      warning(!hasProp(this, 'maximumTrackStyle'), 'maximumTrackStyle will be deprecate, please use railStyle instead.');
    }
    return {
      sValue: this.trimAlignValue(value),
      dragging: false
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      var autoFocus = _this.autoFocus,
          disabled = _this.disabled;

      if (autoFocus && !disabled) {
        _this.focus();
      }
    });
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
      var sValue = this.sValue,
          max = this.max;

      this.setChangeValue(sValue, val, max);
    },
    max: function max(val) {
      var sValue = this.sValue,
          min = this.min;

      this.setChangeValue(sValue, min, val);
    }
  },
  methods: {
    setChangeValue: function setChangeValue(value, min, max) {
      var minAmaxProps = {
        min: min,
        max: max
      };
      var newValue = value !== undefined ? value : this.sValue;
      var nextValue = this.trimAlignValue(newValue, minAmaxProps);
      if (nextValue === this.sValue) return;

      this.setState({ sValue: nextValue });
      if (utils.isValueOutOfRange(newValue, minAmaxProps)) {
        this.$emit('change', nextValue);
      }
    },
    onChange: function onChange(state) {
      var isNotControlled = !hasProp(this, 'value');
      if (isNotControlled) {
        this.setState(state);
      }

      var changedValue = state.sValue;
      this.$emit('change', changedValue);
    },
    onStart: function onStart(position) {
      this.setState({ dragging: true });
      var sValue = this.sValue;

      this.$emit('beforeChange', sValue);

      var value = this.calcValueByPos(position);

      this.startValue = value;
      this.startPosition = position;
      if (value === sValue) return;

      this.prevMovedHandleIndex = 0;

      this.onChange({ sValue: value });
    },
    onEnd: function onEnd() {
      this.setState({ dragging: false });
      this.removeDocumentEvents();
      this.$emit('afterChange', this.sValue);
    },
    onMove: function onMove(e, position) {
      utils.pauseEvent(e);
      var sValue = this.sValue;

      var value = this.calcValueByPos(position);
      if (value === sValue) return;

      this.onChange({ sValue: value });
    },
    onKeyboard: function onKeyboard(e) {
      var valueMutator = utils.getKeyboardValueMutator(e);

      if (valueMutator) {
        utils.pauseEvent(e);
        var sValue = this.sValue;

        var mutatedValue = valueMutator(sValue, this.$props);
        var value = this.trimAlignValue(mutatedValue);
        if (value === sValue) return;

        this.onChange({ sValue: value });
      }
    },
    getLowerBound: function getLowerBound() {
      return this.min;
    },
    getUpperBound: function getUpperBound() {
      return this.sValue;
    },
    trimAlignValue: function trimAlignValue(v) {
      var nextProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var mergedProps = _extends({}, this.$props, nextProps);
      var val = utils.ensureValueInRange(v, mergedProps);
      return utils.ensureValuePrecision(val, mergedProps);
    },
    getTrack: function getTrack(_ref) {
      var prefixCls = _ref.prefixCls,
          vertical = _ref.vertical,
          included = _ref.included,
          offset = _ref.offset,
          minimumTrackStyle = _ref.minimumTrackStyle,
          _trackStyle = _ref._trackStyle;
      var h = this.$createElement;

      return h(Track, {
        'class': prefixCls + '-track',
        attrs: { vertical: vertical,
          included: included,
          offset: 0,
          length: offset
        },
        style: _extends({}, minimumTrackStyle, _trackStyle)
      });
    },
    renderSlider: function renderSlider() {
      var prefixCls = this.prefixCls,
          vertical = this.vertical,
          included = this.included,
          disabled = this.disabled,
          minimumTrackStyle = this.minimumTrackStyle,
          trackStyle = this.trackStyle,
          handleStyle = this.handleStyle,
          tabIndex = this.tabIndex,
          min = this.min,
          max = this.max,
          handleGenerator = this.handle;
      var sValue = this.sValue,
          dragging = this.dragging;

      var offset = this.calcOffset(sValue);
      var handle = handleGenerator(this.$createElement, {
        prefixCls: prefixCls,
        vertical: vertical,
        offset: offset,
        value: sValue,
        dragging: dragging,
        disabled: disabled,
        min: min,
        max: max,
        index: 0,
        tabIndex: tabIndex,
        style: handleStyle[0] || handleStyle,
        ref: 'handleRefs_0',
        handleFocus: this.onFocus,
        handleBlur: this.onBlur
      });

      var _trackStyle = trackStyle[0] || trackStyle;
      return {
        tracks: this.getTrack({ prefixCls: prefixCls, vertical: vertical, included: included, offset: offset, minimumTrackStyle: minimumTrackStyle, _trackStyle: _trackStyle }),
        handles: handle
      };
    }
  }
};

export default createSlider(Slider);