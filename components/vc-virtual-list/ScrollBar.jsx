import classNames from '../_util/classNames';
import createRef from '../_util/createRef';
import raf from '../_util/raf';
import PropTypes from '../_util/vue-types';

const MIN_SIZE = 20;

// export interface ScrollBarProps {
//   prefixCls: string;
//   scrollTop: number;
//   scrollHeight: number;
//   height: number;
//   count: number;
//   onScroll: (scrollTop: number) => void;
//   onStartMove: () => void;
//   onStopMove: () => void;
// }

// interface ScrollBarState {
//   dragging: boolean;
//   pageY: number;
//   startTop: number;
//   visible: boolean;
// }

function getPageY(e) {
  return 'touches' in e ? e.touches[0].pageY : e.pageY;
}

export default {
  name: 'ScrollBar',
  inheritAttrs: false,
  props: {
    prefixCls: PropTypes.string,
    scrollTop: PropTypes.number,
    scrollHeight: PropTypes.number,
    height: PropTypes.number,
    count: PropTypes.number,
    onScroll: PropTypes.func,
    onStartMove: PropTypes.func,
    onStopMove: PropTypes.func,
  },
  setup() {
    return {
      moveRaf: null,
      scrollbarRef: createRef(),
      thumbRef: createRef(),
      visibleTimeout: null,
      state: {
        dragging: false,
        pageY: null,
        startTop: null,
        visible: false,
      },
    };
  },
  watch: {
    scrollTop: {
      handler() {
        this.delayHidden();
      },
      flush: 'post',
    },
  },

  mounted() {
    this.scrollbarRef.current.addEventListener('touchstart', this.onScrollbarTouchStart);
    this.thumbRef.current.addEventListener('touchstart', this.onMouseDown);
  },

  beforeUnmount() {
    this.removeEvents();
    clearTimeout(this.visibleTimeout);
  },
  methods: {
    delayHidden() {
      clearTimeout(this.visibleTimeout);
      this.state.visible = true;

      this.visibleTimeout = setTimeout(() => {
        this.state.visible = false;
        this.$forceUpdate(); // why ?
      }, 2000);
    },

    onScrollbarTouchStart(e) {
      e.preventDefault();
    },

    onContainerMouseDown(e) {
      e.stopPropagation();
      e.preventDefault();
    },

    // ======================= Clean =======================
    patchEvents() {
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);

      this.thumbRef.current.addEventListener('touchmove', this.onMouseMove);
      this.thumbRef.current.addEventListener('touchend', this.onMouseUp);
    },

    removeEvents() {
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);

      this.scrollbarRef.current.removeEventListener('touchstart', this.onScrollbarTouchStart);
      this.thumbRef.current.removeEventListener('touchstart', this.onMouseDown);
      this.thumbRef.current.removeEventListener('touchmove', this.onMouseMove);
      this.thumbRef.current.removeEventListener('touchend', this.onMouseUp);

      raf.cancel(this.moveRaf);
    },

    // ======================= Thumb =======================
    onMouseDown(e) {
      const { onStartMove } = this.$props;

      Object.assign(this.state, {
        dragging: true,
        pageY: getPageY(e),
        startTop: this.getTop(),
      });

      onStartMove();
      this.patchEvents();
      e.stopPropagation();
      e.preventDefault();
    },

    onMouseMove(e) {
      const { dragging, pageY, startTop } = this.state;
      const { onScroll } = this.$props;

      raf.cancel(this.moveRaf);

      if (dragging) {
        const offsetY = getPageY(e) - pageY;
        const newTop = startTop + offsetY;

        const enableScrollRange = this.getEnableScrollRange();
        const enableHeightRange = this.getEnableHeightRange();

        const ptg = newTop / enableHeightRange;
        const newScrollTop = Math.ceil(ptg * enableScrollRange);
        this.moveRaf = raf(() => {
          onScroll(newScrollTop);
        });
      }
    },

    onMouseUp() {
      const { onStopMove } = this.$props;
      this.state.dragging = false;

      onStopMove();
      this.removeEvents();
    },

    // ===================== Calculate =====================
    getSpinHeight() {
      const { height, count } = this.$props;
      let baseHeight = (height / count) * 10;
      baseHeight = Math.max(baseHeight, MIN_SIZE);
      baseHeight = Math.min(baseHeight, height / 2);
      return Math.floor(baseHeight);
    },

    getEnableScrollRange() {
      const { scrollHeight, height } = this.$props;
      return scrollHeight - height;
    },

    getEnableHeightRange() {
      const { height } = this.$props;
      const spinHeight = this.getSpinHeight();
      return height - spinHeight;
    },

    getTop() {
      const { scrollTop } = this.$props;
      const enableScrollRange = this.getEnableScrollRange();
      const enableHeightRange = this.getEnableHeightRange();
      const ptg = scrollTop / enableScrollRange;
      return ptg * enableHeightRange;
    },
  },

  render() {
    // eslint-disable-next-line no-unused-vars
    const { visible, dragging } = this.state;
    const { prefixCls } = this.$props;
    const spinHeight = this.getSpinHeight() + 'px';
    const top = this.getTop() + 'px';
    return (
      <div
        ref={this.scrollbarRef}
        class={`${prefixCls}-scrollbar`}
        style={{
          width: '8px',
          top: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: visible ? null : 'none',
        }}
        onMousedown={this.onContainerMouseDown}
        onMousemove={this.delayHidden}
      >
        <div
          ref={this.thumbRef}
          class={classNames(`${prefixCls}-scrollbar-thumb`, {
            [`${prefixCls}-scrollbar-thumb-moving`]: dragging,
          })}
          style={{
            width: '100%',
            height: spinHeight,
            top,
            left: 0,
            position: 'absolute',
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '99px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onMousedown={this.onMouseDown}
        />
      </div>
    );
  },
};
