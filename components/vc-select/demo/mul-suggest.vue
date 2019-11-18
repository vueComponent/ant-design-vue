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
            value={this.value}
            labelInValue
            style={{ width: '500px' }}
            animation="slide-up"
            placeholder="搜索下"
            optionLabelProp="children"
            multiple
            notFoundContent=""
            onSearch={this.fetchData}
            onChange={this.onChange}
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
