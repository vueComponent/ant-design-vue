import type { ExtractPropTypes, PropType } from 'vue';
import { defineComponent, onBeforeUnmount, onMounted, onUpdated, ref } from 'vue';
import omit from '../_util/omit';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import { someType } from '../_util/type';
import Statistic, { statisticProps } from './Statistic';
import type { countdownValueType, FormatConfig, valueType } from './utils';
import { formatCountdown as formatCD } from './utils';

const REFRESH_INTERVAL = 1000 / 30;

function getTime(value?: countdownValueType) {
  return new Date(value as any).getTime();
}
export const countdownProps = () => {
  return {
    ...statisticProps(),
    value: someType<countdownValueType>([Number, String, Object]),
    format: String,
    onFinish: Function as PropType<() => void>,
    onChange: Function as PropType<(value?: countdownValueType) => void>,
  };
};

export type CountdownProps = Partial<ExtractPropTypes<ReturnType<typeof countdownProps>>>;
export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AStatisticCountdown',
  props: initDefaultProps(countdownProps(), {
    format: 'HH:mm:ss',
  }),
  // emits: ['finish', 'change'],
  setup(props, { emit, slots }) {
    const countdownId = ref<any>();
    const statistic = ref();
    const syncTimer = () => {
      const { value } = props;
      const timestamp = getTime(value);
      if (timestamp >= Date.now()) {
        startTimer();
      } else {
        stopTimer();
      }
    };

    const startTimer = () => {
      if (countdownId.value) return;
      const timestamp = getTime(props.value);
      countdownId.value = setInterval(() => {
        statistic.value.$forceUpdate();
        if (timestamp > Date.now()) {
          emit('change', timestamp - Date.now());
        }
        syncTimer();
      }, REFRESH_INTERVAL);
    };

    const stopTimer = () => {
      const { value } = props;
      if (countdownId.value) {
        clearInterval(countdownId.value);
        countdownId.value = undefined;

        const timestamp = getTime(value);
        if (timestamp < Date.now()) {
          emit('finish');
        }
      }
    };

    const formatCountdown = ({ value, config }: { value: valueType; config: FormatConfig }) => {
      const { format } = props;
      return formatCD(value, { ...config, format });
    };

    const valueRenderHtml = (node: any) => node;
    onMounted(() => {
      syncTimer();
    });
    onUpdated(() => {
      syncTimer();
    });
    onBeforeUnmount(() => {
      stopTimer();
    });
    return () => {
      const value = props.value as valueType;
      return (
        <Statistic
          ref={statistic}
          {...{
            ...omit(props, ['onFinish', 'onChange']),
            value,
            valueRender: valueRenderHtml,
            formatter: formatCountdown,
          }}
          v-slots={slots}
        />
      );
    };
  },
});
