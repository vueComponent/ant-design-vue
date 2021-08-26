import TransBtn from '../TransBtn';
import type {
  LabelValueType,
  RawValueType,
  CustomTagProps,
  DefaultValueType,
  DisplayLabelValueType,
} from '../interface/generator';
import type { RenderNode } from '../interface';
import type { InnerSelectorProps } from './interface';
import Input from './Input';
import type { VNodeChild, Ref, PropType } from 'vue';
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import classNames from '../../_util/classNames';
import pickAttrs from '../../_util/pickAttrs';
import PropTypes from '../../_util/vue-types';
import type { VueNode } from '../../_util/type';
import Overflow from '../../vc-overflow';

type SelectorProps = InnerSelectorProps & {
  // Icon
  removeIcon?: RenderNode;

  // Tags
  maxTagCount?: number | 'responsive';
  maxTagTextLength?: number;
  maxTagPlaceholder?: VNodeChild | ((omittedValues: LabelValueType[]) => VNodeChild);
  tokenSeparators?: string[];
  tagRender?: (props: CustomTagProps) => VNodeChild;
  onToggleOpen: any;

  // Motion
  choiceTransitionName?: string;

  // Event
  onSelect: (value: RawValueType, option: { selected: boolean }) => void;
};

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
  tabindex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  removeIcon: PropTypes.VNodeChild,
  choiceTransitionName: PropTypes.string,

  maxTagCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxTagTextLength: PropTypes.number,
  maxTagPlaceholder: PropTypes.any.def(
    () => (omittedValues: LabelValueType[]) => `+ ${omittedValues.length} ...`,
  ),
  tagRender: PropTypes.func,

  onToggleOpen: { type: Function as PropType<(open?: boolean) => void> },
  onSelect: PropTypes.func,
  onInputChange: PropTypes.func,
  onInputPaste: PropTypes.func,
  onInputKeyDown: PropTypes.func,
  onInputMouseDown: PropTypes.func,
  onInputCompositionStart: PropTypes.func,
  onInputCompositionEnd: PropTypes.func,
};

const onPreventMouseDown = (event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
};

const SelectSelector = defineComponent<SelectorProps>({
  name: 'MultipleSelectSelector',
  inheritAttrs: false,
  props: props as any,
  setup(props) {
    const measureRef = ref();
    const inputWidth = ref(0);
    const focused = ref(false);

    const selectionPrefixCls = computed(() => `${props.prefixCls}-selection`);

    // ===================== Search ======================
    const inputValue = computed(() =>
      props.open || props.mode === 'tags' ? props.searchValue : '',
    );
    const inputEditable: Ref<boolean> = computed(
      () =>
        props.mode === 'tags' || ((props.showSearch && (props.open || focused.value)) as boolean),
    );

    // We measure width and set to the input immediately
    onMounted(() => {
      watch(
        inputValue,
        () => {
          inputWidth.value = measureRef.value.scrollWidth;
        },
        { flush: 'post', immediate: true },
      );
    });

    // ===================== Render ======================
    // >>> Render Selector Node. Includes Item & Rest
    function defaultRenderSelector(
      content: VueNode,
      itemDisabled: boolean,
      closable?: boolean,
      onClose?: (e: MouseEvent) => void,
    ) {
      return (
        <span
          class={classNames(`${selectionPrefixCls.value}-item`, {
            [`${selectionPrefixCls.value}-item-disabled`]: itemDisabled,
          })}
        >
          <span class={`${selectionPrefixCls.value}-item-content`}>{content}</span>
          {closable && (
            <TransBtn
              class={`${selectionPrefixCls.value}-item-remove`}
              onMousedown={onPreventMouseDown}
              onClick={onClose}
              customizeIcon={props.removeIcon}
            >
              ×
            </TransBtn>
          )}
        </span>
      );
    }

    function customizeRenderSelector(
      value: DefaultValueType,
      content: VueNode,
      itemDisabled: boolean,
      closable: boolean,
      onClose: (e: MouseEvent) => void,
    ) {
      const onMouseDown = (e: MouseEvent) => {
        onPreventMouseDown(e);
        props.onToggleOpen(!open);
      };

      return (
        <span onMousedown={onMouseDown}>
          {props.tagRender({
            label: content,
            value,
            disabled: itemDisabled,
            closable,
            onClose,
          })}
        </span>
      );
    }

    function renderItem({ disabled: itemDisabled, label, value }: DisplayLabelValueType) {
      const closable = !props.disabled && !itemDisabled;

      let displayLabel = label;

      if (typeof props.maxTagTextLength === 'number') {
        if (typeof label === 'string' || typeof label === 'number') {
          const strLabel = String(displayLabel);

          if (strLabel.length > props.maxTagTextLength) {
            displayLabel = `${strLabel.slice(0, props.maxTagTextLength)}...`;
          }
        }
      }
      const onClose = (event?: MouseEvent) => {
        if (event) event.stopPropagation();
        props.onSelect(value, { selected: false });
      };

      return typeof props.tagRender === 'function'
        ? customizeRenderSelector(value, displayLabel, itemDisabled, closable, onClose)
        : defaultRenderSelector(displayLabel, itemDisabled, closable, onClose);
    }

    function renderRest(omittedValues: DisplayLabelValueType[]) {
      const {
        maxTagPlaceholder = (omittedValues: LabelValueType[]) => `+ ${omittedValues.length} ...`,
      } = props;
      const content =
        typeof maxTagPlaceholder === 'function'
          ? maxTagPlaceholder(omittedValues)
          : maxTagPlaceholder;

      return defaultRenderSelector(content, false);
    }

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

      // >>> Input Node
      const inputNode = (
        <div
          class={`${selectionPrefixCls.value}-search`}
          style={{ width: inputWidth.value + 'px' }}
          key="input"
        >
          <Input
            inputRef={inputRef}
            open={open}
            prefixCls={prefixCls}
            id={id}
            inputElement={null}
            disabled={disabled}
            autofocus={autofocus}
            autocomplete={autocomplete}
            editable={inputEditable.value}
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
            onFocus={() => (focused.value = true)}
            onBlur={() => (focused.value = false)}
          />

          {/* Measure Node */}
          <span ref={measureRef} class={`${selectionPrefixCls.value}-search-mirror`} aria-hidden>
            {inputValue.value}&nbsp;
          </span>
        </div>
      );

      // >>> Selections
      const selectionNode = (
        <Overflow
          prefixCls={`${selectionPrefixCls.value}-overflow`}
          data={values}
          renderItem={renderItem}
          renderRest={renderRest}
          suffix={inputNode}
          itemKey="key"
          maxCount={props.maxTagCount}
          key="overflow"
        />
      );
      return (
        <>
          {selectionNode}
          {!values.length && !inputValue.value && (
            <span class={`${selectionPrefixCls.value}-placeholder`}>{placeholder}</span>
          )}
        </>
      );
    };
  },
});

export default SelectSelector;
