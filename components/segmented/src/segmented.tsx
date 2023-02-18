import { defineComponent, ref, toRefs, reactive, watch } from 'vue';
import type { ExtractPropTypes, PropType } from 'vue';
import classNames from '../../_util/classNames';
import useConfigInject from '../../config-provider/hooks/useConfigInject';
import { getPropsSlot, initDefaultProps } from '../../_util/props-util';
import useStyle from '../style';

export type segmentedSize = 'large' | 'small';
export interface SegmentedOptions {
  value?: string;
  disabled?: boolean;
}
export const segmentedProps = () => {
  return {
    options: { type: Array as PropType<Array<SegmentedOptions | string | number>> },
    defaultValue: { type: [Number, String] },
    block: Boolean,
    disabled: Boolean,
    size: { type: String as PropType<segmentedSize> },
  };
};
export type SegmentedProps = Partial<ExtractPropTypes<ReturnType<typeof segmentedProps>>>;
export default defineComponent({
  name: 'ASegmented',
  inheritAttrs: false,
  props: { ...initDefaultProps(segmentedProps(), {}) },
  emits: ['change', 'value'],
  slots: ['icon', 'title'],
  setup(props, { emit, slots }) {
    const { prefixCls } = useConfigInject('segmented', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const pre = prefixCls.value;
    const { size } = toRefs(props);
    const itemRef = ref([]);
    const { options, disabled, defaultValue } = toRefs(props);
    const segmentedItemInput = () => {
      return <input type="radio" class={`${pre}-item-input`} disabled checked />;
    };
    const isDisabled = item => {
      if (disabled.value || (typeof item == 'object' && item.disabled)) {
        return segmentedItemInput();
      }
    };
    const currentItemKey = ref();
    currentItemKey.value = defaultValue.value ? defaultValue.value : 0;
    const toPX = (value: number) => (value !== undefined ? `${value}px` : undefined);
    // 开始 or 停止
    const thumbShow = ref(true);
    const mergedStyle = reactive({
      startLeft: '',
      startWidth: '',
      activeLeft: '',
      activeWidth: '',
    });
    const handleSelectedChange = (item, index) => {
      if (disabled.value || item.disabled) return;
      currentItemKey.value = index;
      emit('change', { value: item, key: index });
    };
    const icon = getPropsSlot(slots, props, 'icon');
    const title = getPropsSlot(slots, props, 'title');
    const iconNode = index => {
      return icon ? (
        <span class={classNames({ [`${pre}-item-icon`]: icon })}>{slots.icon?.(index)}</span>
      ) : (
        ''
      );
    };
    const itemNode = (item, index) => {
      if (title) {
        return <div>{slots.title?.(index)}</div>;
      }
      return <span>{item.value}</span>;
    };
    const calcThumbStyle = index => {
      return {
        left: itemRef.value[index].children[0].offsetParent.offsetLeft,
        width: itemRef.value[index].children[0].clientWidth,
      };
    };
    const thumbStyle = reactive({
      transform: '',
      width: '',
    });
    const isValueType = item => {
      return item instanceof Object ? (item.disabled ? true : false) : false;
    };
    watch(
      () => currentItemKey.value,
      (newValue, oldValue) => {
        const prev = oldValue ? oldValue : defaultValue.value ? defaultValue.value : 0;
        const next = newValue;
        const calcPrevStyle = calcThumbStyle(prev);
        const calcNextStyle = calcThumbStyle(next);
        mergedStyle.startLeft = toPX(calcPrevStyle.left);
        mergedStyle.startWidth = toPX(calcPrevStyle.width);
        mergedStyle.activeLeft = toPX(calcNextStyle.left);
        mergedStyle.activeWidth = toPX(calcNextStyle.width);
        if (prev !== next) {
          thumbStyle.transform = `translateX(${mergedStyle.activeLeft})`;
          thumbStyle.width = `${mergedStyle.activeWidth}`;
        }
      },
    );
    const thumbNode = () => {
      return thumbShow.value ? (
        <div
          class={classNames({
            [`${pre}-thumb`]: thumbShow.value,
            [`${pre}-thumb-motion-appear-active`]: thumbShow.value,
          })}
          style={thumbStyle}
        />
      ) : (
        ''
      );
    };
    return () => {
      return wrapSSR(
        <div
          class={classNames(pre, {
            [hashId.value]: true,
            [`${pre}-block`]: props.block,
            [`${pre}-item-disabled`]: props.disabled,
            [`${pre}-lg`]: size.value == 'large',
            [`${pre}-sm`]: size.value == 'small',
          })}
        >
          <div class={classNames(`${pre}-group`)}>
            {thumbNode()}
            {options.value.map((item, index) => {
              return (
                <label
                  ref={ref => (itemRef.value[index] = ref)}
                  class={classNames(`${pre}-item`, {
                    [`${pre}-item-selected`]: currentItemKey.value == index,
                    [`${pre}-item-disabled`]: disabled.value || isValueType(item),
                  })}
                  onClick={() => handleSelectedChange(item, index)}
                >
                  {isDisabled(item)}
                  <div class={classNames(`${pre}-item-label`)} key={index}>
                    {iconNode(index)}
                    {typeof item == 'object' ? itemNode(item, index) : item}
                  </div>
                </label>
              );
            })}
          </div>
        </div>,
      );
    };
  },
});
