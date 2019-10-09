<script>
import Select, { Option } from '../index';
import '../assets/index.less';

export default {
  data() {
    return {
      destroy: false,
      value: 9,
    };
  },
  methods: {
    onChange(e) {
      let value;
      if (e && e.target) {
        value = e.target.value;
      } else {
        value = e;
      }
      console.log('onChange', value, ...arguments);
      this.value = value;
    },

    onDestroy() {
      this.destroy = 1;
    },

    onBlur(v) {
      console.log('onBlur', v);
    },

    onFocus() {
      console.log('onFocus');
    },
  },

  render() {
    if (this.destroy) {
      return null;
    }
    return (
      <div style={{ margin: '20px' }}>
        <div style={{ height: '150px' }} />

        <h2>Single Select</h2>

        <div style={{ width: '300px' }}>
          <Select
            id="my-select"
            value={this.value}
            placeholder="placeholder"
            dropdownMenuStyle={{ maxHeight: '200px' }}
            style={{ width: '500px' }}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            allowClear
            optionLabelProp="children"
            optionFilterProp="text"
            onChange={this.onChange}
            firstActiveValue="2"
            backfill
          >
            <Option value="01" text="jack" title="jack">
              <b
                style={{
                  color: 'red',
                }}
              >
                jack
              </b>
            </Option>
            <Option value="11" text="lucy">
              lucy
            </Option>
            <Option value="21" disabled text="disabled">
              disabled
            </Option>
            <Option value="31" text="yiminghe">
              yiminghe
            </Option>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
              return (
                <Option key={i} value={i} text={String(i)}>
                  {i}-text
                </Option>
              );
            })}
          </Select>
        </div>

        <h2>native select</h2>
        <select value={this.value} style={{ width: '500px' }} onChange={this.onChange}>
          <option value="01">jack</option>
          <option value="11">lucy</option>
          <option value="21" disabled>
            disabled
          </option>
          <option value="31">yiminghe</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
            return (
              <option value={i} key={i}>
                {i}
              </option>
            );
          })}
        </select>

        <p>
          <button onClick={this.onDestroy}>destroy</button>
        </p>
      </div>
    );
  },
};
</script>
