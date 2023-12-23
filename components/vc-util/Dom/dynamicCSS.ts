import canUseDom from '../../_util/canUseDom';
import contains from './contains';

const APPEND_ORDER = 'data-vc-order';
const APPEND_PRIORITY = 'data-vc-priority';
const MARK_KEY = `vc-util-key`;

const containerCache = new Map<ContainerType, Node & ParentNode>();

export type ContainerType = Element | ShadowRoot;
export type Prepend = boolean | 'queue';
export type AppendType = 'prependQueue' | 'append' | 'prepend';

interface Options {
  attachTo?: ContainerType;
  csp?: { nonce?: string };
  prepend?: Prepend;
  /**
   * Config the `priority` of `prependQueue`. Default is `0`.
   * It's useful if you need to insert style before other style.
   */
  priority?: number;
  mark?: string;
}

function getMark({ mark }: Options = {}) {
  if (mark) {
    return mark.startsWith('data-') ? mark : `data-${mark}`;
  }
  return MARK_KEY;
}

function getContainer(option: Options) {
  if (option.attachTo) {
    return option.attachTo;
  }

  const head = document.querySelector('head');
  return head || document.body;
}

function getOrder(prepend?: Prepend): AppendType {
  if (prepend === 'queue') {
    return 'prependQueue';
  }

  return prepend ? 'prepend' : 'append';
}

/**
 * Find style which inject by rc-util
 */
function findStyles(container: ContainerType) {
  return Array.from((containerCache.get(container) || container).children).filter(
    node => node.tagName === 'STYLE',
  ) as HTMLStyleElement[];
}

export function injectCSS(css: string, option: Options = {}) {
  if (!canUseDom()) {
    return null;
  }

  const { csp, prepend, priority = 0 } = option;
  const mergedOrder = getOrder(prepend);
  const isPrependQueue = mergedOrder === 'prependQueue';

  const styleNode = document.createElement('style');
  styleNode.setAttribute(APPEND_ORDER, mergedOrder);

  if (isPrependQueue && priority) {
    styleNode.setAttribute(APPEND_PRIORITY, `${priority}`);
  }

  if (csp?.nonce) {
    styleNode.nonce = csp?.nonce;
  }
  styleNode.innerHTML = css;

  const container = getContainer(option);
  const { firstChild } = container;

  if (prepend) {
    // If is queue `prepend`, it will prepend first style and then append rest style
    if (isPrependQueue) {
      const existStyle = findStyles(container).filter(node => {
        // Ignore style which not injected by rc-util with prepend
        if (!['prepend', 'prependQueue'].includes(node.getAttribute(APPEND_ORDER))) {
          return false;
        }

        // Ignore style which priority less then new style
        const nodePriority = Number(node.getAttribute(APPEND_PRIORITY) || 0);
        return priority >= nodePriority;
      });

      if (existStyle.length) {
        container.insertBefore(styleNode, existStyle[existStyle.length - 1].nextSibling);

        return styleNode;
      }
    }

    // Use `insertBefore` as `prepend`
    container.insertBefore(styleNode, firstChild);
  } else {
    container.appendChild(styleNode);
  }

  return styleNode;
}

function findExistNode(key: string, option: Options = {}) {
  const container = getContainer(option);

  return findStyles(container).find(node => node.getAttribute(getMark(option)) === key);
}

export function removeCSS(key: string, option: Options = {}) {
  const existNode = findExistNode(key, option);
  if (existNode) {
    const container = getContainer(option);
    container.removeChild(existNode);
  }
}

/**
 * qiankun will inject `appendChild` to insert into other
 */
function syncRealContainer(container: ContainerType, option: Options) {
  const cachedRealContainer = containerCache.get(container);

  // Find real container when not cached or cached container removed
  if (!cachedRealContainer || !contains(document, cachedRealContainer)) {
    const placeholderStyle = injectCSS('', option);
    const { parentNode } = placeholderStyle;
    containerCache.set(container, parentNode);
    container.removeChild(placeholderStyle);
  }
}

/**
 * manually clear container cache to avoid global cache in unit testes
 */
export function clearContainerCache() {
  containerCache.clear();
}

export function updateCSS(css: string, key: string, option: Options = {}) {
  const container = getContainer(option);

  // Sync real parent
  syncRealContainer(container, option);

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
