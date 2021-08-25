import { defineComponent, provide, withDirectives } from 'vue';
import classNames from '../../_util/classNames';
import omit from 'omit.js';
import KeyCode from '../../_util/KeyCode';
import BaseMixin from '../../_util/BaseMixin';
import { hasProp, getOptionProps, initDefaultProps } from '../../_util/props-util';
import warning from 'warning';
import {
  getBeforeSelectionText,
  getLastMeasureIndex,
  replaceWithMeasure,
  setInputSelection,
} from './util';
import KeywordTrigger from './KeywordTrigger';
import { vcMentionsProps, defaultProps } from './mentionsProps';
import antInput from '../../_util/antInputDirective';

function noop() {}

const Mentions = {
  name: 'Mentions',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: initDefaultProps(vcMentionsProps, defaultProps),
  created() {
    this.mentionsContext = provide('mentionsContext', this);
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
      this.__emit('change', value);
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
      if (target.composing) {
        return;
      }
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
          this.__emit('search', measureText, measurePrefix);
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
        this.__emit('focus', event);
      }
      this.setState({ isFocus: true });
    },
    onBlur(event) {
      this.focusId = window.setTimeout(() => {
        this.setState({ isFocus: false });
        this.stopMeasure();
        this.__emit('blur', event);
      }, 100);
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

      this.__emit('select', option, measurePrefix);
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
          return { ...getOptionProps(item), children: item.children.default?.() };
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
      notFoundContent,
      getPopupContainer,
      ...restProps
    } = getOptionProps(this);

    const { class: className, style, ...otherAttrs } = this.$attrs;

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
    const textareaProps = {
      ...inputProps,
      ...otherAttrs,
      onChange: noop,
      onSelect: noop,
      value,
      onInput: this.onChange,
      onBlur: this.onInputBlur,
      onKeydown: this.onKeyDown,
      onKeyup: this.onKeyUp,
      onFocus: this.onInputFocus,
    };
    return (
      <div class={classNames(prefixCls, className)} style={style}>
        {withDirectives(<textarea ref="textarea" {...textareaProps} />, [[antInput]])}
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

export default defineComponent(Mentions);
