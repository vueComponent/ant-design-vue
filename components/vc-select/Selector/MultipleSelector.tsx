import TransBtn from '../TransBtn';
import { LabelValueType, RawValueType, CustomTagProps } from '../interface/generator';
import { RenderNode } from '../interface';
import { InnerSelectorProps } from '.';
import Input from './Input';
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  VNodeChild,
  watch,
  watchEffect,
  Ref,
} from 'vue';
import classNames from '../../_util/classNames';
import pickAttrs from '../../_util/pickAttrs';
import PropTypes from '../../_util/vue-types';
import { getTransitionGroupProps, TransitionGroup } from '../../_util/transition';

const REST_TAG_KEY = '__RC_SELECT_MAX_REST_COUNT__';

interface SelectorProps extends InnerSelectorProps {
  // Icon
  removeIcon?: RenderNode;

  // Tags
  maxTagCount?: number;
  maxTagTextLength?: number;
  maxTagPlaceholder?: VNodeChild;
  tokenSeparators?: string[];
  tagRender?: (props: CustomTagProps) => VNodeChild;

  // Motion
  choiceTransitionName?: string;

  // Event
  onSelect: (value: RawValueType, option: { selected: boolean }) => void;
}

const props = {
  id: PropTypes.string,
  prefixCls: PropTypes.string,
  values: PropTypes.array,
  open: PropTypes.looseBool,
  searchValue: PropTypes.string,
  inputRef: PropTypes.any,
  placeholder: PropTypes.any,
  disabled: PropTypes.looseBool,
  mode: PropTypes.string,
  showSearch: PropTypes.looseBool,
  autofocus: PropTypes.looseBool,
  autocomplete: PropTypes.string,
  accessibilityIndex: PropTypes.number,
  tabindex: PropTypes.number,

  removeIcon: PropTypes.VNodeChild,
  choiceTransitionName: PropTypes.string,

  maxTagCount: PropTypes.number,
  maxTagTextLength: PropTypes.number,
  maxTagPlaceholder: PropTypes.any.def(() => (omittedValues: LabelValueType[]) =>
    `+ ${omittedValues.length} ...`,
  ),
  tagRender: PropTypes.func,

  onSelect: PropTypes.func,
  onInputChange: PropTypes.func,
  onInputPaste: PropTypes.func,
  onInputKeyDown: PropTypes.func,
  onInputMouseDown: PropTypes.func,
  onInputCompositionStart: PropTypes.func,
  onInputCompositionEnd: PropTypes.func,
};

