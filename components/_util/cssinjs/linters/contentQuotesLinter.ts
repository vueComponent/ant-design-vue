import type { Linter } from './interface';
import { lintWarning } from './utils';

const linter: Linter = (key, value, info) => {
  if (key === 'content') {
    // From emotion: https://github.com/emotion-js/emotion/blob/main/packages/serialize/src/index.js#L63
    const contentValuePattern =
      /(attr|counters?|url|(((repeating-)?(linear|radial))|conic)-gradient)\(|(no-)?(open|close)-quote/;
    const contentValues = ['normal', 'none', 'initial', 'inherit', 'unset'];
    if (
      typeof value !== 'string' ||
      (contentValues.indexOf(value) === -1 &&
        !contentValuePattern.test(value) &&
        (value.charAt(0) !== value.charAt(value.length - 1) ||
          (value.charAt(0) !== '"' && value.charAt(0) !== "'")))
    ) {
      lintWarning(
        `You seem to be using a value for 'content' without quotes, try replacing it with \`content: '"${value}"'\`.`,
        info,
      );
    }
  }
};

export default linter;
