import type { CSSProperties } from 'vue';
import { onBeforeUnmount, onMounted, Transition, render, defineComponent, shallowRef } from 'vue';
import useState from '../hooks/useState';
import { objectType } from '../type';
import { getTargetWaveColor } from './util';
import wrapperRaf from '../raf';
function validateNum(value: number) {
  return Number.isNaN(value) ? 0 : value;
}

export interface WaveEffectProps {
  className: string;
  target: HTMLElement;
}

const WaveEffect = defineComponent({
  props: {
    target: objectType<HTMLElement>(),
    className: String,
  },
  setup(props) {
    const divRef = shallowRef<HTMLDivElement | null>(null);

    const [color, setWaveColor] = useState<string | null>(null);
    const [borderRadius, setBorderRadius] = useState<number[]>([]);
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [enabled, setEnabled] = useState(false);

    function syncPos() {
      const { target } = props;
      const nodeStyle = getComputedStyle(target);

      // Get wave color from target
      setWaveColor(getTargetWaveColor(target));

      const isStatic = nodeStyle.position === 'static';

      // Rect
      const { borderLeftWidth, borderTopWidth } = nodeStyle;
      setLeft(isStatic ? target.offsetLeft : validateNum(-parseFloat(borderLeftWidth)));
      setTop(isStatic ? target.offsetTop : validateNum(-parseFloat(borderTopWidth)));
      setWidth(target.offsetWidth);
      setHeight(target.offsetHeight);

      // Get border radius
      const {
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius,
      } = nodeStyle;

      setBorderRadius(
        [
          borderTopLeftRadius,
          borderTopRightRadius,
          borderBottomRightRadius,
          borderBottomLeftRadius,
        ].map(radius => validateNum(parseFloat(radius))),
      );
    }
    // Add resize observer to follow size
    let resizeObserver: ResizeObserver;
    let rafId: number;
    let timeoutId: any;
    const clear = () => {
      clearTimeout(timeoutId);
      wrapperRaf.cancel(rafId);
      resizeObserver?.disconnect();
    };
    const removeDom = () => {
      const holder = divRef.value?.parentElement;
      if (holder) {
        render(null, holder);
        if (holder.parentElement) {
          holder.parentElement.removeChild(holder);
        }
      }
    };

    onMounted(() => {
      clear();
      timeoutId = setTimeout(() => {
        removeDom();
      }, 5000);
      const { target } = props;
      if (target) {
        // We need delay to check position here
        // since UI may change after click
        rafId = wrapperRaf(() => {
          syncPos();

          setEnabled(true);
        });

        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(syncPos);

          resizeObserver.observe(target);
        }
      }
    });
    onBeforeUnmount(() => {
      clear();
    });

    const onTransitionend = (e: TransitionEvent) => {
      if (e.propertyName === 'opacity') {
        removeDom();
      }
    };
    return () => {
      if (!enabled.value) {
        return null;
      }
      const waveStyle = {
        left: `${left.value}px`,
        top: `${top.value}px`,
        width: `${width.value}px`,
        height: `${height.value}px`,
        borderRadius: borderRadius.value.map(radius => `${radius}px`).join(' '),
      } as CSSProperties & {
        [name: string]: number | string;
      };

      if (color) {
        waveStyle['--wave-color'] = color.value as string;
      }

      return (
        <Transition
          appear
          name="wave-motion"
          appearFromClass="wave-motion-appear"
          appearActiveClass="wave-motion-appear"
          appearToClass="wave-motion-appear wave-motion-appear-active"
        >
          <div
            ref={divRef}
            class={props.className}
            style={waveStyle}
            onTransitionend={onTransitionend}
          />
        </Transition>
      );
    };
  },
});

function showWaveEffect(node: HTMLElement, className: string) {
  // Create holder
  const holder = document.createElement('div');
  holder.style.position = 'absolute';
  holder.style.left = `0px`;
  holder.style.top = `0px`;
  node?.insertBefore(holder, node?.firstChild);

  render(<WaveEffect target={node} className={className} />, holder);
  return () => {
    render(null, holder);
    if (holder.parentElement) {
      holder.parentElement.removeChild(holder);
    }
  };
}

export default showWaveEffect;
