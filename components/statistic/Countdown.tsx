import { defineComponent } from 'vue';
import moment from 'moment';
import interopDefault from '../_util/interopDefault';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import Statistic, { StatisticProps } from './Statistic';
import { formatCountdown, countdownValueType, FormatConfig } from './utils';

const REFRESH_INTERVAL = 1000 / 30;

function getTime(value?: countdownValueType) {
  return interopDefault(moment)(value).valueOf();
}

export default defineComponent({
  name: 'AStatisticCountdown',
  props: initDefaultProps(StatisticProps, {
    format: 'HH:mm:ss',
  }),
  setup() {
    return {
      countdownId: undefined,
    } as { countdownId: number };
  },
  mounted() {
    this.syncTimer();
  },

  updated() {
    this.syncTimer();
  },

  beforeUnmount() {
    this.stopTimer();
  },

  methods: {
    syncTimer() {
      const { value } = this.$props;
      const timestamp = getTime(value);
      if (timestamp >= Date.now()) {
        this.startTimer();
      } else {
        this.stopTimer();
      }
    },

    startTimer() {
      if (this.countdownId) return;
      this.countdownId = window.setInterval(() => {
        (this.$refs.statistic as any).$forceUpdate();
        this.syncTimer();
      }, REFRESH_INTERVAL);
    },

    stopTimer() {
      const { value } = this.$props;
      if (this.countdownId) {
        clearInterval(this.countdownId);
        this.countdownId = undefined;

        const timestamp = getTime(value);
        if (timestamp < Date.now()) {
          this.$emit('finish');
        }
      }
    },

    formatCountdown({ value, config }: { value: countdownValueType; config: FormatConfig }) {
      const { format } = this.$props;
      return formatCountdown(value, { ...config, format });
    },

    valueRenderHtml: node => node,
  },

  render() {
    return (
      <Statistic
        ref="statistic"
        {...{
          ...this.$props,
          valueRender: this.valueRenderHtml,
          formatter: this.formatCountdown,
        }}
      />
    );
  },
});
