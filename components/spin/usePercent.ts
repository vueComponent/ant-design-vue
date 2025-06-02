import { ref, computed, watchEffect } from 'vue';

const AUTO_INTERVAL = 200;
const STEP_BUCKETS: [limit: number, stepPtg: number][] = [
  [30, 0.05],
  [70, 0.03],
  [96, 0.01],
];

export default function usePercent(spinning: boolean, percent?: number | 'auto') {
  const mockPercent = ref(0);
  const mockIntervalRef = ref<ReturnType<typeof setInterval> | null>(null);

  const isAuto = ref(percent === 'auto');

  watchEffect(() => {
    // 清除现有定时器
    if (mockIntervalRef.value || !isAuto.value || !spinning) {
      clearInterval(mockIntervalRef.value);
      mockIntervalRef.value = null;
    }

    if (isAuto.value && spinning) {
      mockPercent.value = 0;

      mockIntervalRef.value = setInterval(() => {
        mockPercent.value = calculateNextPercent(mockPercent.value);
      }, AUTO_INTERVAL);
    }
  });

  return computed(() => (isAuto.value ? mockPercent.value : +percent));
}

function calculateNextPercent(prev: number): number {
  const restPTG = 100 - prev;

  for (let i = 0; i < STEP_BUCKETS.length; i += 1) {
    const [limit, stepPtg] = STEP_BUCKETS[i];
    if (prev <= limit) {
      return prev + restPTG * stepPtg;
    }
  }

  return prev;
}
