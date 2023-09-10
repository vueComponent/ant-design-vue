import canUseDom from '../../../../_util/canUseDom';
import { ATTR_MARK } from '../../StyleContext';

export const ATTR_CACHE_MAP = 'data-ant-cssinjs-cache-path';

/**
 * This marks style from the css file.
 * Which means not exist in `<style />` tag.
 */
export const CSS_FILE_STYLE = '_FILE_STYLE__';

export function serialize(cachePathMap: Record<string, string>) {
  return Object.keys(cachePathMap)
    .map(path => {
      const hash = cachePathMap[path];
      return `${path}:${hash}`;
    })
    .join(';');
}

let cachePathMap: Record<string, string>;
let fromCSSFile = true;

/**
 * @private Test usage only. Can save remove if no need.
 */
export function reset(mockCache?: Record<string, string>, fromFile = true) {
  cachePathMap = mockCache!;
  fromCSSFile = fromFile;
}

export function prepare() {
  if (!cachePathMap) {
    cachePathMap = {};

    if (canUseDom()) {
      const div = document.createElement('div');
      div.className = ATTR_CACHE_MAP;
      div.style.position = 'fixed';
      div.style.visibility = 'hidden';
      div.style.top = '-9999px';
      document.body.appendChild(div);

      let content = getComputedStyle(div).content || '';
      content = content.replace(/^"/, '').replace(/"$/, '');

      // Fill data
      content.split(';').forEach(item => {
        const [path, hash] = item.split(':');
        cachePathMap[path] = hash;
      });

      // Remove inline record style
      const inlineMapStyle = document.querySelector(`style[${ATTR_CACHE_MAP}]`);
      if (inlineMapStyle) {
        fromCSSFile = false;
        inlineMapStyle.parentNode?.removeChild(inlineMapStyle);
      }

      document.body.removeChild(div);
    }
  }
}

export function existPath(path: string) {
  prepare();

  return !!cachePathMap[path];
}

export function getStyleAndHash(path: string): [style: string | null, hash: string] {
  const hash = cachePathMap[path];
  let styleStr: string | null = null;

  if (hash && canUseDom()) {
    if (fromCSSFile) {
      styleStr = CSS_FILE_STYLE;
    } else {
      const style = document.querySelector(`style[${ATTR_MARK}="${cachePathMap[path]}"]`);

      if (style) {
        styleStr = style.innerHTML;
      } else {
        // Clean up since not exist anymore
        delete cachePathMap[path];
      }
    }
  }

  return [styleStr, hash];
}
