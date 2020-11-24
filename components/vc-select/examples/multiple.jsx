/* eslint-disable no-console */

import Select, { Option } from '..';
import '../assets/index.less';

const children = [];
for (let i = 10; i < 36; i += 1) {
  children.push(
    <Option
      key={i.toString(36) + i}
      disabled={i === 10}
      title={`中文${i}`}
      v-slots={{ default: () => `中文${i}` }}
    ></Option>,
  );
}

const Test = {
  data: () => ({
    state: {
      useAnim: true,
      showArrow: false,
      loading: false,
      value: ['a10'],
    },
  }),
  methods: {
    setState(state) {
      Object.assign(this.state, state);
    },
    onChange(value, options) {
      console.log('onChange', value, options);
      this.setState({
        value,
      });
    },

    onSelect(...args) {
      console.log(args);
    },

    onDeselect(...args) {
      console.log(args);
    },

    useAnim(e) {
      this.setState({
        useAnim: e.target.checked,
      });
    },

    showArrow(e) {
      this.setState({
        showArrow: e.target.checked,
      });
    },

    loading(e) {
      this.setState({
        loading: e.target.checked,
      });
    },
  },

  render() {
    const { useAnim, showArrow, loading, value } = this.state;
    return (
      <div style="margin: 20px">
        <h2>multiple select（scroll the menu）</h2>

        <p>
          <label html-for="useAnim">
            anim
            <input id="useAnim" checked={useAnim} type="checkbox" onChange={this.useAnim} />
          </label>
          <p />
          <label html-for="showArrow">
            showArrow
            <input id="showArrow" checked={showArrow} type="checkbox" onChange={this.showArrow} />
          </label>
        </p>
        <p>
          <label html-for="loading">
            loading
            <input id="loading" checked={loading} type="checkbox" onChange={this.loading} />
          </label>
        </p>

        <div style={{ width: '300px' }}>
          <Select
            value={value}
            animation={useAnim ? 'slide-up' : null}
            choiceTransitionName="rc-select-selection__choice-zoom"
            style={{ width: '500px' }}
            mode="multiple"
            loading={loading}
            showArrow={showArrow}
            allowClear
            optionFilterProp="children"
            optionLabelProp="children"
            onSelect={this.onSelect}
            onDeselect={this.onDeselect}
            placeholder="please select"
            onChange={this.onChange}
            onFocus={() => console.log('focus')}
            onBlur={v => console.log('blur', v)}
            tokenSeparators={[' ', ',']}
          >
            {children}
          </Select>
        </div>
      </div>
    );
  },
};

export default Test;
/* eslint-enable */
