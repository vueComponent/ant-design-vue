import moment from 'moment';
import interopDefault from '../_util/interopDefault';
import Statistic, { StatisticProps } from './Statistic';
import { formatCountdown } from './utils';
import { defineComponent, ref, onMounted, onUpdated, onBeforeUnmount } from 'vue';
import PropTypes from '../_util/vue-types/index';

const REFRESH_INTERVAL = 1000 / 30;
function getTime(value) {
  return interopDefault(moment)(value).valueOf();
}

const StatisticCountdown = defineComponent({
  name: 'AStatisticCountdown',
  props: {
    ...StatisticProps,
    format: PropTypes.string.def('HH:mm:ss'),
  },
  emits: ['finish'],
  setup(props, { emit }) {
    let countdownId: number | undefined = undefined;
    const renderKey = ref(0);

    const syncTimer = () => {
      const timestamp = getTime(props.value);
      if (timestamp >= Date.now()) {
        startTimer();
      } else {
        stopTimer();
      }
    };

    const startTimer = () => {
      if (countdownId) return;
      countdownId = window.setInterval(() => {
        renderKey.value++;
        syncTimer();
      }, REFRESH_INTERVAL);
    };

    const stopTimer = () => {
      if (countdownId) {
        clearInterval(countdownId);
        countdownId = undefined;

        const timestamp = getTime(props.value);
        if (timestamp < Date.now()) {
          emit('finish');
        }
      }
    };

    onMounted(() => {
      syncTimer();
    });

    onUpdated(() => {
      syncTimer();
    });

    onBeforeUnmount(() => {
      stopTimer();
    });

    return () => (
      <Statistic
        data-key={renderKey.value}
        ref="statistic"
        {...{
          ...props,
          valueRender: node => node,
          formatter: ({ value }) => formatCountdown(value, { format: props.format }),
        }}
      />
    );
  },
});

export default StatisticCountdown;
