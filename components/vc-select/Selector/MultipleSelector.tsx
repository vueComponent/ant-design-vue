import TransBtn from '../TransBtn';
import type { InnerSelectorProps } from './interface';
import Input from './Input';
import type { Ref, PropType } from 'vue';
import { ref, watchEffect, computed, defineComponent, onMounted, shallowRef, watch } from 'vue';
import classNames from '../../_util/classNames';
import pickAttrs from '../../_util/pickAttrs';
import PropTypes from '../../_util/vue-types';
import type { VueNode } from '../../_util/type';
import Overflow from '../../vc-overflow';
import type { DisplayValueType, RenderNode, CustomTagProps, RawValueType } from '../BaseSelect';
import type { BaseOptionType } from '../Select';
import useInjectLegacySelectContext from '../../vc-tree-select/LegacyContext';

type SelectorProps = InnerSelectorProps & {
  // Icon
  removeIcon?: RenderNode;

  // Tags
  maxTagCount?: number | 'responsive';
  maxTagTextLength?: number;
  maxTagPlaceholder?: VueNode | ((omittedValues: DisplayValueType[]) => VueNode);
  tokenSeparators?: string[];
  tagRender?: (props: CustomTagProps) => VueNode;
  onToggleOpen: any;

  compositionStatus: boolean;

  // Motion
  choiceTransitionName?: string;

  // Event
  onRemove: (value: DisplayValueType) => void;
};

const props = {
  id: String,
  prefixCls: String,
  values: PropTypes.array,
  open: { type: Boolean, default: undefined },
  searchValue: String,
  inputRef: PropTypes.any,
  placeholder: PropTypes.any,
  disabled: { type: Boolean, default: undefined },
  mode: String,
  showSearch: { type: Boolean, default: undefined },
  autofocus: { type: Boolean, default: undefined },
  autocomplete: String,
  activeDescendantId: String,
  tabindex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  compositionStatus: Boolean,
  removeIcon: PropTypes.any,
  choiceTransitionName: String,

  maxTagCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxTagTextLength: Number,
  maxTagPlaceholder: PropTypes.any.def(
    () => (omittedValues: DisplayValueType[]) => `+ ${omittedValues.length} ...`,
  ),
  tagRender: Function,

  onToggleOpen: { type: Function as PropType<(open?: boolean) => void> },
  onRemove: Function,
  onInputChange: Function,
  onInputPaste: Function,
  onInputKeyDown: Function,
  onInputMouseDown: Function,
  onInputCompositionStart: Function,
  onInputCompositionEnd: Function,
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
    const measureRef = shallowRef();
    const inputWidth = shallowRef(0);
    const focused = shallowRef(false);
    const legacyTreeSelectContext = useInjectLegacySelectContext();
    const selectionPrefixCls = computed(() => `${props.prefixCls}-selection`);

    // ===================== Search ======================
    const inputValue = computed(() =>
      props.open || props.mode === 'tags' ? props.searchValue : '',
    );
    const inputEditable: Ref<boolean> = computed(
      () =>
        props.mode === 'tags' || ((props.showSearch && (props.open || focused.value)) as boolean),
    );
    const targetValue = ref('');
    watchEffect(() => {
      targetValue.value = inputValue.value;
    });
    // We measure width and set to the input immediately
    onMounted(() => {
      watch(
        targetValue,
        () => {
          inputWidth.value = measureRef.value.scrollWidth;
        },
        { flush: 'post', immediate: true },
      );
    });

    // ===================== Render ======================
    // >>> Render Selector Node. Includes Item & Rest
    function defaultRenderSelector(
      title: VueNode,
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
          title={
            typeof title === 'string' || typeof title === 'number' ? title.toString() : undefined
          }
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
      value: RawValueType,
      content: VueNode,
      itemDisabled: boolean,
      closable: boolean,
      onClose: (e: MouseEvent) => void,
      option: BaseOptionType,
    ) {
      const onMouseDown = (e: MouseEvent) => {
        onPreventMouseDown(e);
        props.onToggleOpen(!open);
      };
      let originData = option;
      // For TreeSelect
      if (legacyTreeSelectContext.keyEntities) {
        originData = legacyTreeSelectContext.keyEntities[value]?.node || {};
      }
      return (
        <span key={value} onMousedown={onMouseDown}>
          {props.tagRender({
            label: content,
            value,
            disabled: itemDisabled,
            closable,
            onClose,
            option: originData,
          })}
        </span>
      );
    }

    function renderItem(valueItem: DisplayValueType) {
      const { disabled: itemDisabled, label, value, option } = valueItem;
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
        props.onRemove?.(valueItem);
      };

      return typeof props.tagRender === 'function'
        ? customizeRenderSelector(value, displayLabel, itemDisabled, closable, onClose, option)
        : defaultRenderSelector(label, displayLabel, itemDisabled, closable, onClose);
    }

    function renderRest(omittedValues: DisplayValueType[]) {
      const { maxTagPlaceholder = omittedValues => `+ ${omittedValues.length} ...` } = props;
      const content =
        typeof maxTagPlaceholder === 'function'
          ? maxTagPlaceholder(omittedValues)
          : maxTagPlaceholder;

      return defaultRenderSelector(content, content, false);
    }

    const handleInput = (e: Event) => {
      const composing = (e.target as any).composing;
      targetValue.value = (e.target as any).value;
      if (!composing) {
        props.onInputChange(e);
      }
    };

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
        activeDescendantId,
        tabindex,
        compositionStatus,
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
            activeDescendantId={activeDescendantId}
            value={targetValue.value}
            onKeydown={onInputKeyDown}
            onMousedown={onInputMouseDown}
            onChange={handleInput}
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
            {targetValue.value}&nbsp;
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
          {!values.length && !inputValue.value && !compositionStatus && (
            <span class={`${selectionPrefixCls.value}-placeholder`}>{placeholder}</span>
          )}
        </>
      );
    };
  },
});

export default SelectSelector;
