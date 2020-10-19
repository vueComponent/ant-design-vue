import createRef from '../../_util/createRef';
/* eslint-disable no-console */
import Select, { Option } from '..';
import '../assets/index.less';
import { nextTick } from 'vue';

const Combobox = {
  data() {
    this.textareaRef = createRef();

    this.timeoutId;
    return {
      disabled: false,
      value: '',
      options: [],
    };
  },

  mounted() {
    nextTick(() => {
      console.log('Ref:', this.textareaRef.current);
    });
  },
  methods: {
    onChange(value, option) {
      console.log('onChange', value, option);

      this.value = value;
    },

    onKeyDown(e) {
      const { value } = this;
      if (e.keyCode === 13) {
        console.log('onEnter', value);
      }
    },

    onSelect(v, option) {
      console.log('onSelect', v, option);
    },

    onSearch(text) {
      console.log('onSearch:', text);
    },

    onAsyncChange(value) {
      window.clearTimeout(this.timeoutId);
      console.log(value);
      this.options = [];
      //const value = String(Math.random());
      this.timeoutId = window.setTimeout(() => {
        this.options = [{ value }, { value: `${value}-${value}` }];
      }, 1000);
    },

    toggleDisabled() {
      const { disabled } = this;

      this.disabled = !disabled;
    },
  },

  render() {
    const { value, disabled } = this;
    return (
      <div>
        <h2>combobox</h2>
        <p>
          <button type="button" onClick={this.toggleDisabled}>
            toggle disabled
          </button>
          <button
            type="button"
            onClick={() => {
              this.value = '';
            }}
          >
            reset
          </button>
        </p>
        <div>
          <Select
            disabled={disabled}
            style={{ width: '500px' }}
            onChange={this.onChange}
            onSelect={this.onSelect}
            onSearch={this.onSearch}
            onInputKeyDown={this.onKeyDown}
            notFoundContent=""
            allowClear
            placeholder="please select"
            value={value}
            mode="combobox"
            backfill
            onFocus={() => console.log('focus')}
            onBlur={() => console.log('blur')}
          >
            <Option value="jack">
              <b style={{ color: 'red' }}>jack</b>
            </Option>
            <Option value="lucy">lucy</Option>
            <Option value="disabled" disabled>
              disabled
            </Option>
            <Option value="yiminghe">yiminghe</Option>
            <Option value="竹林星光">竹林星光</Option>
          </Select>

          <h3>Customize Input Element</h3>
          <Select
            mode="combobox"
            style={{ width: '200px' }}
            getInputElement={() => (
              <textarea style={{ background: 'red' }} rows={3} ref={this.textareaRef} />
            )}
            options={[{ value: 'light' }, { value: 'bamboo' }]}
            allowClear
            placeholder="2333"
          />

          <h3>Async Input Element</h3>
          <Select
            mode="combobox"
            notFoundContent={null}
            style={{ width: '200px' }}
            options={this.options}
            onChange={this.onAsyncChange}
          />
        </div>
      </div>
    );
  },
};

export default Combobox;
/* eslint-enable */
