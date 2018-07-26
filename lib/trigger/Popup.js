'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _align = require('../align');

var _align2 = _interopRequireDefault(_align);

var _PopupInner = require('./PopupInner');

var _PopupInner2 = _interopRequireDefault(_PopupInner);

var _LazyRenderBox = require('./LazyRenderBox');

var _LazyRenderBox2 = _interopRequireDefault(_LazyRenderBox);

var _utils = require('./utils');

var _cssAnimation = require('../_util/css-animation');

var _cssAnimation2 = _interopRequireDefault(_cssAnimation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  props: {
    visible: _vueTypes2['default'].bool,
    getClassNameFromAlign: _vueTypes2['default'].func,
    getRootDomNode: _vueTypes2['default'].func,
    align: _vueTypes2['default'].any,
    destroyPopupOnHide: _vueTypes2['default'].bool,
    prefixCls: _vueTypes2['default'].string,
    getContainer: _vueTypes2['default'].func,
    transitionName: _vueTypes2['default'].string,
    animation: _vueTypes2['default'].any,
    maskAnimation: _vueTypes2['default'].string,
    maskTransitionName: _vueTypes2['default'].string,
    mask: _vueTypes2['default'].bool,
    zIndex: _vueTypes2['default'].number,
    popupClassName: _vueTypes2['default'].any,
    popupStyle: _vueTypes2['default'].object.def({})
  },
  data: function data() {
    return {
      destroyPopup: false
    };
  },
  beforeDestroy: function beforeDestroy() {
    this.$el.remove();
  },

  // beforeUpdate () {
  //   this.$nextTick(() => {
  //     const newContainer = this.getContainer()
  //     if (newContainer !== this._container) {
  //       this._container = newContainer
  //       this._container.appendChild(this.$el)
  //       this.$refs.alignInstance.forceAlign()
  //     }
  //   })
  // },
  watch: {
    visible: function visible(val) {
      if (val) {
        this.destroyPopup = false;
      }
    }
  },
  methods: {
    onAlign: function onAlign(popupDomNode, align) {
      var props = this.$props;
      var currentAlignClassName = props.getClassNameFromAlign(align);
      popupDomNode.className = this.getClassName(currentAlignClassName);
      this.$listeners.align && this.$listeners.align(popupDomNode, align);
    },
    getPopupDomNode: function getPopupDomNode() {
      return this.$refs.popupInstance ? this.$refs.popupInstance.$el : null;
    },
    getTarget: function getTarget() {
      return this.$props.getRootDomNode();
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
      if (!transitionName) {
        if (typeof animation === 'string') {
          transitionName = '' + animation;
        } else if (animation && animation.props && animation.props.name) {
          transitionName = animation.props.name;
        }
      }
      return transitionName;
    },
    getClassName: function getClassName(currentAlignClassName) {
      return this.$props.prefixCls + ' ' + this.$props.popupClassName + ' ' + currentAlignClassName;
    },
    getPopupElement: function getPopupElement() {
      var _this = this;

      var h = this.$createElement;
      var props = this.$props,
          $slots = this.$slots,
          $listeners = this.$listeners,
          getTransitionName = this.getTransitionName;
      var align = props.align,
          visible = props.visible,
          prefixCls = props.prefixCls,
          animation = props.animation,
          popupStyle = props.popupStyle;
      var mouseenter = $listeners.mouseenter,
          mouseleave = $listeners.mouseleave;

      var className = this.getClassName(props.getClassNameFromAlign(align));
      // const hiddenClassName = `${prefixCls}-hidden`
      var popupInnerProps = {
        props: {
          prefixCls: prefixCls,
          visible: visible
          // hiddenClassName,
        },
        'class': className,
        on: {
          mouseenter: mouseenter || _utils.noop,
          mouseleave: mouseleave || _utils.noop
        },
        ref: 'popupInstance',
        style: (0, _extends3['default'])({}, this.getZIndexStyle(), popupStyle)
      };
      var transitionProps = {
        props: (0, _extends3['default'])({
          appear: true,
          css: false
        })
      };
      var transitionName = getTransitionName();
      var useTransition = !!transitionName;
      var transitionEvent = {
        beforeEnter: function beforeEnter(el) {
          // el.style.display = el.__vOriginalDisplay
          // this.$refs.alignInstance.forceAlign()
        },
        enter: function enter(el, done) {
          // align updated后执行动画
          _this.$nextTick(function () {
            _this.$refs.alignInstance.$nextTick(function () {
              (0, _cssAnimation2['default'])(el, transitionName + '-enter', done);
            });
          });
        },
        leave: function leave(el, done) {
          (0, _cssAnimation2['default'])(el, transitionName + '-leave', done);
        },
        afterLeave: function afterLeave(el) {
          if (_this.destroyPopupOnHide) {
            _this.destroyPopup = true;
          }
        }
      };

      if ((typeof animation === 'undefined' ? 'undefined' : (0, _typeof3['default'])(animation)) === 'object') {
        useTransition = true;

        var _animation$on = animation.on,
            on = _animation$on === undefined ? {} : _animation$on,
            _animation$props = animation.props,
            _props = _animation$props === undefined ? {} : _animation$props;

        transitionProps.props = (0, _extends3['default'])({}, transitionProps.props, _props);
        transitionProps.on = (0, _extends3['default'])({}, transitionEvent, on, { afterLeave: function afterLeave(el) {
            transitionEvent.afterLeave(el);
            on.afterLeave && on.afterLeave(el);
          } });
      } else {
        transitionProps.on = transitionEvent;
      }
      if (!useTransition) {
        transitionProps = {};
      }
      return h(
        'transition',
        transitionProps,
        [h(
          _align2['default'],
          {
            directives: [{
              name: 'show',
              value: visible
            }],
            attrs: {
              target: this.getTarget,

              monitorWindowResize: true,
              align: align,

              visible: visible
            },
            key: 'popup',
            ref: 'alignInstance', on: {
              'align': this.onAlign
            }
          },
          [h(
            _PopupInner2['default'],
            popupInnerProps,
            [$slots['default']]
          )]
        )]
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
    getMaskElement: function getMaskElement() {
      var h = this.$createElement;

      var props = this.$props;
      var maskElement = null;
      if (props.mask) {
        var maskTransition = this.getMaskTransitionName();
        maskElement = h(_LazyRenderBox2['default'], {
          directives: [{
            name: 'show',
            value: props.visible
          }],

          style: this.getZIndexStyle(),
          key: 'mask',
          'class': props.prefixCls + '-mask',
          attrs: { visible: props.visible
          }
        });
        if (maskTransition) {
          maskElement = h(
            'transition',
            {
              attrs: {
                appear: true,
                name: maskTransition
              }
            },
            [maskElement]
          );
        }
      }
      return maskElement;
    }
  },

  render: function render() {
    var h = arguments[0];
    var destroyPopup = this.destroyPopup,
        getMaskElement = this.getMaskElement,
        getPopupElement = this.getPopupElement,
        visible = this.visible;

    return h('div', [getMaskElement(), visible || !destroyPopup ? getPopupElement() : null]);
  }
};
module.exports = exports['default'];