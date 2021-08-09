import { defineComponent, onBeforeUnmount, onMounted, onUpdated, ref } from 'vue';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import Statistic, { statisticProps } from './Statistic';
import type { countdownValueType, FormatConfig } from './utils';
import { formatCountdown as formatCD } from './utils';

const REFRESH_INTERVAL = 1000 / 30;

function getTime(value?: countdownValueType) {
  return new Date(value as any).getTime();
}

export default defineComponent({
  name: 'AStatisticCountdown',
  props: initDefaultProps(statisticProps, {
    format: 'HH:mm:ss',
  }),
  emits: ['finish', 'change'],
  setup(props, { emit }) {
    const countdownId = ref<number>();
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
      countdownId.value = window.setInterval(() => {
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

    const formatCountdown = ({
      value,
      config,
    }: {
      value: countdownValueType;
      config: FormatConfig;
    }) => {
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
      return (
        <Statistic
          ref={statistic}
          {...{
            ...props,
            valueRender: valueRenderHtml,
            formatter: formatCountdown,
          }}
        />
      );
    };
  },
});
