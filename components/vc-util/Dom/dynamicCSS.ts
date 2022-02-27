import canUseDom from '../../_util/canUseDom';

const MARK_KEY = `vc-util-key` as any;

function getMark({ mark }: Options = {}) {
  if (mark) {
    return mark.startsWith('data-') ? mark : `data-${mark}`;
  }
  return MARK_KEY;
}

interface Options {
  attachTo?: Element;
  csp?: { nonce?: string };
  prepend?: boolean;
  mark?: string;
}

function getContainer(option: Options) {
  if (option.attachTo) {
    return option.attachTo;
  }

  const head = document.querySelector('head');
  return head || document.body;
}

export function injectCSS(css: string, option: Options = {}) {
  if (!canUseDom()) {
    return null;
  }

  const styleNode = document.createElement('style');
  if (option.csp?.nonce) {
    styleNode.nonce = option.csp?.nonce;
  }
  styleNode.innerHTML = css;

  const container = getContainer(option);
  const { firstChild } = container;

  if (option.prepend && container.prepend) {
    // Use `prepend` first
    container.prepend(styleNode);
  } else if (option.prepend && firstChild) {
    // Fallback to `insertBefore` like IE not support `prepend`
    container.insertBefore(styleNode, firstChild);
  } else {
    container.appendChild(styleNode);
  }

  return styleNode;
}

const containerCache = new Map<Element, Node & ParentNode>();

function findExistNode(key: string, option: Options = {}) {
  const container = getContainer(option);

  return Array.from(containerCache.get(container).children).find(
    node => node.tagName === 'STYLE' && node.getAttribute(getMark(option)) === key,
  ) as HTMLStyleElement;
}

export function removeCSS(key: string, option: Options = {}) {
  const existNode = findExistNode(key, option);

  existNode?.parentNode?.removeChild(existNode);
}

export function updateCSS(css: string, key: string, option: Options = {}) {
  const container = getContainer(option);

  // Get real parent
  if (!containerCache.has(container)) {
    const placeholderStyle = injectCSS('', option);
    const { parentNode } = placeholderStyle;
    containerCache.set(container, parentNode);
    parentNode.removeChild(placeholderStyle);
  }

  const existNode = findExistNode(key, option);

  if (existNode) {
    if (option.csp?.nonce && existNode.nonce !== option.csp?.nonce) {
      existNode.nonce = option.csp?.nonce;
    }

    if (existNode.innerHTML !== css) {
      existNode.innerHTML = css;
    }

    return existNode;
  }

  const newNode = injectCSS(css, option);
  newNode.setAttribute(getMark(option), key);
  return newNode;
}
