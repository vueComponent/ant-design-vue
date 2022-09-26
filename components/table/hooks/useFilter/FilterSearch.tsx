import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import SearchOutlined from '@ant-design/icons-vue/SearchOutlined';
import type { TableLocale } from '../../interface';
import Input from '../../../input';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'FilterSearch',
  inheritAttrs: false,
  props: {
    value: String,
    onChange: Function as PropType<(e: InputEvent) => void>,
    filterSearch: Boolean,
    tablePrefixCls: String,
    locale: { type: Object as PropType<TableLocale>, default: undefined as TableLocale },
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
