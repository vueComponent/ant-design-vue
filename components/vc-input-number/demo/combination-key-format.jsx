import InputNumber from '../src/index';
import '../assets/index.less';

export default {
  data() {
    return {
      disabled: false,
      readOnly: false,
      value: 50000,
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
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    format(num) {
      return `$ ${this.numberWithCommas(num)} boeing737`;
    },
    parser(num) {
      return num
        .toString()
        .split(' ')[1]
        .replace(/,*/g, '');
    },
  },
  render() {
    return (
      <div style="margin: 10px;">
        <InputNumber
          min={-8000}
          max={10000000}
          value={this.value}
          onChange={this.onChange}
          style="width: 200px"
          readOnly={this.readOnly}
          disabled={this.disabled}
          autoFocus={false}
          step={100}
          formatter={this.format}
          parser={this.parser}
        />
        <p style="padding:10px 0">
          <button onClick={this.toggleDisabled}>toggle Disabled</button>
          <button onClick={this.toggleReadOnly}>toggle readOnly</button>
        </p>
      </div>
    );
  },
};
