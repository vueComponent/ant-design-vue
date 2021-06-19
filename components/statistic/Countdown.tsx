import { defineComponent, onBeforeUnmount, onMounted, onUpdated, ref } from 'vue';
import moment from 'moment';
import interopDefault from '../_util/interopDefault';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import Statistic, { StatisticProps } from './Statistic';
import { formatCountdown as formatCD, countdownValueType, FormatConfig } from './utils';

const REFRESH_INTERVAL = 1000 / 30;

function getTime(value?: countdownValueType) {
  return interopDefault(moment)(value).valueOf();
}

export default defineComponent({
  name: 'AStatisticCountdown',
  props: initDefaultProps(StatisticProps, {
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
