<script>
import Select, { Option } from '../index';
import '../assets/index.less';

export default {
  methods: {
    onChange(value) {
      console.log(`selected ${value}`);
    },
  },

  render() {
    return (
      <div>
        <h2>Select optionFilterProp</h2>
        <div style={{ width: '300px' }}>
          <Select
            defaultValue="张三"
            style={{ width: '500px' }}
            placeholder="placeholder"
            optionFilterProp="desc"
            onChange={this.onChange}
          >
            <Option value="张三" desc="张三 zhang san">
              ddd
            </Option>
            <Option value="李四" desc="李四 li si">
              李四
            </Option>
            <Option value="王五" desc="王五 wang wu">
              王五
            </Option>
          </Select>
        </div>
      </div>
    );
  },
};
</script>
