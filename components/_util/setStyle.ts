import type { CSSProperties } from 'vue';

/**
 * Easy to set element style, return previous style
 * IE browser compatible(IE browser doesn't merge overflow style, need to set it separately)
 * https://github.com/ant-design/ant-design/issues/19393
 *
 */
export interface SetStyleOptions {
  element?: HTMLElement;
}
function setStyle(style: CSSProperties, options: SetStyleOptions = {}): CSSProperties {
  const { element = document.body } = options;
  const oldStyle: CSSProperties = {};

  const styleKeys = Object.keys(style);

  // IE browser compatible
  styleKeys.forEach(key => {
    oldStyle[key] = element.style[key];
  });

  styleKeys.forEach(key => {
    element.style[key] = style[key];
  });

  return oldStyle;
}

export default setStyle;
