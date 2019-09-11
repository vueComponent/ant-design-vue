import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import addEventListener from '../_util/Dom/addEventListener';
import Affix from '../affix';
import getScroll from '../_util/getScroll';
import raf from 'raf';
import { initDefaultProps } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import { ConfigConsumerProps } from '../config-provider';

function getDefaultContainer() {
  return window;
}

function getOffsetTop(element, container) {
  if (!element) {
    return 0;
  }

  if (!element.getClientRects().length) {
    return 0;
  }

  const rect = element.getBoundingClientRect();

  if (rect.width || rect.height) {
    if (container === window) {
      container = element.ownerDocument.documentElement;
      return rect.top - container.clientTop;
    }
    return rect.top - container.getBoundingClientRect().top;
  }

  return rect.top;
}

function easeInOutCubic(t, b, c, d) {
  const cc = c - b;
  t /= d / 2;
  if (t < 1) {
    return (cc / 2) * t * t * t + b;
  }
  return (cc / 2) * ((t -= 2) * t * t + 2) + b;
}

const sharpMatcherRegx = /#([^#]+)$/;
function scrollTo(href, offsetTop = 0, getContainer, callback = () => {}) {
  const container = getContainer();
  const scrollTop = getScroll(container, true);
  const sharpLinkMatch = sharpMatcherRegx.exec(href);
  if (!sharpLinkMatch) {
    return;
  }
  const targetElement = document.getElementById(sharpLinkMatch[1]);
  if (!targetElement) {
    return;
  }
  const eleOffsetTop = getOffsetTop(targetElement, container);
  const targetScrollTop = scrollTop + eleOffsetTop - offsetTop;
  const startTime = Date.now();
  const frameFunc = () => {
    const timestamp = Date.now();
    const time = timestamp - startTime;
    const nextScrollTop = easeInOutCubic(time, scrollTop, targetScrollTop, 450);
    if (container === window) {
      window.scrollTo(window.pageXOffset, nextScrollTop);
    } else {
      container.scrollTop = nextScrollTop;
    }
    if (time < 450) {
      raf(frameFunc);
    } else {
      callback();
    }
  };
  raf(frameFunc);
}

export const AnchorProps = {
  prefixCls: PropTypes.string,
  offsetTop: PropTypes.number,
  bounds: PropTypes.number,
  affix: PropTypes.bool,
  showInkInFixed: PropTypes.bool,
  getContainer: PropTypes.func,
  wrapperClass: PropTypes.string,
  wrapperStyle: PropTypes.object,
};

export default {
  name: 'AAnchor',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: initDefaultProps(AnchorProps, {
    affix: true,
    showInkInFixed: false,
    getContainer: getDefaultContainer,
  }),
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    this.links = [];
    this._sPrefixCls = '';
    return {
      activeLink: null,
    };
  },
  provide() {
    return {
      antAnchor: {
        registerLink: link => {
          if (!this.links.includes(link)) {
            this.links.push(link);
          }
        },
        unregisterLink: link => {
          const index = this.links.indexOf(link);
          if (index !== -1) {
            this.links.splice(index, 1);
          }
        },
        $data: this.$data,
        scrollTo: this.handleScrollTo,
      },
      antAnchorContext: this,
    };
  },

  mounted() {
    this.$nextTick(() => {
      const { getContainer } = this;
      this.scrollEvent = addEventListener(getContainer(), 'scroll', this.handleScroll);
      this.handleScroll();
    });
  },

  beforeDestroy() {
    if (this.scrollEvent) {
      this.scrollEvent.remove();
    }
  },

  updated() {
    this.$nextTick(() => {
      this.updateInk();
    });
  },
  methods: {
    handleScroll() {
      if (this.animating) {
        return;
      }
      const { offsetTop, bounds } = this;
      this.setState({
        activeLink: this.getCurrentAnchor(offsetTop, bounds),
      });
    },

    handleScrollTo(link) {
      const { offsetTop, getContainer } = this;
      this.animating = true;
      this.setState({ activeLink: link });
      scrollTo(link, offsetTop, getContainer, () => {
        this.animating = false;
      });
    },

    getCurrentAnchor(offsetTop = 0, bounds = 5) {
      const activeLink = '';
      if (typeof document === 'undefined') {
        return activeLink;
      }

      const linkSections = [];
      const { getContainer } = this;
      const container = getContainer();
      this.links.forEach(link => {
        const sharpLinkMatch = sharpMatcherRegx.exec(link.toString());
        if (!sharpLinkMatch) {
          return;
        }
        const target = document.getElementById(sharpLinkMatch[1]);
        if (target) {
          const top = getOffsetTop(target, container);
          if (top < offsetTop + bounds) {
            linkSections.push({
              link,
              top,
            });
          }
        }
      });

      if (linkSections.length) {
        const maxSection = linkSections.reduce((prev, curr) => (curr.top > prev.top ? curr : prev));
        return maxSection.link;
      }
      return '';
    },

    updateInk() {
      if (typeof document === 'undefined') {
        return;
      }
      const { _sPrefixCls } = this;
      const linkNode = this.$el.getElementsByClassName(`${_sPrefixCls}-link-title-active`)[0];
      if (linkNode) {
        this.$refs.linkNode.style.top = `${linkNode.offsetTop + linkNode.clientHeight / 2 - 4.5}px`;
      }
    },
  },

  render() {
    const {
      prefixCls: customizePrefixCls,
      offsetTop,
      affix,
      showInkInFixed,
      activeLink,
      $slots,
      getContainer,
    } = this;

    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('anchor', customizePrefixCls);
    this._sPrefixCls = prefixCls;

    const inkClass = classNames(`${prefixCls}-ink-ball`, {
      visible: activeLink,
    });

    const wrapperClass = classNames(this.wrapperClass, `${prefixCls}-wrapper`);

    const anchorClass = classNames(prefixCls, {
      fixed: !affix && !showInkInFixed,
    });

    const wrapperStyle = {
      maxHeight: offsetTop ? `calc(100vh - ${offsetTop}px)` : '100vh',
      ...this.wrapperStyle,
    };

    const anchorContent = (
      <div class={wrapperClass} style={wrapperStyle}>
        <div class={anchorClass}>
          <div class={`${prefixCls}-ink`}>
            <span class={inkClass} ref="linkNode" />
          </div>
          {$slots.default}
        </div>
      </div>
    );

    return !affix ? (
      anchorContent
    ) : (
      <Affix offsetTop={offsetTop} target={getContainer}>
        {anchorContent}
      </Affix>
    );
  },
};
