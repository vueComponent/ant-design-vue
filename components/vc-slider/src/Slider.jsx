import PropTypes from '../../_util/vue-types';
import warning from '../../_util/warning';
import BaseMixin from '../../_util/BaseMixin';
import { hasProp } from '../../_util/props-util';
import Track from './common/Track';
import createSlider from './common/createSlider';
import * as utils from './utils';

const Slider = {
  name: 'Slider',
  mixins: [BaseMixin],
  props: {
    defaultValue: PropTypes.number,
    value: PropTypes.number,
    disabled: PropTypes.bool,
    autoFocus: PropTypes.bool,
    tabIndex: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
  },
  data() {
    const defaultValue = this.defaultValue !== undefined ? this.defaultValue : this.min;
    const value = this.value !== undefined ? this.value : defaultValue;

    if (utils.isDev()) {
      warning(
        !hasProp(this, 'minimumTrackStyle'),
        'minimumTrackStyle will be deprecate, please use trackStyle instead.',
      );
      warning(
        !hasProp(this, 'maximumTrackStyle'),
        'maximumTrackStyle will be deprecate, please use railStyle instead.',
      );
    }
    return {
      sValue: this.trimAlignValue(value),
      dragging: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      const { autoFocus, disabled } = this;
      if (autoFocus && !disabled) {
        this.focus();
      }
    });
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
      const { sValue, max } = this;
      this.setChangeValue(sValue, val, max);
    },
    max(val) {
      const { sValue, min } = this;
      this.setChangeValue(sValue, min, val);
    },
  },
  methods: {
    setChangeValue(value, min, max) {
      const minAmaxProps = {
        min,
        max,
      };
      const newValue = value !== undefined ? value : this.sValue;
      const nextValue = this.trimAlignValue(newValue, minAmaxProps);
      if (nextValue === this.sValue) return;

      this.setState({ sValue: nextValue });
      if (utils.isValueOutOfRange(newValue, minAmaxProps)) {
        this.$emit('change', nextValue);
      }
    },
    onChange(state) {
      const isNotControlled = !hasProp(this, 'value');
      if (isNotControlled) {
        this.setState(state);
      }

      const changedValue = state.sValue;
      this.$emit('change', changedValue);
    },
    onStart(position) {
      this.setState({ dragging: true });
      const { sValue } = this;
      this.$emit('beforeChange', sValue);

      const value = this.calcValueByPos(position);

      this.startValue = value;
      this.startPosition = position;
      if (value === sValue) return;

      this.prevMovedHandleIndex = 0;
      this.onChange({ sValue: value });
    },
    onEnd(force) {
      const { dragging } = this;
      this.removeDocumentEvents();
      if (dragging || force) {
        this.$emit('afterChange', this.sValue);
      }
      this.setState({ dragging: false });
    },
    onMove(e, position) {
      utils.pauseEvent(e);
      const { sValue } = this;
      const value = this.calcValueByPos(position);
      if (value === sValue) return;

      this.onChange({ sValue: value });
    },
    onKeyboard(e) {
      const valueMutator = utils.getKeyboardValueMutator(e);

      if (valueMutator) {
        utils.pauseEvent(e);
        const { sValue } = this;
        const mutatedValue = valueMutator(sValue, this.$props);
        const value = this.trimAlignValue(mutatedValue);
        if (value === sValue) return;

        this.onChange({ sValue: value });
      }
    },
    getLowerBound() {
      return this.min;
    },
    getUpperBound() {
      return this.sValue;
    },
    trimAlignValue(v, nextProps = {}) {
      if (v === null) {
        return null;
      }
      const mergedProps = { ...this.$props, ...nextProps };
      const val = utils.ensureValueInRange(v, mergedProps);
      return utils.ensureValuePrecision(val, mergedProps);
    },
    getTrack({ prefixCls, vertical, included, offset, minimumTrackStyle, _trackStyle }) {
      return (
        <Track
          class={`${prefixCls}-track`}
          vertical={vertical}
          included={included}
          offset={0}
          length={offset}
          style={{
            ...minimumTrackStyle,
            ..._trackStyle,
          }}
        />
      );
    },
    renderSlider() {
      const {
        prefixCls,
        vertical,
        included,
        disabled,
        minimumTrackStyle,
        trackStyle,
        handleStyle,
        tabIndex,
        min,
        max,
        handle,
        defaultHandle,
      } = this;
      const handleGenerator = handle || defaultHandle;
      const { sValue, dragging } = this;
      const offset = this.calcOffset(sValue);
      const handles = handleGenerator({
        className: `${prefixCls}-handle`,
        prefixCls,
        vertical,
        offset,
        value: sValue,
        dragging,
        disabled,
        min,
        max,
        index: 0,
        tabIndex,
        style: handleStyle[0] || handleStyle,
        directives: [
          {
            name: 'ant-ref',
            value: h => this.saveHandle(0, h),
          },
        ],
        on: {
          focus: this.onFocus,
          blur: this.onBlur,
        },
      });

      const _trackStyle = trackStyle[0] || trackStyle;
      return {
        tracks: this.getTrack({
          prefixCls,
          vertical,
          included,
          offset,
          minimumTrackStyle,
          _trackStyle,
        }),
        handles,
      };
    },
  },
};

export default createSlider(Slider);
