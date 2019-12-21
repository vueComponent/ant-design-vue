/* eslint no-console:0 */

import '../assets/index.less';
import './demo.less';
import TreeSelect, { SHOW_PARENT } from '../index';
import Gen from './big-data-generator';

export default {
  data() {
    return {
      gData: [],
      gData1: [],
      value: '',
      value1: '',
    };
  },
  methods: {
    onChange(value) {
      console.log('onChange', arguments);
      this.value = value;
    },

    onChangeStrictly(value1) {
      console.log('onChangeStrictly', arguments);
      const ind = parseInt(Math.random() * 3, 10);
      value1.push({ value: `0-0-0-${ind}-value`, label: `0-0-0-${ind}-label`, halfChecked: true });
      this.value1 = value1;
    },

    onGen(data) {
      Object.assign(this.$data, {
        gData: data,
        gData1: [...data],
        value: '0-0-0-value',
        value1: [
          { value: '0-0-value', label: '0-0-label', halfChecked: true },
          { value: '0-0-0-value', label: '0-0-0-label' },
        ],
        // value: ['0-0-0-0-value', '0-0-0-1-value', '0-0-0-2-value'],
      });
    },
  },

  render() {
    return (
      <div style={{ padding: '0 20px' }}>
        <Gen onGen={this.onGen} />
        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: '20px' }}>
            <h3>normal check</h3>
            <TreeSelect
              style={{ width: '300px' }}
              dropdownStyle={{ maxHeight: '200px', overflow: 'auto' }}
              treeData={this.gData}
              treeLine
              value={this.value}
              placeholder={<i>请下拉选择</i>}
              treeCheckable
              showCheckedStrategy={SHOW_PARENT}
              onChange={this.onChange}
              __propsSymbol__={Symbol()}
            />
          </div>
          <div>
            <h3>checkStrictly</h3>
            <TreeSelect
              style={{ width: '300px' }}
              dropdownStyle={{ maxHeight: '200px', overflow: 'auto' }}
              treeData={this.gData1}
              treeLine
              value={this.value1}
              placeholder={<i>请下拉选择</i>}
              treeCheckable
              treeCheckStrictly
              showCheckedStrategy={SHOW_PARENT}
              onChange={this.onChangeStrictly}
              __propsSymbol__={Symbol()}
            />
          </div>
        </div>
      </div>
    );
  },
};
