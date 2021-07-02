import type { ExtractPropTypes } from 'vue';
import {
  defineComponent,
  provide,
  withDirectives,
  onMounted,
  ref,
  reactive,
  onUpdated,
  nextTick,
  computed,
} from 'vue';
import classNames from '../../_util/classNames';
import omit from 'omit.js';
import KeyCode from '../../_util/KeyCode';
import { getOptionProps, initDefaultProps } from '../../_util/props-util';
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

export type MentionsProps = Partial<ExtractPropTypes<typeof vcMentionsProps>>;

function noop() {}

const Mentions = {
  name: 'Mentions',
  inheritAttrs: false,
  props: initDefaultProps(vcMentionsProps, defaultProps),
  setup(props: MentionsProps, { emit, attrs, expose }) {
    const measure = ref(null);
    const textarea = ref(null);
    const focusId = ref();
    const state = reactive({
      value: props.defaultValue || props.value || '',
      measuring: false,
      measureLocation: 0,
      measureText: null,
      measurePrefix: '',
      activeIndex: 0,
      isFocus: false,
    });

    const triggerChange = (val: string) => {
      state.value = val;
      emit('change', val);
    };

    const onChange = ({ target: { value, composing }, isComposing }) => {
      if (isComposing || composing) return;
      triggerChange(value);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const { which } = event;
      // Skip if not measuring
      if (!state.measuring) {
        return;
      }

      if (which === KeyCode.UP || which === KeyCode.DOWN) {
        // Control arrow function
        const optionLen = getOptions().length;
        const offset = which === KeyCode.UP ? -1 : 1;
        const newActiveIndex = (state.activeIndex + offset + optionLen) % optionLen;
        state.activeIndex = newActiveIndex;
        event.preventDefault();
      } else if (which === KeyCode.ESC) {
        stopMeasure();
      } else if (which === KeyCode.ENTER) {
        // Measure hit
        event.preventDefault();
        const options = getOptions();
        if (!options.length) {
          stopMeasure();
          return;
        }
        const option = options[state.activeIndex];
        selectOption(option);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const { key, which } = event;
      const { measureText: prevMeasureText, measuring } = state;
      const { prefix, validateSearch } = props;
      const target = event.target as HTMLTextAreaElement;
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
        const validateMeasure = validateSearch(measureText, props);
        const matchOption = !!getOptions(measureText).length;

        if (validateMeasure) {
          if (
            key === measurePrefix ||
            measuring ||
            (measureText !== prevMeasureText && matchOption)
          ) {
            startMeasure(measureText, measurePrefix, measureIndex);
          }
        } else if (measuring) {
          // Stop if measureText is invalidate
          stopMeasure();
        }

        /**
         * We will trigger `onSearch` to developer since they may use for async update.
         * If met `space` means user finished searching.
         */
        if (validateMeasure) {
          emit('search', measureText, measurePrefix);
        }
      } else if (measuring) {
        stopMeasure();
      }
    };
    const onInputFocus = (event: Event) => {
      onFocus(event);
    };
    const onInputBlur = (event: Event) => {
      onBlur(event);
    };
    const onFocus = (event: Event) => {
      window.clearTimeout(focusId.value);
      const { isFocus } = state;
      if (!isFocus && event) {
        emit('focus', event);
      }
      state.isFocus = true;
    };
    const onBlur = (event: Event) => {
      focusId.value = window.setTimeout(() => {
        state.isFocus = false;
        stopMeasure();
        emit('blur', event);
      }, 100);
    };
    const selectOption = option => {
      const { split } = props;
      const { value: mentionValue = '' } = option;
      const { text, selectionLocation } = replaceWithMeasure(state.value, {
        measureLocation: state.measureLocation,
        targetText: mentionValue,
        prefix: state.measurePrefix,
        selectionStart: textarea.value.selectionStart,
        split,
      });
      triggerChange(text);
      stopMeasure(() => {
        // We need restore the selection position
        setInputSelection(textarea.value, selectionLocation);
      });

      emit('select', option, state.measurePrefix);
    };
    const setActiveIndex = activeIndex => {
      state.activeIndex = activeIndex;
    };
    const getOptions = (measureText?: string) => {
      const targetMeasureText = measureText || state.measureText || '';
      const { filterOption, children = [] } = props;
      const list = (Array.isArray(children) ? children : [children])
        .map(item => {
          return { ...getOptionProps(item), children: item.children.default?.() };
        })
        .filter(option => {
          /** Return all result if `filterOption` is false. */
          if (!!filterOption === false) {
            return true;
          }
          return filterOption(targetMeasureText, option);
        });
      return list;
    };
    const startMeasure = (measureText, measurePrefix, measureLocation) => {
      state.measuring = true;
      state.measureText = measureText;
      state.measurePrefix = measurePrefix;
      state.measureLocation = measureLocation;
      state.activeIndex = 0;
    };
    const stopMeasure = (callback?: () => void) => {
      state.measuring = false;
      state.measureLocation = 0;
      state.measureText = null;
      callback?.();
    };
    const focus = () => {
      textarea.value.focus();
    };
    const blur = () => {
      textarea.value.blur();
    };
    expose({ blur, focus });
    onMounted(() => {
      warning(props.children, 'please children prop replace slots.default');

      provide('mentionsContext', {
        notFoundContent: computed(() => {
          return props.notFoundContent;
        }),
        activeIndex: computed(() => {
          return state.activeIndex;
        }),
        setActiveIndex,
        selectOption,
      });
    });
    onUpdated(() => {
      nextTick(() => {
        if (state.measuring) {
          measure.value.scrollTop = textarea.value.scrollTop;
        }
      });
    });
    return () => {
      const { measureLocation, measurePrefix, measuring } = state;
      const {
        prefixCls,
        placement,
        transitionName,
        notFoundContent,
        getPopupContainer,
        ...restProps
      } = props;

      const { class: className, style, ...otherAttrs } = attrs;

      const inputProps = omit(restProps, [
        'value',
        'defaultValue',
        'prefix',
        'split',
        'children',
        'validateSearch',
        'filterOption',
      ]);

      const options = measuring ? getOptions() : [];
      const textareaProps = {
        ...inputProps,
        ...otherAttrs,
        onChange: noop,
        onSelect: noop,
        value: state.value,
        onInput: onChange,
        onBlur: onInputBlur,
        onKeydown: onKeyDown,
        onKeyup: onKeyUp,
        onFocus: onInputFocus,
      };

      return (
        <div class={classNames(prefixCls, className)} style={style}>
          {withDirectives(<textarea ref={textarea} {...textareaProps} />, [[antInput]])}
          {measuring && (
            <div ref={measure} class={`${prefixCls}-measure`}>
              {state.value.slice(0, measureLocation)}
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
              {state.value.slice(measureLocation + measurePrefix.length)}
            </div>
          )}
        </div>
      );
    };
  },
};

export default defineComponent(Mentions);
