import classnames from 'classnames';
import Vue from 'vue';
import ref from 'vue-ref';
import BaseMixin from '../../_util/BaseMixin';
import { initDefaultProps, getEvents, getListeners } from '../../_util/props-util';
import { cloneElement } from '../../_util/vnode';
import ContainerRender from '../../_util/ContainerRender';
import getScrollBarSize from '../../_util/getScrollBarSize';
import drawerProps from './drawerProps';
import {
  dataToArray,
  transitionEnd,
  transitionStr,
  addEventListener,
  removeEventListener,
  transformArguments,
  isNumeric,
} from './utils';

function noop() {}

const currentDrawer = {};
const windowIsUndefined = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

Vue.use(ref, { name: 'ant-ref' });
const Drawer = {
  mixins: [BaseMixin],
  props: initDefaultProps(drawerProps, {
    prefixCls: 'drawer',
    placement: 'left',
    getContainer: 'body',
    level: 'all',
    duration: '.3s',
    ease: 'cubic-bezier(0.78, 0.14, 0.15, 0.86)',
    firstEnter: false, // 记录首次进入.
    showMask: true,
    handler: true,
    maskStyle: {},
    wrapperClassName: '',
    className: '',
  }),
  data() {
    this.levelDom = [];
    this.contentDom = null;
    this.maskDom = null;
    this.handlerdom = null;
    this.mousePos = null;
    this.sFirstEnter = this.firstEnter;
    this.timeout = null;
    this.children = null;
    this.drawerId = Number(
      (Date.now() + Math.random()).toString().replace('.', Math.round(Math.random() * 9)),
    ).toString(16);
    const open = this.open !== undefined ? this.open : !!this.defaultOpen;
    currentDrawer[this.drawerId] = open;
    this.orignalOpen = this.open;
    this.preProps = { ...this.$props };
    return {
      sOpen: open,
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (!windowIsUndefined) {
        let passiveSupported = false;
        window.addEventListener(
          'test',
          null,
          Object.defineProperty({}, 'passive', {
            get: () => {
              passiveSupported = true;
              return null;
            },
          }),
        );
        this.passive = passiveSupported ? { passive: false } : false;
      }
      const open = this.getOpen();
      if (this.handler || open || this.sFirstEnter) {
        this.getDefault(this.$props);
        if (open) {
          this.isOpenChange = true;
        }
        this.$forceUpdate();
      }
    });
  },
  watch: {
    open(val) {
      if (val !== undefined && val !== this.preProps.open) {
        this.isOpenChange = true;
        // 没渲染 dom 时，获取默认数据;
        if (!this.container) {
          this.getDefault(this.$props);
        }
        this.setState({
          sOpen: open,
        });
      }
      this.preProps.open = val;
    },
    placement(val) {
      if (val !== this.preProps.placement) {
        // test 的 bug, 有动画过场，删除 dom
        this.contentDom = null;
      }
      this.preProps.placement = val;
    },
    level(val) {
      if (this.preProps.level !== val) {
        this.getParentAndLevelDom(this.$props);
      }
      this.preProps.level = val;
    },
  },
  updated() {
    this.$nextTick(() => {
      // dom 没渲染时，重走一遍。
      if (!this.sFirstEnter && this.container) {
        this.$forceUpdate();
        this.sFirstEnter = true;
      }
    });
  },
  beforeDestroy() {
    delete currentDrawer[this.drawerId];
    delete this.isOpenChange;
    if (this.container) {
      if (this.sOpen) {
        this.setLevelDomTransform(false, true);
      }
      document.body.style.overflow = '';
      // 拦不住。。直接删除；
      if (this.getSelfContainer) {
        this.container.parentNode.removeChild(this.container);
      }
    }
    this.sFirstEnter = false;
    clearTimeout(this.timeout);
    // 需要 didmount 后也会渲染，直接 unmount 将不会渲染，加上判断.
    if (this.renderComponent) {
      this.renderComponent({
        afterClose: this.removeContainer,
        onClose() {},
        visible: false,
      });
    }
  },
  methods: {
    onMaskTouchEnd(e) {
      this.$emit('maskClick', e);
      this.onTouchEnd(e, true);
    },
    onIconTouchEnd(e) {
      this.$emit('handleClick', e);
      this.onTouchEnd(e);
    },
    onTouchEnd(e, close) {
      if (this.open !== undefined) {
        return;
      }
      const open = close || this.sOpen;
      this.isOpenChange = true;
      this.setState({
        sOpen: !open,
      });
    },
    onWrapperTransitionEnd(e) {
      if (e.target === this.contentWrapper) {
        this.dom.style.transition = '';
        if (!this.sOpen && this.getCurrentDrawerSome()) {
          document.body.style.overflowX = '';
          if (this.maskDom) {
            this.maskDom.style.left = '';
            this.maskDom.style.width = '';
          }
        }
      }
    },
    getDefault(props) {
      this.getParentAndLevelDom(props);
      if (props.getContainer || props.parent) {
        this.container = this.defaultGetContainer();
      }
    },
    getCurrentDrawerSome() {
      return !Object.keys(currentDrawer).some(key => currentDrawer[key]);
    },
    getSelfContainer() {
      return this.container;
    },
    getParentAndLevelDom(props) {
      if (windowIsUndefined) {
        return;
      }
      const { level, getContainer } = props;
      this.levelDom = [];
      if (getContainer) {
        if (typeof getContainer === 'string') {
          const dom = document.querySelectorAll(getContainer)[0];
          this.parent = dom;
        }
        if (typeof getContainer === 'function') {
          this.parent = getContainer();
        }
        if (typeof getContainer === 'object' && getContainer instanceof window.HTMLElement) {
          this.parent = getContainer;
        }
      }
      if (!getContainer && this.container) {
        this.parent = this.container.parentNode;
      }
      if (level === 'all') {
        const children = Array.prototype.slice.call(this.parent.children);
        children.forEach(child => {
          if (
            child.nodeName !== 'SCRIPT' &&
            child.nodeName !== 'STYLE' &&
            child.nodeName !== 'LINK' &&
            child !== this.container
          ) {
            this.levelDom.push(child);
          }
        });
      } else if (level) {
        dataToArray(level).forEach(key => {
          document.querySelectorAll(key).forEach(item => {
            this.levelDom.push(item);
          });
        });
      }
    },
    setLevelDomTransform(open, openTransition, placementName, value) {
      const { placement, levelMove, duration, ease, getContainer } = this.$props;
      if (!windowIsUndefined) {
        this.levelDom.forEach(dom => {
          if (this.isOpenChange || openTransition) {
            /* eslint no-param-reassign: "error" */
            dom.style.transition = `transform ${duration} ${ease}`;
            addEventListener(dom, transitionEnd, this.trnasitionEnd);
            let levelValue = open ? value : 0;
            if (levelMove) {
              const $levelMove = transformArguments(levelMove, { target: dom, open });
              levelValue = open ? $levelMove[0] : $levelMove[1] || 0;
            }
            const $value = typeof levelValue === 'number' ? `${levelValue}px` : levelValue;
            const placementPos =
              placement === 'left' || placement === 'top' ? $value : `-${$value}`;
            dom.style.transform = levelValue ? `${placementName}(${placementPos})` : '';
            dom.style.msTransform = levelValue ? `${placementName}(${placementPos})` : '';
          }
        });
        // 处理 body 滚动
        if (getContainer === 'body') {
          const eventArray = ['touchstart'];
          const domArray = [document.body, this.maskDom, this.handlerdom, this.contentDom];
          const right =
            document.body.scrollHeight >
              (window.innerHeight || document.documentElement.clientHeight) &&
            window.innerWidth > document.body.offsetWidth
              ? getScrollBarSize(1)
              : 0;
          let widthTransition = `width ${duration} ${ease}`;
          const trannsformTransition = `transform ${duration} ${ease}`;
          if (open && document.body.style.overflow !== 'hidden') {
            document.body.style.overflow = 'hidden';
            if (right) {
              document.body.style.position = 'relative';
              document.body.style.width = `calc(100% - ${right}px)`;
              this.dom.style.transition = 'none';
              switch (placement) {
                case 'right':
                  this.dom.style.transform = `translateX(-${right}px)`;
                  this.dom.style.msTransform = `translateX(-${right}px)`;
                  break;
                case 'top':
                case 'bottom':
                  this.dom.style.width = `calc(100% - ${right}px)`;
                  this.dom.style.transform = 'translateZ(0)';
                  break;
                default:
                  break;
              }
              clearTimeout(this.timeout);
              this.timeout = setTimeout(() => {
                this.dom.style.transition = `${trannsformTransition},${widthTransition}`;
                this.dom.style.width = '';
                this.dom.style.transform = '';
                this.dom.style.msTransform = '';
              });
            }
            // 手机禁滚
            domArray.forEach((item, i) => {
              if (!item) {
                return;
              }
              addEventListener(
                item,
                eventArray[i] || 'touchmove',
                i ? this.removeMoveHandler : this.removeStartHandler,
                this.passive,
              );
            });
          } else if (this.getCurrentDrawerSome()) {
            document.body.style.overflow = '';
            if ((this.isOpenChange || openTransition) && right) {
              document.body.style.position = '';
              document.body.style.width = '';
              if (transitionStr) {
                document.body.style.overflowX = 'hidden';
              }
              this.dom.style.transition = 'none';
              let heightTransition;
              switch (placement) {
                case 'right': {
                  this.dom.style.transform = `translateX(${right}px)`;
                  this.dom.style.msTransform = `translateX(${right}px)`;
                  this.dom.style.width = '100%';
                  widthTransition = `width 0s ${ease} ${duration}`;
                  if (this.maskDom) {
                    this.maskDom.style.left = `-${right}px`;
                    this.maskDom.style.width = `calc(100% + ${right}px)`;
                  }
                  break;
                }
                case 'top':
                case 'bottom': {
                  this.dom.style.width = `calc(100% + ${right}px)`;
                  this.dom.style.height = '100%';
                  this.dom.style.transform = 'translateZ(0)';
                  heightTransition = `height 0s ${ease} ${duration}`;
                  break;
                }
                default:
                  break;
              }
              clearTimeout(this.timeout);
              this.timeout = setTimeout(() => {
                this.dom.style.transition = `${trannsformTransition},${
                  heightTransition ? `${heightTransition},` : ''
                }${widthTransition}`;
                this.dom.style.transform = '';
                this.dom.style.msTransform = '';
                this.dom.style.width = '';
                this.dom.style.height = '';
              });
            }
            domArray.forEach((item, i) => {
              if (!item) {
                return;
              }
              removeEventListener(
                item,
                eventArray[i] || 'touchmove',
                i ? this.removeMoveHandler : this.removeStartHandler,
                this.passive,
              );
            });
          }
        }
      }
      const { change } = getListeners(this);
      if (change && this.isOpenChange && this.sFirstEnter) {
        change(open);
        this.isOpenChange = false;
      }
    },
    getChildToRender(open) {
      const {
        className,
        prefixCls,
        placement,
        handler,
        showMask,
        maskStyle,
        width,
        height,
        wrapStyle,
      } = this.$props;
      const children = this.$slots.default;
      const wrapperClassname = classnames(prefixCls, {
        [`${prefixCls}-${placement}`]: true,
        [`${prefixCls}-open`]: open,
        [className]: !!className,
      });
      const isOpenChange = this.isOpenChange;
      const isHorizontal = placement === 'left' || placement === 'right';
      const placementName = `translate${isHorizontal ? 'X' : 'Y'}`;
      // 百分比与像素动画不同步，第一次打用后全用像素动画。
      // const defaultValue = !this.contentDom || !level ? '100%' : `${value}px`;
      const placementPos = placement === 'left' || placement === 'top' ? '-100%' : '100%';
      const transform = open ? '' : `${placementName}(${placementPos})`;
      if (isOpenChange === undefined || isOpenChange) {
        const contentValue = this.contentDom
          ? this.contentDom.getBoundingClientRect()[isHorizontal ? 'width' : 'height']
          : 0;
        const value = (isHorizontal ? width : height) || contentValue;
        this.setLevelDomTransform(open, false, placementName, value);
      }
      let handlerChildren;
      if (handler !== false) {
        const handlerDefalut = (
          <div class="drawer-handle">
            <i class="drawer-handle-icon" />
          </div>
        );
        const { handler: handlerSlot } = this;
        const handlerSlotVnode = (handlerSlot && handlerSlot[0]) || handlerDefalut;
        const { click: handleIconClick } = getEvents(handlerSlotVnode);
        handlerChildren = cloneElement(handlerSlotVnode, {
          on: {
            click: e => {
              handleIconClick && handleIconClick();
              this.onIconTouchEnd(e);
            },
          },
          directives: [
            {
              name: 'ant-ref',
              value: c => {
                this.handlerdom = c;
              },
            },
          ],
        });
      }

      const domContProps = {
        class: wrapperClassname,
        directives: [
          {
            name: 'ant-ref',
            value: c => {
              this.dom = c;
            },
          },
        ],
        on: {
          transitionend: this.onWrapperTransitionEnd,
        },
        style: wrapStyle,
      };
      const directivesMaskDom = [
        {
          name: 'ant-ref',
          value: c => {
            this.maskDom = c;
          },
        },
      ];
      const directivesContentWrapper = [
        {
          name: 'ant-ref',
          value: c => {
            this.contentWrapper = c;
          },
        },
      ];
      const directivesContentDom = [
        {
          name: 'ant-ref',
          value: c => {
            this.contentDom = c;
          },
        },
      ];
      return (
        <div {...domContProps}>
          {showMask && (
            <div
              class={`${prefixCls}-mask`}
              onClick={this.onMaskTouchEnd}
              style={maskStyle}
              {...{ directives: directivesMaskDom }}
            />
          )}
          <div
            class={`${prefixCls}-content-wrapper`}
            style={{
              transform,
              msTransform: transform,
              width: isNumeric(width) ? `${width}px` : width,
              height: isNumeric(height) ? `${height}px` : height,
            }}
            {...{ directives: directivesContentWrapper }}
          >
            <div
              class={`${prefixCls}-content`}
              {...{ directives: directivesContentDom }}
              onTouchstart={open ? this.removeStartHandler : noop} // 跑用例用
              onTouchmove={open ? this.removeMoveHandler : noop} // 跑用例用
            >
              {children}
            </div>
            {handlerChildren}
          </div>
        </div>
      );
    },
    getOpen() {
      return this.open !== undefined ? this.open : this.sOpen;
    },
    getTouchParentScroll(root, currentTarget, differX, differY) {
      if (!currentTarget || currentTarget === document) {
        return false;
      }
      // root 为 drawer-content 设定了 overflow, 判断为 root 的 parent 时结束滚动；
      if (currentTarget === root.parentNode) {
        return true;
      }

      const isY = Math.max(Math.abs(differX), Math.abs(differY)) === Math.abs(differY);
      const isX = Math.max(Math.abs(differX), Math.abs(differY)) === Math.abs(differX);

      const scrollY = currentTarget.scrollHeight - currentTarget.clientHeight;
      const scrollX = currentTarget.scrollWidth - currentTarget.clientWidth;
      /**
       * <div style="height: 300px">
       *   <div style="height: 900px"></div>
       * </div>
       * 在没设定 overflow: auto 或 scroll 时，currentTarget 里获取不到 scrollTop 或 scrollLeft,
       * 预先用 scrollTo 来滚动，如果取出的值跟滚动前取出不同，则 currnetTarget 被设定了 overflow; 否则就是上面这种。
       */
      const t = currentTarget.scrollTop;
      const l = currentTarget.scrollLeft;
      if (currentTarget.scrollTo) {
        currentTarget.scrollTo(currentTarget.scrollLeft + 1, currentTarget.scrollTop + 1);
      }
      const currentT = currentTarget.scrollTop;
      const currentL = currentTarget.scrollLeft;
      if (currentTarget.scrollTo) {
        currentTarget.scrollTo(currentTarget.scrollLeft - 1, currentTarget.scrollTop - 1);
      }
      if (
        (isY &&
          (!scrollY ||
            !(currentT - t) ||
            (scrollY &&
              ((currentTarget.scrollTop >= scrollY && differY < 0) ||
                (currentTarget.scrollTop <= 0 && differY > 0))))) ||
        (isX &&
          (!scrollX ||
            !(currentL - l) ||
            (scrollX &&
              ((currentTarget.scrollLeft >= scrollX && differX < 0) ||
                (currentTarget.scrollLeft <= 0 && differX > 0)))))
      ) {
        return this.getTouchParentScroll(root, currentTarget.parentNode, differX, differY);
      }
      return false;
    },
    removeStartHandler(e) {
      if (e.touches.length > 1) {
        return;
      }
      this.startPos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    },
    removeMoveHandler(e) {
      if (e.changedTouches.length > 1) {
        return;
      }
      const currentTarget = e.currentTarget;
      const differX = e.changedTouches[0].clientX - this.startPos.x;
      const differY = e.changedTouches[0].clientY - this.startPos.y;
      if (
        currentTarget === this.maskDom ||
        currentTarget === this.handlerdom ||
        (currentTarget === this.contentDom &&
          this.getTouchParentScroll(currentTarget, e.target, differX, differY))
      ) {
        e.preventDefault();
      }
    },
    trnasitionEnd(e) {
      removeEventListener(e.target, transitionEnd, this.trnasitionEnd);
      e.target.style.transition = '';
    },
    defaultGetContainer() {
      if (windowIsUndefined) {
        return null;
      }
      const container = document.createElement('div');
      this.parent.appendChild(container);
      if (this.wrapperClassName) {
        container.className = this.wrapperClassName;
      }
      return container;
    },
  },

  render() {
    const { getContainer, wrapperClassName } = this.$props;
    const open = this.getOpen();
    currentDrawer[this.drawerId] = open ? this.container : open;
    const children = this.getChildToRender(this.sFirstEnter ? open : false);
    if (!getContainer) {
      const directives = [
        {
          name: 'ant-ref',
          value: c => {
            this.container = c;
          },
        },
      ];
      return (
        <div class={wrapperClassName} {...{ directives }}>
          {children}
        </div>
      );
    }
    if (!this.container || (!open && !this.sFirstEnter)) {
      return null;
    }
    return (
      <ContainerRender
        parent={this}
        visible
        autoMount
        autoDestroy={false}
        getComponent={() => children}
        getContainer={this.getSelfContainer}
        children={({ renderComponent, removeContainer }) => {
          this.renderComponent = renderComponent;
          this.removeContainer = removeContainer;
          return null;
        }}
      />
    );
  },
};

export default Drawer;
