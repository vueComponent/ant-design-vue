import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { omit } from 'lodash-es';
import { cloneElement } from '../_util/vnode';
import { defaultConfigProvider } from '../config-provider';
import {
  defineComponent,
  inject,
  nextTick,
  onBeforeUnmount,
  onUpdated,
  reactive,
  watch,
  ExtractPropTypes,
  CSSProperties,
  DefineComponent,
} from 'vue';

function getNumberArray(num: string | number | undefined | null) {
  return num
    ? num
        .toString()
        .split('')
        .reverse()
        .map(i => {
          const current = Number(i);
          return isNaN(current) ? i : current;
        })
    : [];
}

export const scrollNumberProps = {
  prefixCls: PropTypes.string,
  count: PropTypes.any,
  component: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.number, PropTypes.string, null]),
  displayComponent: PropTypes.any,
  onAnimated: PropTypes.func,
};

export type ScrollNumberProps = ExtractPropTypes<typeof scrollNumberProps>;

export default defineComponent({
  name: 'ScrollNumber',
  inheritAttrs: false,
  props: scrollNumberProps,
  emits: ['animated'],
  setup(props, { emit, attrs }) {
    const configProvider = inject('configProvider', defaultConfigProvider);
    const state = reactive({
      animateStarted: true,
      lastCount: undefined,
      sCount: props.count,

      timeout: undefined,
    });

    const getPositionByNum = (num: number, i: number) => {
      const currentCount = Math.abs(Number(state.sCount));
      const lastCount = Math.abs(Number(state.lastCount));
      const currentDigit = Math.abs(getNumberArray(state.sCount)[i] as number);
      const lastDigit = Math.abs(getNumberArray(state.lastCount)[i] as number);

      if (state.animateStarted) {
        return 10 + num;
      }
      // 同方向则在同一侧切换数字
      if (currentCount > lastCount) {
        if (currentDigit >= lastDigit) {
          return 10 + num;
        }
        return 20 + num;
      }
      if (currentDigit <= lastDigit) {
        return 10 + num;
      }
      return num;
    };
    const handleAnimated = () => {
      emit('animated');
    };

    const _clearTimeout = () => {
      if (state.timeout) {
        clearTimeout(state.timeout);
        state.timeout = undefined;
      }
    };

    const renderNumberList = (position: number, className: string) => {
      const childrenToReturn = [];
      for (let i = 0; i < 30; i++) {
        childrenToReturn.push(
          <p
            key={i.toString()}
            class={classNames(className, {
              current: position === i,
            })}
          >
            {i % 10}
          </p>,
        );
      }
      return childrenToReturn;
    };

    const renderCurrentNumber = (prefixCls: string, num: number | string, i: number) => {
      if (typeof num === 'number') {
        const position = getPositionByNum(num, i);
        const removeTransition =
          state.animateStarted || getNumberArray(state.lastCount)[i] === undefined;
        const style = {
          transition: removeTransition ? 'none' : undefined,
          msTransform: `translateY(${-position * 100}%)`,
          WebkitTransform: `translateY(${-position * 100}%)`,
          transform: `translateY(${-position * 100}%)`,
        };
        return (
          <span class={`${prefixCls}-only`} style={style} key={i}>
            {renderNumberList(position, `${prefixCls}-only-unit`)}
          </span>
        );
      }
      return (
        <span key="symbol" class={`${prefixCls}-symbol`}>
          {num}
        </span>
      );
    };

    const renderNumberElement = (prefixCls: string) => {
      if (state.sCount && Number(state.sCount) % 1 === 0) {
        return getNumberArray(state.sCount)
          .map((num, i) => renderCurrentNumber(prefixCls, num, i))
          .reverse();
      }
      return state.sCount;
    };

    watch(
      () => props.count,
      () => {
        state.lastCount = state.sCount;
        state.animateStarted = true;
      },
    );

    onUpdated(() => {
      if (state.animateStarted) {
        _clearTimeout();
        // Let browser has time to reset the scroller before actually
        // performing the transition.
        state.timeout = setTimeout(() => {
          state.animateStarted = false;
          state.sCount = props.count;
          nextTick(() => {
            handleAnimated();
          });
        });
      }
    });

    onBeforeUnmount(() => {
      _clearTimeout();
    });

    // configProvider: inject('configProvider', defaultConfigProvider),
    // lastCount: undefined,
    // timeout: undefined,

    return () => {
      const {
        prefixCls: customizePrefixCls,
        title,
        component: Tag = ('sup' as unknown) as DefineComponent,
        displayComponent,
      } = props;
      const getPrefixCls = configProvider.getPrefixCls;
      const prefixCls = getPrefixCls('scroll-number', customizePrefixCls);
      const { class: className, style = {} } = attrs as {
        class?: string;
        style?: CSSProperties;
      };
      if (displayComponent) {
        return cloneElement(displayComponent, {
          class: classNames(
            `${prefixCls}-custom-component`,
            displayComponent.props && displayComponent.props.class,
          ),
        });
      }
      // fix https://fb.me/react-unknown-prop
      const restProps = omit({ ...props, ...attrs }, [
        'count',
        'onAnimated',
        'component',
        'prefixCls',
        'displayComponent',
      ]);
      const tempStyle = { ...style };
      const newProps = {
        ...restProps,
        title,
        style: tempStyle,
        class: classNames(prefixCls, className),
      };
      // allow specify the border
      // mock border-color by box-shadow for compatible with old usage:
      // <Badge count={4} style={{ backgroundColor: '#fff', color: '#999', borderColor: '#d9d9d9' }} />
      if (style && style.borderColor) {
        newProps.style.boxShadow = `0 0 0 1px ${style.borderColor} inset`;
      }

      return <Tag {...newProps}>{renderNumberElement(prefixCls)}</Tag>;
    };
  },
});
