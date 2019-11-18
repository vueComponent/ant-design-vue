<script>
import Select, { Option } from '../index';
import '../assets/index.less';

export default {
  data() {
    return {
      disabled: false,
      value: '',
    };
  },
  methods: {
    onChange(value, option) {
      console.log('onChange', value, option);
      this.value = value;
    },

    onKeyDown(e) {
      if (e.keyCode === 13) {
        console.log('onEnter', this.value);
      }
    },

    onSelect(v, option) {
      console.log('onSelect', v, option);
    },

    toggleDisabled() {
      this.disabled = !this.disabled;
    },
  },

  render() {
    return (
      <div>
        <h2>combobox</h2>
        <p>
          <button onClick={this.toggleDisabled}>toggle disabled</button>
        </p>
        <div style={{ width: '300px' }}>
          <Select
            disabled={this.disabled}
            style={{ width: '500px' }}
            onChange={this.onChange}
            onSelect={this.onSelect}
            onInputKeydown={this.onKeyDown}
            notFoundContent=""
            allowClear
            placeholder="please select"
            value={this.value}
            combobox
            backfill
          >
            <Option value="jack">
              <b style={{ color: 'red' }}>jack</b>
            </Option>
            <Option value="lucy">lucy</Option>
            <Option value="disabled" disabled>
              disabled
            </Option>
            <Option value="yiminghe">yiminghe</Option>
          </Select>
        </div>
      </div>
    );
  },
};
</script>
