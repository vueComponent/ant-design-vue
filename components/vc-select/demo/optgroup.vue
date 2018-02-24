<script>
import Select, { Option, OptGroup } from '../index'
import '../assets/index.less'

export default {
  methods: {
    onChange (value, options) {
      console.log(`selected ${value}`)
    },
  },

  render () {
    return (<div>
      <h2>Select OptGroup</h2>
      <div style={{ width: '300px' }}>
        <Select
          placeholder='placeholder'
          defaultValue='lucy'
          showSearch={false}
          style={{ width: '500px' }}
          onChange={this.onChange}
        >
          <OptGroup>
            <span slot='label'>manager</span>
            <Option value='jack'>
              <b
                style={{
                  color: 'red',
                }}
              >
              jack
              </b>
            </Option>
            <Option value='lucy'>lucy</Option>
          </OptGroup>
          <OptGroup label='engineer'>
            <Option value='yiminghe'>yiminghe</Option>
          </OptGroup>
        </Select>
      </div>
    </div>)
  },
}
</script>
