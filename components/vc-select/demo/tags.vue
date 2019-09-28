<script>
import Select, { Option } from '../index';
import '../assets/index.less';

export default {
  data() {
    return {
      disabled: false,
      value: ['name2', 'name3'],
      maxTagCount: undefined,
    };
  },
  methods: {
    onChange(value, option) {
      console.log(`changed ${value}`, option);
      this.value = value;
    },

    onSelect(value, option) {
      console.log(`selected ${value}`, option.props);
    },

    onDeselect(value, option) {
      console.log(`deselected ${value}`, option);
    },

    toggleDisabled() {
      this.disabled = !this.disabled;
    },

    toggleMaxTagCount(count) {
      this.maxTagCount = count;
    },
  },

  render() {
    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push(
        <Option key={i.toString(36) + i} test={i}>
          {i.toString(36) + i}
        </Option>,
      );
    }
    return (
      <div>
        <h2>tags select（scroll the menu）</h2>

        <div>
          <Select
            placeholder="placeholder"
            tags
            dropdownMenuStyle={{ maxHeight: '200px' }}
            style={{ width: '500px' }}
            disabled={this.disabled}
            maxTagCount={this.maxTagCount}
            maxTagTextLength={10}
            value={this.value}
            onChange={this.onChange}
            onSelect={this.onSelect}
            onDeselect={this.onDeselect}
            tokenSeparators={[' ', ',']}
          >
            {children}
          </Select>
        </div>
        <p>
          <button onClick={this.toggleDisabled}>toggle disabled</button>
          <button onClick={() => this.toggleMaxTagCount(0)}>toggle maxTagCount (0)</button>
          <button onClick={() => this.toggleMaxTagCount(1)}>toggle maxTagCount (1)</button>
        </p>
      </div>
    );
  },
};
</script>
