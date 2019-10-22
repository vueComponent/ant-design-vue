<script>
import Select, { Option } from '../index';
import '../assets/index.less';

export default {
  data() {
    return {
      useAnim: 0,
      value: ['a10'],
    };
  },
  methods: {
    onChange(value, options) {
      console.log('onChange', value, options);
      this.value = value;
    },
    onSelect(...args) {
      console.log('select ', args);
    },
    onDeselect(...args) {
      console.log('deselect ', args);
    },
    useAnimation(e) {
      this.useAnim = e.target.checked;
    },
  },

  render() {
    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push(
        <Option key={i.toString(36) + i} disabled={i === 10} title={`中文${i}`}>
          中文{i}
        </Option>,
      );
    }
    const dropdownMenuStyle = {
      maxHeight: '200px',
    };
    return (
      <div>
        <h2>multiple select（scroll the menu）</h2>

        <p>
          <label>
            anim
            <input checked={this.useAnim} type="checkbox" onChange={this.useAnimation} />
          </label>
        </p>

        <div style={{ width: '300px' }}>
          <Select
            value={this.value}
            animation={this.useAnim ? 'slide-up' : null}
            choiceTransitionName="rc-select-selection__choice-zoom"
            dropdownMenuStyle={dropdownMenuStyle}
            style={{ width: '500px' }}
            multiple
            allowClear
            optionFilterProp="children"
            optionLabelProp="children"
            onSelect={this.onSelect}
            onDeselect={this.onDeselect}
            placeholder="please select"
            onChange={this.onChange}
            onFocus={() => console.log('focus')}
            tokenSeparators={[' ', ',']}
          >
            {children}
          </Select>
        </div>
      </div>
    );
  },
};
</script>
