<script>
import Select, { Option } from '../index';
import '../assets/index.less';
import { fetch } from './tbFetchSuggest';

export default {
  data() {
    return {
      data: [],
      value: [],
    };
  },
  methods: {
    onChange(value) {
      console.log('onChange ', value);
      this.value = value;
    },
    onSelect(value) {
      console.log('select ', value);
    },
    fetchData(value) {
      fetch(value, data => {
        this.data = data;
      });
    },
  },

  render() {
    const data = this.data;
    const options = data.map(d => {
      return (
        <Option key={d.value}>
          <i>{d.text}</i>
        </Option>
      );
    });
    return (
      <div>
        <h2>multiple suggest</h2>

        <div>
          <Select
            style={{ width: '500px' }}
            labelInValue
            optionLabelProp="children"
            value={this.value}
            onChange={this.onChange}
            tags
            placeholder="placeholder"
            notFoundContent=""
            onSearch={this.fetchData}
            onSelect={this.onSelect}
            filterOption={false}
          >
            {options}
          </Select>
        </div>
      </div>
    );
  },
};
</script>
