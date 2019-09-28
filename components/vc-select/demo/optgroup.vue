<script>
import Select, { Option, OptGroup } from '../index';
import '../assets/index.less';

export default {
  methods: {
    onChange(value, option) {
      console.log(`selected ${value}`, option);
    },
  },

  render() {
    return (
      <div>
        <h2>Select OptGroup</h2>
        <div style={{ width: '300px' }}>
          <Select
            placeholder="placeholder"
            defaultValue="lucy"
            showSearch={false}
            style={{ width: '500px' }}
            onChange={this.onChange}
          >
            <OptGroup>
              <span slot="label">manager</span>
              <Option value="jack" test-prop="jack-prop">
                <b
                  style={{
                    color: 'red',
                  }}
                >
                  jack
                </b>
              </Option>
              <Option value="lucy" test-prop="lucy-prop">
                lucy
              </Option>
            </OptGroup>
            <OptGroup label="engineer">
              <Option value="yiminghe" test-prop="yiminghe-prop">
                yiminghe
              </Option>
            </OptGroup>
          </Select>
        </div>
      </div>
    );
  },
};
</script>
