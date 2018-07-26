import _typeof from 'babel-runtime/helpers/typeof';
import _extends from 'babel-runtime/helpers/extends';

import PropTypes from '../_util/vue-types';
import Align from '../align';
import PopupInner from './PopupInner';
import LazyRenderBox from './LazyRenderBox';
import { noop } from './utils';
import animate from '../_util/css-animation';

export default {
  props: {
    visible: PropTypes.bool,
    getClassNameFromAlign: PropTypes.func,
    getRootDomNode: PropTypes.func,
    align: PropTypes.any,
    destroyPopupOnHide: PropTypes.bool,
    prefixCls: PropTypes.string,
    getContainer: PropTypes.func,
    transitionName: PropTypes.string,
    animation: PropTypes.any,
    maskAnimation: PropTypes.string,
    maskTransitionName: PropTypes.string,
    mask: PropTypes.bool,
    zIndex: PropTypes.number,
    popupClassName: PropTypes.any,
    popupStyle: PropTypes.object.def({})
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
          mouseenter: mouseenter || noop,
          mouseleave: mouseleave || noop
        },
        ref: 'popupInstance',
        style: _extends({}, this.getZIndexStyle(), popupStyle)
      };
      var transitionProps = {
        props: _extends({
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
              animate(el, transitionName + '-enter', done);
            });
          });
        },
        leave: function leave(el, done) {
          animate(el, transitionName + '-leave', done);
        },
        afterLeave: function afterLeave(el) {
          if (_this.destroyPopupOnHide) {
            _this.destroyPopup = true;
          }
        }
      };

      if ((typeof animation === 'undefined' ? 'undefined' : _typeof(animation)) === 'object') {
        useTransition = true;

        var _animation$on = animation.on,
            on = _animation$on === undefined ? {} : _animation$on,
            _animation$props = animation.props,
            _props = _animation$props === undefined ? {} : _animation$props;

        transitionProps.props = _extends({}, transitionProps.props, _props);
        transitionProps.on = _extends({}, transitionEvent, on, { afterLeave: function afterLeave(el) {
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
          Align,
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
            PopupInner,
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
        maskElement = h(LazyRenderBox, {
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