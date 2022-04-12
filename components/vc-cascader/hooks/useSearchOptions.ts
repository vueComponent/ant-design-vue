import type { Ref } from 'vue';
import { computed } from 'vue';
import type { DefaultOptionType, ShowSearchType, InternalFieldNames } from '../Cascader';

export const SEARCH_MARK = '__rc_cascader_search_mark__';

const defaultFilter: ShowSearchType['filter'] = (search, options, { label }) =>
  options.some(opt => String(opt[label]).toLowerCase().includes(search.toLowerCase()));

const defaultRender: ShowSearchType['render'] = ({ path, fieldNames }) =>
  path.map(opt => opt[fieldNames.label]).join(' / ');

export default (
  search: Ref<string>,
  options: Ref<DefaultOptionType[]>,
  fieldNames: Ref<InternalFieldNames>,
  prefixCls: Ref<string>,
  config: Ref<ShowSearchType>,
  changeOnSelect: Ref<boolean>,
) => {
  return computed(() => {
    const { filter = defaultFilter, render = defaultRender, limit = 50, sort } = config.value;
    const filteredOptions: DefaultOptionType[] = [];
    if (!search.value) {
      return [];
    }

    function dig(list: DefaultOptionType[], pathOptions: DefaultOptionType[]) {
      list.forEach(option => {
        // Perf saving when `sort` is disabled and `limit` is provided
        if (!sort && limit > 0 && filteredOptions.length >= limit) {
          return;
        }

        const connectedPathOptions = [...pathOptions, option];
        const children = option[fieldNames.value.children];

        // If current option is filterable
        if (
          // If is leaf option
          !children ||
          children.length === 0 ||
          // If is changeOnSelect
          changeOnSelect.value
        ) {
          if (filter(search.value, connectedPathOptions, { label: fieldNames.value.label })) {
            filteredOptions.push({
              ...option,
              [fieldNames.value.label as 'label']: render({
                inputValue: search.value,
                path: connectedPathOptions,
                prefixCls: prefixCls.value,
                fieldNames: fieldNames.value,
              }),
              [SEARCH_MARK]: connectedPathOptions,
            });
          }
        }

        if (children) {
          dig(option[fieldNames.value.children] as DefaultOptionType[], connectedPathOptions);
        }
      });
    }

    dig(options.value, []);

    // Do sort
    if (sort) {
      filteredOptions.sort((a, b) => {
        return sort(a[SEARCH_MARK], b[SEARCH_MARK], search.value, fieldNames.value);
      });
    }

    return limit > 0 ? filteredOptions.slice(0, limit as number) : filteredOptions;
  });
};
