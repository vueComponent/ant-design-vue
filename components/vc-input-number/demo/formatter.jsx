import InputNumber from '../src/index';
import '../assets/index.less';

function getSum(str) {
  let total = 0;
  str.split('').forEach(c => {
    const num = Number(c);

    if (!isNaN(num)) {
      total += num;
    }
  });

  return total;
}

export default {
  data() {
    return {
      value: 1000,
    };
  },
  render() {
    return (
      <div style="margin: 10px;">
        <InputNumber
          defaultValue={1000}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        />
        <InputNumber
          defaultValue={100}
          formatter={value => `${value}%`}
          parser={value => value.replace('%', '')}
        />
        <InputNumber
          style="width: 100px"
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        />

        <div>
          <h1>In Control</h1>
          <InputNumber
            value={this.value}
            onChange={value => {
              this.value = value;
            }}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </div>

        <div>
          <h1>Strange Format</h1>
          <InputNumber
            defaultValue={1000}
            formatter={value => `$ ${value} - ${getSum(value)}`}
            parser={value => (value.match(/^\$ ([\d\.]*) .*$/) || [])[1]}
          />
        </div>
      </div>
    );
  },
};
