import type { Ref } from 'vue';
import { watchEffect, computed } from 'vue';

import { getNonce } from '../utils/nonce';

// Bundler is configured to load this as a processed minified CSS-string
import styles from '../css/styles.css';

const styleElementMap = new Map<Document, HTMLStyleElement>();

/**
 * Injects CSS code into the document's <head>
 */
export const useStyleSheet = (nodeRef: Ref<HTMLDivElement>): void => {
  const parentDocument = computed(() => (nodeRef.value ? nodeRef.value.ownerDocument : document));
  watchEffect(() => {
    if (typeof parentDocument.value !== 'undefined' && !styleElementMap.has(parentDocument.value)) {
      const styleElement = parentDocument.value.createElement('style');
      styleElement.innerHTML = styles;
      styleElementMap.set(parentDocument.value, styleElement);

      // Conform to CSP rules by setting `nonce` attribute to the inline styles
      const nonce = getNonce();
      if (nonce) styleElement.setAttribute('nonce', nonce);

      parentDocument.value.head.appendChild(styleElement);
    }
  });
};
