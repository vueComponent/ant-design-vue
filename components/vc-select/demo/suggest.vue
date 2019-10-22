<script>
import Select, { Option } from '../index';
import '../assets/index.less';
import { fetch } from './tbFetchSuggest';
export default {
  data() {
    return {
      data: [],
      value: [],
    };
  },
  methods: {
    onKeyDown(e) {
      if (e.keyCode === 13) {
        console.log('onEnter', this.value);
        this.jump(this.value);
      }
    },

    onSelect(value) {
      console.log('select ', value);
      this.jump(value);
    },

    jump(v) {
      console.log('jump ', v);
      // location.href = 'https://s.taobao.com/search?q=' + encodeURIComponent(v);
    },

    fetchData(value) {
      this.value = value;
      fetch(value, data => {
        this.data = data;
      });
    },
  },

  render() {
    const data = this.data;
    const options = data.map(d => {
      return <Option key={d.value}>{d.text}</Option>;
    });
    return (
      <div>
        <h2>suggest</h2>

        <div onKeydown={this.onKeyDown}>
          <Select
            style={{ width: '500px' }}
            combobox
            value={this.value}
            placeholder="placeholder"
            defaultActiveFirstOption={false}
            getInputElement={() => <input />}
            showArrow={false}
            notFoundContent=""
            onChange={this.fetchData}
            onSelect={this.onSelect}
            filterOption={false}
          >
            {options}
          </Select>
        </div>
      </div>
    );
  },
};
</script>
