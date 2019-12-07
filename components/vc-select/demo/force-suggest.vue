<script>
import Select, { Option } from '../index';
import { fetch } from './tbFetchSuggest';
import '../assets/index.less';

export default {
  data() {
    return {
      disabled: false,
      data: [],
      value: undefined,
    };
  },
  methods: {
    onChange(value) {
      console.log('select ', value);
      // value.label = value.key
      this.value = value;
    },
    fetchData(value) {
      if (value) {
        fetch(value, data => {
          this.data = data;
        });
      } else {
        this.data = [];
      }
    },

    toggleDisabled() {
      this.disabled = !this.disabled;
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
        <h2>force suggest</h2>
        <p>
          <button onClick={this.toggleDisabled}>toggle disabled</button>
        </p>
        <div>
          <Select
            labelInValue
            onSearch={this.fetchData}
            disabled={this.disabled}
            value={this.value}
            optionLabelProp="children"
            placeholder="placeholder"
            defaultActiveFirstOption
            style={{ width: '500px' }}
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
