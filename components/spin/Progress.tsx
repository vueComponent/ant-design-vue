import { defineComponent, ref, computed, watchEffect } from 'vue';

export interface ProgressProps {
  prefixCls: string;
  percent: number;
}

const viewSize = 100;
const borderWidth = viewSize / 5;
const radius = viewSize / 2 - borderWidth / 2;
const circumference = radius * 2 * Math.PI;
const position = 50;

const CustomCircle = defineComponent({
  compatConfig: { MODE: 3 },
  inheritAttrs: false,
  props: {
    dotClassName: String,
    style: Object,
    hasCircleCls: Boolean,
  },
  setup(props) {
    const cStyle = computed(() => props.style || {});

    return () => (
      <circle
        class={[
          `${props.dotClassName}-circle`,
          {
            [`${props.dotClassName}-circle-bg`]: props.hasCircleCls,
          },
        ]}
        r={radius}
        cx={position}
        cy={position}
        stroke-width={borderWidth}
        style={cStyle.value}
      />
    );
  },
});

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Progress',
  inheritAttrs: false,
  props: {
    percent: Number,
    prefixCls: String,
  },
  setup(props) {
    const dotClassName = `${props.prefixCls}-dot`;
    const holderClassName = `${dotClassName}-holder`;
    const hideClassName = `${holderClassName}-hidden`;

    const render = ref(false);

    // ==================== Visible =====================
    watchEffect(() => {
      if (props.percent !== 0) {
        render.value = true;
      }
    });

    // ==================== Progress ====================
    const safePtg = computed(() => Math.max(Math.min(props.percent, 100), 0));

    const circleStyle = computed(() => ({
      strokeDashoffset: `${circumference / 4}`,
      strokeDasharray: `${(circumference * safePtg.value) / 100} ${
        (circumference * (100 - safePtg.value)) / 100
      }`,
    }));

    // ===================== Render =====================
    return () => {
      if (!render.value) {
        return null;
      }

      return (
        <span
          class={[holderClassName, `${dotClassName}-progress`, safePtg.value <= 0 && hideClassName]}
        >
          <svg
            viewBox={`0 0 ${viewSize} ${viewSize}`}
            {...({
              role: 'progressbar',
              'aria-valuemin': 0,
              'aria-valuemax': 100,
              'aria-valuenow': safePtg.value,
            } as any)}
          >
            <CustomCircle dotClassName={dotClassName} hasCircleCls={true} />
            <CustomCircle dotClassName={dotClassName} style={circleStyle.value} />
          </svg>
        </span>
      );
    };
  },
});
