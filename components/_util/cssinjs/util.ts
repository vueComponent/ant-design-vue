import hash from '@emotion/hash';
import { removeCSS, updateCSS } from '../../vc-util/Dom/dynamicCSS';
import canUseDom from '../canUseDom';

import { Theme } from './theme';

// Create a cache here to avoid always loop generate
const flattenTokenCache = new WeakMap<any, string>();

export function flattenToken(token: any) {
  let str = flattenTokenCache.get(token) || '';

  if (!str) {
    Object.keys(token).forEach(key => {
      const value = token[key];
      str += key;
      if (value instanceof Theme) {
        str += value.id;
      } else if (value && typeof value === 'object') {
        str += flattenToken(value);
      } else {
        str += value;
      }
    });

    // Put in cache
    flattenTokenCache.set(token, str);
  }
  return str;
}

/**
 * Convert derivative token to key string
 */
export function token2key(token: any, salt: string): string {
  return hash(`${salt}_${flattenToken(token)}`);
}

const randomSelectorKey = `random-${Date.now()}-${Math.random()}`.replace(/\./g, '');

// Magic `content` for detect selector support
const checkContent = '_bAmBoO_';

function supportSelector(
  styleStr: string,
  handleElement: (ele: HTMLElement) => void,
  supportCheck?: (ele: HTMLElement) => boolean,
): boolean {
  if (canUseDom()) {
    updateCSS(styleStr, randomSelectorKey);

    const ele = document.createElement('div');
    ele.style.position = 'fixed';
    ele.style.left = '0';
    ele.style.top = '0';
    handleElement?.(ele);
    document.body.appendChild(ele);

    if (process.env.NODE_ENV !== 'production') {
      ele.innerHTML = 'Test';
      ele.style.zIndex = '9999999';
    }

    const support = supportCheck
      ? supportCheck(ele)
      : getComputedStyle(ele).content?.includes(checkContent);

    ele.parentNode?.removeChild(ele);
    removeCSS(randomSelectorKey);

    return support;
  }

  return false;
}

let canLayer: boolean | undefined = undefined;
export function supportLayer(): boolean {
  if (canLayer === undefined) {
    canLayer = supportSelector(
      `@layer ${randomSelectorKey} { .${randomSelectorKey} { content: "${checkContent}"!important; } }`,
      ele => {
        ele.className = randomSelectorKey;
      },
    );
  }

  return canLayer!;
}

let canWhere: boolean | undefined = undefined;
export function supportWhere(): boolean {
  if (canWhere === undefined) {
    canWhere = supportSelector(
      `:where(.${randomSelectorKey}) { content: "${checkContent}"!important; }`,
      ele => {
        ele.className = randomSelectorKey;
      },
    );
  }

  return canWhere!;
}

let canLogic: boolean | undefined = undefined;
export function supportLogicProps(): boolean {
  if (canLogic === undefined) {
    canLogic = supportSelector(
      `.${randomSelectorKey} { inset-block: 93px !important; }`,
      ele => {
        ele.className = randomSelectorKey;
      },
      ele => getComputedStyle(ele).bottom === '93px',
    );
  }

  return canLogic!;
}
