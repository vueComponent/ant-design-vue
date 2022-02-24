import { addClass, removeClass } from '../../vc-util/Dom/class';
import { nextTick } from 'vue';
import type { CSSMotionProps } from '../../_util/transition';

const listAnimation = (name): CSSMotionProps => {
  return {
    name,
    appear: true,
    css: true,
    onBeforeEnter: (node: HTMLDivElement) => {
      addClass(node, name);
      node.style.height = '0px';
      node.style.opacity = '0';
    },
    onEnter: (node: HTMLDivElement) => {
      nextTick(() => {
        node.style.height = `${node.scrollHeight}px`;
        node.style.opacity = '1';
      });
    },
    onAfterEnter: (node: HTMLDivElement) => {
      if (node) removeClass(node, name);
      node.style.height = undefined;
      node.style.opacity = undefined;
    },
    onBeforeLeave: (node: HTMLDivElement) => {
      addClass(node, name);
      node.style.height = `${node.offsetHeight}px`;
      node.style.opacity = undefined;
    },
    onLeave: (node: HTMLDivElement) => {
      setTimeout(() => {
        node.style.height = '0px';
        node.style.opacity = '0';
      });
    },
    onAfterLeave: (node: HTMLDivElement) => {
      if (node) removeClass(node, name);
      node.style.height = undefined;
      node.style.opacity = undefined;
    },
  };
};
export default listAnimation;
