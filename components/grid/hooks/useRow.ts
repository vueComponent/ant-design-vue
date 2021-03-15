import {
  reactive,
  ref,
  provide,
  inject,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
  CSSProperties,
} from 'vue';
import ResponsiveObserve, {
  Breakpoint,
  ScreenMap,
  responsiveArray,
} from '../../_util/responsiveObserve';
import { defaultConfigProvider } from '../../config-provider';
import { rowContextState } from '../Row';

const useRow = props => {
  const rowContext = reactive<rowContextState>({
    gutter: undefined,
  });

  provide('rowContext', rowContext);

  let token: number;

  onMounted(() => {
    token = ResponsiveObserve.subscribe(screen => {
      const currentGutter = props.gutter || 0;
      if (
        (!Array.isArray(currentGutter) && typeof currentGutter === 'object') ||
        (Array.isArray(currentGutter) &&
          (typeof currentGutter[0] === 'object' || typeof currentGutter[1] === 'object'))
      ) {
        screens.value = screen;
      }
    });
  });

  onBeforeUnmount(() => {
    ResponsiveObserve.unsubscribe(token);
  });

  const screens = ref<ScreenMap>({
    xs: true,
    sm: true,
    md: true,
    lg: true,
    xl: true,
    xxl: true,
  });

  const getGutter = (): [number, number] => {
    const results: [number, number] = [0, 0];
    const { gutter = 0 } = props;
    const normalizedGutter = Array.isArray(gutter) ? gutter : [gutter, 0];
    normalizedGutter.forEach((g, index) => {
      if (typeof g === 'object') {
        for (let i = 0; i < responsiveArray.length; i++) {
          const breakpoint: Breakpoint = responsiveArray[i];
          if (screens.value[breakpoint] && g[breakpoint] !== undefined) {
            results[index] = g[breakpoint] as number;
            break;
          }
        }
      } else {
        results[index] = g || 0;
      }
    });
    return results;
  };

  const configProvider = inject('configProvider', defaultConfigProvider);

  const classes = computed(() => {
    const { prefixCls: customizePrefixCls, justify, align } = props;
    const prefixCls = configProvider.getPrefixCls('row', customizePrefixCls);

    return [
      prefixCls,
      {
        [`${prefixCls}-${justify}`]: justify,
        [`${prefixCls}-${align}`]: align,
      },
    ];
  });

  const rowStyle = ref<CSSProperties>();

  let gutter: [number, number];
  watch(
    () => props.gutter,
    () => {
      gutter = getGutter();
      rowStyle.value = {
        ...(gutter[0] > 0
          ? {
              marginLeft: `${gutter[0] / -2}px`,
              marginRight: `${gutter[0] / -2}px`,
            }
          : {}),
        ...(gutter[1] > 0
          ? {
              marginTop: `${gutter[1] / -2}px`,
              marginBottom: `${gutter[1] / -2}px`,
            }
          : {}),
      };
    },
    {
      immediate: true,
    },
  );

  rowContext.gutter = gutter;
  return { class: classes, style: rowStyle };
};

export default useRow;
