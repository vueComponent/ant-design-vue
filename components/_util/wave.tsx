import { nextTick, defineComponent, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue';
import TransitionEvents from './css-animation/Event';
import raf from './raf';
import { findDOMNode } from './props-util';
import useConfigInject from './hooks/useConfigInject';
let styleForPesudo: HTMLStyleElement;

// Where el is the DOM element you'd like to test for visibility
function isHidden(element: HTMLElement) {
  if (process.env.NODE_ENV === 'test') {
    return false;
  }
  return !element || element.offsetParent === null;
}
function isNotGrey(color: string) {
  // eslint-disable-next-line no-useless-escape
  const match = (color || '').match(/rgba?\((\d*), (\d*), (\d*)(, [\.\d]*)?\)/);
  if (match && match[1] && match[2] && match[3]) {
    return !(match[1] === match[2] && match[2] === match[3]);
  }
  return true;
}
export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Wave',
  props: {
    insertExtraNode: Boolean,
    disabled: Boolean,
  },
  setup(props, { slots, expose }) {
    const instance = getCurrentInstance();
    const { csp, prefixCls } = useConfigInject('', props);
    expose({
      csp,
    });
    let eventIns = null;
    let clickWaveTimeoutId = null;
    let animationStartId = null;
    let animationStart = false;
    let extraNode = null;
    let isUnmounted = false;
    const onTransitionStart = e => {
      if (isUnmounted) return;

      const node = findDOMNode(instance);
      if (!e || e.target !== node) {
        return;
      }

      if (!animationStart) {
        resetEffect(node);
      }
    };
    const onTransitionEnd = (e: any) => {
      if (!e || e.animationName !== 'fadeEffect') {
        return;
      }
      resetEffect(e.target);
    };
    const getAttributeName = () => {
      const { insertExtraNode } = props;
      return insertExtraNode
        ? `${prefixCls.value}-click-animating`
        : `${prefixCls.value}-click-animating-without-extra-node`;
    };
    const onClick = (node: HTMLElement, waveColor: string) => {
      const { insertExtraNode, disabled } = props;
      if (disabled || !node || isHidden(node) || node.className.indexOf('-leave') >= 0) {
        return;
      }

      extraNode = document.createElement('div');
      extraNode.className = `${prefixCls.value}-click-animating-node`;
      const attributeName = getAttributeName();
      node.removeAttribute(attributeName);
      node.setAttribute(attributeName, 'true');
      // Not white or transparent or grey
      styleForPesudo = styleForPesudo || document.createElement('style');
      if (
        waveColor &&
        waveColor !== '#ffffff' &&
        waveColor !== 'rgb(255, 255, 255)' &&
        isNotGrey(waveColor) &&
        !/rgba\(\d*, \d*, \d*, 0\)/.test(waveColor) && // any transparent rgba color
        waveColor !== 'transparent'
      ) {
        // Add nonce if CSP exist
        if (csp.value?.nonce) {
          styleForPesudo.nonce = csp.value.nonce;
        }
        extraNode.style.borderColor = waveColor;
        styleForPesudo.innerHTML = `
        [${prefixCls.value}-click-animating-without-extra-node='true']::after, .${prefixCls.value}-click-animating-node {
          --antd-wave-shadow-color: ${waveColor};
        }`;
        if (!document.body.contains(styleForPesudo)) {
          document.body.appendChild(styleForPesudo);
        }
      }
      if (insertExtraNode) {
        node.appendChild(extraNode);
      }
      TransitionEvents.addStartEventListener(node, onTransitionStart);
      TransitionEvents.addEndEventListener(node, onTransitionEnd);
    };
    const resetEffect = (node: HTMLElement) => {
      if (!node || node === extraNode || !(node instanceof Element)) {
        return;
      }
      const { insertExtraNode } = props;
      const attributeName = getAttributeName();
      node.setAttribute(attributeName, 'false'); // edge has bug on `removeAttribute` #14466
      if (styleForPesudo) {
        styleForPesudo.innerHTML = '';
      }
      if (insertExtraNode && extraNode && node.contains(extraNode)) {
        node.removeChild(extraNode);
      }
      TransitionEvents.removeStartEventListener(node, onTransitionStart);
      TransitionEvents.removeEndEventListener(node, onTransitionEnd);
    };
    const bindAnimationEvent = (node: HTMLElement) => {
      if (
        !node ||
        !node.getAttribute ||
        node.getAttribute('disabled') ||
        node.className.indexOf('disabled') >= 0
      ) {
        return;
      }
      const newClick = (e: MouseEvent) => {
        // Fix radio button click twice
        if ((e.target as any).tagName === 'INPUT' || isHidden(e.target as HTMLElement)) {
          return;
        }
        resetEffect(node);
        // Get wave color from target
        const waveColor =
          getComputedStyle(node).getPropertyValue('border-top-color') || // Firefox Compatible
          getComputedStyle(node).getPropertyValue('border-color') ||
          getComputedStyle(node).getPropertyValue('background-color');
        clickWaveTimeoutId = setTimeout(() => onClick(node, waveColor), 0);
        raf.cancel(animationStartId);
        animationStart = true;

        // Render to trigger transition event cost 3 frames. Let's delay 10 frames to reset this.
        animationStartId = raf(() => {
          animationStart = false;
        }, 10);
      };
      node.addEventListener('click', newClick, true);
      return {
        cancel: () => {
          node.removeEventListener('click', newClick, true);
        },
      };
    };
    onMounted(() => {
      nextTick(() => {
        const node = findDOMNode(instance);
        if (node.nodeType !== 1) {
          return;
        }
        eventIns = bindAnimationEvent(node);
      });
    });
    onBeforeUnmount(() => {
      if (eventIns) {
        eventIns.cancel();
      }
      clearTimeout(clickWaveTimeoutId);
      isUnmounted = true;
    });
    return () => {
      return slots.default?.()[0];
    };
  },
});
