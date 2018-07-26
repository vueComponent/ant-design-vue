import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _extends from 'babel-runtime/helpers/extends';
/* eslint react/no-multi-comp:0, no-console:0 */

import '../assets/index.less';
import './demo.less';
import TreeSelect, { SHOW_PARENT } from '../index';
import Gen from './big-data-generator';

export default {
  data: function data() {
    return {
      gData: [],
      gData1: [],
      value: '',
      value1: ''
    };
  },

  methods: {
    onChange: function onChange(value) {
      console.log('onChange', arguments);
      this.value = value;
    },
    onChangeStrictly: function onChangeStrictly(value1) {
      console.log('onChangeStrictly', arguments);
      var ind = parseInt(Math.random() * 3, 10);
      value1.push({ value: '0-0-0-' + ind + '-value', label: '0-0-0-' + ind + '-label', halfChecked: true });
      this.value1 = value1;
    },
    onGen: function onGen(data) {
      _extends(this.$data, {
        gData: data,
        gData1: [].concat(_toConsumableArray(data)),
        value: '0-0-0-value',
        value1: [{ value: '0-0-value', label: '0-0-label', halfChecked: true }, { value: '0-0-0-value', label: '0-0-0-label' }]
        // value: ['0-0-0-0-value', '0-0-0-1-value', '0-0-0-2-value'],
      });
    }
  },

  render: function render() {
    var h = arguments[0];

    return h(
      'div',
      { style: { padding: '0 20px' } },
      [h(Gen, {
        on: {
          'gen': this.onGen
        }
      }), h(
        'div',
        { style: { display: 'flex' } },
        [h(
          'div',
          { style: { marginRight: '20px' } },
          [h('h3', ['normal check']), h(TreeSelect, {
            style: { width: '300px' },
            attrs: { dropdownStyle: { maxHeight: '200px', overflow: 'auto' },
              treeData: this.gData, treeLine: true,
              value: this.value,
              placeholder: h('i', ['\u8BF7\u4E0B\u62C9\u9009\u62E9']),
              treeCheckable: true,
              showCheckedStrategy: SHOW_PARENT
            },
            on: {
              'change': this.onChange
            }
          })]
        ), h('div', [h('h3', ['checkStrictly']), h(TreeSelect, {
          style: { width: '300px' },
          attrs: { dropdownStyle: { maxHeight: '200px', overflow: 'auto' },
            treeData: this.gData1, treeLine: true,
            value: this.value1,
            placeholder: h('i', ['\u8BF7\u4E0B\u62C9\u9009\u62E9']),
            treeCheckable: true,
            treeCheckStrictly: true,
            showCheckedStrategy: SHOW_PARENT
          },
          on: {
            'change': this.onChangeStrictly
          }
        })])]
      )]
    );
  }
};