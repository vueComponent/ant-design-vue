import { defineComponent, shallowRef, computed } from 'vue';
import type { ExtractPropTypes, FunctionalComponent } from 'vue';
import classNames from '../../_util/classNames';
import useConfigInject from '../../config-provider/hooks/useConfigInject';
import { initDefaultProps } from '../../_util/props-util';
import useStyle from '../style';
import type { CustomSlotsType, VueNode } from '../../_util/type';
import { functionType, someType, arrayType, booleanType, stringType } from '../../_util/type';
import type { ChangeEvent } from '../../_util/EventInterface';
import MotionThumb from './MotionThumb';
export type SegmentedValue = string | number;
export type segmentedSize = 'large' | 'small';
export interface SegmentedBaseOption {
  value: string | number;
  disabled?: boolean;
  payload?: any;
  /**
   * html `title` property for label
   */
  title?: string;
  className?: string;
}
export interface SegmentedOption extends SegmentedBaseOption {
  label?: VueNode | ((option: SegmentedBaseOption) => VueNode);
}

function normalizeOptions(options: (SegmentedOption | string | number)[]) {
  return options.map(option => {
    if (typeof option === 'object' && option !== null) {
      return option;
    }

    return {
      label: option?.toString(),
      title: option?.toString(),
      value: option as unknown as SegmentedBaseOption['value'],
    };
  });
}
export const segmentedProps = () => {
  return {
    prefixCls: String,
    options: arrayType<(SegmentedOption | string | number)[]>(),
    block: booleanType(),
    disabled: booleanType(),
    size: stringType<segmentedSize>(),
    value: { ...someType<SegmentedValue>([String, Number]), required: true },
    motionName: String,
    onChange: functionType<(val: SegmentedValue) => void>(),
    'onUpdate:value': functionType<(val: SegmentedValue) => void>(),
  };
};
export type SegmentedProps = Partial<ExtractPropTypes<ReturnType<typeof segmentedProps>>>;

const SegmentedOption: FunctionalComponent<
  SegmentedOption & {
    prefixCls: string;
    checked: boolean;
    onChange: (_event: ChangeEvent, val: SegmentedValue) => void;
  }
> = (props, { slots, emit }) => {
  const {
    value,
    disabled,
    payload,
    title,
    prefixCls,
    label = slots.label,
    checked,
    className,
  } = props;
  const handleChange = (event: InputEvent) => {
    if (disabled) {
      return;
    }

    emit('change', event, value);
  };

  return (
    <label
      class={classNames(
        {
          [`${prefixCls}-item-disabled`]: disabled,
        },
        className,
      )}
    >
      <input
        class={`${prefixCls}-item-input`}
        type="radio"
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
      />
      <div class={`${prefixCls}-item-label`} title={typeof title === 'string' ? title : ''}>
        {typeof label === 'function'
          ? label({
              value,
              disabled,
              payload,
              title,
            })
          : label ?? value}
      </div>
    </label>
  );
};
SegmentedOption.inheritAttrs = false;

export default defineComponent({
  name: 'ASegmented',
  inheritAttrs: false,
  props: initDefaultProps(segmentedProps(), {
    options: [],
    motionName: 'thumb-motion',
  }),
  slots: Object as CustomSlotsType<{
    label: SegmentedBaseOption;
  }>,
  setup(props, { emit, slots, attrs }) {
    const { prefixCls, direction, size } = useConfigInject('segmented', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const rootRef = shallowRef<HTMLDivElement>();
    const thumbShow = shallowRef(false);

    const segmentedOptions = computed(() => normalizeOptions(props.options));
    const handleChange = (_event: ChangeEvent, val: SegmentedValue) => {
      if (props.disabled) {
        return;
      }
      emit('update:value', val);
      emit('change', val);
    };
    return () => {
      const pre = prefixCls.value;
      return wrapSSR(
        <div
          {...attrs}
          class={classNames(
            pre,
            {
              [hashId.value]: true,
              [`${pre}-block`]: props.block,
              [`${pre}-disabled`]: props.disabled,
              [`${pre}-lg`]: size.value == 'large',
              [`${pre}-sm`]: size.value == 'small',
              [`${pre}-rtl`]: direction.value === 'rtl',
            },
            attrs.class,
          )}
          ref={rootRef}
        >
          <div class={`${pre}-group`}>
            <MotionThumb
              containerRef={rootRef}
              prefixCls={pre}
              value={props.value}
              motionName={`${pre}-${props.motionName}`}
              direction={direction.value}
              getValueIndex={val => segmentedOptions.value.findIndex(n => n.value === val)}
              onMotionStart={() => {
                thumbShow.value = true;
              }}
              onMotionEnd={() => {
                thumbShow.value = false;
              }}
            />
            {segmentedOptions.value.map(segmentedOption => (
              <SegmentedOption
                key={segmentedOption.value}
                prefixCls={pre}
                checked={segmentedOption.value === props.value}
                onChange={handleChange}
                {...segmentedOption}
                className={classNames(segmentedOption.className, `${pre}-item`, {
                  [`${pre}-item-selected`]:
                    segmentedOption.value === props.value && !thumbShow.value,
                })}
                disabled={!!props.disabled || !!segmentedOption.disabled}
                v-slots={slots}
              />
            ))}
          </div>
        </div>,
      );
    };
  },
});
