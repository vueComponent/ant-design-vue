import { nextTick } from 'vue';
import { addClass, removeClass } from '../vc-util/Dom/class';
import type { CSSMotionProps } from './transition';

const collapseMotion = (name = 'ant-motion-collapse', appear = true): CSSMotionProps => {
  return {
    name,
    appear,
    css: true,
    onBeforeEnter: (node: HTMLDivElement) => {
      node.style.height = '0px';
      node.style.opacity = '0';
      addClass(node, name);
    },
    onEnter: (node: HTMLDivElement) => {
      nextTick(() => {
        node.style.height = `${node.scrollHeight}px`;
        node.style.opacity = '1';
      });
    },
    onAfterEnter: (node: HTMLDivElement) => {
      if (node) {
        removeClass(node, name);
        node.style.height = null;
        node.style.opacity = null;
      }
    },
    onBeforeLeave: (node: HTMLDivElement) => {
      addClass(node, name);
      node.style.height = `${node.offsetHeight}px`;
      node.style.opacity = null;
    },
    onLeave: (node: HTMLDivElement) => {
      setTimeout(() => {
        node.style.height = '0px';
        node.style.opacity = '0';
      });
    },
    onAfterLeave: (node: HTMLDivElement) => {
      if (node) {
        removeClass(node, name);
        if (node.style) {
          node.style.height = null;
          node.style.opacity = null;
        }
      }
    },
  };
};
export default collapseMotion;
