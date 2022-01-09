import warning, { noteOnce } from '../../vc-util/warning';
import { convertChildrenToData } from './legacyUtil';
import { toArray } from './commonUtil';
import { isValidElement } from '../../_util/props-util';
import type { VNode } from 'vue';
import type { RawValueType, LabelInValueType, SelectProps } from '../Select';
import { isMultiple } from '../BaseSelect';

function warningProps(props: SelectProps) {
  const {
    mode,
    options,
    children,
    backfill,
    allowClear,
    placeholder,
    getInputElement,
    showSearch,
    onSearch,
    defaultOpen,
    autofocus,
    labelInValue,
    value,
    inputValue,
    optionLabelProp,
  } = props;

  const multiple = isMultiple(mode);
  const mergedShowSearch = showSearch !== undefined ? showSearch : multiple || mode === 'combobox';
  const mergedOptions = options || convertChildrenToData(children);

  // `tags` should not set option as disabled
  warning(
    mode !== 'tags' || mergedOptions.every((opt: { disabled?: boolean }) => !opt.disabled),
    'Please avoid setting option to disabled in tags mode since user can always type text as tag.',
  );

  // `combobox` should not use `optionLabelProp`
  warning(
    mode !== 'combobox' || !optionLabelProp,
    '`combobox` mode not support `optionLabelProp`. Please set `value` on Option directly.',
  );

  // Only `combobox` support `backfill`
  warning(mode === 'combobox' || !backfill, '`backfill` only works with `combobox` mode.');

  // Only `combobox` support `getInputElement`
  warning(
    mode === 'combobox' || !getInputElement,
    '`getInputElement` only work with `combobox` mode.',
  );

  // Customize `getInputElement` should not use `allowClear` & `placeholder`
  noteOnce(
    mode !== 'combobox' || !getInputElement || !allowClear || !placeholder,
    'Customize `getInputElement` should customize clear and placeholder logic instead of configuring `allowClear` and `placeholder`.',
  );

  // `onSearch` should use in `combobox` or `showSearch`
  if (onSearch && !mergedShowSearch && mode !== 'combobox' && mode !== 'tags') {
    warning(false, '`onSearch` should work with `showSearch` instead of use alone.');
  }

  noteOnce(
    !defaultOpen || autofocus,
    '`defaultOpen` makes Select open without focus which means it will not close by click outside. You can set `autofocus` if needed.',
  );

  if (value !== undefined && value !== null) {
    const values = toArray<RawValueType | LabelInValueType>(value);
    warning(
      !labelInValue ||
        values.every(val => typeof val === 'object' && ('key' in val || 'value' in val)),
      '`value` should in shape of `{ value: string | number, label?: any }` when you set `labelInValue` to `true`',
    );

    warning(
      !multiple || Array.isArray(value),
      '`value` should be array when `mode` is `multiple` or `tags`',
    );
  }

  // Syntactic sugar should use correct children type
  if (children) {
    let invalidateChildType = null;
    children.some((node: any) => {
      if (!isValidElement(node) || !node.type) {
        return false;
      }

      const { type } = node as { type: { isSelectOption?: boolean; isSelectOptGroup?: boolean } };

      if (type.isSelectOption) {
        return false;
      }
      if (type.isSelectOptGroup) {
        const childs = node.children?.default() || [];
        const allChildrenValid = childs.every((subNode: VNode) => {
          if (
            !isValidElement(subNode) ||
            !node.type ||
            (subNode.type as { isSelectOption?: boolean }).isSelectOption
          ) {
            return true;
          }
          invalidateChildType = subNode.type;
          return false;
        });

        if (allChildrenValid) {
          return false;
        }
        return true;
      }
      invalidateChildType = type;
      return true;
    });

    if (invalidateChildType) {
      warning(
        false,
        `\`children\` should be \`Select.Option\` or \`Select.OptGroup\` instead of \`${
          invalidateChildType.displayName || invalidateChildType.name || invalidateChildType
        }\`.`,
      );
    }

    warning(
      inputValue === undefined,
      '`inputValue` is deprecated, please use `searchValue` instead.',
    );
  }
}

export default warningProps;
