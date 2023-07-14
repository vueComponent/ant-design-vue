import type { Linter } from './interface';
import { lintWarning } from './utils';

const linter: Linter = (key, value, info) => {
  switch (key) {
    case 'marginLeft':
    case 'marginRight':
    case 'paddingLeft':
    case 'paddingRight':
    case 'left':
    case 'right':
    case 'borderLeft':
    case 'borderLeftWidth':
    case 'borderLeftStyle':
    case 'borderLeftColor':
    case 'borderRight':
    case 'borderRightWidth':
    case 'borderRightStyle':
    case 'borderRightColor':
    case 'borderTopLeftRadius':
    case 'borderTopRightRadius':
    case 'borderBottomLeftRadius':
    case 'borderBottomRightRadius':
      lintWarning(
        `You seem to be using non-logical property '${key}' which is not compatible with RTL mode. Please use logical properties and values instead. For more information: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties.`,
        info,
      );
      return;
    case 'margin':
    case 'padding':
    case 'borderWidth':
    case 'borderStyle':
      // case 'borderColor':
      if (typeof value === 'string') {
        const valueArr = value.split(' ').map(item => item.trim());
        if (valueArr.length === 4 && valueArr[1] !== valueArr[3]) {
          lintWarning(
            `You seem to be using '${key}' property with different left ${key} and right ${key}, which is not compatible with RTL mode. Please use logical properties and values instead. For more information: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties.`,
            info,
          );
        }
      }
      return;
    case 'clear':
    case 'textAlign':
      if (value === 'left' || value === 'right') {
        lintWarning(
          `You seem to be using non-logical value '${value}' of ${key}, which is not compatible with RTL mode. Please use logical properties and values instead. For more information: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties.`,
          info,
        );
      }
      return;
    case 'borderRadius':
      if (typeof value === 'string') {
        const radiusGroups = value.split('/').map(item => item.trim());
        const invalid = radiusGroups.reduce((result, group) => {
          if (result) {
            return result;
          }
          const radiusArr = group.split(' ').map(item => item.trim());
          // borderRadius: '2px 4px'
          if (radiusArr.length >= 2 && radiusArr[0] !== radiusArr[1]) {
            return true;
          }
          // borderRadius: '4px 4px 2px'
          if (radiusArr.length === 3 && radiusArr[1] !== radiusArr[2]) {
            return true;
          }
          // borderRadius: '4px 4px 2px 4px'
          if (radiusArr.length === 4 && radiusArr[2] !== radiusArr[3]) {
            return true;
          }
          return result;
        }, false);

        if (invalid) {
          lintWarning(
            `You seem to be using non-logical value '${value}' of ${key}, which is not compatible with RTL mode. Please use logical properties and values instead. For more information: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties.`,
            info,
          );
        }
      }
      return;
    default:
  }
};

export default linter;
