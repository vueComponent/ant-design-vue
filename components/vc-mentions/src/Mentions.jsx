import omit from 'omit.js';
import KeyCode from '../../_util/KeyCode';
import BaseMixin from '../../_util/BaseMixin';
import {
  getSlots,
  hasProp,
  getOptionProps,
  getListeners,
  initDefaultProps,
} from '../../_util/props-util';
import warning from 'warning';
import {
  getBeforeSelectionText,
  getLastMeasureIndex,
  replaceWithMeasure,
  setInputSelection,
} from './util';
import KeywordTrigger from './KeywordTrigger';
import { vcMentionsProps, defaultProps } from './mentionsProps';

function noop() {}

const Mentions = {
  name: 'Mentions',
  mixins: [BaseMixin],
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change',
  },
  props: initDefaultProps(vcMentionsProps, defaultProps),
  provide() {
    return {
      mentionsContext: this,
    };
  },
  data() {
    const { value = '', defaultValue = '' } = this.$props;
    warning(this.$props.children, 'please children prop replace slots.default');
    return {
      _value: !hasProp(this, 'value') ? defaultValue : value,
      measuring: false,
      measureLocation: 0,
      measureText: null,
      measurePrefix: '',
      activeIndex: 0,
      isFocus: false,
    };
  },
  watch: {
    value(val) {
      this.$data._value = val;
    },
  },
  updated() {
    this.$nextTick(() => {
      const { measuring } = this.$data;

      // Sync measure div top with textarea for rc-trigger usage
      if (measuring) {
        this.$refs.measure.scrollTop = this.$refs.textarea.scrollTop;
      }
    });
  },
  methods: {
    triggerChange(value) {
      const props = getOptionProps(this);
      if (!('value' in props)) {
        this.setState({ _value: value });
      } else {
        this.$forceUpdate();
      }
      this.$emit('change', value);
    },
    onChange({ target: { value, composing }, isComposing }) {
      if (isComposing || composing) return;
      this.triggerChange(value);
    },
    onKeyDown(event) {
      const { which } = event;
      const { activeIndex, measuring } = this.$data;
      // Skip if not measuring
      if (!measuring) {
        return;
      }

      if (which === KeyCode.UP || which === KeyCode.DOWN) {
        // Control arrow function
        const optionLen = this.getOptions().length;
        const offset = which === KeyCode.UP ? -1 : 1;
        const newActiveIndex = (activeIndex + offset + optionLen) % optionLen;
        this.setState({
          activeIndex: newActiveIndex,
        });
        event.preventDefault();
      } else if (which === KeyCode.ESC) {
        this.stopMeasure();
      } else if (which === KeyCode.ENTER) {
        // Measure hit
        event.preventDefault();
        const options = this.getOptions();
        if (!options.length) {
          this.stopMeasure();
          return;
        }
        const option = options[activeIndex];
        this.selectOption(option);
      }
    },
    /**
     * When to start measure:
     * 1. When user press `prefix`
     * 2. When measureText !== prevMeasureText
     *  - If measure hit
     *  - If measuring
     *
     * When to stop measure:
     * 1. Selection is out of range
     * 2. Contains `space`
     * 3. ESC or select one
     */
    onKeyUp(event) {
      const { key, which } = event;
      const { measureText: prevMeasureText, measuring } = this.$data;
      const { prefix = '', validateSearch } = this.$props;
      const target = event.target;
      const selectionStartText = getBeforeSelectionText(target);
      const { location: measureIndex, prefix: measurePrefix } = getLastMeasureIndex(
        selectionStartText,
        prefix,
      );

      // Skip if match the white key list
      if ([KeyCode.ESC, KeyCode.UP, KeyCode.DOWN, KeyCode.ENTER].indexOf(which) !== -1) {
        return;
      }

      if (measureIndex !== -1) {
        const measureText = selectionStartText.slice(measureIndex + measurePrefix.length);
        const validateMeasure = validateSearch(measureText, this.$props);
        const matchOption = !!this.getOptions(measureText).length;

        if (validateMeasure) {
          if (
            key === measurePrefix ||
            measuring ||
            (measureText !== prevMeasureText && matchOption)
          ) {
            this.startMeasure(measureText, measurePrefix, measureIndex);
          }
        } else if (measuring) {
          // Stop if measureText is invalidate
          this.stopMeasure();
        }

        /**
         * We will trigger `onSearch` to developer since they may use for async update.
         * If met `space` means user finished searching.
         */
        if (validateMeasure) {
          this.$emit('search', measureText, measurePrefix);
        }
      } else if (measuring) {
        this.stopMeasure();
      }
    },
    onInputFocus(event) {
      this.onFocus(event);
    },
    onInputBlur(event) {
      this.onBlur(event);
    },
    onDropdownFocus() {
      this.onFocus();
    },
    onDropdownBlur() {
      this.onBlur();
    },
    onFocus(event) {
      window.clearTimeout(this.focusId);
      const { isFocus } = this.$data;
      if (!isFocus && event) {
        this.$emit('focus', event);
      }
      this.setState({ isFocus: true });
    },
    onBlur(event) {
      this.focusId = window.setTimeout(() => {
        this.setState({ isFocus: false });
        this.stopMeasure();
        this.$emit('blur', event);
      }, 0);
    },
    selectOption(option) {
      const { _value: value, measureLocation, measurePrefix } = this.$data;
      const { split } = this.$props;
      const { value: mentionValue = '' } = option;
      const { text, selectionLocation } = replaceWithMeasure(value, {
        measureLocation,
        targetText: mentionValue,
        prefix: measurePrefix,
        selectionStart: this.$refs.textarea.selectionStart,
        split,
      });
      this.triggerChange(text);
      this.stopMeasure(() => {
        // We need restore the selection position
        setInputSelection(this.$refs.textarea, selectionLocation);
      });

      this.$emit('select', option, measurePrefix);
    },
    setActiveIndex(activeIndex) {
      this.setState({
        activeIndex,
      });
    },
    getOptions(measureText) {
      const targetMeasureText = measureText || this.$data.measureText || '';
      const { filterOption, children = [] } = this.$props;
      const list = (Array.isArray(children) ? children : [children])
        .map(item => {
          const children = getSlots(item).default;
          return { ...getOptionProps(item), children };
        })
        .filter(option => {
          /** Return all result if `filterOption` is false. */
          if (filterOption === false) {
            return true;
          }
          return filterOption(targetMeasureText, option);
        });
      return list;
    },
    startMeasure(measureText, measurePrefix, measureLocation) {
      this.setState({
        measuring: true,
        measureText,
        measurePrefix,
        measureLocation,
        activeIndex: 0,
      });
    },
    stopMeasure(callback) {
      this.setState(
        {
          measuring: false,
          measureLocation: 0,
          measureText: null,
        },
        callback,
      );
    },
    focus() {
      this.$refs.textarea.focus();
    },
    blur() {
      this.$refs.textarea.blur();
    },
  },

  render() {
    const { _value: value, measureLocation, measurePrefix, measuring } = this.$data;
    const {
      prefixCls,
      placement,
      transitionName,
      autoFocus,
      notFoundContent,
      getPopupContainer,
      ...restProps
    } = getOptionProps(this);

    const inputProps = omit(restProps, [
      'value',
      'defaultValue',
      'prefix',
      'split',
      'children',
      'validateSearch',
      'filterOption',
    ]);

    const options = measuring ? this.getOptions() : [];

    return (
      <div class={prefixCls}>
        <textarea
          ref="textarea"
          {...{
            directives: [{ name: 'ant-input' }],
            attrs: { ...inputProps, ...this.$attrs },
            domProps: {
              value,
            },
            on: {
              ...getListeners(this),
              select: noop,
              change: noop,
              input: this.onChange,
              keydown: this.onKeyDown,
              keyup: this.onKeyUp,
              blur: this.onInputBlur,
            },
          }}
        />
        {measuring && (
          <div ref="measure" class={`${prefixCls}-measure`}>
            {value.slice(0, measureLocation)}
            <KeywordTrigger
              prefixCls={prefixCls}
              transitionName={transitionName}
              placement={placement}
              options={options}
              visible
              getPopupContainer={getPopupContainer}
            >
              <span>{measurePrefix}</span>
            </KeywordTrigger>
            {value.slice(measureLocation + measurePrefix.length)}
          </div>
        )}
      </div>
    );
  },
};

export default Mentions;
