import type { CSSProperties } from 'vue';
import { computed, defineComponent, onUnmounted, reactive, ref, watch } from 'vue';
import classNames from '../_util/classNames';

export interface UnitNumberProps {
  prefixCls: string;
  value: string | number;
  offset?: number;
  current?: boolean;
}

function UnitNumber({ prefixCls, value, current, offset = 0 }: UnitNumberProps) {
  let style: CSSProperties | undefined;

  if (offset) {
    style = {
      position: 'absolute',
      top: `${offset}00%`,
      left: 0,
    };
  }

  return (
    <p
      style={style}
      class={classNames(`${prefixCls}-only-unit`, {
        current,
      })}
    >
      {value}
    </p>
  );
}

function getOffset(start: number, end: number, unit: -1 | 1) {
  let index = start;
  let offset = 0;

  while ((index + 10) % 10 !== end) {
    index += unit;
    offset += unit;
  }

  return offset;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'SingleNumber',
  props: {
    prefixCls: String,
    value: String,
    count: Number,
  },
  setup(props) {
    const originValue = computed(() => Number(props.value));
    const originCount = computed(() => Math.abs(props.count));
    const state = reactive({
      prevValue: originValue.value,
      prevCount: originCount.value,
    });

    // ============================= Events =============================
    const onTransitionEnd = () => {
      state.prevValue = originValue.value;
      state.prevCount = originCount.value;
    };
    const timeout = ref();
    // Fallback if transition event not support
    watch(
      originValue,
      () => {
        clearTimeout(timeout.value);
        timeout.value = setTimeout(() => {
          onTransitionEnd();
        }, 1000);
      },
      { flush: 'post' },
    );
    onUnmounted(() => {
      clearTimeout(timeout.value);
    });

    return () => {
      let unitNodes: any[];
      let offsetStyle: CSSProperties = {};
      const value = originValue.value;
      if (state.prevValue === value || Number.isNaN(value) || Number.isNaN(state.prevValue)) {
        // Nothing to change
        unitNodes = [UnitNumber({ ...props, current: true } as UnitNumberProps)];
        offsetStyle = {
          transition: 'none',
        };
      } else {
        unitNodes = [];

        // Fill basic number units
        const end = value + 10;
        const unitNumberList: number[] = [];
        for (let index = value; index <= end; index += 1) {
          unitNumberList.push(index);
        }

        // Fill with number unit nodes
        const prevIndex = unitNumberList.findIndex(n => n % 10 === state.prevValue);
        unitNodes = unitNumberList.map((n, index) => {
          const singleUnit = n % 10;
          return UnitNumber({
            ...props,
            value: singleUnit,
            offset: index - prevIndex,
            current: index === prevIndex,
          } as UnitNumberProps);
        });

        // Calculate container offset value
        const unit = state.prevCount < originCount.value ? 1 : -1;
        offsetStyle = {
          transform: `translateY(${-getOffset(state.prevValue, value, unit)}00%)`,
        };
      }
      return (
        <span
          class={`${props.prefixCls}-only`}
          style={offsetStyle}
          onTransitionend={() => onTransitionEnd()}
        >
          {unitNodes}
        </span>
      );
    };
  },
});
