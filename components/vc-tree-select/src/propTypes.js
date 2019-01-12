import PropTypes from '../../_util/vue-types';
import { isLabelInValue } from './util';

const internalValProp = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

export function genArrProps(propType) {
  return PropTypes.oneOfType([propType, PropTypes.arrayOf(propType)]);
}

/**
 * Origin code check `multiple` is true when `treeCheckStrictly` & `labelInValue`.
 * But in process logic is already cover to array.
 * Check array is not necessary. Let's simplify this check logic.
 */
export function valueProp(...args) {
  const [props, propName, Component] = args;

  if (isLabelInValue(props)) {
    const err = genArrProps(
      PropTypes.shape({
        label: PropTypes.node,
        value: internalValProp,
      }).loose,
    )(...args);
    if (err) {
      return new Error(
        `Invalid prop \`${propName}\` supplied to \`${Component}\`. ` +
          `You should use { label: string, value: string | number } or [{ label: string, value: string | number }] instead.`,
      );
    }
    return null;
  }

  const err = genArrProps(internalValProp)(...args);
  if (err) {
    return new Error(
      `Invalid prop \`${propName}\` supplied to \`${Component}\`. ` +
        `You should use string or [string] instead.`,
    );
  }
  return null;
}
