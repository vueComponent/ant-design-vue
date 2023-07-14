import { defineComponent, ref } from 'vue';
import { AutoComplete } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const mockVal = (str: string, repeat = 1) => ({
  value: str.repeat(repeat),
});

const Demo = defineComponent({
  setup() {
    const value = ref('');
    const options = ref<{ value: string }[]>([]);
    const onSearch = (searchText: string) => {
      options.value = !searchText
        ? []
        : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)];
    };
    const onSelect = (data: string) => {
      // eslint-disable-next-line no-console
      console.log('onSelect', data);
    };
    const onChange = (data: string) => {
      value.value = data;
    };

    return () => {
      return (
        <>
          {' '}
          <AutoComplete
            options={options.value}
            style={{ width: 200 }}
            onSelect={onSelect}
            onSearch={onSearch}
            placeholder="input here"
          />{' '}
          <br /> <br />{' '}
          <AutoComplete
            value={value.value}
            options={options.value}
            style={{ width: 200 }}
            onSelect={onSelect}
            onSearch={onSearch}
            onChange={onChange}
            placeholder="control mode"
          />{' '}
        </>
      );
    };
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: [],
  key: 'autoComplete',
};

export default componentDemo;
