<script>
import Select, { Option } from '../index';
import '../assets/index.less';

export default {
  methods: {
    onChange(value) {
      console.log(`selected ${value}`);
    },
  },

  render() {
    const cases = {
      0: { name: 'Case 1' },
      1: { name: 'Case 2' },
      2: { name: 'Case 3' },
    };
    return (
      <div>
        <h2>Select optionLabelProp</h2>
        <Select style={{ width: '500px' }} optionLabelProp="children" multiple allowClear>
          {Object.keys(cases).map(key => (
            <Option key={key} value={key}>
              {cases[key].name}
            </Option>
          ))}
        </Select>
      </div>
    );
  },
};
</script>
