import pickAttrs from '../../_util/pickAttrs';
import Input from './Input';
import type { InnerSelectorProps } from './interface';
import { Fragment, computed, defineComponent, ref, watch } from 'vue';
import PropTypes from '../../_util/vue-types';
import type { VueNode } from '../../_util/type';
import useInjectLegacySelectContext from '../../vc-tree-select/LegacyContext';

interface SelectorProps extends InnerSelectorProps {
  inputElement: VueNode;
  activeValue: string;
}
const props = {
  inputElement: PropTypes.any,
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
  activeDescendantId: PropTypes.string,
  tabindex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  activeValue: PropTypes.string,
  backfill: PropTypes.looseBool,
  onInputChange: PropTypes.func,
  onInputPaste: PropTypes.func,
  onInputKeyDown: PropTypes.func,
  onInputMouseDown: PropTypes.func,
  onInputCompositionStart: PropTypes.func,
  onInputCompositionEnd: PropTypes.func,
};
const SingleSelector = defineComponent<SelectorProps>({
  name: 'SingleSelector',
  setup(props) {
    const inputChanged = ref(false);

    const combobox = computed(() => props.mode === 'combobox');
    const inputEditable = computed(() => combobox.value || props.showSearch);

    const inputValue = computed(() => {
      let inputValue: string = props.searchValue || '';
      if (combobox.value && props.activeValue && !inputChanged.value) {
        inputValue = props.activeValue;
      }
      return inputValue;
    });
    const legacyTreeSelectContext = useInjectLegacySelectContext();
    watch(
      [combobox, () => props.activeValue],
      () => {
        if (combobox.value) {
          inputChanged.value = false;
        }
      },
      { immediate: true },
    );

    // Not show text when closed expect combobox mode
    const hasTextInput = computed(() =>
      props.mode !== 'combobox' && !props.open && !props.showSearch ? false : !!inputValue.value,
    );

    const title = computed(() => {
      const item = props.values[0];
      return item && (typeof item.label === 'string' || typeof item.label === 'number')
        ? item.label.toString()
        : undefined;
    });

    const renderPlaceholder = () => {
      if (props.values[0]) {
        return null;
      }
      const hiddenStyle = hasTextInput.value ? { visibility: 'hidden' as const } : undefined;
      return (
        <span class={`${props.prefixCls}-selection-placeholder`} style={hiddenStyle}>
          {props.placeholder}
        </span>
      );
    };

    return () => {
      const {
        inputElement,
        prefixCls,
        id,
        values,
        inputRef,
        disabled,
        autofocus,
        autocomplete,
        activeDescendantId,
        open,
        tabindex,
        onInputKeyDown,
        onInputMouseDown,
        onInputChange,
        onInputPaste,
        onInputCompositionStart,
        onInputCompositionEnd,
      } = props;
      const item = values[0];
      let titleNode = null;
      // custom tree-select title by slot

      // For TreeSelect
      if (item && legacyTreeSelectContext.customSlots) {
        const key = item.key ?? item.value;
        const originData = legacyTreeSelectContext.keyEntities[key]?.node || {};
        titleNode =
          legacyTreeSelectContext.customSlots[originData.slots?.title] ||
          legacyTreeSelectContext.customSlots.title ||
          item.label;
        if (typeof titleNode === 'function') {
          titleNode = titleNode(originData);
        }
        //  else if (treeSelectContext.value.slots.titleRender) {
        //   // 因历史 title 是覆盖逻辑，新增 titleRender，所有的 title 都走一遍 titleRender
        //   titleNode = treeSelectContext.value.slots.titleRender(item.option?.data || {});
        // }
      } else {
        titleNode = item?.label;
      }
      return (
        <>
          <span class={`${prefixCls}-selection-search`}>
            <Input
              inputRef={inputRef}
              prefixCls={prefixCls}
              id={id}
              open={open}
              inputElement={inputElement}
              disabled={disabled}
              autofocus={autofocus}
              autocomplete={autocomplete}
              editable={inputEditable.value}
              activeDescendantId={activeDescendantId}
              value={inputValue.value}
              onKeydown={onInputKeyDown}
              onMousedown={onInputMouseDown}
              onChange={e => {
                inputChanged.value = true;
                onInputChange(e as any);
              }}
              onPaste={onInputPaste}
              onCompositionstart={onInputCompositionStart}
              onCompositionend={onInputCompositionEnd}
              tabindex={tabindex}
              attrs={pickAttrs(props, true)}
            />
          </span>

          {/* Display value */}
          {!combobox.value && item && !hasTextInput.value && (
            <span class={`${prefixCls}-selection-item`} title={title.value}>
              <Fragment key={item.key ?? item.value}>{titleNode}</Fragment>
            </span>
          )}

          {/* Display placeholder */}
          {renderPlaceholder()}
        </>
      );
    };
  },
});
SingleSelector.props = props;
SingleSelector.inheritAttrs = false;

export default SingleSelector;
