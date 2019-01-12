import InputNumber from '../src/index';
import '../assets/index.less';

export default {
  data() {
    return {
      precision: 2,
    };
  },
  methods: {
    onChange(value) {
      console.log('onChange:', value);
      this.value = value;
    },
    changeprecision(e) {
      this.precision = parseInt(e.target.value, 10);
    },
  },
  render() {
    return (
      <div style="margin: 10px;">
        <InputNumber defaultValue={1} onChange={this.onChange} precision={this.precision} />
        <p style="padding:10px 0">
          precision:
          <input type="number" onInput={this.changeprecision} value={this.precision} />
        </p>
      </div>
    );
  },
};
