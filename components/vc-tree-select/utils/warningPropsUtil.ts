import { warning } from '../../vc-util/warning';
import type { TreeSelectProps } from '../TreeSelect';
import { toArray } from './valueUtil';

function warningProps(props: TreeSelectProps & { searchPlaceholder?: string }) {
  const { searchPlaceholder, treeCheckStrictly, treeCheckable, labelInValue, value, multiple } =
    props;

  warning(
    !searchPlaceholder,
    '`searchPlaceholder` has been removed, please use `placeholder` instead',
  );

  if (treeCheckStrictly && labelInValue === false) {
    warning(false, '`treeCheckStrictly` will force set `labelInValue` to `true`.');
  }

  if (labelInValue || treeCheckStrictly) {
    warning(
      toArray(value).every(val => val && typeof val === 'object' && 'value' in val),
      'Invalid prop `value` supplied to `TreeSelect`. You should use { label: string, value: string | number } or [{ label: string, value: string | number }] instead.',
    );
  }

  if (treeCheckStrictly || multiple || treeCheckable) {
    warning(
      !value || Array.isArray(value),
      '`value` should be an array when `TreeSelect` is checkable or multiple.',
    );
  } else {
    warning(!Array.isArray(value), '`value` should not be array when `TreeSelect` is single mode.');
  }
}

export default warningProps;
