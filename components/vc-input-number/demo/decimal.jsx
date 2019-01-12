import InputNumber from '../src/index';
import '../assets/index.less';

export default {
  data() {
    return {
      disabled: false,
      readOnly: false,
      value: 8,
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
          min={-8}
          max={10}
          step={0.1}
          value={this.value}
          style="width: 100px"
          onChange={this.onChange}
          readOnly={this.readOnly}
          disabled={this.disabled}
        />
        <p style="padding:10px 0">
          <button onClick={this.toggleDisabled}>toggle Disabled</button>
          <button onClick={this.toggleReadOnly}>toggle readOnly</button>
        </p>
      </div>
    );
  },
};
