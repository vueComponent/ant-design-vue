import type { CSSProperties, ExtractPropTypes } from 'vue';
import {
  toRef,
  watchEffect,
  defineComponent,
  provide,
  ref,
  reactive,
  onUpdated,
  nextTick,
  computed,
} from 'vue';
import classNames from '../../_util/classNames';
import KeyCode from '../../_util/KeyCode';
import { initDefaultProps } from '../../_util/props-util';
import {
  getBeforeSelectionText,
  getLastMeasureIndex,
  replaceWithMeasure,
  setInputSelection,
} from './util';
import KeywordTrigger from './KeywordTrigger';
import { vcMentionsProps, defaultProps } from './mentionsProps';
import type { OptionProps } from './Option';
import MentionsContextKey from './MentionsContext';
import omit from '../../_util/omit';
import type { EventHandler } from '../../_util/EventInterface';
import type { BaseInputExpose } from '../../_util/BaseInput';
import BaseInput from '../../_util/BaseInput';

export type MentionsProps = Partial<ExtractPropTypes<typeof vcMentionsProps>>;

function noop() {}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Mentions',
  inheritAttrs: false,
  props: initDefaultProps(vcMentionsProps, defaultProps),
  emits: ['change', 'select', 'search', 'focus', 'blur', 'pressenter'],
  setup(props, { emit, attrs, expose, slots }) {
    const measure = ref(null);
    const textarea = ref<BaseInputExpose>(null);
    const focusId = ref();
    const state = reactive({
      value: props.value || '',
      measuring: false,
      measureLocation: 0,
      measureText: null,
      measurePrefix: '',
      activeIndex: 0,
      isFocus: false,
    });

    watchEffect(() => {
      state.value = props.value;
    });

    const triggerChange = (val: string) => {
      emit('change', val);
    };

    const onChange: EventHandler = ({ target: { value } }) => {
      triggerChange(value);
    };

    const startMeasure = (measureText: string, measurePrefix: string, measureLocation: number) => {
      Object.assign(state, {
        measuring: true,
        measureText,
        measurePrefix,
        measureLocation,
        activeIndex: 0,
      });
    };
    const stopMeasure = (callback?: () => void) => {
      Object.assign(state, {
        measuring: false,
        measureLocation: 0,
        measureText: null,
      });
      callback?.();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const { which } = event;
      // Skip if not measuring
      if (!state.measuring) {
        return;
      }

      if (which === KeyCode.UP || which === KeyCode.DOWN) {
        // Control arrow function
        const optionLen = options.value.length;
        const offset = which === KeyCode.UP ? -1 : 1;
        const newActiveIndex = (state.activeIndex + offset + optionLen) % optionLen;
        state.activeIndex = newActiveIndex;
        event.preventDefault();
      } else if (which === KeyCode.ESC) {
        stopMeasure();
      } else if (which === KeyCode.ENTER) {
        // Measure hit
        event.preventDefault();
        if (!options.value.length) {
          stopMeasure();
          return;
        }
        const option = options.value[state.activeIndex];
        selectOption(option);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const { key, which } = event;
      const { measureText: prevMeasureText, measuring } = state;
      const { prefix, validateSearch } = props;
      const target = event.target as HTMLTextAreaElement;
      if ((target as any).composing) {
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
        const validateMeasure = validateSearch(measureText, props);
        const matchOption = !!getOptions(measureText).length;

        if (validateMeasure) {
          if (
            key === measurePrefix ||
            key === 'Shift' ||
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
    const onPressEnter = event => {
      if (!state.measuring) {
        emit('pressenter', event);
      }
    };

    const onInputFocus = (event: Event) => {
      onFocus(event);
    };
    const onInputBlur = (event: Event) => {
      onBlur(event);
    };
    const onFocus = (event: Event) => {
      clearTimeout(focusId.value);
      const { isFocus } = state;
      if (!isFocus && event) {
        emit('focus', event);
      }
      state.isFocus = true;
    };
    const onBlur = (event: Event) => {
      focusId.value = setTimeout(() => {
        state.isFocus = false;
        stopMeasure();
        emit('blur', event);
      }, 100);
    };
    const selectOption = (option: OptionProps) => {
      const { split } = props;
      const { value: mentionValue = '' } = option;
      const { text, selectionLocation } = replaceWithMeasure(state.value, {
        measureLocation: state.measureLocation,
        targetText: mentionValue,
        prefix: state.measurePrefix,
        selectionStart: textarea.value.getSelectionStart(),
        split,
      });
      triggerChange(text);
      stopMeasure(() => {
        // We need restore the selection position
        setInputSelection(textarea.value.input as HTMLTextAreaElement, selectionLocation);
      });

      emit('select', option, state.measurePrefix);
    };
    const setActiveIndex = (activeIndex: number) => {
      state.activeIndex = activeIndex;
    };

    const getOptions = (measureText?: string) => {
      const targetMeasureText = measureText || state.measureText || '';
      const { filterOption } = props;
      const list = props.options.filter((option: OptionProps) => {
        /** Return all result if `filterOption` is false. */
        if (!!filterOption === false) {
          return true;
        }
        return (filterOption as Function)(targetMeasureText, option);
      });
      return list;
    };
    const options = computed(() => {
      return getOptions();
    });

    const focus = () => {
      textarea.value.focus();
    };
    const blur = () => {
      textarea.value.blur();
    };
    expose({ blur, focus });
    provide(MentionsContextKey, {
      activeIndex: toRef(state, 'activeIndex'),
      setActiveIndex,
      selectOption,
      onFocus,
      onBlur,
      loading: toRef(props, 'loading'),
    });
    onUpdated(() => {
      nextTick(() => {
        if (state.measuring) {
          measure.value.scrollTop = textarea.value.getScrollTop();
        }
      });
    });
    return () => {
      const { measureLocation, measurePrefix, measuring } = state;
      const { prefixCls, placement, transitionName, getPopupContainer, direction, ...restProps } =
        props;

      const { class: className, style, ...otherAttrs } = attrs;

      const inputProps = omit(restProps, [
        'value',
        'prefix',
        'split',
        'validateSearch',
        'filterOption',
        'options',
        'loading',
      ]);

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
        onPressenter: onPressEnter,
      };
      return (
        <div class={classNames(prefixCls, className)} style={style as CSSProperties}>
          <BaseInput {...textareaProps} ref={textarea} tag="textarea"></BaseInput>
          {measuring && (
            <div ref={measure} class={`${prefixCls}-measure`}>
              {state.value.slice(0, measureLocation)}
              <KeywordTrigger
                prefixCls={prefixCls}
                transitionName={transitionName}
                dropdownClassName={props.dropdownClassName}
                placement={placement}
                options={measuring ? options.value : []}
                visible
                direction={direction}
                getPopupContainer={getPopupContainer}
                v-slots={{ notFoundContent: slots.notFoundContent, option: slots.option }}
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
});