const SelectSelector = defineComponent<SelectorProps>({
  name: 'MultipleSelectSelector',
  setup(props) {
    let motionAppear = false; // not need use ref, because not need trigger watchEffect
    const measureRef = ref();
    const inputWidth = ref(0);

    // ===================== Motion ======================
    onMounted(() => {
      motionAppear = true;
    });

    // ===================== Search ======================
    const inputValue = computed(() =>
      props.open || props.mode === 'tags' ? props.searchValue : '',
    );
    const inputEditable: Ref<boolean> = computed(
      () => props.mode === 'tags' || ((props.open && props.showSearch) as boolean),
    );

    // We measure width and set to the input immediately
    onMounted(() => {
      watch(
        inputValue,
        () => {
          inputWidth.value = measureRef.value.scrollWidth;
        },
        { flush: 'post' },
      );
    });

    const selectionNode = ref();
    watchEffect(() => {
      const {
        values,
        prefixCls,
        removeIcon,
        choiceTransitionName,
        maxTagCount,
        maxTagTextLength,
        maxTagPlaceholder = (omittedValues: LabelValueType[]) => `+ ${omittedValues.length} ...`,
        tagRender,
        onSelect,
      } = props;
      // ==================== Selection ====================
      let displayValues: LabelValueType[] = values;

      // Cut by `maxTagCount`
      let restCount: number;
      if (typeof maxTagCount === 'number') {
        restCount = values.length - maxTagCount;
        displayValues = values.slice(0, maxTagCount);
      }

      // Update by `maxTagTextLength`
      if (typeof maxTagTextLength === 'number') {
        displayValues = displayValues.map(({ label, ...rest }) => {
          let displayLabel = label;

          if (typeof label === 'string' || typeof label === 'number') {
            const strLabel = String(displayLabel);

            if (strLabel.length > maxTagTextLength) {
              displayLabel = `${strLabel.slice(0, maxTagTextLength)}...`;
            }
          }

          return {
            ...rest,
            label: displayLabel,
          };
        });
      }

      // Fill rest
      if (restCount > 0) {
        displayValues.push({
          key: REST_TAG_KEY,
          label:
            typeof maxTagPlaceholder === 'function'
              ? maxTagPlaceholder(values.slice(maxTagCount))
              : maxTagPlaceholder,
        });
      }
      const transitionProps = getTransitionGroupProps(choiceTransitionName, {
        appear: motionAppear,
      });
      selectionNode.value = (
        <TransitionGroup {...transitionProps}>
          {...displayValues.map(
            ({ key, label, value, disabled: itemDisabled, class: className, style }) => {
              const mergedKey = key || value;
              const closable = key !== REST_TAG_KEY && !itemDisabled;
              const onMousedown = (event: MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();
              };
              const onClose = (event?: MouseEvent) => {
                if (event) event.stopPropagation();
                onSelect(value as RawValueType, { selected: false });
              };

              return typeof tagRender === 'function' ? (
                <span
                  key={mergedKey as string}
                  onMousedown={onMousedown}
                  class={classNames(className)}
                  style={style}
                >
                  {tagRender({
                    label,
                    value,
                    disabled: itemDisabled,
                    closable,
                    onClose,
                  } as CustomTagProps)}
                </span>
              ) : (
                <span
                  key={mergedKey as string}
                  class={classNames(className, `${prefixCls}-selection-item`, {
                    [`${prefixCls}-selection-item-disabled`]: itemDisabled,
                  })}
                  style={style}
                >
                  <span class={`${prefixCls}-selection-item-content`}>{label}</span>
                  {closable && (
                    <TransBtn
                      class={`${prefixCls}-selection-item-remove`}
                      onMousedown={onMousedown}
                      onClick={onClose}
                      customizeIcon={removeIcon}
                    >
                      ×
                    </TransBtn>
                  )}
                </span>
              );
            },
          )}
        </TransitionGroup>
      );
    });

    return () => {
      const {
        id,
        prefixCls,
        values,
        open,
        inputRef,
        placeholder,
        disabled,
        autofocus,
        autocomplete,
        accessibilityIndex,
        tabindex,
        onInputChange,
        onInputPaste,
        onInputKeyDown,
        onInputMouseDown,
        onInputCompositionStart,
        onInputCompositionEnd,
      } = props;
      return (
        <>
          {selectionNode.value}
          <span class={`${prefixCls}-selection-search`} style={{ width: inputWidth.value + 'px' }}>
            <Input
              inputRef={inputRef}
              open={open}
              prefixCls={prefixCls}
              id={id}
              inputElement={null}
              disabled={disabled}
              autofocus={autofocus}
              autocomplete={autocomplete}
              editable={inputEditable.value as boolean}
              accessibilityIndex={accessibilityIndex}
              value={inputValue.value}
              onKeydown={onInputKeyDown}
              onMousedown={onInputMouseDown}
              onChange={onInputChange}
              onPaste={onInputPaste}
              onCompositionstart={onInputCompositionStart}
              onCompositionend={onInputCompositionEnd}
              tabindex={tabindex}
              attrs={pickAttrs(props, true)}
            />

            {/* Measure Node */}
            <span ref={measureRef} class={`${prefixCls}-selection-search-mirror`} aria-hidden>
              {inputValue.value}&nbsp;
            </span>
          </span>

          {!values.length && !inputValue.value && (
            <span class={`${prefixCls}-selection-placeholder`}>{placeholder}</span>
          )}
        </>
      );
    };
  },
});
SelectSelector.inheritAttrs = false;
SelectSelector.props = props;
export default SelectSelector;
