// based on rc-resize-observer 0.1.3
import ResizeObserver from 'resize-observer-polyfill';

// Still need to be compatible with React 15, we use class component here
const VueResizeObserver = {
  name: 'ResizeObserver',
  props: {
    disabled: Boolean,
  },
  data() {
    this.currentElement = null;
    this.resizeObserver = null;
    return {
      width: 0,
      height: 0,
    };
  },

  mounted() {
    this.onComponentUpdated();
  },

  updated() {
    this.onComponentUpdated();
  },
  beforeDestroy() {
    this.destroyObserver();
  },
  methods: {
    onComponentUpdated() {
      const { disabled } = this.$props;

      // Unregister if disabled
      if (disabled) {
        this.destroyObserver();
        return;
      }

      // Unregister if element changed
      const element = this.$el;
      const elementChanged = element !== this.currentElement;
      if (elementChanged) {
        this.destroyObserver();
        this.currentElement = element;
      }

      if (!this.resizeObserver && element) {
        this.resizeObserver = new ResizeObserver(this.onResize);
        this.resizeObserver.observe(element);
      }
    },

    onResize(entries) {
      const { target } = entries[0];
      const { width, height } = target.getBoundingClientRect();
      /**
       * Resize observer trigger when content size changed.
       * In most case we just care about element size,
       * let's use `boundary` instead of `contentRect` here to avoid shaking.
       */
      const fixedWidth = Math.floor(width);
      const fixedHeight = Math.floor(height);

      if (this.width !== fixedWidth || this.height !== fixedHeight) {
        const size = { width: fixedWidth, height: fixedHeight };
        this.width = fixedWidth;
        this.height = fixedHeight;
        this.$emit('resize', size);
      }
    },

    destroyObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
    },
  },

  render() {
    return this.$slots.default[0];
  },
};

export default VueResizeObserver;
