import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import addEventListener from '../_util/Dom/addEventListener';
import Affix from '../affix';
import getScroll from '../_util/getScroll';
import getRequestAnimationFrame from '../_util/getRequestAnimationFrame';
import { initDefaultProps, getClass, getStyle } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';

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

  var rect = element.getBoundingClientRect();

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
  var cc = c - b;
  t /= d / 2;
  if (t < 1) {
    return cc / 2 * t * t * t + b;
  }
  return cc / 2 * ((t -= 2) * t * t + 2) + b;
}

var reqAnimFrame = getRequestAnimationFrame();
var sharpMatcherRegx = /#([^#]+)$/;
function scrollTo(href) {
  var offsetTop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var getContainer = arguments[2];
  var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};

  var container = getContainer();
  var scrollTop = getScroll(container, true);
  var sharpLinkMatch = sharpMatcherRegx.exec(href);
  if (!sharpLinkMatch) {
    return;
  }
  var targetElement = document.getElementById(sharpLinkMatch[1]);
  if (!targetElement) {
    return;
  }
  var eleOffsetTop = getOffsetTop(targetElement, container);
  var targetScrollTop = scrollTop + eleOffsetTop - offsetTop;
  var startTime = Date.now();
  var frameFunc = function frameFunc() {
    var timestamp = Date.now();
    var time = timestamp - startTime;
    var nextScrollTop = easeInOutCubic(time, scrollTop, targetScrollTop, 450);
    if (container === window) {
      window.scrollTo(window.pageXOffset, nextScrollTop);
    } else {
      container.scrollTop = nextScrollTop;
    }
    if (time < 450) {
      reqAnimFrame(frameFunc);
    } else {
      callback();
    }
  };
  reqAnimFrame(frameFunc);
  history.pushState(null, '', href);
}

export var AnchorProps = {
  prefixCls: PropTypes.string,
  offsetTop: PropTypes.number,
  bounds: PropTypes.number,
  affix: PropTypes.bool,
  showInkInFixed: PropTypes.bool,
  getContainer: PropTypes.func
};

export default {
  name: 'AAnchor',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: initDefaultProps(AnchorProps, {
    prefixCls: 'ant-anchor',
    affix: true,
    showInkInFixed: false,
    getContainer: getDefaultContainer
  }),

  data: function data() {
    this.links = [];
    return {
      activeLink: null
    };
  },
  provide: function provide() {
    var _this = this;

    return {
      antAnchor: {
        registerLink: function registerLink(link) {
          if (!_this.links.includes(link)) {
            _this.links.push(link);
          }
        },
        unregisterLink: function unregisterLink(link) {
          var index = _this.links.indexOf(link);
          if (index !== -1) {
            _this.links.splice(index, 1);
          }
        },
        $data: this.$data,
        scrollTo: this.handleScrollTo
      }
    };
  },
  mounted: function mounted() {
    var _this2 = this;

    this.$nextTick(function () {
      var getContainer = _this2.getContainer;

      _this2.scrollEvent = addEventListener(getContainer(), 'scroll', _this2.handleScroll);
      _this2.handleScroll();
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this.scrollEvent) {
      this.scrollEvent.remove();
    }
  },
  updated: function updated() {
    var _this3 = this;

    this.$nextTick(function () {
      _this3.updateInk();
    });
  },

  methods: {
    handleScroll: function handleScroll() {
      if (this.animating) {
        return;
      }
      var offsetTop = this.offsetTop,
          bounds = this.bounds;

      this.setState({
        activeLink: this.getCurrentAnchor(offsetTop, bounds)
      });
    },
    handleScrollTo: function handleScrollTo(link) {
      var _this4 = this;

      var offsetTop = this.offsetTop,
          getContainer = this.getContainer;

      this.animating = true;
      this.setState({ activeLink: link });
      scrollTo(link, offsetTop, getContainer, function () {
        _this4.animating = false;
      });
    },
    getCurrentAnchor: function getCurrentAnchor() {
      var offsetTop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var bounds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

      var activeLink = '';
      if (typeof document === 'undefined') {
        return activeLink;
      }

      var linkSections = [];
      var getContainer = this.getContainer;

      var container = getContainer();
      this.links.forEach(function (link) {
        var sharpLinkMatch = sharpMatcherRegx.exec(link.toString());
        if (!sharpLinkMatch) {
          return;
        }
        var target = document.getElementById(sharpLinkMatch[1]);
        if (target) {
          var top = getOffsetTop(target, container);
          if (top < offsetTop + bounds) {
            linkSections.push({
              link: link,
              top: top
            });
          }
        }
      });

      if (linkSections.length) {
        var maxSection = linkSections.reduce(function (prev, curr) {
          return curr.top > prev.top ? curr : prev;
        });
        return maxSection.link;
      }
      return '';
    },
    updateInk: function updateInk() {
      if (typeof document === 'undefined') {
        return;
      }
      var prefixCls = this.prefixCls;

      var linkNode = this.$el.getElementsByClassName(prefixCls + '-link-title-active')[0];
      if (linkNode) {
        this.$refs.linkNode.style.top = linkNode.offsetTop + linkNode.clientHeight / 2 - 4.5 + 'px';
      }
    }
  },

  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        offsetTop = this.offsetTop,
        affix = this.affix,
        showInkInFixed = this.showInkInFixed,
        activeLink = this.activeLink,
        $slots = this.$slots;


    var inkClass = classNames(prefixCls + '-ink-ball', {
      visible: activeLink
    });

    var wrapperClass = classNames(getClass(this), prefixCls + '-wrapper');

    var anchorClass = classNames(prefixCls, {
      'fixed': !affix && !showInkInFixed
    });

    var wrapperStyle = {
      maxHeight: offsetTop ? 'calc(100vh - ' + offsetTop + 'px)' : '100vh'
      // ...getStyle(this, true),
    };

    var anchorContent = h(
      'div',
      {
        'class': wrapperClass,
        style: wrapperStyle
      },
      [h(
        'div',
        { 'class': anchorClass },
        [h(
          'div',
          { 'class': prefixCls + '-ink' },
          [h('span', { 'class': inkClass, ref: 'linkNode' })]
        ), $slots['default']]
      )]
    );

    return !affix ? anchorContent : h(
      Affix,
      {
        attrs: { offsetTop: offsetTop }
      },
      [anchorContent]
    );
  }
};