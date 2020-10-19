import { defineComponent } from 'vue';
/* eslint-disable no-console */

import Select, { Option } from '..';
import '../assets/index.less';
import './single.less';

const Test = defineComponent({
  data() {
    return {
      destroy: false,
      value: '9',
    };
  },
  methods: {
    onChange(e) {
      let value;
      if (e && e.target) {
        ({ value } = e.target);
      } else {
        value = e;
      }
      console.log('onChange', value);

      this.value = value;
    },

    onDestroy() {
      this.destroy = 1;
    },

    onBlur(v) {
      console.log('onBlur', v);
    },

    onFocus() {
      console.log('onFocus');
    },

    onSearch(val) {
      console.log('Search:', val);
    },
  },

  render() {
    const { value, destroy } = this;
    if (destroy) {
      return null;
    }

    return (
      <div style={{ margin: '20px' }}>
        <div
          style={{ height: '150px', background: 'rgba(0, 255, 0, 0.1)' }}
          onMousedown={e => {
            e.preventDefault();
          }}
        >
          Prevent Default
        </div>

        <h2>Single Select</h2>

        <div style={{ width: '300px' }}>
          <Select
            autofocus
            id="my-select"
            value={value}
            placeholder="placeholder"
            showSearch
            style={{ width: '500px' }}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            onSearch={this.onSearch}
            allowClear
            optionFilterProp="text"
            onChange={this.onChange}
            onPopupScroll={() => {
              console.log('Scroll!');
            }}
          >
            <Option value={null}>不选择</Option>,
            <Option value="01" text="jack" title="jack">
              <b
                style={{
                  color: 'red',
                }}
              >
                jack
              </b>
            </Option>
            ,
            <Option value="11" text="lucy">
              <span>lucy</span>
            </Option>
            ,
            <Option value="21" disabled text="disabled">
              disabled
            </Option>
            ,
            <Option value="31" text="yiminghe" class="test-option" style={{ background: 'yellow' }}>
              yiminghe
            </Option>
            ,
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
              <Option key={i} value={String(i)} text={String(i)}>
                {i}-text
              </Option>
            ))}
          </Select>
        </div>
        <h2>native select</h2>
        <select value={value} style={{ width: '500px' }} onChange={this.onChange}>
          <option value="01">jack</option>
          <option value="11">lucy</option>
          <option value="21" disabled>
            disabled
          </option>
          <option value="31">yiminghe</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
            <option value={i} key={i}>
              {i}
            </option>
          ))}
        </select>

        <h2>RTL Select</h2>

        <div style={{ width: '300px' }}>
          <Select
            id="my-select-rtl"
            placeholder="rtl"
            direction="rtl"
            dropdownMatchSelectWidth={300}
            dropdownStyle={{ minWidth: '300px' }}
            style={{ width: '500px' }}
          >
            <Option value="1">1</Option>
            <Option value="2">2</Option>
          </Select>
        </div>

        <p>
          <button type="button" onClick={this.onDestroy}>
            destroy
          </button>
        </p>
      </div>
    );
  },
});

export default Test;
/* eslint-enable */
