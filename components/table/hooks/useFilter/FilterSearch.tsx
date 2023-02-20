import { defineComponent } from 'vue';
import SearchOutlined from '@ant-design/icons-vue/SearchOutlined';
import type { FilterSearchType, TableLocale } from '../../interface';
import Input from '../../../input';
import { stringType, someType, functionType, objectType } from '../../../_util/type';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'FilterSearch',
  inheritAttrs: false,
  props: {
    value: stringType(),
    onChange: functionType<(e: InputEvent) => void>(),
    filterSearch: someType<FilterSearchType>([Boolean, Function]),
    tablePrefixCls: stringType(),
    locale: objectType<TableLocale>(),
  },
  setup(props) {
    return () => {
      const { value, onChange, filterSearch, tablePrefixCls, locale } = props;
      if (!filterSearch) {
        return null;
      }
      return (
        <div class={`${tablePrefixCls}-filter-dropdown-search`}>
          <Input
            v-slots={{ prefix: () => <SearchOutlined /> }}
            placeholder={locale.filterSearchPlaceholder}
            onChange={onChange}
            value={value}
            // for skip min-width of input
            htmlSize={1}
            class={`${tablePrefixCls}-filter-dropdown-search-input`}
          />
        </div>
      );
    };
  },
});
