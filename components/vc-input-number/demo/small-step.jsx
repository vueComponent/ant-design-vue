import InputNumber from '../src/index';
import '../assets/index.less';

export default {
  data() {
    return {
      value: 0.000000001,
    };
  },
  methods: {
    onChange(value) {
      console.log('onChange:', value);
      this.value = value;
    },
    toggleDisabled() {
      this.disabled = !this.disabled;
    },
    toggleReadOnly() {
      this.readOnly = !this.readOnly;
    },
  },
  render() {
    return (
      <div style="margin: 10px;">
        <InputNumber
          min={-10}
          max={10}
          step={0.000000001}
          style="width: 100px"
          value={this.value}
          onChange={this.onChange}
        />
      </div>
    );
  },
};
