'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _KeyCode = require('../_util/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _LazyRenderBox = require('./LazyRenderBox');

var _LazyRenderBox2 = _interopRequireDefault(_LazyRenderBox);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _getTransitionProps = require('../_util/getTransitionProps');

var _getTransitionProps2 = _interopRequireDefault(_getTransitionProps);

var _getScrollBarSize = require('../_util/getScrollBarSize');

var _getScrollBarSize2 = _interopRequireDefault(_getScrollBarSize);

var _IDialogPropTypes = require('./IDialogPropTypes');

var _IDialogPropTypes2 = _interopRequireDefault(_IDialogPropTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var IDialogPropTypes = (0, _IDialogPropTypes2['default'])();

var uuid = 0;
var openCount = 0;

/* eslint react/no-is-mounted:0 */
function noop() {}
function getScroll(w, top) {
  var ret = w['page' + (top ? 'Y' : 'X') + 'Offset'];
  var method = 'scroll' + (top ? 'Top' : 'Left');
  if (typeof ret !== 'number') {
    var d = w.document;
    ret = d.documentElement[method];
    if (typeof ret !== 'number') {
      ret = d.body[method];
    }
  }
  return ret;
}

function setTransformOrigin(node, value) {
  var style = node.style;
  ['Webkit', 'Moz', 'Ms', 'ms'].forEach(function (prefix) {
    style[prefix + 'TransformOrigin'] = value;
  });
  style['transformOrigin'] = value;
}

function offset(el) {
  var rect = el.getBoundingClientRect();
  var pos = {
    left: rect.left,
    top: rect.top
  };
  var doc = el.ownerDocument;
  var w = doc.defaultView || doc.parentWindow;
  pos.left += getScroll(w);
  pos.top += getScroll(w, true);
  return pos;
}
var initDefaultProps = function initDefaultProps(propTypes, defaultProps) {
  return Object.keys(defaultProps).map(function (k) {
    return propTypes[k].def(defaultProps[k]);
  });
};
exports['default'] = {
  mixins: [_BaseMixin2['default']],
  props: (0, _extends4['default'])({}, IDialogPropTypes, initDefaultProps(IDialogPropTypes, {
    mask: true,
    visible: false,
    keyboard: true,
    closable: true,
    maskClosable: true,
    destroyOnClose: false,
    prefixCls: 'rc-dialog'
  })),
  data: function data() {
    return {
      destroyPopup: false
    };
  },


  // private inTransition: boolean;
  // private titleId: string;
  // private openTime: number;
  // private lastOutSideFocusNode: HTMLElement | null;
  // private wrap: HTMLElement;
  // private dialog: any;
  // private sentinel: HTMLElement;
  // private bodyIsOverflowing: boolean;
  // private scrollbarWidth: number;

  beforeMount: function beforeMount() {
    this.inTransition = false;
    this.titleId = 'rcDialogTitle' + uuid++;
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.updatedCallback(false);
    });
  },


  watch: {
    visible: function visible(val) {
      var _this2 = this;

      if (val) {
        this.destroyPopup = false;
      }
      this.$nextTick(function () {
        _this2.updatedCallback(!val);
      });
    }
  },
  beforeDestroy: function beforeDestroy() {
    if (this.visible || this.inTransition) {
      this.removeScrollingEffect();
    }
  },

  methods: {
    updatedCallback: function updatedCallback(visible) {
      var mousePosition = this.mousePosition;
      if (this.visible) {
        // first show
        if (!visible) {
          this.openTime = Date.now();
          this.lastOutSideFocusNode = document.activeElement;
          this.addScrollingEffect();
          this.$refs.wrap.focus();
          var dialogNode = this.$refs.dialog.$el;
          if (mousePosition) {
            var elOffset = offset(dialogNode);
            setTransformOrigin(dialogNode, mousePosition.x - elOffset.left + 'px ' + (mousePosition.y - elOffset.top) + 'px');
          } else {
            setTransformOrigin(dialogNode, '');
          }
        }
      } else if (visible) {
        this.inTransition = true;
        if (this.mask && this.lastOutSideFocusNode) {
          try {
            this.lastOutSideFocusNode.focus();
          } catch (e) {
            this.lastOutSideFocusNode = null;
          }
          this.lastOutSideFocusNode = null;
        }
      }
    },
    onAnimateLeave: function onAnimateLeave() {
      var afterClose = this.afterClose,
          destroyOnClose = this.destroyOnClose;
      // need demo?
      // https://github.com/react-component/dialog/pull/28

      if (this.$refs.wrap) {
        this.$refs.wrap.style.display = 'none';
      }
      if (destroyOnClose) {
        this.destroyPopup = true;
      }
      this.inTransition = false;
      this.removeScrollingEffect();
      if (afterClose) {
        afterClose();
      }
    },
    onMaskClick: function onMaskClick(e) {
      // android trigger click on open (fastclick??)
      if (Date.now() - this.openTime < 300) {
        return;
      }
      if (e.target === e.currentTarget) {
        this.close(e);
      }
    },
    onKeydown: function onKeydown(e) {
      var props = this.$props;
      if (props.keyboard && e.keyCode === _KeyCode2['default'].ESC) {
        this.close(e);
      }
      // keep focus inside dialog
      if (props.visible) {
        if (e.keyCode === _KeyCode2['default'].TAB) {
          var activeElement = document.activeElement;
          var dialogRoot = this.$refs.wrap;
          if (e.shiftKey) {
            if (activeElement === dialogRoot) {
              this.$refs.sentinel.focus();
            }
          } else if (activeElement === this.$refs.sentinel) {
            dialogRoot.focus();
          }
        }
      }
    },
    getDialogElement: function getDialogElement() {
      var h = this.$createElement;
      var closable = this.closable,
          prefixCls = this.prefixCls,
          width = this.width,
          height = this.height,
          title = this.title,
          tempFooter = this.footer,
          bodyStyle = this.bodyStyle,
          visible = this.visible,
          bodyProps = this.bodyProps;

      var dest = {};
      if (width !== undefined) {
        dest.width = typeof width === 'number' ? width + 'px' : width;
      }
      if (height !== undefined) {
        dest.height = typeof height === 'number' ? height + 'px' : height;
      }

      var footer = void 0;
      if (tempFooter) {
        footer = h(
          'div',
          { 'class': prefixCls + '-footer', ref: 'footer' },
          [tempFooter]
        );
      }

      var header = void 0;
      if (title) {
        header = h(
          'div',
          { 'class': prefixCls + '-header', ref: 'header' },
          [h(
            'div',
            { 'class': prefixCls + '-title', attrs: { id: this.titleId }
            },
            [title]
          )]
        );
      }

      var closer = void 0;
      if (closable) {
        closer = h(
          'button',
          {
            key: 'close',
            on: {
              'click': this.close || noop
            },
            attrs: {
              'aria-label': 'Close'
            },
            'class': prefixCls + '-close'
          },
          [h('span', { 'class': prefixCls + '-close-x' })]
        );
      }

      var style = (0, _extends4['default'])({}, this.dialogStyle, dest);
      var cls = (0, _extends4['default'])((0, _defineProperty3['default'])({}, prefixCls, true), this.dialogClass);
      var transitionName = this.getTransitionName();
      var dialogElement = h(
        _LazyRenderBox2['default'],
        {
          directives: [{
            name: 'show',
            value: visible
          }],

          key: 'dialog-element',
          attrs: { role: 'document'
          },
          ref: 'dialog',
          style: style,
          'class': cls
        },
        [h(
          'div',
          { 'class': prefixCls + '-content' },
          [closer, header, h(
            'div',
            (0, _babelHelperVueJsxMergeProps2['default'])([{
              'class': prefixCls + '-body',
              style: bodyStyle,
              ref: 'body'
            }, bodyProps]),
            [this.$slots['default']]
          ), footer]
        ), h(
          'div',
          {
            attrs: { tabIndex: 0 },
            ref: 'sentinel', style: 'width: 0px; height: 0px; overflow: hidden' },
          ['sentinel']
        )]
      );
      var dialogTransitionProps = (0, _getTransitionProps2['default'])(transitionName, {
        afterLeave: this.onAnimateLeave
      });
      return h(
        'transition',
        (0, _babelHelperVueJsxMergeProps2['default'])([{
          key: 'dialog'
        }, dialogTransitionProps]),
        [visible || !this.destroyPopup ? dialogElement : null]
      );
    },
    getZIndexStyle: function getZIndexStyle() {
      var style = {};
      var props = this.$props;
      if (props.zIndex !== undefined) {
        style.zIndex = props.zIndex;
      }
      return style;
    },
    getWrapStyle: function getWrapStyle() {
      return (0, _extends4['default'])({}, this.getZIndexStyle(), this.wrapStyle);
    },
    getMaskStyle: function getMaskStyle() {
      return (0, _extends4['default'])({}, this.getZIndexStyle(), this.maskStyle);
    },
    getMaskElement: function getMaskElement() {
      var h = this.$createElement;

      var props = this.$props;
      var maskElement = void 0;
      if (props.mask) {
        var maskTransition = this.getMaskTransitionName();
        maskElement = h(_LazyRenderBox2['default'], (0, _babelHelperVueJsxMergeProps2['default'])([{
          directives: [{
            name: 'show',
            value: props.visible
          }],

          style: this.getMaskStyle(),
          key: 'mask',
          'class': props.prefixCls + '-mask'
        }, props.maskProps]));
        if (maskTransition) {
          var maskTransitionProps = (0, _getTransitionProps2['default'])(maskTransition);
          maskElement = h(
            'transition',
            (0, _babelHelperVueJsxMergeProps2['default'])([{
              key: 'mask'
            }, maskTransitionProps]),
            [maskElement]
          );
        }
      }
      return maskElement;
    },
    getMaskTransitionName: function getMaskTransitionName() {
      var props = this.$props;
      var transitionName = props.maskTransitionName;
      var animation = props.maskAnimation;
      if (!transitionName && animation) {
        transitionName = props.prefixCls + '-' + animation;
      }
      return transitionName;
    },
    getTransitionName: function getTransitionName() {
      var props = this.$props;
      var transitionName = props.transitionName;
      var animation = props.animation;
      if (!transitionName && animation) {
        transitionName = props.prefixCls + '-' + animation;
      }
      return transitionName;
    },
    setScrollbar: function setScrollbar() {
      if (this.bodyIsOverflowing && this.scrollbarWidth !== undefined) {
        document.body.style.paddingRight = this.scrollbarWidth + 'px';
      }
    },
    addScrollingEffect: function addScrollingEffect() {
      openCount++;
      if (openCount !== 1) {
        return;
      }
      this.checkScrollbar();
      this.setScrollbar();
      document.body.style.overflow = 'hidden';
      // this.adjustDialog();
    },
    removeScrollingEffect: function removeScrollingEffect() {
      openCount--;
      if (openCount !== 0) {
        return;
      }
      document.body.style.overflow = '';
      this.resetScrollbar();
      // this.resetAdjustments();
    },
    close: function close(e) {
      this.__emit('close', e);
    },
    checkScrollbar: function checkScrollbar() {
      var fullWindowWidth = window.innerWidth;
      if (!fullWindowWidth) {
        // workaround for missing window.innerWidth in IE8
        var documentElementRect = document.documentElement.getBoundingClientRect();
        fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
      }
      this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
      if (this.bodyIsOverflowing) {
        this.scrollbarWidth = (0, _getScrollBarSize2['default'])();
      }
    },
    resetScrollbar: function resetScrollbar() {
      document.body.style.paddingRight = '';
    },
    adjustDialog: function adjustDialog() {
      if (this.$refs.wrap && this.scrollbarWidth !== undefined) {
        var modalIsOverflowing = this.$refs.wrap.scrollHeight > document.documentElement.clientHeight;
        this.$refs.wrap.style.paddingLeft = (!this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '') + 'px';
        this.$refs.wrap.style.paddingRight = (this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : '') + 'px';
      }
    },
    resetAdjustments: function resetAdjustments() {
      if (this.$refs.wrap) {
        this.$refs.wrap.style.paddingLeft = this.$refs.wrap.style.paddingLeft = '';
      }
    }
  },
  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        maskClosable = this.maskClosable,
        visible = this.visible,
        wrapClassName = this.wrapClassName,
        title = this.title,
        wrapProps = this.wrapProps;

    var style = this.getWrapStyle();
    // clear hide display
    // and only set display after async anim, not here for hide
    if (visible) {
      style.display = null;
    }
    return h('div', [this.getMaskElement(), h(
      'div',
      (0, _babelHelperVueJsxMergeProps2['default'])([{
        attrs: {
          tabIndex: -1,

          role: 'dialog',
          'aria-labelledby': title ? this.titleId : null
        },
        on: {
          'keydown': this.onKeydown,
          'click': maskClosable ? this.onMaskClick : noop
        },

        'class': prefixCls + '-wrap ' + (wrapClassName || ''),
        ref: 'wrap',
        style: style
      }, wrapProps]),
      [this.getDialogElement()]
    )]);
  }
};
module.exports = exports['default'];