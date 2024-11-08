import type { Linter } from '..';
import { lintWarning } from './utils';

const linter: Linter = (_key, _value, info) => {
  if (
    info.parentSelectors.some(selector => {
      const selectors = selector.split(',');
      return selectors.some(item => item.split('&').length > 2);
    })
  ) {
    lintWarning('Should not use more than one `&` in a selector.', info);
  }
};

export default linter;
