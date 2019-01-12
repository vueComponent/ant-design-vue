import InputNumber from '../src/index';
import '../assets/index.less';

export default {
  data() {
    return {
      disabled: false,
      readOnly: false,
      value: 5,
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
    const upHandler = <div style={{ color: 'blue' }}>x</div>;
    const downHandler = <div style={{ color: 'red' }}>V</div>;
    return (
      <div style="margin: 10px;">
        <InputNumber
          min={-8}
          max={10}
          value={this.value}
          onChange={this.onChange}
          style="width: 100px"
          readOnly={this.readOnly}
          disabled={this.disabled}
          upHandler={upHandler}
          downHandler={downHandler}
        />
      </div>
    );
  },
};
