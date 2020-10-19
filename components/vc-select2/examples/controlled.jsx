/* eslint-disable no-console */

import Select, { Option } from '..';
import '../assets/index.less';

const Controlled = {
  data: () => ({
    destroy: false,
    value: 9,
    open: true,
  }),
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
      this.destroy = true;
    },

    onBlur(v) {
      console.log('onBlur', v);
    },

    onFocus() {
      console.log('onFocus');
    },

    onDropdownVisibleChange(open) {
      this.open = open;
    },
    getPopupContainer(node) {
      return node.parentNode;
    },
  },

  render() {
    const { open, destroy, value } = this;
    if (destroy) {
      return null;
    }
    return (
      <div style={{ margin: '20px' }}>
        <h2>controlled Select</h2>
        <div style={{ width: '300px' }}>
          <Select
            id="my-select"
            value={value}
            placeholder="placeholder"
            listHeight={200}
            style={{ width: '500px' }}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            open={open}
            optionLabelProp="children"
            optionFilterProp="text"
            onChange={this.onChange}
            onDropdownVisibleChange={this.onDropdownVisibleChange}
            //getPopupContainer={this.getPopupContainer}
          >
            <Option value="01" text="jack" title="jack">
              <b
                style={{
                  color: 'red',
                }}
              >
                jack
              </b>
            </Option>
            <Option value="11" text="lucy">
              lucy
            </Option>
            <Option value="21" disabled text="disabled">
              disabled
            </Option>
            <Option value="31" text="yiminghe">
              yiminghe
            </Option>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
              <Option key={i} value={i} text={String(i)}>
                {i}-text
              </Option>
            ))}
          </Select>
        </div>
      </div>
    );
  },
};

export default Controlled;
/* eslint-enable */
