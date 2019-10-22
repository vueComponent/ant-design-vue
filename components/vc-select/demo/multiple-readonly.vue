<script>
import Select, { Option } from '../index';
import '../assets/index.less';
import { fetch } from './tbFetchSuggest';

export default {
  data() {
    return {
      data: [],
      value: ['b11'],
    };
  },
  methods: {
    onChange(value) {
      console.log('onChange ', value);
      this.value = value;
    },
    onSelect(value) {
      console.log('select ', value);
    },
    fetchData(value) {
      fetch(value, data => {
        this.data = data;
      });
    },
  },

  render() {
    const children = [];
    for (let i = 10; i < 36; i++) {
      // 11 => readonly selected item
      children.push(
        <Option disabled={i === 11} key={i.toString(36) + i}>
          中文{i}
        </Option>,
      );
    }
    const dropdownMenuStyle = {
      maxHeight: '200px',
    };
    return (
      <div>
        <h2>multiple readonly default selected item</h2>
        <div>
          <Select
            multiple
            value={this.value}
            animation="slide-up"
            choiceTransitionName="rc-select-selection__choice-zoom"
            dropdownMenuStyle={dropdownMenuStyle}
            style={{ width: '500px' }}
            optionFilterProp="children"
            optionLabelProp="children"
            placeholder="please select"
            onChange={this.onChange}
          >
            {children}
          </Select>
        </div>
      </div>
    );
  },
};
</script>
